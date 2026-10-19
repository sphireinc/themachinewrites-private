import { describe, expect, it } from 'vitest';
import { normalizedCacheKey } from '../../functions/_lib/cacheKey';
import { withEdgeCache, type EdgeCache } from '../../functions/_lib/cache';
import { onRequest as feed } from '../../functions/api/feed';
import { fetchPublicContentWithCache } from '../../functions/_lib/publicContent';
import { configureGatewayForTests } from '../../functions/_lib/dependencies';

const env: Env = { PUBLIC_CONTENT_OWNER:'owner', PUBLIC_CONTENT_REPO:'repo', PUBLIC_CONTENT_BRANCH:'main', PUBLIC_CONTENT_ORIGIN:'https://raw.githubusercontent.com', FEED_CACHE_SECONDS:'60' };

class MemoryCache implements EdgeCache {
  values = new Map<string,Response>();
  async match(key:string){return this.values.get(key)?.clone();}
  async put(key:string,response:Response){this.values.set(key,response.clone());}
}

describe('edge cache behavior', () => {
  it('normalizes tracking variants and rejects unknown params',()=>{
    const a=normalizedCacheKey(new Request('https://themachinewrites.com/api/feed?utm_source=a'));
    const b=normalizedCacheKey(new Request('https://themachinewrites.com/api/feed?fbclid=b'));
    expect(a).toBe(b); expect(()=>normalizedCacheKey(new Request('https://themachinewrites.com/api/feed?foo=1'))).toThrow();
  });
  it('serves warm cache without origin and cold miss returns 503',async()=>{
    let calls=0;const cache=new MemoryCache();
    await withEdgeCache(env,cache,'https://themachinewrites.com/api/feed',async()=>{calls++;return Response.json({ok:true});});
    const second=await withEdgeCache(env,cache,'https://themachinewrites.com/api/feed',async()=>{calls++;return Response.json({ok:false});});
    expect(calls).toBe(1); expect(await second.json()).toEqual({ok:true});
    configureGatewayForTests({fetcher:async()=>new Response('origin down',{status:503}),cache:new MemoryCache()});
    const cold=await feed({request:new Request('https://themachinewrites.com/api/feed'),env,params:{}});
    expect(cold.status).toBe(503);
    configureGatewayForTests({});
  });
  it('preserves body when origin returns 304 with cached validators',async()=>{
    const cached={text:'cached',etag:'etag',lastModified:'date'};
    await expect(fetchPublicContentWithCache(env,'feed/latest.json',cached,async()=>new Response(null,{status:304}),1000,512)).resolves.toEqual({...cached,notModified:true});
  });
  it('article cache remains immutable and query-independent',async()=>{
    const cache=new MemoryCache(); let calls=0;
    const a=await withEdgeCache(env,cache,'https://themachinewrites.com/api/posts/01M58D0W400000000000000000',async()=>{calls++;return new Response('body',{headers:{'Cache-Control':'public, max-age=31536000, immutable'}});});
    const b=await withEdgeCache(env,cache,'https://themachinewrites.com/api/posts/01M58D0W400000000000000000',async()=>{calls++;return new Response('changed');});
    expect(calls).toBe(1); expect(await a.text()).toBe('body'); expect(await b.text()).toBe('body');
  });
});
