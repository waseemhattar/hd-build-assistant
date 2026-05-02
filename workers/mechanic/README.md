# Sidestand Mechanic Worker

Cloudflare Worker that powers the in-app AI mechanic assistant. Runs Llama 3.3 70B
on Cloudflare Workers AI, injects the user's bike context, and streams responses
back to the React app.

## One-time setup

```bash
cd workers/mechanic
npm install

# 1. Authenticate with your Cloudflare account
npx wrangler login

# 2. Set the Supabase JWT secret so the Worker can verify users.
#    Find this in Supabase Dashboard → Project Settings → API → JWT Secret.
npx wrangler secret put SUPABASE_JWT_SECRET
# Paste the secret when prompted.

# 3. Deploy
npx wrangler deploy
```

After deploy, Wrangler prints the Worker's URL, something like:
`https://sidestand-mechanic.<your-account>.workers.dev`

Take that URL and add it to your React app's environment:

```bash
# In the project root, edit .env.local (or wherever you keep VITE_ vars)
VITE_MECHANIC_WORKER_URL=https://sidestand-mechanic.<your-account>.workers.dev
```

Rebuild the app, and the floating chat button starts working.

## Custom domain (recommended for prod)

In Cloudflare Dashboard → Workers → sidestand-mechanic → Triggers → Add custom
domain. Use something like `mechanic.sidestand.app`. Then update the env var
to that URL.

## Local dev

```bash
npx wrangler dev
```

Listens on `http://localhost:8787`. Set `VITE_MECHANIC_WORKER_URL=http://localhost:8787`
in your local `.env.local` for testing.

## Cost

Workers AI bills per neuron used. Llama 3.3 70B at this size is roughly
$0.001 per 1k input tokens and $0.005 per 1k output tokens. A typical chat
exchange (~500 input tokens, ~250 output tokens) costs around $0.002.

## Logs

```bash
npx wrangler tail
```

Streams logs from production. Useful for debugging stuck conversations.
