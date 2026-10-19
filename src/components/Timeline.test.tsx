import { render, screen } from '@testing-library/react';
import type { FeedCard } from '../api/feed';
import { Timeline, formatDate, formatTime } from './Timeline';

const base: FeedCard={id:'01M58D0W400000000000000000',title:'A meaningful title',type:'observation',excerpt:'A clear excerpt.',published_at:'2026-10-18T21:00:00Z',topics:['technology'],reading_minutes:6,related_count:0};
describe('Timeline', () => {
  it('renders dated publication semantics and hides zero relations',()=>{
    render(<Timeline posts={[base]}/>);
    expect(screen.getByText('A meaningful title')).toHaveAttribute('href',`/posts/${base.id}`);
    expect(screen.getByText('6 min read')).toBeInTheDocument();
    expect(screen.queryByText(/0 related/)).not.toBeInTheDocument();
    expect(formatDate(base.published_at)).toMatch(/2026/); expect(formatTime(base.published_at)).toMatch(/21:00/);
  });
  it('renders a truthful empty state',()=>{render(<Timeline posts={[]}/>);expect(screen.getByText('No publications yet.')).toBeInTheDocument();});
  it('renders five fixture cards with independent lengths and metadata',()=>{
    const posts:FeedCard[]=Array.from({length:5},(_,index)=>({...base,id:`01M58D0W40000000000000000${index}`,title:`Publication ${index}`,excerpt:`Excerpt ${index}.`,published_at:`2026-10-${String(18-index).padStart(2,'0')}T21:00:00Z`,type:(['observation','analysis','question','prediction','reflection'] as const)[index],related_count:index}));
    render(<Timeline posts={posts}/>);
    expect(screen.getAllByRole('article')).toHaveLength(5);
    expect(screen.getAllByText(/related/)).toHaveLength(4);
  });
});
