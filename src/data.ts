export const profile = {
  firstName: 'Aranav', fullName: 'Aranav Sharma', role: 'Marketing & Digital Growth',
  tagline: ['I build brands people', 'notice, remember,', 'and choose.'],
  intro: 'Marketing-minded, detail-driven, and always learning. I connect content, search, and clear execution to help brands grow.',
  manifesto: 'Good marketing is not noise. It is a clear story, delivered with consistency, shaped by insight, and measured by the people it reaches.',
  stats: [{value: '03', label: 'Marketing roles', note: 'Hands-on experience'}, {value:'06',label:'Core disciplines',note:'Strategy to reporting'}, {value:'01',label:'Growth mindset',note:'Always in progress'}],
  projects: [
    {number:'01',category:'BRAND / SOCIAL',name:'EliteFinish',description:'A consistent social presence for a painting-services brand.',chips:['Content calendars','Brand promotion','Campaign planning','Team coordination'],type:'gauge',url:'#contact'},
    {number:'02',category:'SEO / OPTIMISATION',name:'Website audit',description:'A focused review of metadata, keywords, and indexability signals.',chips:['SEO audit','Keyword research','Metadata review','Action reporting'],type:'heatmap',url:'#contact'},
    {number:'03',category:'CONTENT / GROWTH',name:'RICOZ',description:'Digital promotion and content execution built around brand communication.',chips:['Social media','Creative campaigns','Content planning','Progress updates'],type:'chat',url:'#contact'}
  ],
  journey: [
    {year:'NOW',title:'Marketing Head',org:'EliteFinish · Social strategy, SEO reviews, campaign planning and team coordination'},
    {year:'RECENT',title:'Digital Marketing Intern',org:'RICOZ · Digital promotion, content planning and marketing execution'},
    {year:'FOUNDATION',title:'Digital Marketing Internship',org:'IT Hub Solution · Kankarbagh, Patna · SEO, ads, analytics and reporting'}
  ],
  skills:['Social Media Marketing','Content Strategy','SEO','Keyword Research','Brand Promotion','Campaign Planning','Marketing Reporting','Team Coordination','Website Optimisation','Audience Research','Analytics','Online Advertising','Creative Direction','Content Calendars','MS Word','Basic Excel'],
  coding:[{value:'SEO',suffix:'+',label:'Search focus'},{value:'SOCIAL',suffix:'★',label:'Community'},{value:'CONTENT',suffix:'+',label:'Creative output'},{value:'GROWTH',suffix:'★',label:'Growth mindset'}],
  certifications:[{title:'SEO & Keyword Research',issuer:'IT Hub Solution · Internship exposure'},{title:'Social Media Marketing',issuer:'IT Hub Solution · Internship exposure'},{title:'Online Advertising',issuer:'IT Hub Solution · Internship exposure'},{title:'Audience Research',issuer:'IT Hub Solution · Internship exposure'},{title:'Analytics & Reporting',issuer:'IT Hub Solution · Internship exposure'},{title:'Website Optimisation',issuer:'IT Hub Solution · Internship exposure'}],
  email:'asarnavsharma04@gmail.com', github:'https://github.com/AranavSharma07', linkedin:'https://www.linkedin.com/in/aranav-sharma-161880443?utm_source=share_via&utm_content=profile&utm_medium=member_android', resume:'./resume.pdf',
  education:'B.Sc. Physics · Currently pursuing', college:'Daudnagar College, Daudnagar · Magadh University'
};
export type SceneId='hero'|'about'|'work'|'journey'|'skills'|'awards'|'contact';
export const scenes:{id:SceneId;label:string;from:number;to:number;x:number;k:number;height:number}[]=[
{id:'hero',label:'Hello',from:0,to:71,x:.70,k:1,height:230},{id:'about',label:'About',from:72,to:119,x:.27,k:1,height:280},{id:'work',label:'Work',from:120,to:191,x:.77,k:.86,height:460},{id:'journey',label:'Journey',from:192,to:220,x:.26,k:1,height:240},{id:'skills',label:'Toolkit',from:221,to:232,x:.50,k:.98,height:280},{id:'awards',label:'Awards',from:233,to:238,x:.75,k:1,height:320},{id:'contact',label:'Contact',from:238,to:238,x:.50,k:1,height:240}];
