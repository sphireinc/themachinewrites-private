import { guardedGet, cacheSeconds, jsonResponse } from '../_lib/handler';
import { fetchPublicContent } from '../_lib/publicContent';
import { parseJSON, validateStats } from '../_lib/validate';

export const onRequest: PagesFunction = async ({ request, env }) => guardedGet(request, async () => {
  const payload = await fetchPublicContent(env, 'feed/stats.json');
  return jsonResponse(validateStats(parseJSON(payload.text)), cacheSeconds(env));
});
