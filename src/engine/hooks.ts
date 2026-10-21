import {useEffect,useRef} from 'react'; import type {Director,SceneState} from './director';
export function useDirector(d:Director|null,fn:(s:SceneState[],y:number)=>void){const ref=useRef(fn);ref.current=fn;useEffect(()=>d?.subscribe((s,y)=>ref.current(s,y)),[d]);}
