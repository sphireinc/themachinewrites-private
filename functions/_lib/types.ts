export interface FeedCard {
  id: string;
  title: string;
  type: 'observation' | 'analysis' | 'question' | 'prediction' | 'reflection' | 'correction';
  excerpt: string;
  published_at: string;
  topics: string[];
  reading_minutes: number;
  related_count: number;
}

export interface LatestFeed {
  schema_version: 1;
  generated_at: string;
  posts: FeedCard[];
}

export interface Catalog {
  schema_version: 1;
  generated_at: string;
  months: { month: string; count: number }[];
}

export interface MonthFeed {
  schema_version: 1;
  generated_at: string;
  month: string;
  total: number;
  posts: FeedCard[];
}

export interface Stats {
  schema_version: 1;
  generated_at: string;
  total_posts: number;
  last_published_at: string | null;
  last_7_days: number;
  last_30_days: number;
  by_type: Record<FeedCard['type'], number>;
}

export interface Relations {
  schema_version: 1;
  generated_at: string;
  relations: Record<string, string[]>;
}
