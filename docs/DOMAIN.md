# Custom domain, DNS, TLS and routing

After the Pages preview is healthy, attach the following domains in Cloudflare Pages:

- Apex: `themachinewrites.com`
- Optional redirect host: `www.themachinewrites.com`

Use Cloudflare's Pages custom-domain instructions rather than hard-coding provider-specific DNS
records in this repository. The provider supplies the required CNAME/A targets for the selected
zone. Keep one canonical hostname and redirect the other consistently; the current intended
canonical form is the apex unless the operator records a deliberate alternative.

## Verification

Record the date, project, deployment commit and command output:

```sh
curl -I https://themachinewrites.com/
curl -I https://www.themachinewrites.com/
curl -I https://themachinewrites.com/api/feed
```

Pass criteria:

- Apex HTTPS serves the reviewed application with a valid certificate.
- `www` either serves the same canonical site or returns the chosen permanent redirect consistently.
- `/api/feed` reaches the Cloudflare Function and returns an explicit success or failure state,
  never a silent fake publication.
- Response headers include CSP, `Referrer-Policy`, `X-Content-Type-Options`, `X-Frame-Options`,
  restrictive `Permissions-Policy`, COOP and CORP.
- No mixed-content or insecure asset requests appear in browser developer tools.

SPA navigations such as `/archive` and `/about` should return the application shell from Pages;
API paths remain handled by Functions. Invalid API inputs/state return explicit JSON
`400/404/502/503` responses, not a false success page.

Domain ownership, DNS records, certificate issuance and redirect verification require operator
action in Cloudflare. Do not claim completion from local Wrangler output alone.
