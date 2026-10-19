const commonHeaders = {
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), serial=(), browsing-topics=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
} as const;

export const onRequest: PagesFunction = async ({ request, next }) => {
  const response = await next();
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(commonHeaders)) {
    if (!headers.has(name)) headers.set(name, value);
  }
  const isAPI = new URL(request.url).pathname.startsWith('/api/');
  if (!headers.has('Content-Security-Policy')) {
    headers.set(
      'Content-Security-Policy',
      isAPI
        ? "default-src 'none'; frame-ancestors 'none'; base-uri 'none'"
        : "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'; upgrade-insecure-requests",
    );
  }
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
};
