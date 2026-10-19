import type { FeedCard } from './feed';
export interface Catalog {schema_version:1;generated_at:string;months:{month:string;count:number}[]}
export interface MonthFeed {schema_version:1;generated_at:string;month:string;total:number;posts:FeedCard[]}
export async function fetchCatalog(fetcher:typeof fetch=fetch):Promise<Catalog>{const response=await fetcher('/api/archive');if(!response.ok)throw new Error('Archive unavailable');return response.json();}
export async function fetchMonth(month:string,fetcher:typeof fetch=fetch):Promise<MonthFeed>{const response=await fetcher(`/api/archive?month=${encodeURIComponent(month)}`);if(!response.ok)throw new Error('Month unavailable');return response.json();}
