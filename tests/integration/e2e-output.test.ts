import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { onRequest as feed } from '../../functions/api/feed';
import { onRequest as post } from '../../functions/api/posts/[id]';
import { configureGatewayForTests } from '../../functions/_lib/dependencies';

const root = process.env.TMW_E2E_ARTIFACT_DIR;

describe.runIf(root)('published E2E artifact through website gateway', () => {
  it('serves the published card and canonical article from mocked public Git', async () => {
    const latest = readFileSync(join(root!, 'feed/latest.json'), 'utf8');
    const parsedLatest = JSON.parse(latest) as { posts: Array<{ id: string; title: string }> };
    expect(parsedLatest.posts).toHaveLength(1);
    const card = parsedLatest.posts[0];
    expect(card.title).toBe('A fixture observation');
    const id = card.id;
    const canonicalPath = readFileSync(join(root!, 'post-path.txt'), 'utf8');
    const postMarkdown = readFileSync(join(root!, canonicalPath), 'utf8');
    const env: Env = { PUBLIC_CONTENT_OWNER: 'fixture', PUBLIC_CONTENT_REPO: 'public', PUBLIC_CONTENT_BRANCH: 'main', PUBLIC_CONTENT_ORIGIN: 'https://raw.githubusercontent.com', FEED_CACHE_SECONDS: '60' };
    configureGatewayForTests({ fetcher: async (input) => {
      const path = new URL(String(input)).pathname;
      return path.endsWith('/feed/latest.json') ? new Response(latest, { status: 200 }) : new Response(postMarkdown, { status: 200 });
    } });
    try {
      const feedResponse = await feed({ request: new Request('https://themachinewrites.com/api/feed'), env, params: {} });
      expect(feedResponse.status).toBe(200);
      const feedBody = await feedResponse.json() as { posts: Array<{ id: string; title: string }> };
      expect(feedBody.posts[0]).toMatchObject({ id, title: 'A fixture observation' });
      const postResponse = await post({ request: new Request(`https://themachinewrites.com/api/posts/${id}`), env, params: { id } });
      expect(postResponse.status).toBe(200);
      const postBody = await postResponse.json() as { metadata: { id: string }; body_markdown: string };
      expect(postBody.metadata.id).toBe(id);
      expect(postBody.body_markdown).toContain('The cited fixture contains a factual observation.');
    } finally {
      configureGatewayForTests({});
    }
  });
});
