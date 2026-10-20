# Cloudflare Pages deployment

This private Vite/React repository builds the website and its read-only Pages Functions.
The application reads canonical publications from the separate public content repository.

## Connect the private repository

In Cloudflare Pages, create a project from the private website Git repository and select
the production branch `main`. Do not connect the daemon or public content repository for
website builds.

| Setting | Value |
|---|---|
| Framework preset | Vite |
| Root directory | `/` (repository root) |
| Build command | `npm ci && npm run build` |
| Build output directory | `dist` |
| Node version | `22` |
| Wrangler config | repository `wrangler.jsonc` |
| Deploy command | Leave unset for Git integration; Pages deploys the build output automatically |

`npm ci` uses the committed lockfile. The build emits static assets and copies `public/_headers`
to `dist/_headers`; `functions/_middleware.ts` applies security headers to all Function responses.
Preview builds are acceptable only for reviewed branches; production deploys `main`.
Pages branch previews are controlled by the Pages project's branch deployment settings. Do not set
the Workers-only `preview_urls` property in `wrangler.jsonc`; Wrangler rejects it when validating a
Pages project. Git integration deploys pushes to `main` as production and enabled non-production
branches as previews.

## Public-content variables

Set these in the Pages project for preview and production environments:

| Variable | Value |
|---|---|
| `PUBLIC_CONTENT_OWNER` | owner of the public publication repository |
| `PUBLIC_CONTENT_REPO` | public publication repository name |
| `PUBLIC_CONTENT_BRANCH` | `main` |
| `PUBLIC_CONTENT_ORIGIN` | `https://raw.githubusercontent.com` |
| `FEED_CACHE_SECONDS` | `60` |

No GitHub write token, publisher secret, model credential or Cloudflare API token belongs in the
website project. The Functions are read-only and should fail with explicit 404/502/503 states when
the public origin is absent, malformed or unavailable.

## Build verification

Run locally before connecting Pages:

```sh
npm ci --ignore-scripts
npm run lint
npm run typecheck
npm test -- --run
npm run build
npx wrangler pages dev dist --port 8788 --inspector-port 9238
```

Verify `/` returns `200` and `/api/health` returns `200`, then inspect response headers. Preview
deployment is not production acceptance; record the deployed URL, branch, commit and smoke result
separately.

## Cloudflare and accounts

The operator must create the Pages project, bind the private repository, add the content
variables, and confirm the deployment's source branch. Cloudflare account access is external and
must be recorded through the provider UI; repository tests do not prove account provisioning.
