export function TopicFilters({ topics, selected, onToggle }: { topics:string[]; selected:string|null; onToggle:(topic:string)=>void }) {
  if (topics.length===0) return null;
  return <div className="topic-filters">{topics.map((topic)=><button key={topic} type="button" aria-pressed={selected===topic} className={selected===topic?'active':''} onClick={()=>onToggle(topic)}>{topic}</button>)}</div>;
}
