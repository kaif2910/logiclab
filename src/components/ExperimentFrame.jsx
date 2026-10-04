import React,{useState,useId} from 'react';
import {CircuitBoard,Table2,BookOpen,ZoomIn,ZoomOut,Grid2X2} from 'lucide-react';
import {LiveBadge,ResetButton} from './UI';

function tabKey(event,items,current,select){
  if(!['ArrowRight','ArrowLeft','Home','End'].includes(event.key))return;
  event.preventDefault();const position=items.findIndex(item=>item[0]===current);
  const next=event.key==='Home'?0:event.key==='End'?items.length-1:(position+(event.key==='ArrowRight'?1:-1)+items.length)%items.length;
  select(items[next][0]);event.currentTarget.parentElement.querySelectorAll('[role="tab"]')[next]?.focus();
}
// The signal dock never moves when the mobile reference tab changes.
export default function ExperimentFrame({title,category,description,inputs,outputs,inputCount=2,diagram,table,explanation,calculation,onReset,onLibrary,libraryLabel='All experiments',canZoom=false}){
  const [view,setView]=useState('circuit');
  const [reference,setReference]=useState('table');
  const [zoom,setZoom]=useState(false);
  const id=useId();
  const tabs=[['circuit','Circuit',CircuitBoard],['table','Truth table',Table2],['explanation','Explanation',BookOpen]];
  function choose(next){setView(next);if(next!=='circuit')setReference(next);}
  return <section className="experiment-page">
    <header className="experiment-heading">
      <div><span className="eyebrow">{category}</span><h1>{title}</h1><p>{description}</p></div>
      <div className="experiment-actions"><button className="button subtle small library-button" onClick={onLibrary}><Grid2X2 size={15}/>{libraryLabel}</button><ResetButton onClick={onReset}/></div>
    </header>
    <section className={`panel signal-dock ${inputCount>3?'many-inputs':''}`} aria-label="Live input and output controls">
      <div className="dock-inputs"><span className="dock-label">INPUTS <small>Tap 0 or 1</small></span><div className="signal-inputs">{inputs}</div></div>
      <div className="dock-outputs"><span className="dock-label">OUTPUT</span><div className="signal-outputs" aria-live="polite">{outputs}</div></div>
    </section>
    <div className="mobile-experiment-tabs" role="tablist" aria-label="Experiment view">{tabs.map(([key,label,Icon])=><button key={key} id={`${id}-${key}`} aria-controls={`${id}-panel-${key==='circuit'?'circuit':'reference'}`} role="tab" tabIndex={view===key?0:-1} aria-selected={view===key} onKeyDown={e=>tabKey(e,tabs,view,choose)} onClick={()=>choose(key)}><Icon size={15}/>{label}</button>)}</div>
    <div className="experiment-body" data-view={view}>
      <section className={`panel diagram-pane ${zoom?'diagram-enlarged':''}`} id={`${id}-panel-circuit`} aria-label="Circuit diagram">
        <div className="stage-heading"><span><CircuitBoard size={15}/>Signal flow</span><div><LiveBadge/>{canZoom&&<button className="icon-button" aria-label={zoom?'Fit diagram to panel':'Enlarge diagram'} aria-pressed={zoom} onClick={()=>setZoom(!zoom)}>{zoom?<ZoomOut size={17}/>:<ZoomIn size={17}/>}</button>}</div></div>
        <div className="diagram-viewport">{diagram}</div>
        <div className="live-calculation" aria-live="polite">{calculation}</div>
      </section>
      <section className="panel reference-pane" id={`${id}-panel-reference`} aria-label={reference==='table'?'Truth table':'Explanation'}>
        <div className="desktop-reference-tabs" role="tablist" aria-label="Reference view">{tabs.slice(1).map(([key,label,Icon])=><button key={key} role="tab" tabIndex={reference===key?0:-1} aria-selected={reference===key} onKeyDown={e=>tabKey(e,tabs.slice(1),reference,choose)} onClick={()=>choose(key)}><Icon size={15}/>{label}</button>)}</div>
        <div className="reference-content" key={`${reference}-${view==="circuit"?"hidden":"visible"}`}>{reference==='table'?table:explanation}</div>
      </section>
    </div>
  </section>;
}

