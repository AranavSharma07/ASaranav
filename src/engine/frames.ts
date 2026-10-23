export type Shot={from:number;to:number;box:[number,number,number,number];cx:number};
export type Manifest={w:number;h:number;count:number;shots:Shot[]};

/** Progressive frame loader: the opening/closing frames load first, then the
 * remaining sequence. Missing small-screen frames fall back to desktop assets. */
export class FrameLoader {
 manifest:Manifest|null=null; images=new Map<number,HTMLImageElement>(); loaded=0; attempted=0; listeners=new Set<()=>void>(); mobile=typeof window!=='undefined'&&window.innerWidth<820; failed=0;
 async init(onProgress:(n:number,total:number)=>void){
  const r=await fetch(`${import.meta.env.BASE_URL}frames/manifest.json`);
  if(!r.ok) throw new Error(`Frame manifest failed (${r.status})`);
  this.manifest=await r.json() as Manifest;
  const ids=Array.from({length:this.manifest.count},(_,i)=>i);
  const boundaries=new Set<number>(); this.manifest.shots.forEach(s=>{boundaries.add(s.from);boundaries.add(s.to)});
  const ordered=[...boundaries];const seen=new Set(ordered);
  // Keep the first frame and scene boundaries available as early as possible.
  for(const stride of [16,8,4,2,1]) for(let i=0;i<ids.length;i+=stride) if(!seen.has(i)){seen.add(i);ordered.push(i)}
  let cursor=0; const workers=Array.from({length:Math.min(8,ordered.length)},async()=>{while(cursor<ordered.length){const id=ordered[cursor++];await this.load(id,onProgress)}});
  await Promise.all(workers);
 }
 private load(id:number,onProgress:(n:number,total:number)=>void){
  return new Promise<void>(resolve=>{
   const trySource=(base:'sm'|'lg')=>{const im=new Image();im.decoding='async';im.src=`${import.meta.env.BASE_URL}frames/${base}/f${String(id).padStart(3,'0')}.webp`;
    im.onload=async()=>{try{if('decode'in im) await im.decode()}catch{}this.images.set(id,im);this.loaded++;this.attempted++;onProgress(this.loaded,this.manifest?.count||1);this.listeners.forEach(fn=>fn());resolve()};
    im.onerror=()=>{if(base==='sm')trySource('lg');else{this.failed++;this.attempted++;onProgress(this.loaded,this.manifest?.count||1);this.listeners.forEach(fn=>fn());resolve()}};
   };trySource(this.mobile?'sm':'lg');
  });
 }
 nearest(frame:number,shot:Shot){const id=Math.round(frame);if(this.images.has(id))return id;for(let d=1;d<(this.manifest?.count||240);d++){for(const n of [id-d,id+d])if(n>=Math.min(shot.from,shot.to)&&n<=Math.max(shot.from,shot.to)&&this.images.has(n))return n;}return this.images.keys().next().value??0;}
 get(frame:number,shot:Shot){const lo=Math.min(shot.from,shot.to),hi=Math.max(shot.from,shot.to),a=Math.max(lo,Math.min(hi,Math.floor(frame))),b=Math.max(lo,Math.min(hi,a+1));const nearestA=this.images.get(a)||this.images.get(this.nearest(a,shot));const nearestB=this.images.get(b)||this.images.get(this.nearest(b,shot));return {a:nearestA,b:nearestB,frac:Math.max(0,Math.min(1,frame-a))};}
 subscribe(fn:()=>void){this.listeners.add(fn);return()=>this.listeners.delete(fn)}
}
