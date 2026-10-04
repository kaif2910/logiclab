import React from 'react';
import {TrafficCone,Building2,Shield,Droplets,LockKeyhole,Unlock} from 'lucide-react';
import {applications,evaluateApplication,combinations} from '../engine';
import {BinarySwitch,LED,TruthTable} from '../components/UI';
import ExperimentFrame from '../components/ExperimentFrame';
import ExperimentCatalog from '../components/ExperimentCatalog';
const icons={traffic:TrafficCone,elevator:Building2,security:Shield,water:Droplets,lock:LockKeyhole};
export default function Applications({id,values,onValues,navigate}){
  if(!id)return <ExperimentCatalog title="Logic in everyday life" description="Choose a practical example to open its interactive experiment." category="APPLICATIONS" items={applications} onChoose={key=>navigate(`applications/${key}`)}/>;
  const a=applications[id],outputs=evaluateApplication(id,values),Icon=icons[id];
  const visual=<div className="application-visual">{id==='traffic'?<div className="traffic-lights">{outputs.map((v,i)=><div key={i} className={`traffic-light light-${i} ${v?'on':''}`}><span/>{a.outputs[i]} · {v?'ON / 1':'OFF / 0'}</div>)}</div>:id==='lock'?<div className={`lock-display ${outputs[0]?'granted':''}`}>{outputs[0]?<Unlock size={55}/>:<LockKeyhole size={55}/>}<code>{values.join(' ')}</code><strong>{outputs[0]?'ACCESS GRANTED':'ACCESS DENIED'}</strong><small>Target key: 1 0 1 1</small></div>:<div className="application-state"><Icon size={56} strokeWidth={1.2}/><strong>{id==='water'?outputs[0]?'PUMP RUNNING':'PUMP STOPPED':id==='elevator'?outputs[0]?'MOTOR ENABLED':'MOTOR DISABLED':outputs[0]?'ALARM ACTIVE':'ALARM INACTIVE'}</strong><span>{id==='water'&&values[0]&&values[1]?'Conflicting readings. Full-level signal overrides the pump.':a.description}</span></div>}</div>;
  return <ExperimentFrame title={a.name} category="APPLICATIONS / INTERACTIVE MODEL" description={a.description} inputCount={a.inputs.length}
    onReset={()=>onValues(values.map(()=>0))} onLibrary={()=>navigate('applications')} libraryLabel="All applications"
    inputs={values.map((v,i)=><BinarySwitch compact key={i} label={a.inputs[i]} value={v} onChange={val=>onValues(values.map((x,j)=>j===i?val:x))}/>)}
    outputs={outputs.map((v,i)=><LED key={i} value={v} label={a.outputs[i]}/>)} diagram={visual}
    calculation={<code>{outputs.map((v,i)=>`${a.outputs[i]} = ${v}`).join(' · ')}</code>}
    table={<><div className="reference-intro"><h2>Live truth table</h2><p>{a.symbols.map((s,i)=>`${s}: ${a.inputs[i]}`).join(' · ')}</p></div><TruthTable inputs={a.symbols} outputs={a.outputs} current={values} rows={combinations(a.inputs.length).map(v=>[...v,...evaluateApplication(id,v)])}/></>}
    explanation={<div className="experiment-explanation"><h2>The logic behind it</h2>{a.equations.map(eq=><code key={eq}>{eq}</code>)}<div className="token-row">{a.symbols.map((symbol,i)=><span className="value-token" key={symbol}>{symbol} = {values[i]}</span>)}</div><h3>About this model</h3><p>{a.note}</p></div>}
  />;
}
