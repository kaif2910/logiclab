import React from 'react';
import {circuits,combinations,evaluateCircuit} from '../engine';
import {NetworkDiagram,RoutingDiagram} from '../components/Networks';
import {BinarySwitch,LED,TruthTable} from '../components/UI';
import ExperimentFrame from '../components/ExperimentFrame';
import ExperimentCatalog from '../components/ExperimentCatalog';
export default function Circuits({id,values,onValues,navigate}){
  if(!id)return <ExperimentCatalog title="Combinational Circuits" description="Choose an experiment. Each circuit opens in its own workbench." category="COMBINATIONAL CIRCUITS" items={circuits} onChoose={key=>navigate(`circuits/${key}`)}/>;
  const c=circuits[id],result=evaluateCircuit(id,values),rows=combinations(c.inputs.length).map(v=>[...v,...evaluateCircuit(id,v).outputs]);
  const nodes=c.gates?[...c.inputs.map(name=>({id:name,name,type:'INPUT',pins:[]})),...c.gates.map(([key,type,...pins])=>({id:key,type,pins})),...c.outputs.map((name,i)=>({id:`out${i}`,name,type:'LED',pins:[c.out[i]]}))]:[];
  const signals={...result.signals,...Object.fromEntries(result.outputs.map((v,i)=>[`out${i}`,v]))};
  return <ExperimentFrame title={c.name} category={`COMBINATIONAL CIRCUITS / ${c.category.toUpperCase()}`} description={c.description} inputCount={c.inputs.length} canZoom
    onReset={()=>onValues(values.map(()=>0))} onLibrary={()=>navigate('circuits')} libraryLabel="All circuits"
    inputs={values.map((v,i)=><BinarySwitch compact key={c.inputs[i]} label={c.inputs[i]} value={v} onChange={val=>onValues(values.map((x,j)=>j===i?val:x))}/>)}
    outputs={result.outputs.map((v,i)=><LED key={i} value={v} label={c.outputs[i]}/>)}
    diagram={c.gates?<NetworkDiagram nodes={nodes} signals={signals}/>:<RoutingDiagram id={id} circuit={c} result={result} values={values}/>}
    calculation={<>{result.selected!==null&&<span>Selected {id==='mux'?'input':'output'}: {result.selected}</span>}<code>{c.outputs.map((name,i)=>`${name} = ${result.outputs[i]}`).join(' · ')}</code></>}
    table={<><div className="reference-intro"><h2>Live truth table</h2><p>{rows.length} combinations · highlighted row = current inputs</p></div><TruthTable inputs={c.inputs} outputs={c.outputs} rows={rows} current={values}/></>}
    explanation={<div className="experiment-explanation"><h2>How it works</h2><p>{c.description}</p>{c.equations.map(eq=><code key={eq}>{eq}</code>)}{!c.gates&&<p>{id==='decoder'?'A is the most significant bit.':'S1 is the most significant selector bit. Index = 2 × S1 + S0.'}</p>}{c.gates&&<><h3>Intermediate signals</h3>{c.gates.map(([key,type,...pins])=><code key={key}>{key.toUpperCase()} = {type}({pins.map(p=>result.signals[p]).join(', ')}) = {result.signals[key]}</code>)}</>}</div>}
  />;
}
