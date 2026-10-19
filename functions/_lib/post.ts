import { GatewayError } from './errors';

export interface PostSource { title:string;url:string;retrieved_at:string }
export interface PostMetadata {schema_version:1;id:string;title:string;type:string;published_at:string;topics:string[];sources:PostSource[];related_ids:string[];correction_of:string|null;model_identifier:string;prompt_version:string}
export interface ParsedPost {metadata:PostMetadata;body_markdown:string}

export function parseCanonicalPost(markdown:string):ParsedPost {
  const normalized=markdown.replace(/\r\n/g,'\n'); if(!normalized.startsWith('---\n')) throw invalid();
  const close=normalized.indexOf('\n---\n',4); if(close<0) throw invalid();
  const lines=normalized.slice(4,close).split('\n'); const values:Record<string,string>={}; const sources:PostSource[]=[]; let inSources=false; let current:Partial<PostSource>|null=null;
  for(const raw of lines){const line=raw.trim(); if(!line)continue; if(line==='sources:'){inSources=true;continue} if(inSources&&line.startsWith('- title:')){if(current&&current.title&&current.url&&current.retrieved_at)sources.push(current as PostSource);current={title:decode(line.slice(8).trim())};continue} if(inSources&&line.startsWith('url:')&&current){current.url=decode(line.slice(4).trim());continue} if(inSources&&line.startsWith('retrieved_at:')&&current){current.retrieved_at=decode(line.slice(13).trim());continue} if(!raw.startsWith(' ')){inSources=false;const colon=line.indexOf(':');if(colon>0)values[line.slice(0,colon)]=line.slice(colon+1).trim()} }
  if(current&&current.title&&current.url&&current.retrieved_at)sources.push(current as PostSource);
  const required=['schema_version','id','title','type','published_at','topics','related_ids','correction_of','model_identifier','prompt_version'];
  if(required.some((key)=>!(key in values))||values.schema_version!=='1'||sources.length===0)throw invalid();
  const body=normalized.slice(close+5).trim(); if(!body)throw invalid();
  return {metadata:{schema_version:1,id:decode(values.id),title:decode(values.title),type:decode(values.type),published_at:decode(values.published_at),topics:array(values.topics),sources,related_ids:array(values.related_ids),correction_of:values.correction_of==='null'?null:decode(values.correction_of),model_identifier:decode(values.model_identifier),prompt_version:decode(values.prompt_version)},body_markdown:body};
}
function decode(value:string):string { if(value.startsWith('"')){try{return JSON.parse(value)}catch{throw invalid()}} return value; }
function array(value:string):string[] { const trimmed=value.trim();if(!trimmed.startsWith('[')||!trimmed.endsWith(']'))throw invalid();return trimmed.slice(1,-1).split(',').map((item)=>decode(item.trim())).filter(Boolean); }
function invalid(){return new GatewayError(502,'bad_gateway','Canonical publication is malformed.',false)}
