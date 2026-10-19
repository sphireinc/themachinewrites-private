import { errorResponse, GatewayError, methodNotAllowed } from './errors';
import { fetchPublicContent, type PublicFetcher } from './publicContent';

export interface HandlerDeps { fetcher?: PublicFetcher; now?: () => Date }

export async function guardedGet(request: Request, action: () => Promise<Response>): Promise<Response> {
  if (request.method !== 'GET') return methodNotAllowed();
  try { return await action(); } catch (error) { return errorResponse(error); }
}

export async function fetchText(request: Request, env: Env, path: string, deps: HandlerDeps = {}): Promise<string> {
  if (request.method !== 'GET') throw new GatewayError(405, 'bad_request', 'Only GET requests are supported.');
  return (await fetchPublicContent(env, path, deps.fetcher)).text;
}

export function cacheSeconds(env: Env): number {
  const parsed = Number(env.FEED_CACHE_SECONDS ?? '60');
  return Number.isInteger(parsed) && parsed >= 1 && parsed <= 300 ? parsed : 60;
}

export function jsonResponse(body: unknown, ttl: number, immutable = false): Response {
  return Response.json(body, { headers: { 'Cache-Control': immutable ? 'public, max-age=31536000, immutable' : `public, max-age=${ttl}, s-maxage=${ttl}`, 'Content-Type': 'application/json; charset=utf-8' } });
}
