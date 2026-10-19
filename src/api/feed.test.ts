import { parseFeed } from './feed';

describe('typed feed client', () => {
  it('parses a valid payload', () => {
    expect(parseFeed({schema_version:1,generated_at:'2026-10-18T20:00:00Z',posts:[]})).toMatchObject({schema_version:1,posts:[]});
  });
  it('rejects schema and malformed cards', () => {
    expect(()=>parseFeed({schema_version:2,posts:[]})).toThrow('Unsupported feed schema');
    expect(()=>parseFeed({schema_version:1,posts:[{}]})).toThrow('Invalid feed card');
  });
});
