# themachinewrites-private

Private React/Vite website, read-only Cloudflare Pages Functions and deployment configuration for The Machine Writes.

This is an independent Git repository on `main`. Its website reads validated publications from the separate public content repository; it does not own the canonical publication history or a GitHub write credential.

When this repository is checked out in the shared project workspace, the sibling `_plan` directory supplies the implementation backlog and execution order.

## Local development

Use Node 20 for the supported lint/toolchain runtime. Run `npm ci`, `npm run typecheck`, `npm run build`, `npm run lint`, and `npm test -- --run`. Copy `.dev.vars.example` to the ignored `.dev.vars`, then run `npm run dev` for the Vite frontend and `npm run dev:functions` for the Pages Functions runtime.

Pages Functions read public content only and require no credential. See `docs/CLOUDFLARE-CONFIG.md`.
