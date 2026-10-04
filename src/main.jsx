import React,{useState,useEffect,useRef} from 'react';
import {createRoot} from 'react-dom/client';
import {flushSync} from 'react-dom';
import {MotionConfig,motion} from 'framer-motion';
import {Home as HomeIcon,BookOpen,Layers,Box,Lightbulb,GraduationCap,Menu,X,HelpCircle,ChevronRight,ChevronDown,Cpu,Sun,Moon} from 'lucide-react';
import Home from './pages/Home';
import {GateLibrary,GateSimulator} from './pages/Gates';
import Circuits from './pages/Circuits';
import Playground from './pages/Playground';
import Applications from './pages/Applications';
import Learn from './pages/Learn';
import {gates,circuits,applications,evaluateGate,sampleNetwork} from './engine';
import {parseRoute,routeLabel} from './navigation';
import './styles.css';
import './workbench.css';
import './themes.css';
const navigation=[['home','Home',HomeIcon],['gates','Logic Gates',BookOpen],['circuits','Combinational Circuits',Layers],['playground','Circuit Playground',Box],['applications','Applications',Lightbulb],['learn','Learn',GraduationCap]];
const catalogs={gates,circuits,applications};
function initialTheme(){try{return localStorage.getItem('logiclab-theme')==='dark'?'dark':'light'}catch{return 'light'}}
function App(){
  const [route,setRoute]=useState(()=>parseRoute(location.hash));
  const [mobile,setMobile]=useState(false),[theme,setTheme]=useState(initialTheme);
  const [openGroup,setOpenGroup]=useState(()=>parseRoute(location.hash).section);
  const [gateValues,setGateValues]=useState({AND:[1,0]}),[circuitValues,setCircuitValues]=useState({}),[appValues,setAppValues]=useState({});
  const [nodes,setNodes]=useState(sampleNetwork);
  const mainRef=useRef(null),sidebarRef=useRef(null),menuRef=useRef(null);
  const simulator=Boolean(route.id)||route.section==='playground';
  function navigate(path){const next=parseRoute(path);setRoute(next);setOpenGroup(next.section);setMobile(false);if(location.hash!==`#${next.key}`)location.hash=next.key;window.scrollTo({top:0,behavior:'instant'});}
  function closeMenu(){setMobile(false);menuRef.current?.focus();}
  useEffect(()=>{
    const changed=()=>{if(location.hash==='#main-content')return;const next=parseRoute(location.hash);setRoute(next);setOpenGroup(next.section);setMobile(false);window.scrollTo({top:0,behavior:'instant'});};
    window.addEventListener('hashchange',changed);return()=>window.removeEventListener('hashchange',changed);
  },[]);
  useEffect(()=>{mainRef.current?.focus({preventScroll:true});},[route.key]);
  useEffect(()=>{
    const drawer=window.matchMedia('(max-width:1040px)');
    const resized=()=>{if(!drawer.matches)setMobile(false);};
    drawer.addEventListener('change',resized);
    return()=>drawer.removeEventListener('change',resized);
  },[]);
  useEffect(()=>{document.documentElement.dataset.theme=theme;document.querySelector('meta[name="theme-color"]')?.setAttribute('content',theme==='dark'?'#111b29':'#f4f6f8');try{localStorage.setItem('logiclab-theme',theme)}catch{}},[theme]);
  useEffect(()=>{
    if(!mobile)return;
    const previous=document.body.style.overflow;document.body.style.overflow='hidden';
    sidebarRef.current?.querySelector('.mobile-nav-close')?.focus();
    const keydown=e=>{if(e.key==='Escape'){e.preventDefault();closeMenu();}if(e.key==='Tab'){const focusable=[...sidebarRef.current.querySelectorAll('button,a')].filter(el=>el.getClientRects().length);const first=focusable[0],last=focusable.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}}};
    document.addEventListener('keydown',keydown);return()=>{document.body.style.overflow=previous;document.removeEventListener('keydown',keydown);};
  },[mobile]);
  useEffect(()=>{
    const context=document.modelContext;if(!context?.registerTool)return;const lifecycle=new AbortController();
    const tool={name:'simulate_logic_gate',title:'Simulate a logic gate',description:'Open the gate’s dedicated workbench and set its binary inputs.',inputSchema:{type:'object',properties:{gate:{type:'string',enum:Object.keys(gates)},inputs:{type:'array',items:{type:'integer',enum:[0,1]},minItems:1,maxItems:2}},required:['gate','inputs'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute(input){if(!input||typeof input!=='object'||Object.keys(input).some(k=>!['gate','inputs'].includes(k))||!Array.isArray(input.inputs))throw Error('Supply a gate and binary inputs.');const output=evaluateGate(input.gate,input.inputs);flushSync(()=>{setGateValues(old=>({...old,[input.gate]:[...input.inputs,...(input.inputs.length===1?[0]:[])]}));navigate(`gates/${input.gate}`);});return{gate:input.gate,inputs:input.inputs,output,state:output?'HIGH':'LOW'};}};
    try{Promise.resolve(context.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});}catch{}return()=>lifecycle.abort();
  },[]);
  let content;
  if(route.section==='gates')content=route.id?<GateSimulator key={route.key} type={route.id} values={gateValues[route.id]||[0,0]} onValues={v=>setGateValues(old=>({...old,[route.id]:v}))} navigate={navigate}/>:<GateLibrary simulate={name=>navigate(`gates/${name}`)}/>;
  else if(route.section==='circuits')content=<Circuits key={route.key} id={route.id} values={route.id?(circuitValues[route.id]||circuits[route.id].inputs.map(()=>0)):[]} onValues={v=>setCircuitValues(old=>({...old,[route.id]:v}))} navigate={navigate}/>;
  else if(route.section==='applications')content=<Applications key={route.key} id={route.id} values={route.id?(appValues[route.id]||applications[route.id].inputs.map(()=>0)):[]} onValues={v=>setAppValues(old=>({...old,[route.id]:v}))} navigate={navigate}/>;
  else if(route.section==='playground')content=<Playground nodes={nodes} onNodes={setNodes}/>;
  else if(route.section==='learn')content=<Learn navigate={navigate}/>;
  else content=<Home navigate={navigate}/>;
  return <MotionConfig reducedMotion="user"><a href="#main-content" className="skip-link">Skip to content</a>
    <aside ref={sidebarRef} className={`sidebar ${mobile?'open':''}`} role={mobile?'dialog':undefined} aria-modal={mobile?true:undefined} aria-label="Learning navigation">
      <div className="sidebar-brand-row"><button className="brand" onClick={()=>navigate('home')}><span className="brand-mark"><Cpu size={25}/></span><span>Logic<span>Lab</span><small>LEARN · BUILD · SIMULATE</small></span></button><button className="mobile-nav-close icon-button" aria-label="Close navigation" onClick={closeMenu}><X size={20}/></button></div>
      <div className="nav-section-label">YOUR LEARNING SPACE</div>
      <nav aria-label="Main navigation">{navigation.map(([section,label,Icon])=><div className="nav-group" key={section}>
        <div className={`nav-group-heading ${route.section===section?'is-current':''}`}><button className={`nav-item ${route.section===section?'active':''}`} aria-current={route.section===section&&!route.id?'page':undefined} onClick={()=>navigate(section)}><Icon size={19}/><span>{label}</span></button>{catalogs[section]&&<button className="nav-expand" aria-label={`${openGroup===section?'Collapse':'Expand'} ${label}`} aria-expanded={openGroup===section} onClick={()=>setOpenGroup(openGroup===section?null:section)}><ChevronDown size={16}/></button>}</div>
        {catalogs[section]&&openGroup===section&&<div className="nav-subitems">{Object.entries(catalogs[section]).map(([id,item])=><a key={id} href={`#${section}/${id}`} aria-current={route.section===section&&route.id===id?'page':undefined} onClick={e=>{if(e.ctrlKey||e.metaKey||e.shiftKey)return;e.preventDefault();navigate(`${section}/${id}`)}}>{section==='gates'?`${id} Gate`:item.name}</a>)}</div>}
      </div>)}</nav>
      <div className="sidebar-bottom"><button className="about-link" onClick={()=>{navigate('learn');setTimeout(()=>document.getElementById('about')?.scrollIntoView({behavior:'instant'}),80)}}><HelpCircle size={17}/>About LogicLab<span>v1.1</span></button></div>
    </aside>
    {mobile&&<button className="sidebar-scrim" aria-label="Dismiss navigation" onClick={closeMenu}/>}
    <div className="app-shell" inert={mobile?true:undefined}>
      <header className="topbar"><div><button ref={menuRef} className="mobile-menu" aria-label="Open navigation" aria-expanded={mobile} onClick={()=>setMobile(true)}><Menu size={21}/></button><span className="breadcrumb"><span>{route.id?navigation.find(n=>n[0]===route.section)?.[1]:'Learning lab'}</span><ChevronRight size={13}/><strong>{routeLabel(route)}</strong></span></div><span className="browser-status"><span/>Your digital logic classroom</span><button className="theme-toggle" aria-label={`Switch to ${theme==='light'?'dark':'light'} mode`} title={`Switch to ${theme==='light'?'dark':'light'} mode`} onClick={()=>setTheme(theme==='light'?'dark':'light')}>{theme==='light'?<Moon size={18}/>:<Sun size={18}/>}<span>{theme==='light'?'Dark':'Light'}</span></button></header>
      <main ref={mainRef} id="main-content" tabIndex={-1} className={simulator?'workbench-main':''}><motion.div className={simulator?'workbench-motion':''} key={route.key} initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.15}}>{content}</motion.div></main>
      {!simulator&&<footer className="footer"><span>LogicLab <span className="muted">/ Learn through experimentation</span></span><span>LEARN · BUILD · SIMULATE</span></footer>}
    </div>
  </MotionConfig>;
}
createRoot(document.getElementById('root')).render(<App/>);
