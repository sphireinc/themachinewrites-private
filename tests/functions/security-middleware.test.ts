import { describe, expect, it } from 'vitest';
import { onRequest } from '../../functions/_middleware';

async function render(pathname: string, response?: Response): Promise<Response> {
  return onRequest({ request: new Request(`https://example.org${pathname}`), env: {}, params: {}, next: async () => response ?? Response.json({ ok: true }) });
}

describe('Pages security middleware', () => {
  it('adds API security headers without replacing no-store', async () => {
    const response = await render('/api/health', new Response('{}', { headers: { 'Cache-Control': 'no-store' } }));
    expect(response.headers.get('content-security-policy')).toContain("default-src 'none'");
    expect(response.headers.get('x-content-type-options')).toBe('nosniff');
    expect(response.headers.get('x-frame-options')).toBe('DENY');
    expect(response.headers.get('cache-control')).toBe('no-store');
  });

  it('adds a same-origin application CSP to HTML and preserves response status', async () => {
    const response = await render('/', new Response('<html></html>', { status: 503 }));
    expect(response.status).toBe(503);
    expect(response.headers.get('content-security-policy')).toContain("script-src 'self'");
    expect(response.headers.get('referrer-policy')).toBe('no-referrer');
    expect(response.headers.get('permissions-policy')).toContain('geolocation=()');
  });
});
