import React from 'react';
import {Play} from 'lucide-react';
import ExperimentFrame from '../components/ExperimentFrame';
import {gates,evaluateGate,combinations} from '../engine';
import {BinarySwitch,LED,TruthTable,GateSymbol,GateDiagram,PageHeading,PanelTitle,LiveBadge,ResetButton} from '../components/UI';
export function GateLibrary({simulate}){return <><PageHeading eyebrow="01 / THE BUILDING BLOCKS" title="Seven gates. Endless possibilities." description="Meet the fundamental components behind every digital circuit."/><div className="gate-library">{Object.values(gates).map((g,i)=><article className="panel gate-card" key={g.name}><div className="gate-card-top"><span className="index-tag">0{i+1} / {g.inputs} INPUT{g.inputs>1?'S':''}</span><GateSymbol type={g.name}/></div><h2>{g.name} Gate</h2><p>{g.description}</p><code className="equation">Y = {g.expression}</code><p className="gate-rule">{g.rule}</p><TruthTable compact inputs={g.inputs===1?['A']:['A','B']} outputs={['Y']} rows={combinations(g.inputs).map(v=>[...v,evaluateGate(g.name,v)])}/><button className="button secondary full-width" onClick={()=>simulate(g.name)}><Play size={15}/>Simulate {g.name}</button></article>)}</div><section className="panel comparison"><PanelTitle eyebrow="QUICK REFERENCE" title="Gate comparison"/><div className="table-overflow"><table className="comparison-table"><thead><tr>{['Gate','Symbol','Boolean expression','Meaning','Output condition'].map(x=><th key={x}>{x}</th>)}</tr></thead><tbody>{Object.values(gates).map(g=><tr key={g.name}><td>{g.name}</td><td><GateSymbol type={g.name}/></td><td><code>Y = {g.expression}</code></td><td>{g.description}</td><td>{g.rule}</td></tr>)}</tbody></table></div></section></>}
export function GateSimulator({type,values:all,onValues,navigate}){
  const g=gates[type],values=all.slice(0,g.inputs),output=evaluateGate(type,values);
  const setValues=v=>onValues([...v,...(v.length===1?[all[1]??0]:[])]);
  const numeric=g.expression.replaceAll('A',String(values[0])).replaceAll('B',String(values[1]));
  return <ExperimentFrame title={`${type} Gate`} category="LOGIC GATES / INTERACTIVE EXPERIMENT" description={g.rule} inputCount={g.inputs}
    onReset={()=>setValues(values.map(()=>0))} onLibrary={()=>navigate('gates')} libraryLabel="Gate library"
    inputs={values.map((v,i)=><BinarySwitch compact key={i} label={`Input ${i?'B':'A'}`} value={v} onChange={val=>setValues(values.map((old,j)=>j===i?val:old))}/>)}
    outputs={<LED value={output} label="Y"/>}
    diagram={<GateDiagram type={type} values={values} output={output}/>}
    calculation={<><code>Y = {numeric} = <strong>{output}</strong></code><span>{output?'HIGH · LED ON':'LOW · LED OFF'}</span></>}
    table={<><div className="reference-intro"><h2>Live truth table</h2><p>The highlighted row matches your inputs.</p></div><TruthTable inputs={g.inputs===1?['A']:['A','B']} outputs={['Y']} rows={combinations(g.inputs).map(v=>[...v,evaluateGate(type,v)])} current={values}/></>}
    explanation={<div className="experiment-explanation"><h2>How {type} works</h2><p>{g.rule}</p><span className="eyebrow">BOOLEAN EXPRESSION</span><code>Y = {g.expression}</code><span className="eyebrow">CURRENT CALCULATION</span><code>Y = {numeric} = {output}</code><p>{g.inputs===1?'Toggle A. The output always takes the opposite value.':'Try each input combination and compare the output with the truth table.'}</p></div>}
  />;
}
