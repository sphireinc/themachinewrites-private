import { guardedGet, cacheSeconds, jsonResponse } from '../_lib/handler';
import { fetchPublicContent } from '../_lib/publicContent';
import { isMonth, parseJSON, validateCatalog, validateMonth } from '../_lib/validate';

export const onRequest: PagesFunction = async ({ request, env }) => guardedGet(request, async () => {
  const url = new URL(request.url); const month = url.searchParams.get('month');
  if (month !== null && !isMonth(month)) return Response.json({ error: 'bad_request', message: 'month must use YYYY-MM.' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
  const path = month ? `feed/months/${month}.json` : 'feed/catalog.json';
  const payload = await fetchPublicContent(env, path);
  const parsed = parseJSON(payload.text);
  return jsonResponse(month ? validateMonth(parsed, month) : validateCatalog(parsed), cacheSeconds(env));
});
