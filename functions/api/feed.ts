import { guardedGet, cacheSeconds, jsonResponse, fetchText } from '../_lib/handler';
import { parseJSON, validateLatest } from '../_lib/validate';

export const onRequest: PagesFunction = async ({ request, env }) => guardedGet(request, async () => {
  const payload = await fetchText(request, env, 'feed/latest.json');
  return jsonResponse(validateLatest(parseJSON(payload)), cacheSeconds(env));
});
