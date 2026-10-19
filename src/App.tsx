import { useEffect, useState } from 'react';
import { fetchFeed, type LatestFeed } from './api/feed';
import { SiteHeader } from './components/SiteHeader';
import { SiteFooter } from './components/SiteFooter';
import { FeedLayout } from './layouts/FeedLayout';
import { FeedError } from './components/FeedState';
import { usePublicationView } from './components/PublicationView';
import { usePath } from './router';
import { PostPage } from './pages/PostPage';
import { ArchivePage } from './pages/ArchivePage';
import { AboutPage } from './pages/AboutPage';

export function App() {
  const path=usePath();
  const [dark, setDark] = useState(false);
  const [feed, setFeed] = useState<LatestFeed | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reload, setReload] = useState(0);
  useEffect(() => { let active=true; fetchFeed().then((value)=>{if(active){setFeed(value);setError(null)}}).catch(()=>{if(active)setError('Unable to load publications.')}); return ()=>{active=false}; }, [reload]);
  const view=usePublicationView(feed??{schema_version:1,generated_at:'',posts:[]});
  const match=/^\/posts\/([0-7][0-9A-HJKMNP-TV-Z]{25})$/.exec(path);
  const content=path==='/archive'?<ArchivePage/>:path==='/about'?<AboutPage/>:match?<PostPage id={match[1]}/>:path==='/'?<FeedLayout left={view.left} center={<section aria-label="Publication timeline">{error ? <FeedError message={error} onRetry={() => setReload((value)=>value+1)} /> : view.center}</section>} right={view.right}/>:<section className="not-found"><h1>Page not found</h1><a href="/">Return home</a></section>;
  return <main className={`site-shell bg-canvas text-ink${dark ? ' dark' : ''}`}><SiteHeader dark={dark} onToggleDark={() => setDark((value) => !value)} />{content}<SiteFooter /></main>;
}
