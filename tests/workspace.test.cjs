const test = require('node:test');
const assert = require('node:assert/strict');
const W = require('../src/workflow.js');

const mail = (id, projectId, extra={}) => ({id,receivedAt:'2030-05-13T09:00:00+09:00',subject:'Synthetic project notice',body:'Fictional',facts:{type:'assessment',companyIds:['aster'],projectId,eventId:'es',title:projectId+' ES',applicationDeadline:'2030-05-16T18:00:00+09:00',...extra}});
test('two projects at one company retain separate actions even with the same event ID',()=>{
 const s=W.processBatch(W.createState(),[mail('main','aster-pm'),mail('intern','aster-ai',{applicationDeadline:'2030-05-22T12:00:00+09:00'})]).state;
 const p=W.project(s);assert.equal(p.actions.length,2);assert.equal(p.projects.length,2);
 assert.equal(p.actions.find(a=>a.projectId==='aster-ai').deadline,'2030-05-22T12:00:00+09:00');
});
test('a decision is scoped to a project and does not change its sibling',()=>{
 const s=W.processBatch(W.createState(),[mail('main','aster-pm',{type:'invitation'}),mail('intern','aster-ai',{type:'invitation'})]).state;
 const p=W.project(W.setDecision(s,'aster-ai','save'));
 assert.equal(p.projects.find(p=>p.id==='aster-ai').stage,'watching');
 assert.equal(p.projects.find(p=>p.id==='aster-pm').stage,'incoming');
});
test('same event name in sibling tracks cannot merge confirmed calendar entries',()=>{
 const p=W.project(W.processBatch(W.createState(),[mail('main','aster-pm',{type:'confirmation',start:'2030-05-20T10:00:00+09:00',end:'2030-05-20T11:00:00+09:00'}),mail('intern','aster-ai',{type:'confirmation',start:'2030-05-21T10:00:00+09:00',end:'2030-05-21T11:00:00+09:00'})]).state);
 assert.equal(p.calendar.length,2);assert.equal(new Set(p.calendar.map(e=>e.id)).size,2);
});
