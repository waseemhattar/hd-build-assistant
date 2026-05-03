-- Migration 012 — pgvector + procedure embeddings for RAG
--
-- This migration adds the vector-search infrastructure that powers
-- the AI mechanic's retrieval-augmented generation. Background:
--
--   Without RAG, the mechanic only sees procedure TITLES in the
--   system prompt — it has no idea what each procedure actually
--   contains. Claude is forced to guess from titles alone, which
--   leads to vague answers or pattern-matching on words.
--
--   With RAG, we embed each procedure (title + summary + steps +
--   tools + torque specs) into a 1024-dim vector. At chat time the
--   user's question is also embedded, and we cosine-similarity
--   search to pull the top-5 most relevant procedures' full bodies
--   into the prompt. The model can then quote specific torque values,
--   warnings, and step sequences instead of hallucinating them.
--
-- Embedding model: @cf/baai/bge-large-en-v1.5 (1024 dimensions).
-- Free under the user's Cloudflare Workers AI quota.

create extension if not exists vector;

-- Add embedding column. Nullable so existing rows survive the
-- migration; ingest job populates them in batch.
alter table public.procedures
  add column if not exists embedding vector(1024);

-- HNSW index — newer than ivfflat, better recall, faster queries
-- for our scale (~hundreds of procedures). Cosine distance matches
-- the BGE model's normalisation.
create index if not exists procedures_embedding_hnsw_idx
  on public.procedures
  using hnsw (embedding vector_cosine_ops);

-- Helper view that joins each procedure to its applicable manual
-- year-range + model codes. The match function below uses this so
-- we can filter by the rider's bike at query time without a separate
-- chapter→manual hop in the function body.
create or replace view public.procedures_with_manual as
  select
    p.id            as procedure_id,
    p.chapter_id,
    p.title,
    p.summary,
    p.applies_to,
    p.is_clean,
    p.tier,
    p.embedding,
    m.id            as manual_id,
    m.manufacturer  as manual_manufacturer,
    m.family        as manual_family,
    m.year_from     as manual_year_from,
    m.year_to       as manual_year_to,
    m.model_codes   as manual_model_codes
  from public.procedures p
  join public.chapters c on c.id = p.chapter_id
  join public.manuals  m on m.id = c.manual_id
  where p.is_clean = true and p.tier = 'free';

