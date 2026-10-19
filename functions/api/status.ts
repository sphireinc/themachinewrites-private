import { guardedGet, cacheSeconds, jsonResponse, fetchText } from '../_lib/handler';
import { parseJSON, validateStats } from '../_lib/validate';

export const onRequest: PagesFunction = async ({ request, env }) => guardedGet(request, async () => {
  const payload = await fetchText(request, env, 'feed/stats.json');
  return jsonResponse(validateStats(parseJSON(payload)), cacheSeconds(env));
});
