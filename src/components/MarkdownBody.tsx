import type { ReactNode } from 'react';

export function MarkdownBody({ markdown }:{ markdown:string }) {
  const blocks=markdown.split(/\n{2,}/).map((block)=>block.trim()).filter(Boolean);
  return <div className="markdown-body">{blocks.map((block,index)=>renderBlock(block,index))}</div>;
}

function renderBlock(block:string,key:number):ReactNode {
  if(/^<[^>]+>/.test(block)||/\bon[a-z]+\s*=/i.test(block)||/(?:javascript|data|vbscript)\s*:/i.test(block)) return null;
  const heading=/^(#{1,3})\s+(.+)$/s.exec(block); if(heading) { const level=heading[1].length; const Tag=`h${level}` as 'h1'|'h2'|'h3'; return <Tag key={key}>{heading[2]}</Tag>; }
  const lines=block.split('\n');
  if(lines.every((line)=>/^[-*]\s+/.test(line))) return <ul key={key}>{lines.map((line,i)=><li key={i}>{inline(line.replace(/^[-*]\s+/,''))}</li>)}</ul>;
  return <p key={key}>{inline(block.replace(/\n/g,' '))}</p>;
}
function inline(value:string):ReactNode[] { const parts=[]; const regex=/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g; let last=0; let match; while((match=regex.exec(value))){if(match.index>last)parts.push(value.slice(last,match.index));parts.push(<a key={match.index} href={match[2]} target="_blank" rel="noopener noreferrer">{match[1]}</a>);last=match.index+match[0].length;}if(last<value.length)parts.push(value.slice(last));return parts; }
