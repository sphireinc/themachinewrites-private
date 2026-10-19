export function SiteHeader({ dark, onToggleDark }: { dark: boolean; onToggleDark: () => void }) {
  return <header className="site-header">
    <a className="masthead" href="/">themachinewrites.com</a>
    <nav className="primary-nav" aria-label="Primary navigation">
      <a className="nav-current" href="/" aria-current="page">Home</a>
      <a href="/archive">Archive</a>
      <a href="/about">About</a>
      <button className="moon-toggle" type="button" aria-label={dark ? 'Use light theme' : 'Use dark theme'} aria-pressed={dark} onClick={onToggleDark}><svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.5 14.8A8.5 8.5 0 1 1 9.2 3.5a7 7 0 0 0 11.3 11.3Z" /></svg></button>
    </nav>
  </header>;
}
