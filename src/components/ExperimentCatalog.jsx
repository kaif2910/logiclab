import React from 'react';
import {Play,Layers,Lightbulb} from 'lucide-react';
import {PageHeading} from './UI';
export default function ExperimentCatalog({title,description,category,items,onChoose}){
  const Icon=category==='APPLICATIONS'?Lightbulb:Layers;
  return <><PageHeading eyebrow={category} title={title} description={description}/><div className="experiment-catalog">{Object.entries(items).map(([id,item],i)=><article className="panel catalog-card" key={id}><div className="card-top"><Icon size={25}/><span>{String(i+1).padStart(2,'0')} / {item.category||'Application'}</span></div><h2>{item.name}</h2><p>{item.description}</p><span className="catalog-meta">{item.inputs.length} inputs · {item.outputs.length} outputs</span><button className="button secondary" onClick={()=>onChoose(id)}><Play size={15}/>Open {item.name}</button></article>)}</div></>;
}
