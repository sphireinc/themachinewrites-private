import { useMemo, useState } from 'react';
import type { LatestFeed } from '../api/feed';
import { CategoryFilters, filterByCategory, type Category } from './CategoryFilters';
import { Timeline } from './Timeline';
import { TopicFilters } from './TopicFilters';
import { topicLabels } from '../utils/topics';
import { AboutPanel } from './AboutPanel';
import { deriveStats, LastActivity } from './LastActivity';

export function usePublicationView(feed:LatestFeed) {
  const [category,setCategory]=useState<Category>('all'); const [topic,setTopic]=useState<string|null>(null);
  const visible=useMemo(()=>filterByCategory(feed.posts,category).filter((post)=>!topic||post.topics.includes(topic)),[feed.posts,category,topic]);
  return {left:<CategoryFilters value={category} onChange={setCategory}/>,center:<Timeline posts={visible}/>,right:<><LastActivity stats={deriveStats(feed.posts)}/><TopicFilters topics={topicLabels(feed.posts)} selected={topic} onToggle={(value)=>setTopic((current)=>current===value?null:value)}/><AboutPanel/></>};
}

export function PublicationView({ feed }: { feed:LatestFeed }) {
  const view=usePublicationView(feed);
  return <><div aria-label="Filters">{view.left}</div><div aria-label="Publication timeline">{view.center}</div><div aria-label="Publication context">{view.right}</div></>;
}
