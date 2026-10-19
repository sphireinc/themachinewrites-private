import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parseFeed } from '../../src/api/feed';

const pin = JSON.parse(readFileSync('tests/contracts/PIN.json', 'utf8')) as {
  public_repository_revision: string;
  schemas: Record<string, string>;
};

function pinnedSchema(name: string): unknown {
  const content = readFileSync(`tests/contracts/${name}`);
  const digest = createHash('sha256').update(content).digest('hex');
  expect(pin.schemas[name]).toBe(`sha256:${digest}`);
  return JSON.parse(content.toString('utf8')) as unknown;
}

describe('pinned public contract compatibility', () => {
  it('records the reviewed public revision and immutable schema hashes', () => {
    expect(pin.public_repository_revision).toMatch(/^[0-9a-f]{40}$/);
    expect(Object.keys(pin.schemas).sort()).toEqual(['latest-feed.v1.schema.json', 'post.v1.schema.json']);
    expect(pinnedSchema('latest-feed.v1.schema.json')).toHaveProperty('$id');
    expect(pinnedSchema('post.v1.schema.json')).toHaveProperty('$id');
  });

  it('accepts a pinned v1 feed fixture through the browser parser', () => {
    const feed = {
      schema_version: 1,
      generated_at: '2026-10-18T20:01:00Z',
      posts: [{
        id: '01M589K0G00000000000000000', title: 'A careful observation', type: 'observation',
        excerpt: 'A bounded excerpt supported by the cited source.', published_at: '2026-10-18T20:00:00Z',
        topics: ['technology'], reading_minutes: 1, related_count: 0,
      }],
    };
    expect(parseFeed(feed).posts).toHaveLength(1);
  });

  it('fails closed on an unknown incompatible schema version', () => {
    expect(() => parseFeed({ schema_version: 2, generated_at: '2026-10-18T20:01:00Z', posts: [] }))
      .toThrow(/Unsupported feed schema/);
  });
});
