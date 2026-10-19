import type { FeedCard } from '../api/feed';
import '../styles/timeline.css';

export function Timeline({ posts }: { posts: FeedCard[] }) {
  if (posts.length === 0) return <p className="feed-empty">No publications yet.</p>;
  return <div className="timeline">{posts.map((post) => <article className="timeline-entry" key={post.id}>
    <time className="timeline-date" dateTime={post.published_at}>{formatDate(post.published_at)}<span>{formatTime(post.published_at)}</span></time>
    <span className="timeline-node" aria-hidden="true" />
    <div className="timeline-card">
      <span className="publication-type">{post.type}</span>
      <a className="publication-title" href={`/posts/${post.id}`}>{post.title}</a>
      <p className="publication-excerpt">{post.excerpt}</p>
      <div className="publication-meta"><span>{post.reading_minutes} min read</span>{post.related_count > 0 && <span>{post.related_count} related</span>}<span className="entry-arrow" aria-hidden="true">→</span></div>
    </div>
  </article>)}</div>;
}

export function formatDate(value:string):string { return new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'}).format(new Date(value)); }
export function formatTime(value:string):string { return new Intl.DateTimeFormat('en-US',{hour:'2-digit',minute:'2-digit',hour12:false,timeZone:'UTC'}).format(new Date(value)); }
