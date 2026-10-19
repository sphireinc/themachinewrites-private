import { useEffect, useState } from 'react';
import { fetchFeed, type LatestFeed } from './api/feed';
import { SiteHeader } from './components/SiteHeader';
import { SiteFooter } from './components/SiteFooter';
import { FeedLayout } from './layouts/FeedLayout';
import { FeedError } from './components/FeedState';
import { usePublicationView } from './components/PublicationView';

export function App() {
  const [dark, setDark] = useState(false);
  const [feed, setFeed] = useState<LatestFeed | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reload, setReload] = useState(0);
  useEffect(() => { let active=true; fetchFeed().then((value)=>{if(active){setFeed(value);setError(null)}}).catch(()=>{if(active)setError('Unable to load publications.')}); return ()=>{active=false}; }, [reload]);
  const view=usePublicationView(feed??{schema_version:1,generated_at:'',posts:[]});
  return <main className={`site-shell bg-canvas text-ink${dark ? ' dark' : ''}`}><SiteHeader dark={dark} onToggleDark={() => setDark((value) => !value)} /><FeedLayout left={view?.left??<div aria-hidden="true"/>} center={<section aria-label="Publication timeline">{error ? <FeedError message={error} onRetry={() => setReload((value)=>value+1)} /> : view?.center??<p className="feed-loading">Loading publications…</p>}</section>} right={view?.right??<div aria-hidden="true"/>} /><SiteFooter /></main>;
}
