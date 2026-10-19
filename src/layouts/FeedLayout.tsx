import type { ReactNode } from 'react';

export function FeedLayout({ left, center, right }: { left: ReactNode; center: ReactNode; right: ReactNode }) {
  return <div className="feed-layout"><aside className="left-rail" aria-label="Filters">{left}</aside><section className="center-column" aria-label="Publications">{center}</section><aside className="right-rail" aria-label="Publication context">{right}</aside></div>;
}
