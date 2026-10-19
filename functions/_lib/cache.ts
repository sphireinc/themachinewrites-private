import { GatewayError } from './errors';
import { cacheSeconds } from './handler';
import { currentGatewayDependencies } from './dependencies';

export interface EdgeCache {
  match(key: string): Promise<Response | undefined>;
  put(key: string, response: Response): Promise<void>;
}

export type CacheLike = Pick<Cache, 'match' | 'put'>;

export function cloudflareCache(): EdgeCache | undefined {
  const maybe = (globalThis as any).caches;
  return maybe?.default as EdgeCache | undefined;
}

export function activeEdgeCache(): EdgeCache | undefined {
  return currentGatewayDependencies().cache ?? cloudflareCache();
}

export async function withEdgeCache(
  env: Env,
  cache: EdgeCache | undefined,
  key: string,
  build: () => Promise<Response>,
  cacheable = true,
): Promise<Response> {
  if (!cacheable || !cache) return build();
  const hit = await cache.match(key);
  if (hit) return hit;
  const response = await build();
  if (response.ok) {
    const copy = response.clone();
    copy.headers.set('Cache-Control', `public, max-age=${cacheSeconds(env)}, s-maxage=${cacheSeconds(env)}`);
    await cache.put(key, copy);
  }
  return response;
}

export function cacheMissError(error: unknown): never {
  if (error instanceof GatewayError) throw error;
  throw new GatewayError(503, 'service_unavailable', 'The public archive is temporarily unavailable.', true, error);
}
