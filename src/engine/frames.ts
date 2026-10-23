export type Shot={from:number;to:number;box:[number,number,number,number];cx:number};
export type Manifest={w:number;h:number;count:number;shots:Shot[]};
export class FrameLoader {
 manifest:Manifest|null=null;
 images=new Map<number,HTMLImageElement>();
 loaded=0;
 failed=0;
 listeners=new Set<()=>void>();
 mobile=innerWidth<820;
 private pending=new Set<number>();
 private loading=new Set<number>();
 async init(onProgress:(n:number,total:number)=>void){
  const r=await fetch('./frames/manifest.json');
  if(!r.ok) throw new Error(`Frame manifest request failed (${r.status})`);
  this.manifest=await r.json() as Manifest;
  const base=this.mobile?'sm':'lg';
  const ids=Array.from({length:this.manifest.count},(_,i)=>i);
  const boundary=new Set<number>();
  this.manifest.shots.forEach(s=>{boundary.add(s.from);boundary.add(s.to);});
  // Load key scene frames first, then progressively fill in the sequence with a small
  // concurrency limit so mobile browsers don't get flooded with 239 image requests.
  const ordered:number[]=[...boundary];
  const seen=new Set<number>(ordered);
  for(const stride of [8,4,2,1]) for(let i=0;i<ids.length;i+=stride) if(!seen.has(i)){seen.add(i);ordered.push(i);}
  let cursor=0;
  const worker=async()=>{
   while(cursor<ordered.length){
    const id=ordered[cursor++];
    await this.load(id,base,onProgress);
   }
  };
  await Promise.all(Array.from({length:Math.min(6,ordered.length)},()=>worker()));
 }
 private load(id:number,base:string,onProgress:(n:number,total:number)=>void){
  if(this.images.has(id)||this.loading.has(id)) return Promise.resolve();
  this.loading.add(id);
  return new Promise<void>(resolve=>{
   const im=new Image();
   im.decoding='async';
   im.src=`./frames/${base}/f${String(id).padStart(3,'0')}.webp`;
   const finish=()=>{this.loading.delete(id);this.loaded++;onProgress(this.loaded,this.manifest?.count||1);this.listeners.forEach(fn=>fn());resolve();};
   im.onload=async()=>{try{await im.decode();}catch{}this.images.set(id,im);finish();};
   im.onerror=()=>{this.failed++;finish();};
  });
 }
 nearest(frame:number,shot:Shot){
  const id=Math.round(frame);
  if(this.images.has(id))return id;
  for(let d=1;d<(this.manifest?.count||240);d++) for(const n of [id-d,id+d]) if(n>=Math.min(shot.from,shot.to)&&n<=Math.max(shot.from,shot.to)&&this.images.has(n))return n;
  return this.images.keys().next().value??0;
 }
 get(frame:number,shot:Shot){
  const lo=Math.min(shot.from,shot.to),hi=Math.max(shot.from,shot.to);
  const a=Math.max(lo,Math.min(hi,Math.floor(frame))),b=Math.max(lo,Math.min(hi,a+1));
  const first=this.images.get(a)||this.images.get(this.nearest(a,shot));
  const second=this.images.get(b)||this.images.get(this.nearest(b,shot));
  return {a:first,b:second,frac:Math.max(0,Math.min(1,frame-a))};
 }
 subscribe(fn:()=>void){this.listeners.add(fn);return()=>this.listeners.delete(fn);}
}
