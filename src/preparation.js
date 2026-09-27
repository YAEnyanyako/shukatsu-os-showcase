(function(root,factory){
  const api=factory(typeof module==='object'&&module.exports ? require('./catalog.js') : root.Catalog);
  if(typeof module==='object'&&module.exports) module.exports=api; else root.Preparation=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(C){
  'use strict';
  const createState=()=>({drafts:{},collected:[],collections:[],notes:{},interviews:{},calendar:{connected:false,events:{},runs:[]}});
  const validProject=id=>C.projects.some(p=>p.id===id);
  const key=(id,q)=>{if(!validProject(id)||!C.esQuestions.some(v=>v.id===q))throw Error('Unknown project or question');return id+'/'+q;};
  function es(s,id,q){return s.drafts[key(id,q)]||{text:C.esQuestions.find(v=>v.id===q).seed,versions:[]};}
  function draft(s,id,q,text){s.drafts[key(id,q)]={...es(s,id,q),text:String(text)};}
  function version(s,id,q){const d=es(s,id,q);s.drafts[key(id,q)]={...d,versions:d.versions.concat({number:d.versions.length+1,text:d.text})};}
  const count=text=>Array.from(text).length;
  function review(text,limit){return [
    {label:'具体性',text:count(text)<120?'担当・行動・結果を具体化してください。どこを自分が決めたかがまだ見えにくい長さです。':'自分の担当、選択した行動、観察できた結果が区別できるか確認してください。文字数だけで内容の十分さは判定しません。'},
    {label:'深掘り',text:'なぜその方法か？ 他の案は？ あなたがいなければ何が違ったか？ 数字や比較の根拠を説明できるか確認。'},
    {label:'表現',text:count(text)>limit?`上限を ${count(text)-limit} 字超えています。結論の重複と抽象表現を見直してください。`:'「貢献」「成長」だけで終わらず、対象と行動が伝わるか確認。診断は簡易ルールで、文章を書き換えません。'}
  ];}
  function collect(s,companyId){const ids=C.sources.filter(x=>x.companyId===companyId).map(x=>x.id);const added=ids.filter(id=>!s.collected.includes(id));s.collected.push(...added);const run={companyId,added:added.length,skipped:ids.length-added.length,at:new Date().toISOString()};s.collections.push(run);return run;}
  function distill(s,id){if(!validProject(id))throw Error('Unknown project');const existing=s.notes[id]||[];const ids=C.sources.filter(x=>x.projectId===id&&x.kind==='experience'&&s.collected.includes(x.id)).map(x=>x.id);s.notes[id]=[...new Set(existing.concat(ids))];return s.notes[id].length-existing.length;}
  function answers(s,id,round){return s.interviews[id+'/'+round]||{};}
  function answer(s,id,round,q,text){const p=C.projects.find(p=>p.id===id);if(!p||!p.rounds.includes(round)||!Number.isInteger(q)||q<0||q>2)throw Error('Invalid interview');s.interviews[id+'/'+round]={...answers(s,id,round),[q]:String(text)};}
  function feedback(s,id,round){const a=answers(s,id,round);return [0,1,2].map(i=>({q:i,text:!a[i]?'未回答。この問いから準備してください。':count(a[i])<60?'回答が短く、判断理由を追問されると材料が不足する可能性があります。具体例を追加して再練習。':'「別案を選ばなかった理由」「結果の根拠」「自分の担当」を追問して検証してください。自動評価は合否を判定しません。'}));}
  function sync(s,events){if(!s.calendar.connected)throw Error('Connect the demo first');let added=0,updated=0,skipped=0;const next={};
    events.forEach(e=>{const old=s.calendar.events[e.id];const changed=old&&['start','end','title','sourceId'].some(k=>old[k]!==e[k]);if(!old)added++;else if(changed)updated++;else skipped++;next[e.id]={...e,sequence:old?(old.sequence||0)+(changed?1:0):0};});
    const removed=Object.keys(s.calendar.events).filter(id=>!Object.hasOwn(next,id)).length;s.calendar.events=next;const run={added,updated,skipped,removed};s.calendar.runs.push(run);return run;
  }
  const escapeICS=s=>String(s).replace(/\\/g,'\\\\').replace(/\r\n|\r|\n/g,'\\n').replace(/;/g,'\\;').replace(/,/g,'\\,');
  const utc=s=>new Date(s).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');
  function fold(line){let result='',current='',bytes=0;for(const c of line){const n=new TextEncoder().encode(c).length;if(bytes+n>75){result+=current+'\r\n';current=' ';bytes=1;}current+=c;bytes+=n;}return result+current;}
  function ics(events){const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Shukatsu OS//Fictional Demo//JA','CALSCALE:GREGORIAN'];events.forEach(e=>lines.push('BEGIN:VEVENT','UID:'+escapeICS(e.id)+'@example.com','DTSTAMP:20300513T000000Z','SEQUENCE:'+(e.sequence||0),'DTSTART:'+utc(e.start),'DTEND:'+utc(e.end),'SUMMARY:'+escapeICS(e.title),'DESCRIPTION:'+escapeICS('架空の公開デモ / 根拠 '+(e.sourceId||'')),'END:VEVENT'));lines.push('END:VCALENDAR');return lines.map(fold).join('\r\n')+'\r\n';}
  // Only restore known project/source keys. Persisted prose remains local and is escaped at render time.
  function restore(raw,allowedEvents=[]){const s=createState();if(!raw||typeof raw!=='object')return s;
    for(const p of C.projects){for(const q of C.esQuestions){const d=raw.drafts&&raw.drafts[p.id+'/'+q.id];if(d&&typeof d.text==='string'){draft(s,p.id,q.id,d.text);s.drafts[p.id+'/'+q.id].versions=Array.isArray(d.versions)?d.versions.filter(v=>v&&typeof v.text==='string').map((v,i)=>({number:i+1,text:v.text})):[];}}
      s.notes[p.id]=Array.isArray(raw.notes&&raw.notes[p.id])?[...new Set(raw.notes[p.id].filter(id=>C.sources.some(x=>x.id===id&&x.projectId===p.id)))]:[];
      p.rounds.forEach(r=>{const a=raw.interviews&&raw.interviews[p.id+'/'+r];[0,1,2].forEach(i=>{if(a&&typeof a[i]==='string')answer(s,p.id,r,i,a[i]);});});}
    s.collected=Array.isArray(raw.collected)?[...new Set(raw.collected.filter(id=>C.sources.some(x=>x.id===id)))]:[];
    s.collections=Array.isArray(raw.collections)?raw.collections.filter(r=>r&&C.projects.some(p=>p.companyId===r.companyId)&&Number.isInteger(r.added)&&Number.isInteger(r.skipped)&&typeof r.at==='string'&&Number.isFinite(Date.parse(r.at))).slice(-100):[];
    s.calendar.connected=raw.calendar&&raw.calendar.connected===true;
    for(const event of allowedEvents){
      const old=raw.calendar&&raw.calendar.events&&raw.calendar.events[event.id];
      if(old&&Number.isSafeInteger(old.sequence)&&old.sequence>=0&&typeof old.sourceId==='string'&&['start','end'].every(k=>typeof old[k]==='string'&&Number.isFinite(Date.parse(old[k])))) {
        s.calendar.events[event.id]={...event,start:old.start,end:old.end,sourceId:old.sourceId,sequence:old.sequence};
      }
    }
    s.calendar.runs=Array.isArray(raw.calendar&&raw.calendar.runs)?raw.calendar.runs.filter(r=>r&&['added','updated','skipped','removed'].every(k=>Number.isInteger(r[k])&&r[k]>=0)).slice(-100):[];
    return s;
  }
  return {createState,es,draft,version,count,review,collect,distill,answers,answer,feedback,sync,ics,restore};
});
