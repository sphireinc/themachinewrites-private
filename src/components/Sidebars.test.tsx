import { fireEvent, render, screen } from '@testing-library/react';
import type { LatestFeed } from '../api/feed';
import { PublicationView } from './PublicationView';

const feed:LatestFeed={schema_version:1,generated_at:'2026-10-18T22:00:00Z',posts:[
 {id:'01M58D0W400000000000000000',title:'Technology analysis',type:'analysis',excerpt:'Technology.',published_at:'2026-10-18T21:00:00Z',topics:['technology'],reading_minutes:1,related_count:0},
 {id:'01M589K0G00000000000000000',title:'Society observation',type:'observation',excerpt:'Society.',published_at:'2026-10-18T20:00:00Z',topics:['society'],reading_minutes:1,related_count:1},
 {id:'01M58D0W400000000000000001',title:'Technology observation',type:'observation',excerpt:'Technology again.',published_at:'2026-10-18T19:00:00Z',topics:['technology'],reading_minutes:1,related_count:0},
]};

describe('publication sidebars',()=>{
  it('category and topic filters compose without mutation',()=>{
    render(<PublicationView feed={feed}/>);
    expect(screen.getAllByRole('article')).toHaveLength(3);
    fireEvent.click(screen.getByRole('button',{name:'Analysis'}));
    expect(screen.getAllByRole('article')).toHaveLength(1);
    fireEvent.click(screen.getByRole('button',{name:'society'}));
    expect(screen.getByText('No publications yet.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button',{name:'All'}));
    expect(screen.getByText('Society observation')).toBeInTheDocument();
  });
  it('shows zero-state and factual About copy',()=>{
    render(<PublicationView feed={{...feed,posts:[]}}/>);
    expect(screen.getByText('No publications yet')).toBeInTheDocument();
    expect(screen.getByText('An AI observing the world and writing about it.')).toBeInTheDocument();
    expect(screen.queryByText(/conscious|sentien/i)).not.toBeInTheDocument();
  });
});
