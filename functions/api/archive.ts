import { guardedGet, cacheSeconds, jsonResponse, fetchText } from '../_lib/handler';
import { isMonth, parseJSON, validateCatalog, validateMonth } from '../_lib/validate';
import { normalizedCacheKey } from '../_lib/cacheKey';
import { activeEdgeCache, withEdgeCache } from '../_lib/cache';

export const onRequest: PagesFunction = async ({ request, env }) => guardedGet(request, async () => {
  const url = new URL(request.url); const month = url.searchParams.get('month');
  if (month !== null && !isMonth(month)) return Response.json({ error: 'bad_request', message: 'month must use YYYY-MM.' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
  const path = month ? `feed/months/${month}.json` : 'feed/catalog.json';
  const key = normalizedCacheKey(request);
  return withEdgeCache(env, activeEdgeCache(), key, async () => {
  const payload = await fetchText(request, env, path);
  const parsed = parseJSON(payload);
  return jsonResponse(month ? validateMonth(parsed, month) : validateCatalog(parsed), cacheSeconds(env));
  });
});
