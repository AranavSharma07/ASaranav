export type Shot={from:number;to:number;box:[number,number,number,number];cx:number};
export type Manifest={w:number;h:number;count:number;shots:Shot[]};
export class FrameLoader {
 manifest:Manifest|null=null; images=new Map<number,HTMLImageElement>(); loaded=0; listeners=new Set<()=>void>(); mobile=innerWidth<820;
 async init(onProgress:(n:number,total:number)=>void){
  const r=await fetch('./frames/manifest.json');
  this.manifest=await r.json() as Manifest;
  const base=this.mobile?'sm':'lg';
  const ids=Array.from({length:this.manifest.count},(_,i)=>i);
  const boundary=new Set<number>();
  this.manifest.shots.forEach(s=>{boundary.add(s.from);boundary.add(s.to)});
  // Prioritise each shot's first/last frame so every section has a valid pose
  // before the user can scroll into it. Load the remaining frames afterward.
  const priority=[...boundary].sort((a,b)=>a-b);
  const rest=ids.filter(id=>!boundary.has(id));
  await Promise.all(priority.map(id=>this.load(id,base,onProgress)));
  await Promise.all(rest.map(id=>this.load(id,base,onProgress)));
 }
 private load(id:number,base:string,onProgress:(n:number,total:number)=>void){return new Promise<void>(resolve=>{
  const im=new Image();
  im.src=`./frames/${base}/f${String(id).padStart(3,'0')}.webp`;
  const settle=()=>{this.loaded++;onProgress(this.loaded,this.manifest?.count||1);this.listeners.forEach(fn=>fn());resolve()};
  im.onload=async()=>{try{await im.decode()}catch{}this.images.set(id,im);settle()};
  im.onerror=()=>settle();
 });}
 get(frame:number,shot:Shot){
  const lo=Math.min(shot.from,shot.to),hi=Math.max(shot.from,shot.to);
  const target=Math.max(lo,Math.min(hi,Math.round(frame)));
  // Never substitute a different pose for a missing frame. Stage retains the
  // last valid frame from this shot until the exact requested frame is ready.
  const image=this.images.get(target);
  return {a:image,b:image,frac:0};
 }
 subscribe(fn:()=>void){this.listeners.add(fn);return()=>this.listeners.delete(fn)}
}
