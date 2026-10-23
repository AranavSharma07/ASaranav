import React,{useEffect,useRef} from 'react';
import {FrameLoader,type Shot} from '../engine/frames';
import {scenes} from '../data';
import type {SceneState} from '../engine/director';

export function Stage({loader,statesRef}:{loader:FrameLoader;statesRef:React.MutableRefObject<SceneState[]>}){
 const ref=useRef<HTMLCanvasElement>(null);const mouse=useRef({x:0,y:0,tx:0,ty:0});
 useEffect(()=>{const canvas=ref.current;if(!canvas)return;const ctx=canvas.getContext('2d');if(!ctx)return;let key='';let raf=0;
  const resize=()=>{const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(innerWidth*dpr);canvas.height=Math.round(innerHeight*dpr);canvas.style.width='100vw';canvas.style.height='100vh';key=''};
  const move=(e:MouseEvent)=>{mouse.current.tx=(e.clientX/innerWidth-.5)*28;mouse.current.ty=(e.clientY/innerHeight-.5)*16};
  window.addEventListener('resize',resize);window.addEventListener('mousemove',move);const unsubscribe=loader.subscribe(()=>{key=''});resize();
  const shotFor=(frame:number):Shot|undefined=>loader.manifest?.shots.find(s=>frame>=Math.min(s.from,s.to)&&frame<=Math.max(s.from,s.to));
  const drawShot=(sceneIndex:number,frame:number,shift=0,opacity=1,clip:'left'|'right'|undefined=undefined,transitionT=1)=>{
   const scene=scenes[sceneIndex],shot=shotFor(frame);if(!shot||!loader.manifest)return;
   const mobile=innerWidth<820,vw=innerWidth,vh=innerHeight,dpr=Math.min(devicePixelRatio||1,2);
   const scale=mobile?Math.min(vh*.74/900,vw*1.05/Math.max(1,shot.box[2])):vh*scene.k/900;
   const offY=vh-900*scale,x=mobile ? 0.5 : scene.x,offX=x*vw-shot.cx*1600*scale+mouse.current.x+shift;
   const {a,b,frac}=loader.get(frame,shot);
   if(clip){const skew=.2*vh,e=-skew+(vw+2*skew)*Math.max(0,Math.min(1,transitionT));ctx.save();ctx.beginPath();if(clip==='right'){ctx.moveTo(e+skew,0);ctx.lineTo(e-skew,vh);ctx.lineTo(vw,vh);ctx.lineTo(vw,0)}else{ctx.moveTo(0,0);ctx.lineTo(e+skew,0);ctx.lineTo(e-skew,vh);ctx.lineTo(0,vh)}ctx.closePath();ctx.clip();}
   const paint=(im:HTMLImageElement|undefined,opacity=1)=>{if(!im)return;ctx.globalAlpha=opacity;ctx.drawImage(im,offX+shot.box[0]*scale,offY+shot.box[1]*scale,shot.box[2]*scale,shot.box[3]*scale)};
   paint(a,opacity);if(b&&b!==a)paint(b,opacity*frac);ctx.globalAlpha=1;if(clip)ctx.restore();
  };
  const draw=()=>{const dpr=Math.min(devicePixelRatio||1,2),vw=innerWidth,vh=innerHeight;mouse.current.x+=(mouse.current.tx-mouse.current.x)*.06;mouse.current.y+=(mouse.current.ty-mouse.current.y)*.06;const states=statesRef.current;
   if(states.length){const y=window.scrollY,lead=.78*vh,span=.62*vh;let active=0;for(let i=0;i<states.length;i++)if(y>=states[i].top-lead)active=i;const cur=states[active];const frame=scenes[active].from+(scenes[active].to-scenes[active].from)*cur.p;
    const t=active>0?Math.max(0,Math.min(1,(y-(cur.top-lead))/span)):1;
    const nextFrame=cur.p===0?scenes[active].from:frame;
    const k=`${active}:${frame.toFixed(2)}:${t.toFixed(2)}:${loader.loaded}:${vw}:${vh}:${mouse.current.x.toFixed(0)}:${mouse.current.y.toFixed(0)}`;
    if(k!==key&&loader.manifest){key=k;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,vw,vh);
     if(active>0&&t<1){drawShot(active-1,scenes[active-1].to,60*t,1-.35*t,'right',t);drawShot(active,nextFrame,-60*(1-t),t,'left',t);const skew=.2*vh,e=-skew+(vw+2*skew)*t;ctx.save();ctx.globalAlpha=1;ctx.shadowColor=scenes[active].id==='contact'?'#fff':'#ff1f1f';ctx.shadowBlur=24;ctx.strokeStyle=scenes[active].id==='contact'?'#fff':'#ff1f1f';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(e+skew,0);ctx.lineTo(e-skew,vh);ctx.stroke();ctx.shadowBlur=0;const trail=ctx.createLinearGradient(e-45,0,e+45,0);trail.addColorStop(0,'rgba(255,31,31,0)');trail.addColorStop(.5,scenes[active].id==='contact'?'rgba(255,255,255,.45)':'rgba(255,31,31,.45)');trail.addColorStop(1,'rgba(255,31,31,0)');ctx.fillStyle=trail;ctx.fillRect(e-45,0,90,vh);ctx.restore();}
     else drawShot(active,frame);
    }
   }
   raf=requestAnimationFrame(draw);
  };draw();return()=>{cancelAnimationFrame(raf);unsubscribe();window.removeEventListener('resize',resize);window.removeEventListener('mousemove',move)};
 },[loader,statesRef]);return <canvas ref={ref} className="stage" aria-hidden="true"/>;
}
