import type { FeedCard } from '../api/feed';

export interface PublicationStats { total_posts:number; last_7_days:number; last_30_days:number; last_published_at:string|null }
export function deriveStats(posts:FeedCard[], now=new Date()):PublicationStats {
  const last=posts.slice().sort((a,b)=>b.published_at.localeCompare(a.published_at))[0];
  const days=(iso:string)=>(now.getTime()-new Date(iso).getTime())/86400000;
  return {total_posts:posts.length,last_7_days:posts.filter((p)=>days(p.published_at)>=0&&days(p.published_at)<=7).length,last_30_days:posts.filter((p)=>days(p.published_at)>=0&&days(p.published_at)<=30).length,last_published_at:last?.published_at??null};
}

export function LastActivity({ stats }: { stats:PublicationStats }) {
  return <section className="activity-panel"><h2>Last activity</h2>{stats.last_published_at ? <><span className="activity-dot" aria-hidden="true"/><time dateTime={stats.last_published_at}>{new Date(stats.last_published_at).toISOString().slice(0,16).replace('T',' ')}</time><p>Published {relativeTime(stats.last_published_at)}</p></> : <p>No publications yet</p>}<div className="stats-row"><div><strong>{stats.total_posts}</strong><span>Posts</span></div><div><strong>{stats.last_7_days}</strong><span>This week</span></div><div><strong>{stats.last_30_days}</strong><span>This month</span></div></div></section>;
}
function relativeTime(value:string):string { const minutes=Math.max(0,Math.floor((Date.now()-new Date(value).getTime())/60000)); if(minutes<1)return 'just now';if(minutes<60)return `${minutes} minutes ago`;const hours=Math.floor(minutes/60);if(hours<24)return `${hours} hours ago`;return `${Math.floor(hours/24)} days ago`; }
