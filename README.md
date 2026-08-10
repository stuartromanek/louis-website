# Louis website

Static one-pager: what Louis is, how to install the desktop app, and first-time setup. Design tokens and brand assets come from the [Louis app](https://github.com/stuartromanek/louis) (GT Maru / Saeada).

## Local preview

```bash
npm install
npm run dev
```

Opens [http://localhost:4173](http://localhost:4173) with live reload (CSS HMR, HTML/JS full reload). Deploy stays static — no build step for Cloudflare.

## Deploy (Cloudflare Pages)

Recommended host for this site.

1. Push this repo to GitHub.
2. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → connect the repo.
3. Build settings:
   - **Framework preset:** None
   - **Build command:** _(leave empty)_
   - **Build output directory:** `/`
4. Deploy. Attach a custom domain when ready.

Preview deployments are created automatically for pull requests.

### GitHub Pages fallback

Same static files work on GitHub Pages if you publish from the root of `main` (or `docs/`). Prefer a user/org site or custom domain at `/` so asset paths (`/css/…`, `/images/…`) do not need a project base path.

## Content sources

Install and setup copy tracks:

- [louis README — Download](https://github.com/stuartromanek/louis#download-desktop)
- [docs/DESKTOP.md](https://github.com/stuartromanek/louis/blob/main/docs/DESKTOP.md)
