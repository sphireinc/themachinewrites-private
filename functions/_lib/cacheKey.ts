const ALLOWED_QUERY: Record<string, Set<string>> = { '/api/feed': new Set(), '/api/archive': new Set(['month']), '/api/status': new Set() };
const TRACKING = new Set(['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid','fbclid']);

export function normalizedCacheKey(request: Request): string {
  const incoming = new URL(request.url);
  const allowed = ALLOWED_QUERY[incoming.pathname] ?? (incoming.pathname.startsWith('/api/posts/') || incoming.pathname.startsWith('/api/relations/') ? new Set<string>() : undefined);
  const query = new URLSearchParams();
  if (allowed) {
    for (const [key, value] of incoming.searchParams) {
      if (TRACKING.has(key.toLowerCase())) continue;
      if (!allowed.has(key)) throw new Error('unsupported query parameter');
      query.append(key, value);
    }
    query.sort();
  }
  const base = new URL(incoming.pathname, incoming.origin);
  base.search = query.toString();
  return base.toString();
}
