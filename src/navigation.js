import {gates,circuits,applications} from './engine.js';
const sections=['home','gates','circuits','playground','applications','learn'];
export function parseRoute(hash=''){
  const path=hash.replace(/^#\/?/,'');
  if(path==='simulator')return {section:'gates',id:'AND',key:'gates/AND'};
  const [part,id]=path.split('/');
  const section=sections.includes(part)?part:'home';
  const catalog=section==='gates'?gates:section==='circuits'?circuits:section==='applications'?applications:null;
  const selected=catalog&&Object.hasOwn(catalog,id)?id:null;
  return {section,id:selected,key:selected?`${section}/${selected}`:section};
}
export function routeLabel(route){
  if(route.id)return route.section==='gates'?`${route.id} Gate`:(route.section==='circuits'?circuits:applications)[route.id].name;
  return {home:'Home',gates:'Logic Gates',circuits:'Combinational Circuits',playground:'Circuit Playground',applications:'Applications',learn:'Learn'}[route.section];
}

