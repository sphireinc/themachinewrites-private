import { guardedGet, cacheSeconds, jsonResponse, fetchText } from '../../_lib/handler';
import { isULID, parseJSON, validateRelations } from '../../_lib/validate';

export const onRequest: PagesFunction = async ({ request, env, params }) => guardedGet(request, async () => {
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  if (!id || !isULID(id)) return Response.json({ error: 'bad_request', message: 'post ID must be a ULID.' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
  const payload = await fetchText(request, env, 'feed/relations.json');
  const relations = validateRelations(parseJSON(payload));
  return jsonResponse({ schema_version: 1, id, references: relations.relations[id] ?? [] }, cacheSeconds(env));
});
