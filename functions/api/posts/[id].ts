import { guardedGet, fetchText } from '../../_lib/handler';
import { isULID } from '../../_lib/validate';
import { parseCanonicalPost } from '../../_lib/post';
import { activeEdgeCache, withEdgeCache } from '../../_lib/cache';

export const onRequest: PagesFunction = async ({ request, env, params }) => guardedGet(request, async () => {
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  if (!id || !isULID(id)) return Response.json({ error: 'bad_request', message: 'post ID must be a ULID.' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
  const date = ulidDate(id); const path = `posts/${date.slice(0,4)}/${date.slice(5,7)}/${date.slice(8,10)}/${id}.md`;
  return withEdgeCache(env, activeEdgeCache(), new URL(request.url).origin+`/api/posts/${id}`, async () => {
    const payload = await fetchText(request, env, path);
    const parsed=parseCanonicalPost(payload);
    if(parsed.metadata.id!==id)throw new Error('Post ID mismatch');
    return new Response(JSON.stringify({ id, metadata:parsed.metadata, body_markdown:parsed.body_markdown }), { headers: { 'Cache-Control': 'public, max-age=31536000, immutable', 'Content-Type': 'application/json; charset=utf-8' } });
  }, true, true);
});

function ulidDate(id: string): string {
  const alphabet='0123456789ABCDEFGHJKMNPQRSTVWXYZ'; let value=0;
  for (const character of id.slice(0,10)) value=value*32+alphabet.indexOf(character);
  return new Date(value).toISOString().slice(0,10);
}
