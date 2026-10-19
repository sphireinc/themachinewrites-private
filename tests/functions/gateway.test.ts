import { describe, expect, it } from 'vitest';
import { fetchPublicContent, publicContentURL } from '../../functions/_lib/publicContent';
import { errorResponse } from '../../functions/_lib/errors';
import { parseJSON, validateLatest } from '../../functions/_lib/validate';
import { onRequest as feed } from '../../functions/api/feed';
import { onRequest as archive } from '../../functions/api/archive';
import { onRequest as post } from '../../functions/api/posts/[id]';
import { onRequest as status } from '../../functions/api/status';
import { onRequest as relations } from '../../functions/api/relations/[id]';
import { configureGatewayForTests } from '../../functions/_lib/dependencies';

const env: Env = { PUBLIC_CONTENT_OWNER:'owner', PUBLIC_CONTENT_REPO:'repo', PUBLIC_CONTENT_BRANCH:'main', PUBLIC_CONTENT_ORIGIN:'https://raw.githubusercontent.com', FEED_CACHE_SECONDS:'60' };
const idA='01M58D0W400000000000000000', idB='01M589K0G00000000000000000';
const cardA={id:idA,title:'Newest post',type:'observation',excerpt:'Excerpt.',published_at:'2026-10-18T21:00:00Z',topics:['technology'],reading_minutes:1,related_count:0};
const cardB={...cardA,id:idB,title:'Older post',excerpt:'Older.',published_at:'2026-10-18T20:00:00Z'};
const latest={schema_version:1,generated_at:'2026-10-18T22:00:00Z',posts:[cardA,cardB]};

describe('public content fetch abstraction', () => {
  it('keeps constructed URLs under configured owner/repo/branch', () => {
    expect(publicContentURL(env,'feed/latest.json').href).toBe('https://raw.githubusercontent.com/owner/repo/main/feed/latest.json');
  });
  it('rejects an oversized origin payload safely', async()=>{
    await expect(fetchPublicContent(env,'feed/latest.json',async()=>new Response('x',{status:200}),1000,0)).rejects.toMatchObject({status:502});
  });
});

describe('gateway endpoint fixtures', () => {
  it('feed returns newest-first cards and POST 405', async()=>{
    expect(()=>validateLatest(latest)).not.toThrow();
    const result=await call(feed,'/api/feed',latest); expect(result.status, await result.clone().text()).toBe(200);
    expect((await result.json()).posts.map((p:any)=>p.id)).toEqual([idA,idB]);
    const denied=await call(feed,'/api/feed',latest,'POST'); expect(denied.status).toBe(405);
  });
  it('archive handles catalog/month and invalid month', async()=>{
    const catalog={schema_version:1,generated_at:'2026-10-18T22:00:00Z',months:[{month:'2026-10',count:2}]};
    expect((await call(archive,'/api/archive',catalog)).status).toBe(200);
    expect((await call(archive,'/api/archive?month=2026-13',{})).status).toBe(400);
  });
  it('post returns canonical markdown for valid ULID', async()=>{
    const markdown=`---\nschema_version: 1\nid: ${idA}\ntitle: "Fixture post"\ntype: observation\npublished_at: 2026-10-18T21:00:00Z\ntopics: [technology]\nsources:\n  - title: "Source"\n    url: https://example.org/source\n    retrieved_at: 2026-10-18T20:00:00Z\nrelated_ids: []\ncorrection_of: null\nmodel_identifier: "test"\nprompt_version: "p1"\n---\n\nBody.`;
    const result=await call(post,`/api/posts/${idA}`,markdown,'GET',{id:idA}); expect(result.status).toBe(200); expect(await result.json()).toMatchObject({id:idA,metadata:{title:'Fixture post'}});
  });
  it('status and relations expose publication truth', async()=>{
    const stats={schema_version:1,generated_at:'2026-10-18T22:00:00Z',total_posts:0,last_published_at:null,last_7_days:0,last_30_days:0,by_type:{observation:0,analysis:0,question:0,prediction:0,reflection:0,correction:0}};
    expect((await call(status,'/api/status',stats)).status).toBe(200);
    const rel={schema_version:1,generated_at:'2026-10-18T22:00:00Z',relations:{[idA]:[idB]}};
    const result=await call(relations,`/api/relations/${idA}`,rel,'GET',{id:idA}); expect((await result.json()).references).toEqual([idB]);
  });
  it('maps 404, 5xx, malformed JSON and schema drift', async()=>{
    expect((await call(feed,'/api/feed',null,'GET',{},404)).status).toBe(404);
    expect((await call(feed,'/api/feed',null,'GET',{},503)).status).toBe(503);
    expect(errorResponse(catchError('{')).status).toBe(502);
    expect((await call(feed,'/api/feed',{...latest,schema_version:2})).status).toBe(502);
  });
});

async function call(handler:PagesFunction,path:string,body:unknown,method='GET',params:Record<string,string>={},status=200):Promise<Response>{
  const response=status===200?new Response(typeof body==='string'?body:JSON.stringify(body),{status:200}):new Response(status>=500?'origin down':'missing',{status});
  const envWithFetch:Env={...env};
  const context={request:new Request('https://themachinewrites.com'+path,{method}),env:envWithFetch,params};
  configureGatewayForTests({fetcher:async()=>response});
  try{return await handler(context);}finally{configureGatewayForTests({});}
}
function catchError(text:string){try{return parseJSON(text)}catch(error){return error}}