-- ---------- match_procedures ----------
--
-- Returns the top-`match_count` procedures whose:
--   - is_clean = true and tier = 'free'  (RLS already enforces this
--     for non-admins, but we double-belt-and-brace it here)
--   - manual covers the rider's bike (year in [year_from..year_to]
--     AND (model_codes is empty OR contains the rider's code))
--   - applies_to is empty OR contains the rider's bike-catalog id
--   - have an embedding column populated
--
-- Ordered by cosine similarity (1 - distance), descending.
--
-- Caller passes:
--   query_embedding — the user's question, embedded by BGE
--   bike_year       — number, optional (null = no year filter)
--   bike_model_code — text, optional ('FLHX' etc., null skips filter)
--   bike_catalog_id — text, optional ('touring-2020' etc., null skips)
--   match_count     — int, how many to return (default 5)
--   match_threshold — float, similarity floor below which we exclude
--                     even if we don't have enough rows (default 0.5)
create or replace function public.match_procedures(
  query_embedding vector(1024),
  bike_year       int           default null,
  bike_model_code text          default null,
  bike_catalog_id text          default null,
  match_count     int           default 5,
  match_threshold float         default 0.5
)
returns table (
  procedure_id    uuid,
  title           text,
  summary         text,
  similarity      float
)
language sql
stable
security invoker  -- respects the caller's RLS context
as $$
  select
    p.procedure_id,
    p.title,
    p.summary,
    1 - (p.embedding <=> query_embedding) as similarity
  from public.procedures_with_manual p
  where p.embedding is not null
    -- year window
    and (
      bike_year is null
      or p.manual_year_from is null
      or p.manual_year_to   is null
      or (bike_year between p.manual_year_from and p.manual_year_to)
    )
    -- model code (manuals.model_codes empty = applies to all)
    and (
      bike_model_code is null
      or p.manual_model_codes is null
      or array_length(p.manual_model_codes, 1) is null
      or bike_model_code = any (p.manual_model_codes)
    )
    -- per-procedure applies_to override (empty array = all)
    and (
      p.applies_to is null
      or array_length(p.applies_to, 1) is null
      or (bike_catalog_id is not null and bike_catalog_id = any (p.applies_to))
      or (bike_model_code is not null and bike_model_code = any (p.applies_to))
    )
    -- similarity floor — keeps obviously-irrelevant matches out
    and (1 - (p.embedding <=> query_embedding)) >= match_threshold
  order by p.embedding <=> query_embedding
  limit match_count;
$$;

-- Anyone authenticated can call match_procedures — RLS handles
-- the row-level filtering. This function only does similarity math.
grant execute on function public.match_procedures(
  vector, int, text, text, int, float
) to authenticated, anon;

-- ---------- needs_embedding view ----------
--
-- The Worker's /admin/embed-procedures endpoint reads from this view
-- to find procedures that haven't been embedded yet. Includes the
-- text content we'd actually want to embed — title + summary + step
-- bodies — so the endpoint doesn't have to do its own joins.

create or replace view public.procedures_needing_embedding as
  with steps_concat as (
    select
      procedure_id,
      string_agg(
        format('Step %s: %s%s%s',
          coalesce(step_number, sort_order, 0),
          coalesce(body, ''),
          case when warning is not null and length(warning) > 0
            then E'\n  Warning: ' || warning else '' end,
          case when note is not null and length(note) > 0
            then E'\n  Note: ' || note else '' end
        ),
        E'\n\n' order by sort_order, step_number
      ) as steps_text
    from public.procedure_steps
    group by procedure_id
  ),
  tools_concat as (
    select procedure_id,
           string_agg(name, ', ' order by sort_order) as tools_text
    from public.procedure_tools group by procedure_id
  ),
  parts_concat as (
    select procedure_id,
           string_agg(
             coalesce(description, '') ||
               case when part_number is not null
                 then ' (PN ' || part_number || ')' else '' end,
             ', ' order by sort_order
           ) as parts_text
    from public.procedure_parts group by procedure_id
  ),
  torque_concat as (
    select procedure_id,
           string_agg(
             format('%s: %s', fastener, value),
             '; ' order by sort_order
           ) as torque_text
    from public.procedure_torque group by procedure_id
  ),
  warnings_concat as (
    select procedure_id,
           string_agg(
             upper(level) || ': ' || text,
             E'\n' order by sort_order
           ) as warnings_text
    from public.procedure_warnings group by procedure_id
  )
  select
    p.id as procedure_id,
    p.title,
    p.summary,
    s.steps_text,
    t.tools_text,
    pa.parts_text,
    tq.torque_text,
    w.warnings_text
  from public.procedures p
  left join steps_concat    s  on s.procedure_id  = p.id
  left join tools_concat    t  on t.procedure_id  = p.id
  left join parts_concat    pa on pa.procedure_id = p.id
  left join torque_concat   tq on tq.procedure_id = p.id
  left join warnings_concat w  on w.procedure_id  = p.id
  where p.embedding is null
    and p.is_clean = true
    and p.tier = 'free';

comment on view public.procedures_needing_embedding is
  'Procedures that have no embedding yet, with concatenated text content ready to embed. Drained by the Worker''s /admin/embed-procedures endpoint.';

-- ---------- set_procedure_embedding ----------
--
-- Bypass-route for the admin embedding backfill. PostgREST + pgvector
-- has a quirk where PATCHing a vector column via the REST API
-- silently no-ops (returns 200, "matched 0 rows", embedding stays
-- null). We work around this by going through an RPC function that
-- runs as SECURITY DEFINER (so the function's owner — the supabase
-- internal user — does the update, fully bypassing RLS) and takes
-- the vector as its native pgvector text format.
--
-- Only the service role can call this. The Worker uses its
-- service-role key for the admin /embed-procedures endpoint.

create or replace function public.set_procedure_embedding(
  p_id        uuid,
  p_embedding text
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count int;
begin
  update public.procedures
     set embedding = p_embedding::vector
   where id = p_id;
  -- GET DIAGNOSTICS ... = ROW_COUNT returns int, so v_count must be
  -- numeric — declaring it as boolean (an earlier mistake) blew up
  -- with `operator does not exist: boolean > integer` on every call.
  get diagnostics v_count = row_count;
  return v_count > 0;
end;
$$;

revoke all on function public.set_procedure_embedding(uuid, text) from public;
grant execute on function public.set_procedure_embedding(uuid, text) to service_role;
