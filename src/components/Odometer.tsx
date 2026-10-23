import React from 'react';
export function Odometer({value,label,note}:{value:string;label:string;note:string}){return <div className="stat-card"><div className="odo">{value.split('').map((c,i)=><span key={i}>{c}</span>)}</div><p className="stat-label">{label}</p><small>{note}</small></div>}
