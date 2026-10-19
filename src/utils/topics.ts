import type { FeedCard } from '../api/feed';

export function topicLabels(posts: FeedCard[], limit=8): string[] {
  const seen = new Set<string>();
  return posts.flatMap((post)=>post.topics).filter((topic)=>{if(seen.has(topic))return false;seen.add(topic);return true}).sort((a,b)=>a.localeCompare(b)).slice(0,limit);
}
