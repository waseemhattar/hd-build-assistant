
# Deploy to harley.h-dbuilds.com

End goal: the React app lives on Netlify, served at
**https://harley.h-dbuilds.com** (a subdomain of the existing Wix-managed
h-dbuilds.com).

Architecture: Netlify-hosted SPA, CNAME from Wix DNS → Netlify. The main
site (h-dbuilds.com) continues to run on Wix unchanged.

## 1 — Push to GitHub

From this folder (`hd-build-assistant`) run:

```bash
git init
git add .
git commit -m "Initial commit: HD Build Assistant"
git branch -M main
git remote add origin https://github.com/<your-username>/hd-build-assistant.git
git push -u origin main
```

Create the repo first at https://github.com/new — name it `hd-build-assistant`
and leave it empty (no README / .gitignore / license — we already have them).

## 2 — Connect the repo to Netlify

1. Log in to https://app.netlify.com (sign up free with GitHub).
2. **Add new site → Import an existing project → GitHub** → pick
   `hd-build-assistant`.
3. Build settings (Netlify should auto-detect from `netlify.toml`, but verify):
   - **Base directory**: `hd-build-assistant`  (only needed if the repo root
     is the parent folder — if you pushed just this folder as the repo root,
     leave base directory blank)
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. Click **Deploy**. First build takes ~1 minute. You'll get a URL like
   `https://amazing-name-123456.netlify.app` — verify it works.

## 3 — Add harley.h-dbuilds.com as a custom domain (Netlify)

In the Netlify site:

1. **Site configuration → Domain management → Custom domains → Add a
   domain**.
2. Enter: `harley.h-dbuilds.com`.
3. Netlify will say "Check DNS configuration" and show you a CNAME target
   like `amazing-name-123456.netlify.app`. Copy it — that's what you'll
   point at from Wix.
4. Netlify auto-provisions a Let's Encrypt SSL certificate once DNS
   propagates.

## 4 — Add the CNAME record at Wix

Because h-dbuilds.com was bought through Wix, Wix manages its DNS. Wix lets
you add custom subdomain records on domains you own through their account
dashboard:

1. Go to https://www.wix.com/my-account/domains
2. Click on **h-dbuilds.com**.
3. Open **Advanced → DNS Records** (the exact wording may be "DNS Records"
   or "Edit DNS records"; this is the Wix Account dashboard, not the site
   editor).
4. Under the **CNAME** section, click **+ Add Record**:
   - **Host Name**: `harley`
   - **Value / Points to**: the `*.netlify.app` hostname from step 3
     (e.g. `amazing-name-123456.netlify.app`)
   - **TTL**: default is fine
5. Save.

If you don't see a "DNS Records" option under Advanced, Wix may be routing
DNS through their own nameservers but only exposing MX/TXT. In that case,
open a Wix support chat and ask them to add a CNAME: `harley` →
`<your-netlify-host>.netlify.app`. Wix support does this routinely.

## 5 — Wait for propagation + verify

- DNS propagation: usually 5–30 minutes, sometimes up to 48 hours.
- Check propagation at https://dnschecker.org/?query=harley.h-dbuilds.com&type=CNAME
- When Netlify shows the domain as verified and the SSL cert is green,
  visit https://harley.h-dbuilds.com — you should see the app.

## Future updates

Any commit to `main` will auto-deploy. To add new service procedures, edit
`src/data/jobs.js`, commit, push — the site refreshes in ~1 minute.

## Rollback

Netlify keeps every deploy. If a push breaks the site:
**Deploys → click any previous working deploy → Publish deploy**.
