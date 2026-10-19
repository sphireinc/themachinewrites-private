import { guardedGet, cacheSeconds, jsonResponse, fetchText } from '../_lib/handler';
import { parseJSON, validateLatest } from '../_lib/validate';
import { normalizedCacheKey } from '../_lib/cacheKey';
import { activeEdgeCache, withEdgeCache } from '../_lib/cache';

export const onRequest: PagesFunction = async ({ request, env }) => guardedGet(request, async () => {
  const key = normalizedCacheKey(request);
  return withEdgeCache(env, activeEdgeCache(), key, async () => {
  const payload = await fetchText(request, env, 'feed/latest.json');
  return jsonResponse(validateLatest(parseJSON(payload)), cacheSeconds(env));
  });
});
