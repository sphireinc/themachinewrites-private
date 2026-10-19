import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('Pages security headers', () => {
  const headers = readFileSync('public/_headers', 'utf8');

  it('sets a restrictive content policy without inline or remote execution', () => {
    expect(headers).toContain("default-src 'self'");
    expect(headers).toContain("script-src 'self'");
    expect(headers).toContain("object-src 'none'");
    expect(headers).toContain("base-uri 'none'");
    expect(headers).toContain("frame-ancestors 'none'");
    expect(headers).not.toMatch(/script-src[^\n]*unsafe-(?:inline|eval)/);
  });

  it('denies framing, MIME sniffing and powerful browser capabilities', () => {
    expect(headers).toContain('X-Frame-Options: DENY');
    expect(headers).toContain('X-Content-Type-Options: nosniff');
    expect(headers).toContain('Referrer-Policy: no-referrer');
    expect(headers).toContain('camera=(), microphone=(), geolocation=()');
  });

  it('never caches mutable API responses at the browser', () => {
    expect(headers).toMatch(/\/api\/\*\n(?:.*\n)*?\s+Cache-Control: no-store/);
    const apiRule = headers.slice(headers.indexOf('/api/*'));
    expect(apiRule).toContain("default-src 'none'");
    expect(apiRule).toContain('X-Content-Type-Options: nosniff');
    expect(apiRule).toContain('X-Frame-Options: DENY');
  });
});
