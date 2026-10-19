import { useEffect, useState, type MouseEvent, type ReactNode } from 'react';

export function usePath(): string {
  const [path,setPath]=useState(window.location.pathname);
  useEffect(()=>{const update=()=>setPath(window.location.pathname);window.addEventListener('popstate',update);return()=>window.removeEventListener('popstate',update)},[]);
  return path;
}

export function navigate(path:string): void {
  window.history.pushState(null,'',path);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({top:0,behavior:'instant'});
}

export function Link({href,children,className}:{href:string;children:ReactNode;className?:string}) {
  const click=(event:MouseEvent<HTMLAnchorElement>)=>{if(event.button===0&&!event.metaKey&&!event.ctrlKey&&!event.shiftKey&&!event.altKey){event.preventDefault();navigate(href)}};
  return <a href={href} className={className} onClick={click}>{children}</a>;
}
