import type { Catalog, FeedCard, LatestFeed, MonthFeed, Relations, Stats } from './types';
import { GatewayError } from './errors';

const ULID = /^[0-7][0-9A-HJKMNP-TV-Z]{25}$/;
const MONTH = /^[0-9]{4}-(0[1-9]|1[0-2])$/;
const TYPES = new Set(['observation','analysis','question','prediction','reflection','correction']);

export function parseJSON(text: string): unknown {
  try { return JSON.parse(text); } catch (error) { throw new GatewayError(502,'bad_gateway','The public archive returned malformed JSON.',false,error); }
}

export function validateLatest(value: unknown): LatestFeed {
  const record = object(value); requireVersion(record); const posts = array(record.posts);
  if (posts.length > 50) throw invalid('latest feed exceeds 50 posts');
  const cards = posts.map(validateCard);
  assertOrdered(cards);
  return { schema_version: 1, generated_at: timestamp(record.generated_at), posts: cards };
}

export function validateCatalog(value: unknown): Catalog {
  const record = object(value); requireVersion(record); const months = array(record.months).map((entry) => {
    const item = object(entry); const month = string(item.month); if (!MONTH.test(month)) throw invalid('invalid catalog month');
    const count = nonnegative(item.count); if (count === 0) throw invalid('catalog count must be positive'); return { month, count };
  });
  return { schema_version: 1, generated_at: timestamp(record.generated_at), months };
}

export function validateMonth(value: unknown, expected?: string): MonthFeed {
  const record = object(value); requireVersion(record); const month = string(record.month);
  if (!MONTH.test(month) || (expected && month !== expected)) throw invalid('invalid month feed');
  const posts = array(record.posts).map(validateCard); const total = nonnegative(record.total);
  if (total !== posts.length) throw invalid('month total does not match posts');
  assertOrdered(posts);
  return { schema_version: 1, generated_at: timestamp(record.generated_at), month, total, posts };
}

export function validateStats(value: unknown): Stats {
  const record = object(value); requireVersion(record); const total = nonnegative(record.total_posts);
  const last = record.last_published_at === null ? null : timestamp(record.last_published_at);
  const byTypeRecord = object(record.by_type); const byType = {} as Stats['by_type'];
  for (const type of TYPES) byType[type as keyof Stats['by_type']] = nonnegative(byTypeRecord[type]);
  if (total === 0 && last !== null) throw invalid('empty corpus cannot have last publication time');
  if (total > 0 && last === null) throw invalid('nonempty corpus requires last publication time');
  return { schema_version: 1, generated_at: timestamp(record.generated_at), total_posts: total, last_published_at: last, last_7_days: nonnegative(record.last_7_days), last_30_days: nonnegative(record.last_30_days), by_type: byType };
}

export function validateRelations(value: unknown): Relations {
  const record = object(value); requireVersion(record); const source = object(record.relations); const relations: Record<string,string[]> = {};
  for (const [key, valueList] of Object.entries(source)) {
    if (!ULID.test(key)) throw invalid('invalid relation key');
    const values = array(valueList).map((id) => { const value = string(id); if (!ULID.test(value)) throw invalid('invalid relation target'); return value; });
    if (new Set(values).size !== values.length) throw invalid('duplicate relation target'); relations[key] = values.sort();
  }
  return { schema_version: 1, generated_at: timestamp(record.generated_at), relations };
}

export function isULID(value: string): boolean { return ULID.test(value); }
export function isMonth(value: string): boolean { return MONTH.test(value); }

function validateCard(value: unknown): FeedCard {
  const card=object(value), type=string(card.type); if(!TYPES.has(type)) throw invalid('invalid post type');
  if(!ULID.test(string(card.id))) throw invalid('invalid post ID'); const published=timestamp(card.published_at);
  if (decodeULIDDate(string(card.id)) !== published.slice(0,10)) throw invalid('post ID/date mismatch');
  return {id:string(card.id),title:string(card.title),type:type as FeedCard['type'],excerpt:string(card.excerpt),published_at:published,topics:array(card.topics).map(string),reading_minutes:positive(card.reading_minutes),related_count:nonnegative(card.related_count)};
}
function assertOrdered(cards:FeedCard[]){for(let i=1;i<cards.length;i++){const a=cards[i-1],b=cards[i];if(a.published_at<b.published_at||(a.published_at===b.published_at&&a.id<b.id))throw invalid('posts are not sorted newest first');}}
function decodeULIDDate(id:string){const alphabet='0123456789ABCDEFGHJKMNPQRSTVWXYZ';let value=0;for(const c of id.slice(0,10))value=value*32+alphabet.indexOf(c);return new Date(value).toISOString().slice(0,10);}
function object(value:unknown):Record<string,unknown>{if(!value||typeof value!=='object'||Array.isArray(value))throw invalid('expected object');return value as Record<string,unknown>;}
function array(value:unknown):unknown[]{if(!Array.isArray(value))throw invalid('expected array');return value;}
function string(value:unknown):string{if(typeof value!=='string')throw invalid('expected string');return value;}
function timestamp(value:unknown):string{const text=string(value);if(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(text)||Number.isNaN(Date.parse(text)))throw invalid('invalid timestamp');return text;}
function nonnegative(value:unknown):number{if(typeof value!=='number'||!Number.isInteger(value)||value<0)throw invalid('expected nonnegative integer');return value;}
function positive(value:unknown):number{const n=nonnegative(value);if(n===0)throw invalid('expected positive integer');return n;}
function requireVersion(record:Record<string,unknown>){if(record.schema_version!==1)throw invalid('unsupported schema version');}
function invalid(message:string){return new GatewayError(502,'bad_gateway',message,false);}
