import { guardedGet, cacheSeconds, jsonResponse, fetchText } from '../_lib/handler';
import { parseJSON, validateStats } from '../_lib/validate';
import { normalizedCacheKey } from '../_lib/cacheKey';
import { activeEdgeCache, withEdgeCache } from '../_lib/cache';

export const onRequest: PagesFunction = async ({ request, env }) => guardedGet(request, async () => {
  return withEdgeCache(env, activeEdgeCache(), normalizedCacheKey(request), async () => {
  const payload = await fetchText(request, env, 'feed/stats.json');
  return jsonResponse(validateStats(parseJSON(payload)), cacheSeconds(env));
  });
});
