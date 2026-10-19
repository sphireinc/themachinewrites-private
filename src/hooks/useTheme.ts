import { useEffect,useState } from 'react';

export function useTheme(){
  const [dark,setDark]=useState(()=>{const saved=localStorage.getItem('tmw-theme');if(saved==='dark')return true;if(saved==='light')return false;return window.matchMedia?.('(prefers-color-scheme: dark)').matches??false;});
  useEffect(()=>{localStorage.setItem('tmw-theme',dark?'dark':'light')},[dark]);
  return {dark,toggle:()=>setDark((value)=>!value)};
}
