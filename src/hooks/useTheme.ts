import { useEffect,useLayoutEffect,useState } from 'react';

export function useTheme(){
  const [dark,setDark]=useState(()=>localStorage.getItem('tmw-theme')==='dark');
  useLayoutEffect(()=>{document.documentElement.classList.toggle('dark',dark)},[dark]);
  useEffect(()=>{localStorage.setItem('tmw-theme',dark?'dark':'light')},[dark]);
  return {dark,toggle:()=>setDark((value)=>!value)};
}
