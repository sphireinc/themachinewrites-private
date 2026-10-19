import { useEffect, useState } from 'react';
import { fetchFeed, type LatestFeed } from './api/feed';
import { SiteHeader } from './components/SiteHeader';
import { SiteFooter } from './components/SiteFooter';
import { FeedLayout } from './layouts/FeedLayout';
import { Timeline } from './components/Timeline';
import { FeedError } from './components/FeedState';

export function App() {
  const [dark, setDark] = useState(false);
  const [feed, setFeed] = useState<LatestFeed | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reload, setReload] = useState(0);
  useEffect(() => { let active=true; fetchFeed().then((value)=>{if(active){setFeed(value);setError(null)}}).catch(()=>{if(active)setError('Unable to load publications.')}); return ()=>{active=false}; }, [reload]);
  return <main className={`site-shell bg-canvas text-ink${dark ? ' dark' : ''}`}><SiteHeader dark={dark} onToggleDark={() => setDark((value) => !value)} /><FeedLayout left={<div className="frame-placeholder" aria-hidden="true" />} center={<section aria-label="Publication timeline">{error ? <FeedError message={error} onRetry={() => setReload((value)=>value+1)} /> : feed ? <Timeline posts={feed.posts} /> : <p className="feed-loading">Loading publications…</p>}</section>} right={<div className="context-placeholder" aria-hidden="true" />} /><SiteFooter /></main>;
}
