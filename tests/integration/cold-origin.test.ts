import { describe, expect, it } from 'vitest';
import { onRequest as feed } from '../../functions/api/feed';
import { configureGatewayForTests } from '../../functions/_lib/dependencies';

const env: Env = {
  PUBLIC_CONTENT_OWNER: 'fixture',
  PUBLIC_CONTENT_REPO: 'public',
  PUBLIC_CONTENT_BRANCH: 'main',
  PUBLIC_CONTENT_ORIGIN: 'https://raw.githubusercontent.com',
  FEED_CACHE_SECONDS: '60',
};

async function call(fetcher: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>): Promise<Response> {
  configureGatewayForTests({ fetcher });
  try {
    return await feed({ request: new Request('https://themachinewrites.com/api/feed'), env, params: {} });
  } finally {
    configureGatewayForTests({});
  }
}

describe('cold public origin and website failure states', () => {
  it.each([
    [404, 'not_found'],
    [500, 'service_unavailable'],
  ])('maps origin %i to explicit %s rather than an empty success', async (status, code) => {
    const response = await call(async () => new Response('origin unavailable', { status }));
    expect(response.status).toBe(status === 404 ? 404 : 503);
    expect(await response.json()).toMatchObject({ error: code, retryable: status !== 404 });
  });

  it('maps an aborted origin request to a retryable timeout', async () => {
    const response = await call(async () => {
      const error = new DOMException('aborted', 'AbortError');
      throw error;
    });
    expect(response.status).toBe(503);
    expect(await response.json()).toMatchObject({ error: 'service_unavailable', retryable: true });
  });

  it('rejects malformed and schema-drifted payloads as a bad gateway', async () => {
    const malformed = await call(async () => new Response('{', { status: 200 }));
    expect(malformed.status).toBe(502);
    const drifted = await call(async () => new Response(JSON.stringify({ schema_version: 2, generated_at: '2026-10-18T20:00:00Z', posts: [] }), { status: 200 }));
    expect(drifted.status).toBe(502);
  });

  it('rejects an origin redirect instead of following it', async () => {
    const response = await call(async () => new Response(null, { status: 302, headers: { Location: 'https://attacker.example/' } }));
    expect(response.status).toBe(502);
    expect(await response.json()).toMatchObject({ error: 'bad_gateway', retryable: false });
    expect(response.headers.get('Cache-Control')).toBe('no-store');
  });

  it('returns empty cards only for a valid empty v1 feed', async () => {
    const response = await call(async () => new Response(JSON.stringify({ schema_version: 1, generated_at: '2026-10-18T20:00:00Z', posts: [] }), { status: 200 }));
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ schema_version: 1, posts: [] });
  });
});
