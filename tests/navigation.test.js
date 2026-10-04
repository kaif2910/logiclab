import test from 'node:test';
import assert from 'node:assert/strict';
import {parseRoute,routeLabel} from '../src/navigation.js';
import {gates,circuits,applications} from '../src/engine.js';
test('Every experiment has a stable, refreshable route',()=>{for(const [section,items] of Object.entries({gates,circuits,applications}))for(const id of Object.keys(items)){const route=parseRoute(`#${section}/${id}`);assert.equal(route.section,section);assert.equal(route.id,id);assert.equal(route.key,`${section}/${id}`);assert.ok(routeLabel(route));}});
test('Old simulator links still open the AND workbench',()=>assert.deepEqual(parseRoute('#simulator'),{section:'gates',id:'AND',key:'gates/AND'}));
test('Invalid links fall back without selecting an invalid experiment',()=>{assert.equal(parseRoute('#gates/invalid').key,'gates');assert.equal(parseRoute('#circuits/__proto__').id,null);assert.equal(parseRoute('#missing').key,'home');assert.equal(parseRoute('').key,'home');});
