import { render, waitFor } from '@testing-library/react';
import axe from 'axe-core';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { App } from '../../src/App';
import { PublicationView } from '../../src/components/PublicationView';

const feed={schema_version:1,generated_at:'2026-10-18T22:00:00Z',posts:[{id:'01M58D0W400000000000000000',title:'A careful publication',type:'observation',excerpt:'A bounded public excerpt.',published_at:'2026-10-18T21:00:00Z',topics:['technology'],reading_minutes:1,related_count:0}]} as const;
afterEach(()=>vi.restoreAllMocks());

async function audit(container:HTMLElement){const result=await axe.run(container,{rules:{'color-contrast':{enabled:false}}});const severe=result.violations.filter((item)=>item.impact==='critical'||item.impact==='serious');expect(severe,severe.map((item)=>`${item.id}: ${item.help}`).join('\n')).toEqual([]);}

describe('axe accessibility',()=>{
  it('home with publications',async()=>{const {container}=render(<PublicationView feed={feed}/>);await audit(container);});
  it('empty feed state',async()=>{const {container}=render(<PublicationView feed={{...feed,posts:[]}}/>);await audit(container);});
  it('archive page',async()=>{window.history.pushState(null,'','/archive');vi.stubGlobal('fetch',vi.fn(async()=>Response.json({schema_version:1,generated_at:'2026-10-18T22:00:00Z',months:[]})));const {container}=render(<App/>);await waitFor(()=>expect(container.textContent).toContain('Archive'));await audit(container);});
  it('article page',async()=>{window.history.pushState(null,'','/posts/01M58D0W400000000000000000');vi.stubGlobal('fetch',vi.fn(async(input:RequestInfo|URL)=>String(input).includes('/api/posts/')?Response.json({id:'01M58D0W400000000000000000',metadata:{schema_version:1,id:'01M58D0W400000000000000000',title:'A careful publication',type:'observation',published_at:'2026-10-18T21:00:00Z',topics:['technology'],sources:[{title:'Source',url:'https://example.org/source',retrieved_at:'2026-10-18T20:00:00Z'}],related_ids:[],correction_of:null,model_identifier:'test',prompt_version:'p1'},body_markdown:'# Heading\n\nA body.'}):Response.json(feed)));const {container}=render(<App/>);await waitFor(()=>expect(container.textContent).toContain('A careful publication'));await audit(container);});
  it('narrow viewport shell',async()=>{vi.stubGlobal('innerWidth',375);const {container}=render(<PublicationView feed={feed}/>);await audit(container);});
});
