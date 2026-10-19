export type PublicationType = 'observation' | 'analysis' | 'question' | 'prediction' | 'reflection' | 'correction';
export interface FeedCard { id:string; title:string; type:PublicationType; excerpt:string; published_at:string; topics:string[]; reading_minutes:number; related_count:number }
export interface LatestFeed { schema_version:1; generated_at:string; posts:FeedCard[] }

export async function fetchFeed(fetcher: typeof fetch = fetch, timeoutMs = 5000): Promise<LatestFeed> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetcher('/api/feed', { signal: controller.signal, headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`Feed request failed (${response.status})`);
    return parseFeed(await response.json());
  } finally { clearTimeout(timer); }
}

export function parseFeed(value: unknown): LatestFeed {
  if (!value || typeof value !== 'object') throw new Error('Invalid feed response');
  const record = value as Record<string, unknown>;
  if (record.schema_version !== 1 || !Array.isArray(record.posts)) throw new Error('Unsupported feed schema');
  const posts = record.posts.map(parseCard);
  return { schema_version: 1, generated_at: String(record.generated_at), posts };
}

function parseCard(value: unknown): FeedCard {
  if (!value || typeof value !== 'object') throw new Error('Invalid feed card');
  const card = value as Record<string, unknown>;
  const fields = ['id','title','type','excerpt','published_at'] as const;
  if (fields.some((field) => typeof card[field] !== 'string') || !Array.isArray(card.topics) ||
      typeof card.reading_minutes !== 'number' || typeof card.related_count !== 'number') throw new Error('Invalid feed card');
  return card as unknown as FeedCard;
}
