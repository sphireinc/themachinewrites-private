import { parseCanonicalPost } from './post';
import { describe,expect,it } from 'vitest';
const post=`---\nschema_version: 1\nid: 01M58D0W400000000000000000\ntitle: "A careful observation"\ntype: observation\npublished_at: 2026-10-18T21:00:00Z\ntopics: [technology]\nsources:\n  - title: "Source"\n    url: https://example.org/source\n    retrieved_at: 2026-10-18T20:00:00Z\nrelated_ids: []\ncorrection_of: null\nmodel_identifier: "test"\nprompt_version: "p1"\n---\n\n# Heading\n\nBody.`;
describe('canonical post parser',()=>{it('returns title, metadata, sources and body',()=>{const parsed=parseCanonicalPost(post);expect(parsed.metadata.title).toBe('A careful observation');expect(parsed.metadata.sources).toHaveLength(1);expect(parsed.body_markdown).toContain('# Heading');});});
