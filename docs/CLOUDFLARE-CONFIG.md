# Cloudflare configuration

Copy `.dev.vars.example` to the ignored `.dev.vars` for local development. These values identify public read-only content; no credential is required.

| Variable | Purpose |
|---|---|
| `PUBLIC_CONTENT_OWNER` | GitHub owner of the public content repository |
| `PUBLIC_CONTENT_REPO` | Public content repository name |
| `PUBLIC_CONTENT_BRANCH` | Read branch, normally `main` |
| `PUBLIC_CONTENT_ORIGIN` | Raw HTTPS origin, normally `https://raw.githubusercontent.com` |
| `FEED_CACHE_SECONDS` | Short TTL for mutable feed indexes, normally 60 |

Pages Functions only read public Git content. Do not place a publication token, private key, Cloudflare API token, or model credential in `.dev.vars`, Wrangler config, source, or build output.
