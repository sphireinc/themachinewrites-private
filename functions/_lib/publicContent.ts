import { GatewayError } from './errors';

const MAX_PATH_LENGTH = 512;

export interface PublicContentResponse {
  text: string;
  etag: string | null;
  lastModified: string | null;
  notModified?: boolean;
}

export interface StoredPublicContent {
  text: string;
  etag: string | null;
  lastModified: string | null;
}

export type PublicFetcher = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export function configuredOrigin(env: Env): URL {
  const raw = env.PUBLIC_CONTENT_ORIGIN ?? 'https://raw.githubusercontent.com';
  const parsed = new URL(raw);
  if (parsed.protocol !== 'https:' || parsed.port || parsed.username || parsed.password || parsed.search || parsed.hash) {
    throw new GatewayError(503, 'service_unavailable', 'Public content origin is misconfigured.', false);
  }
  parsed.pathname = parsed.pathname.replace(/\/+$/, '');
  parsed.search = '';
  parsed.hash = '';
  return parsed;
}

export function publicContentURL(env: Env, path: string): URL {
  if (!path || path.length > MAX_PATH_LENGTH || path.startsWith('/') || path.includes('\\') || path.includes('..') || path.includes('\0') || path.split('/').some((segment) => !segment || segment === '.')) {
    throw new GatewayError(500, 'bad_gateway', 'Invalid public content path.', false);
  }
  const owner = required(env.PUBLIC_CONTENT_OWNER, 'owner');
  const repo = required(env.PUBLIC_CONTENT_REPO, 'repository');
  const branch = required(env.PUBLIC_CONTENT_BRANCH, 'branch');
  const origin = configuredOrigin(env);
  const encodedPath = path.split('/').map(encodeURIComponent).join('/');
  const prefix = `${origin.pathname.replace(/\/$/, '')}/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/${encodeURIComponent(branch)}/${encodedPath}`;
  return new URL(origin.origin + prefix);
}

export async function fetchPublicContent(
  env: Env,
  path: string,
  fetcher: PublicFetcher = fetch,
  timeoutMs = 5_000,
  maxBytes = 512 * 1024,
): Promise<PublicContentResponse> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetcher(publicContentURL(env, path), {
      method: 'GET',
      redirect: 'manual',
      signal: controller.signal,
      headers: { Accept: 'application/json, text/markdown, text/plain' },
    });
    if (response.status === 304) throw new GatewayError(304, 'not_found', 'Origin content is unchanged.', false);
    if (response.status >= 300 && response.status < 400) throw new GatewayError(502, 'bad_gateway', 'The public archive returned an unexpected redirect.', false);
    if (response.status === 404) throw new GatewayError(404, 'not_found', 'Publication not found.', false);
    if (response.status === 429) throw new GatewayError(503, 'service_unavailable', 'The public archive is temporarily busy.', true);
    if (response.status >= 500) throw new GatewayError(503, 'service_unavailable', 'The public archive is temporarily unavailable.', true);
    if (!response.ok) throw new GatewayError(502, 'bad_gateway', 'The public archive returned an invalid response.', false);
    const bytes = new Uint8Array(await response.arrayBuffer());
    if (bytes.byteLength > maxBytes) throw new GatewayError(502, 'bad_gateway', 'The public archive response is too large.', false);
    return {
      text: new TextDecoder('utf-8', { fatal: true }).decode(bytes),
      etag: response.headers.get('ETag'),
      lastModified: response.headers.get('Last-Modified'),
    };
  } catch (error) {
    if (error instanceof GatewayError) throw error;
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new GatewayError(503, 'service_unavailable', 'The public archive timed out.', true, error);
    }
    throw new GatewayError(503, 'service_unavailable', 'The public archive is temporarily unavailable.', true, error);
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchPublicContentWithCache(
  env: Env,
  path: string,
  previous: StoredPublicContent | undefined,
  fetcher: PublicFetcher = fetch,
  timeoutMs = 5_000,
  maxBytes = 512 * 1024,
): Promise<PublicContentResponse> {
  try { return await fetchPublicContent(env, path, fetcher, timeoutMs, maxBytes); }
  catch (error) {
    if (error instanceof GatewayError && error.status === 304 && previous) {
      return { ...previous, notModified: true } as PublicContentResponse;
    }
    throw error;
  }
}

function required(value: string | undefined, label: string): string {
  if (!value?.trim()) throw new GatewayError(503, 'service_unavailable', `Public content ${label} is not configured.`, false);
  return value;
}
