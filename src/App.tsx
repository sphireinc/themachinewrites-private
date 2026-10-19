import { useState } from 'react';
import { SiteHeader } from './components/SiteHeader';
import { SiteFooter } from './components/SiteFooter';
import { FeedLayout } from './layouts/FeedLayout';

export function App() {
  const [dark, setDark] = useState(false);
  return <main className={`site-shell bg-canvas text-ink${dark ? ' dark' : ''}`}><SiteHeader dark={dark} onToggleDark={() => setDark((value) => !value)} /><FeedLayout left={<div className="frame-placeholder" aria-hidden="true" />} center={<div className="timeline-placeholder" aria-label="Publication timeline" />} right={<div className="context-placeholder" aria-hidden="true" />} /><SiteFooter /></main>;
}
