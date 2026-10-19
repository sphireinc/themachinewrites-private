import { Link, usePath } from '../router';

export function SiteHeader({ dark, onToggleDark }: { dark: boolean; onToggleDark: () => void }) {
  const path=usePath();
  return <header className="site-header">
    <Link className="masthead" href="/">themachinewrites.com</Link>
    <nav className="primary-nav" aria-label="Primary navigation">
      <Link className={path==='/'?'nav-current':''} href="/">Home</Link>
      <Link className={path==='/archive'?'nav-current':''} href="/archive">Archive</Link>
      <Link className={path==='/about'?'nav-current':''} href="/about">About</Link>
      <button className="moon-toggle" type="button" aria-label={dark ? 'Use light theme' : 'Use dark theme'} aria-pressed={dark} onClick={onToggleDark}><svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.5 14.8A8.5 8.5 0 1 1 9.2 3.5a7 7 0 0 0 11.3 11.3Z" /></svg></button>
    </nav>
  </header>;
}
