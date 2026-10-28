import { AREAS, areaById, MODULES, moduleByArea, EXERCISES, PLACEMENT,
         TRAINING_MODES, TRAINING_SIZE, TRAINING_MODULE } from './data/content.js?v=5';
import { mascot } from './mascot.js?v=5';
import { icons } from './icons.js?v=5';
import { buildExercise, typeLabel } from './exercises.js?v=5';
import * as S from './state.js?v=5';

const app = document.getElementById('app');
let route = { name:'intro', params:{}, step:0 };

function h(tag,cls,html){const e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e;}
function go(name, params={}, step=0){ route={name,params,step}; render(); window.scrollTo(0,0); }

// ---------- friendly feedback copy ----------
const OK_MSG = ['Výborne!','Správne!','Super, máte to!','Presne tak!','Skvelá práca!'];
const NO_MSG = ['Skúsme to ešte raz.','Nevadí, to zvládnete.','Takmer! Skúste znova.','To nič, poďme na to spolu.'];
const pick = (arr,i)=>arr[i%arr.length];

// =====================================================================
// RENDER ROUTER
// =====================================================================
function render(){
  app.innerHTML='';
  const st = S.getState();
  if(route.name==='intro' && !st.introDone){ app.appendChild(renderIntro()); return; }
  let screen;
  switch(route.name){
    case 'home': screen=renderHome(); break;
    case 'areas': screen=renderAreas(); break;
    case 'area': screen=renderArea(route.params.areaId); break;
    case 'path': screen=renderPath(route.params.moduleId); break;
    case 'lesson': screen=renderLesson(route.params); break;
    case 'placement': screen=renderPlacementIntro(route.params.moduleId); break;
    case 'session': screen=renderSession(route.params); break;
    case 'training': screen=renderTraining(); break;
    case 'progress': screen=renderProgress(); break;
    case 'about': screen=renderAbout(); break;
    case 'profile': screen=renderProfile(); break;
    default: screen=renderHome();
  }
  app.appendChild(screen);
  // bottom nav on main screens only
  if(['home','areas','area','path','training','progress'].includes(route.name)){
    app.appendChild(renderNav());
  }
}

// =====================================================================
// INTRO (max 2 screens)
// =====================================================================
function renderIntro(){
  const s = h('div','screen no-nav');
  if(route.step===0){
    s.appendChild(h('div','brandmark','Praktickô'));
    s.appendChild(h('div','mascot-hero', mascot('welcome',150)+
      `<div class="speech"><h1>Zvládajte každodenné situácie s väčšou istotou.</h1>
       <p class="muted">Precvičujte si základné zručnosti na praktických príkladoch zo života a práce. Vlastným tempom, krok za krokom a bez stresu.</p></div>`));
    const btn=h('button','btn','Pokračovať'); btn.onclick=()=>go('intro',{},1);
    const wrap=h('div'); wrap.style.marginTop='18px'; wrap.appendChild(btn);
    s.appendChild(wrap);
    s.appendChild(dots(2,0));
  } else {
    s.appendChild(h('div','mascot-hero', mascot('encourage',150)+
      `<div class="speech"><h1>Vaša vlastná cesta</h1>
       <p class="muted">Pred začiatkom si môžete spraviť krátky vstupný test. Pomôže nám odporučiť, kde je najlepšie začať. Učiť sa budete vždy vlastným tempom.</p>
       <p class="faint">Žiadna registrácia ani osobné údaje.</p></div>`));
    const btn=h('button','btn','Začať'); btn.onclick=()=>{ S.setIntroDone(); go('home'); };
    const back=h('button','btn ghost','Späť'); back.onclick=()=>go('intro',{},0);
    const wrap=h('div'); wrap.style.marginTop='18px'; wrap.appendChild(btn); wrap.appendChild(back);
    s.appendChild(wrap);
    s.appendChild(dots(2,1));
  }
  return s;
}
function dots(n,on){ const d=h('div','step-dots'); d.style.marginTop='20px';
  for(let i=0;i<n;i++) d.appendChild(h('i', i===on?'on':'')); return d; }

// =====================================================================
// HOME
// =====================================================================
function renderHome(){
  const s=h('div','screen');
  const st=S.getState();
  const cur=st.current;
  const returning = !!(cur && cur.moduleId && MODULES[cur.moduleId]);

  // header: brand + profile icon top-right
  const head=h('div','home-head');
  head.innerHTML=`<div class="brandmark sm">Praktickô</div>`;
  const prof=h('button','avatar-btn','PN');
  prof.setAttribute('aria-label','Profil');
  prof.onclick=()=>go('profile');
  head.appendChild(prof);
  s.appendChild(head);

  // welcome + purpose
  s.appendChild(h('div','home-hero',
    `<h1>${returning?'Vitajte späť!':'Dobrý deň!'}</h1>
     <p class="muted">Praktickô vám pomáha precvičovať základné zručnosti pre každodenný život a prácu — vlastným tempom.</p>`));

  // continuation card ONLY if unfinished learning exists
  if(returning){
    const mod=MODULES[cur.moduleId]; const ar=areaById(mod.area);
    const c=h('div','continue');
    c.innerHTML=`<div class="c-ico" style="background:${ar.soft};color:${ar.accent}">${icons[ar.icon]}</div>
      <div class="ct"><div class="lbl">Pokračovať v učení</div><div class="nm">${mod.title}</div></div>
      <div class="arrow">${icons.arrow}</div>`;
    c.onclick=()=>go('path',{moduleId:cur.moduleId});
    s.appendChild(c);
  } else {
    const inv=h('div','card invite');
    inv.innerHTML=`<div class="invite-art">${mascot('point',72)}</div>
      <div><h3 style="margin:0 0 3px">Začnime spolu</h3>
      <p class="muted" style="margin:0">Vyberte si učebný okruh a pustite sa do prvej lekcie. Odporúčame <strong>Matematickú a finančnú gramotnosť</strong> — je úplne pripravená.</p></div>`;
    s.appendChild(inv);
  }

  // primary navigation actions (NOT the six-area grid)
  const a1=h('button','btn home-cta',`${icons.learn}<span>Učebné okruhy</span>`);
  a1.onclick=()=>go('areas');
  s.appendChild(a1);
  const a2=h('button','btn secondary home-cta',`${icons.info}<span>O aplikácii</span>`);
  a2.onclick=()=>go('about');
  s.appendChild(a2);

  return s;
}
function areaGrid(){
  const g=h('div','area-grid');
  AREAS.forEach(a=>{
    const t=h('div','area-tile');
    t.style.setProperty('--ac',a.accent); t.style.setProperty('--acs',a.soft);
    t.innerHTML=`<div class="area-ico" style="color:${a.accent}">${icons[a.icon]}</div>
      <div class="nm">${a.name}</div>${a.reference?'<div class="faint" style="color:'+a.accent+'">Pripravené</div>':'<div class="faint">Ukážka</div>'}`;
    t.onclick=()=>go('area',{areaId:a.id});
    g.appendChild(t);
  });
  return g;
}
function renderAreas(){
  const s=h('div','screen');
  s.appendChild(h('h1',null,'Učebné okruhy'));
  s.appendChild(h('p','muted','Vyberte si oblasť gramotnosti.'));
  s.appendChild(areaGrid());
  return s;
}

// =====================================================================
// AREA DETAIL
// =====================================================================
function renderArea(areaId){
  const a=areaById(areaId); const mod=moduleByArea(areaId);
  const s=h('div','screen');
  s.appendChild(topbar(a.name, ()=>go('areas')));
  const head=h('div','card');
  head.style.borderLeft=`4px solid ${a.accent}`;
  head.innerHTML=`<div style="display:flex;gap:12px;align-items:center;margin-bottom:6px">
    <div class="area-ico" style="color:${a.accent};background:${a.soft}">${icons[a.icon]}</div>
    <div><h2 style="margin:0">${mod.title}</h2><div class="faint">${mod.desc}</div></div></div>`;
  s.appendChild(head);

  const pl=S.getPlacement(mod.id);
  const us=S.unitStatus(mod.id);

  if(mod.reference){
    // placement card
    const pc=h('div','card');
    if(pl){
      pc.innerHTML=`<h3>Vstupný test dokončený</h3>
        <p class="muted">${pl.outcome==='advanced'
          ? `Odporúčame začať v <strong>${pl.recommendedUnit}. tematickom celku</strong>. Celky 1 a 2 si môžete kedykoľvek prejsť ako dobrovoľné opakovanie.`
          : `Odporúčame začať v <strong>${pl.recommendedUnit}. tematickom celku</strong> a postupovať krok za krokom.`}</p>`;
      const b=h('button','btn secondary sm','Zopakovať vstupný test');
      b.onclick=()=>go('placement',{moduleId:mod.id});
      pc.appendChild(b);
    } else {
      pc.innerHTML=`<h3>Krátky vstupný test</h3>
        <p class="muted">5 krátkych úloh nám pomôže odporučiť, kde začať. Môžete ho aj preskočiť a začať od začiatku.</p>`;
      const b=h('button','btn','Začať vstupný test'); b.onclick=()=>go('placement',{moduleId:mod.id});
      pc.appendChild(b);
    }
    s.appendChild(pc);

    const b2=h('button','btn secondary','Zobraziť učebnú cestu');
    b2.onclick=()=>go('path',{moduleId:mod.id});
    s.appendChild(b2);
  } else {
    const info=h('div','card');
    info.innerHTML=`<div style="display:flex;gap:10px;align-items:flex-start">${mascot('point',56)}
      <p style="margin:0" class="muted">Toto je <strong>ukážkový modul</strong>. Prvý tematický celok obsahuje funkčné cvičenia, ďalšie celky budú doplnené v plnej verzii.</p></div>`;
    s.appendChild(info);
    const b2=h('button','btn','Zobraziť učebnú cestu');
    b2.onclick=()=>go('path',{moduleId:mod.id});
    s.appendChild(b2);
  }
  return s;
}

// =====================================================================
// LEARNING PATH (nodes)
// =====================================================================
function renderPath(moduleId){
  const mod=MODULES[moduleId]; const a=areaById(mod.area);
  const s=h('div','screen');
  s.appendChild(topbar(mod.title, ()=>go('area',{areaId:mod.area})));
  const us=S.unitStatus(moduleId);

  mod.units.forEach((u,ui)=>{
    const ust=us.units[u.n];
    const head=h('div','unit-head'+(ust.status==='locked'?' locked':''));
    let badge=`<span class="u-badge">${u.n}. celok</span>`;
    head.innerHTML=`${badge}<strong>${u.title}</strong>`;
    if(ust.optional) head.innerHTML+=`<span class="u-opt">nepovinné</span>`;
    if(ust.status==='completed') head.innerHTML+=`<span style="margin-left:auto;color:var(--ok)">${icons.check}</span>`;
    s.appendChild(head);

    if(!u.lessons.length){
      const empty=h('div','card');
      empty.innerHTML=`<p class="faint" style="margin:0">${ust.status==='locked'?'Najprv dokončite predošlý celok.':'Obsah tohto celku bude doplnený v plnej verzii.'}</p>`;
      s.appendChild(empty);
      return;
    }

    const path=h('div','path');
    u.lessons.forEach((lid,li)=>{
      const ex=EXERCISES[lid];
      const done=S.isLessonDone(lid);
      const unitOpen = ust.status==='available'||ust.status==='current'||ust.status==='completed';
      let nodeCls='node';
      if(done) nodeCls+=' done';
      else if(!unitOpen) nodeCls+=' locked';
      else nodeCls+=' current';
      const row=h('div','node-row');
      if(li>0) row.appendChild(h('div','connector'+(done||S.isLessonDone(u.lessons[li-1])?' done':'')));
      const node=h('div',nodeCls);
      node.innerHTML = done?icons.check : (!unitOpen?icons.lock : icons.play);
      node.onclick=()=>{
        if(!unitOpen){ toast('Tento celok sa odomkne po dokončení predchádzajúceho.'); return; }
        go('lesson',{moduleId,lessonId:lid});
      };
      row.appendChild(node);
      row.appendChild(h('div','node-label', ex.title));
      row.appendChild(h('div','node-sub', typeLabel[ex.type]));
      path.appendChild(row);
    });
    s.appendChild(path);
  });
  return s;
}

// =====================================================================
// LESSON (single exercise, with retry) — learning flow
// =====================================================================
function renderLesson({moduleId, lessonId}){
  const ex=EXERCISES[lessonId];
  const mod=MODULES[moduleId];
  S.setCurrent({areaId:mod.area, moduleId, lessonId});
  return exercisePlayer({
    title: mod.title,
    items:[ex],
    allowRetry:true,
    mustCorrect:true,
    onExit:()=>go('path',{moduleId}),
    onFinish:()=>{
      const res=S.completeLessonAndCheck(moduleId, lessonId);
      if(res.unitCompleted){ showUnitComplete(moduleId, res); }
      else go('path',{moduleId});
    },
    progressTotal:1,
  });
}

// =====================================================================
// GENERIC EXERCISE PLAYER (used by lesson / placement / training)
// =====================================================================
function exercisePlayer(cfg){
  // cfg: {title, items[], allowRetry, onExit, onFinish(results), onEach?, progressTotal, headerNote}
  const s=h('div','screen lesson-screen no-nav');
  let idx=0; const results=[];
  const total=cfg.items.length;

  const bar=h('div'); s.appendChild(bar);
  const body=h('div'); s.appendChild(body);
  const action=h('div','sticky-action'); const actionInner=h('div','inner'); action.appendChild(actionInner);
  s.appendChild(action);

  function drawHeader(){
    bar.innerHTML='';
    const tb=h('div','topbar');
    const close=h('button','back'); close.innerHTML=icons.close;
    close.onclick=()=>{ if(confirm('Naozaj chcete ukončiť? Postup v tomto cvičení sa neuloží.')) cfg.onExit(); };
    tb.appendChild(close);
    tb.appendChild(h('div','', `<strong>${cfg.title}</strong>`));
    bar.appendChild(tb);
    const pb=h('div','pbar'); pb.appendChild(h('i')); 
    pb.firstChild.style.width = ((idx)/total*100)+'%';
    bar.appendChild(pb);
    bar.appendChild(h('div','faint',`${cfg.headerNote? cfg.headerNote+' · ':''}Úloha ${idx+1} z ${total}`));
  }

  function drawExercise(revealHint){
    drawHeader();
    body.innerHTML=''; actionInner.innerHTML='';
    const ex=cfg.items[idx];
    body.appendChild(h('div','faint', typeLabel[ex.type]));
    body.appendChild(h('div','ex-instruction', ex.instruction));
    const ctrl=buildExercise(ex);
    body.appendChild(ctrl.el);

    // hint
    let hintShown=false;
    const hintHolder=h('div'); body.appendChild(hintHolder);
    function revealHintBox(){
      if(hintShown || !ex.hint) return; hintShown=true;
      hintHolder.appendChild(h('div','hintbox', `<span class="hc">${icons.bulb}</span><span>${ex.hint}</span>`));
      if(hintBtn) hintBtn.disabled=true;
    }

    const confirm=h('button','btn','Skontrolovať'); confirm.disabled=true;
    let hintBtn=null;
    if(ex.hint){
      hintBtn=h('button','btn secondary sm','Pomôcka'); hintBtn.style.flex='0 0 auto';
      hintBtn.onclick=()=>revealHintBox();
    }
    ctrl.el.addEventListener('answerchange',()=>{ confirm.disabled=!ctrl.hasAnswer(); });
    if(ex.type==='order'){ confirm.disabled=false; }

    // When we re-draw after a wrong answer in a lesson, keep the hint visible.
    if(revealHint) revealHintBox();

    confirm.onclick=()=>{
      const correct=ctrl.check();
      // In lessons (mustCorrect) a wrong answer must NOT reveal the correct option —
      // the learner has to find it themselves. Only mark their wrong choice.
      const reveal = !(cfg.mustCorrect && !correct);
      ctrl.showResult(correct, reveal);
      results[idx]={id:ex.id, correct, level:ex.level};
      showFeedback(correct, ex, ctrl);
    };
    if(hintBtn) actionInner.appendChild(hintBtn);
    actionInner.appendChild(confirm);

    function showFeedback(correct, ex, ctrl){
      // disable confirm & hint
      confirm.remove(); if(hintBtn) hintBtn.remove();

      // LESSON MODE: a wrong answer must NOT let the learner advance.
      // Show encouragement + the hint, and the learner has to pick the
      // correct option themselves before they can continue.
      if(!correct && cfg.mustCorrect){
        const fb=h('div','feedback no');
        fb.innerHTML=`<div class="fb-mascot">${mascot('hint',56)}</div>
          <div><div class="fb-title">${pick(NO_MSG,idx)}</div>
          <div class="fb-expl">Skúste to ešte raz — pozrite si pomôcku a vyberte správnu možnosť.</div></div>`;
        body.appendChild(fb);
        revealHintBox();
        fb.scrollIntoView({behavior:'smooth',block:'nearest'});
        const retry=h('button','btn','Skúsiť znova');
        retry.onclick=()=>{ drawExercise(true); };
        actionInner.appendChild(retry);
        return;
      }

      const fb=h('div','feedback '+(correct?'ok':'no'));
      fb.innerHTML=`<div class="fb-mascot">${mascot(correct?'celebrate':'encourage',56)}</div>
        <div><div class="fb-title">${correct?pick(OK_MSG,idx):pick(NO_MSG,idx)}</div>
        <div class="fb-expl">${ex.explanation}</div></div>`;
      body.appendChild(fb);
      fb.scrollIntoView({behavior:'smooth',block:'nearest'});

      if(!correct && cfg.allowRetry){
        const retry=h('button','btn secondary','Skúsiť znova');
        retry.onclick=()=>{ drawExercise(); };
        const cont=h('button','btn','Pokračovať');
        cont.onclick=()=>next();
        actionInner.appendChild(retry); actionInner.appendChild(cont);
      } else {
        const cont=h('button','btn', idx+1<total?'Pokračovať':'Dokončiť');
        cont.onclick=()=>next();
        actionInner.appendChild(cont);
      }
    }
  }
  function next(){
    if(cfg.onEach) cfg.onEach(results[idx]);
    idx++;
    if(idx>=total){ cfg.onFinish(results); }
    else drawExercise();
  }
  drawExercise();
  return s;
}

// =====================================================================
// PLACEMENT
// =====================================================================
function renderPlacementIntro(moduleId){
  const conf=PLACEMENT[moduleId]; const mod=MODULES[moduleId];
  const s=h('div','screen no-nav');
  s.appendChild(topbar('Vstupný test', ()=>go('area',{areaId:mod.area})));
  s.appendChild(h('div','mascot-hero', mascot('point',120)+
    `<div class="speech"><h2 style="margin:0">Zistime, kde začať</h2>
     <p class="muted" style="margin:.4em 0 0">Čaká vás ${conf.questions.length} krátkych úloh z rôznych zručností. Nie je to skúška — pomôže nám to odporučiť vhodný začiatok.</p></div>`));
  const b=h('button','btn','Začať'); b.onclick=()=>startPlacement(moduleId);
  const skip=h('button','btn ghost','Preskočiť a začať od začiatku');
  skip.onclick=()=>{ S.recordPlacement(moduleId,{done:true,skipped:true,score:0,total:conf.questions.length,outcome:'beginner',recommendedUnit:1});
    go('path',{moduleId}); };
  const w=h('div'); w.style.marginTop='16px'; w.appendChild(b); w.appendChild(skip); s.appendChild(w);
  return s;
}
function startPlacement(moduleId){
  const conf=PLACEMENT[moduleId]; const mod=MODULES[moduleId];
  go('session',{kind:'placement', moduleId});
}

// =====================================================================
// SESSION dispatcher (placement / training)
// =====================================================================
function renderSession(params){
  if(params.kind==='placement') return runPlacement(params.moduleId);
  if(params.kind==='training') return runTraining(params.modeId);
  return renderHome();
}

function runPlacement(moduleId){
  const conf=PLACEMENT[moduleId]; const mod=MODULES[moduleId];
  return exercisePlayer({
    title:'Vstupný test',
    items:conf.questions,
    allowRetry:false,
    headerNote:'Vstupný test',
    onExit:()=>go('area',{areaId:mod.area}),
    onFinish:(results)=>{
      const score=results.filter(r=>r.correct).length;
      const advanced = score>=conf.threshold;
      const outcome = advanced?'advanced':'beginner';
      const recommendedUnit = advanced?3:1;
      S.recordPlacement(moduleId,{done:true,score,total:conf.questions.length,outcome,recommendedUnit});
      showPlacementResult(moduleId,{score,total:conf.questions.length,outcome,recommendedUnit});
    },
  });
}
function showPlacementResult(moduleId,{score,total,outcome,recommendedUnit}){
  const mod=MODULES[moduleId];
  const s=h('div','screen no-nav');
  s.appendChild(h('div','celebrate',
    `<div>${mascot(outcome==='advanced'?'celebrate':'encourage',150)}</div>
     <h1 style="margin-top:6px">${outcome==='advanced'?'Máte pekný základ!':'Začneme od základov'}</h1>`));
  s.appendChild(h('div','center',`<div class="stat-row">
    <div class="stat"><div class="big">${score}/${total}</div><div class="lab">správne</div></div></div>`));
  const card=h('div','card');
  card.innerHTML = outcome==='advanced'
    ? `<p>Odporúčame začať v <strong>${recommendedUnit}. tematickom celku</strong>. Celky 1 a 2 máte k dispozícii ako nepovinné opakovanie, ak si ich budete chcieť prejsť.</p>`
    : `<p>Odporúčame začať v <strong>${recommendedUnit}. tematickom celku</strong> a postupovať krok za krokom. Každý ďalší celok sa odomkne po dokončení predchádzajúceho.</p>`;
  s.appendChild(card);
  const b=h('button','btn','Zobraziť učebnú cestu');
  b.onclick=()=>go('path',{moduleId});
  s.appendChild(b);
  app.innerHTML=''; app.appendChild(s); window.scrollTo(0,0);
}

// =====================================================================
// UNIT COMPLETE celebration
// =====================================================================
function showUnitComplete(moduleId,res){
  const mod=MODULES[moduleId];
  const st=S.getState();
  const doneLessons=Object.keys(st.completedLessons).filter(l=>EXERCISES[l]&&EXERCISES[l].module===moduleId).length;
  const doneUnits=mod.units.filter(u=>S.isUnitDone(moduleId,u.n)).length;
  confetti();
  const s=h('div','screen no-nav');
  s.appendChild(h('div','celebrate',
    `<div>${mascot('celebrate',160)}</div>
     <h1 style="margin-top:4px">${res.unitN}. celok dokončený!</h1>
     <div class="badge">${icons.star} Odznak za ${res.unitN}. celok</div>`));
  s.appendChild(h('div','center',`<div class="stat-row">
    <div class="stat"><div class="big">${doneLessons}</div><div class="lab">cvičení</div></div>
    <div class="stat"><div class="big">${doneUnits}</div><div class="lab">celkov</div></div></div>`));
  const msg = res.nextUnlocked
    ? `<p class="center muted">Odomkli ste ďalší celok. Len tak ďalej!</p>`
    : `<p class="center muted">Skvelá práca! Pokračujte vo svojom tempe.</p>`;
  s.appendChild(h('div',null,msg));
  const b=h('button','btn','Pokračovať');
  b.onclick=()=>go('path',{moduleId});
  s.appendChild(b);
  app.innerHTML=''; app.appendChild(s); window.scrollTo(0,0);
}

// =====================================================================
// TRAINING
// =====================================================================
function renderTraining(){
  const s=h('div','screen');
  s.appendChild(h('h1',null,'Tréning'));
  const mod=MODULES[TRAINING_MODULE];
  s.appendChild(h('p','muted',`Precvičovanie z modulu <strong>${mod.title}</strong>. Vyberte si náročnosť.`));
  TRAINING_MODES.forEach((m,i)=>{
    const c=h('div','card tap mode-card');
    c.innerHTML=`<div class="mix"><span class="l1">${m.mix.split('/')[0]}%</span><span>${m.title.split(' ')[0]}</span></div>
      <div style="flex:1"><h3 style="margin:0 0 2px">${m.title}</h3><div class="faint">${m.desc}</div></div>
      <div class="arrow" style="color:var(--primary)">${icons.arrow}</div>`;
    c.onclick=()=>go('session',{kind:'training', modeId:m.id});
    s.appendChild(c);
  });
  const st=S.getState();
  if(st.training.length){
    s.appendChild(h('h2',null,'Posledné tréningy'));
    const ul=h('ul','list-plain card');
    st.training.forEach(t=>{
      const mode=TRAINING_MODES.find(m=>m.id===t.mode);
      ul.appendChild(h('li',null,`<span style="flex:1">${mode?mode.title:t.mode}</span><span class="tag ${t.correct/t.total>=0.6?'ok':''}">${t.correct}/${t.total}</span>`));
    });
    s.appendChild(ul);
  }
  return s;
}

// deterministic training set selection respecting L1/L2 mix, availability, no repeats
function buildTrainingItems(modeId){
  const mode=TRAINING_MODES.find(m=>m.id===modeId);
  const moduleId=TRAINING_MODULE;
  const us=S.unitStatus(moduleId);
  const mod=MODULES[moduleId];
  // available exercises = lessons in units that are available/current/completed
  let pool=[];
  mod.units.forEach(u=>{
    const st=us.units[u.n].status;
    if(st==='available'||st==='current'||st==='completed'){
      u.lessons.forEach(l=>pool.push(EXERCISES[l]));
    }
  });
  if(pool.length===0){ // fallback: all module exercises
    pool=Object.values(EXERCISES).filter(e=>e.module===moduleId);
  }
  const l1=pool.filter(e=>e.level==='L1');
  const l2=pool.filter(e=>e.level==='L2');
  const n=Math.min(TRAINING_SIZE, Math.max(l1.length+l2.length,1));
  let n1=Math.round(n*mode.l1), n2=n-n1;
  // seeded shuffle for determinism per session (seed from time but stable within session)
  const seed = Date.now();
  const sh=(arr)=>seededShuffle(arr, seed);
  const sel=[];
  const take=(arr,k)=>{ const s=sh(arr); for(let i=0;i<arr.length && sel.length<n && k>0;i++){ sel.push(s[i]); k--; } };
  // draw without repeats; cycle if not enough unique
  const drawUnique=(arr,k)=>{ const s=sh(arr); let added=0;
    for(let i=0;i<s.length && added<k;i++){ if(!sel.includes(s[i])){ sel.push(s[i]); added++; } } return added; };
  let got1=drawUnique(l1,n1); let got2=drawUnique(l2,n2);
  // fill remaining from the other pool / leftovers to reach n, avoiding repeats until forced
  while(sel.length<n){
    const before=sel.length;
    drawUnique(l2, n - sel.length);
    drawUnique(l1, n - sel.length);
    if(sel.length===before) break;
  }
  // if still short (small pool), allow repeats to reach n but keep variety
  let gi=0; const all=sh([...l1,...l2]);
  while(sel.length<n && all.length){ sel.push(all[gi%all.length]); gi++; }
  return sel.slice(0,n);
}
function seededShuffle(arr, seed){
  const a=[...arr]; let s=seed;
  const rnd=()=>{ s=(s*1103515245+12345)&0x7fffffff; return s/0x7fffffff; };
  for(let i=a.length-1;i>0;i--){ const j=Math.floor(rnd()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
  return a;
}
function runTraining(modeId){
  const mode=TRAINING_MODES.find(m=>m.id===modeId);
  const items=buildTrainingItems(modeId);
  return exercisePlayer({
    title:'Tréning · '+mode.title,
    items, allowRetry:false,
    headerNote:mode.mix,
    onExit:()=>go('training'),
    onFinish:(results)=>{
      const correct=results.filter(r=>r.correct).length;
      S.addTraining({mode:modeId, correct, total:results.length, date:Date.now()});
      showTrainingSummary(modeId,{correct,total:results.length});
    },
  });
}
function showTrainingSummary(modeId,{correct,total}){
  const mode=TRAINING_MODES.find(m=>m.id===modeId);
  const good=correct/total>=0.6;
  confetti(good?12:0);
  const s=h('div','screen no-nav');
  s.appendChild(h('div','celebrate',
    `<div>${mascot(good?'celebrate':'encourage',150)}</div>
     <h1 style="margin-top:6px">Tréning dokončený</h1>`));
  s.appendChild(h('div','center',`<div class="stat-row">
    <div class="stat"><div class="big">${correct}/${total}</div><div class="lab">správne</div></div></div>`));
  s.appendChild(h('p','center muted', good?'Výborná práca! Chcete pokračovať?':'Pekná snaha! Každé opakovanie pomáha.'));
  const again=h('button','btn','Trénovať znova'); again.onclick=()=>go('session',{kind:'training',modeId});
  const back=h('button','btn secondary','Späť na tréning'); back.onclick=()=>go('training');
  s.appendChild(again); s.appendChild(back);
  app.innerHTML=''; app.appendChild(s); window.scrollTo(0,0);
}

// =====================================================================
// PROGRESS
// =====================================================================
function renderProgress(){
  const s=h('div','screen');
  const st=S.getState();
  s.appendChild(h('h1',null,'Pokrok'));

  const totalLessons=Object.keys(EXERCISES).length;
  const doneLessons=Object.keys(st.completedLessons).length;
  const doneUnits=Object.keys(st.completedUnits).length;
  const badges=Object.keys(st.badges).length;

  s.appendChild(h('div',null,`<div class="stat-row" style="justify-content:space-between">
    <div class="stat"><div class="big">${doneLessons}</div><div class="lab">cvičení</div></div>
    <div class="stat"><div class="big">${doneUnits}</div><div class="lab">celkov</div></div>
    <div class="stat"><div class="big">${badges}</div><div class="lab">odznakov</div></div></div>`));

  // current position
  const cur=st.current;
  const posCard=h('div','card');
  if(cur&&cur.moduleId&&MODULES[cur.moduleId]){
    const mod=MODULES[cur.moduleId];
    posCard.innerHTML=`<h3>Kde ste skončili</h3><p class="muted" style="margin:0">${mod.title}${cur.lessonId&&EXERCISES[cur.lessonId]?' · '+EXERCISES[cur.lessonId].title:''}</p>`;
    const b=h('button','btn secondary sm','Pokračovať'); b.style.marginTop='10px';
    b.onclick=()=>go('path',{moduleId:cur.moduleId}); posCard.appendChild(b);
  } else {
    posCard.innerHTML=`<h3>Kde ste skončili</h3><p class="muted" style="margin:0">Zatiaľ ste nezačali. Vyberte si oblasť v časti Učenie.</p>`;
  }
  s.appendChild(posCard);

  // per-module progress (reference + any touched)
  const refMod=MODULES[TRAINING_MODULE];
  const us=S.unitStatus(refMod.id);
  const mc=h('div','card');
  mc.innerHTML=`<h3>${refMod.title}</h3>`;
  refMod.units.forEach(u=>{
    const done=S.isUnitDone(refMod.id,u.n);
    const stx=us.units[u.n].status;
    const lbl = done?'<span class="tag ok">dokončené</span>':(stx==='locked'?'<span class="tag">zamknuté</span>':'<span class="tag">dostupné</span>');
    mc.appendChild(h('div',null,`<div style="display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid var(--line)"><span style="flex:1">${u.n}. celok · ${u.title}</span>${lbl}</div>`));
  });
  s.appendChild(mc);

  // recent training
  if(st.training.length){
    const tc=h('div','card'); tc.innerHTML='<h3>Posledné tréningy</h3>';
    const ul=h('ul','list-plain');
    st.training.forEach(t=>{ const mode=TRAINING_MODES.find(m=>m.id===t.mode);
      ul.appendChild(h('li',null,`<span style="flex:1">${mode?mode.title:t.mode}</span><span class="tag ${t.correct/t.total>=0.6?'ok':''}">${t.correct}/${t.total}</span>`)); });
    tc.appendChild(ul); s.appendChild(tc);
  }

  // reset
  const rc=h('div'); rc.style.marginTop='8px';
  const rb=h('button','btn ghost','Vymazať uložený pokrok');
  rb.onclick=()=>{ if(confirm('Vymazať všetok uložený pokrok? Túto akciu nie je možné vrátiť.')){ S.resetState(); go('home'); } };
  rc.appendChild(rb); s.appendChild(rc);
  return s;
}

// =====================================================================
// ABOUT (O aplikácii)
// =====================================================================
function renderAbout(){
  const s=h('div','screen');
  s.appendChild(topbar('O aplikácii', ()=>go('home')));
  const c=h('div','card about-card');
  c.innerHTML=`
    <p>Praktickô je vzdelávacia aplikácia zameraná na rozvoj základných zručností potrebných v každodennom živote a práci.</p>
    <p>Prostredníctvom krátkych interaktívnych úloh a modelových situácií si môžete precvičovať matematickú a finančnú, čitateľskú, digitálnu, občiansku a prírodovednú gramotnosť, ako aj zručnosti osobnostného rozvoja.</p>
    <p>Aplikácia vám umožňuje učiť sa vlastným tempom, overiť si svoje vedomosti a opakovať si úlohy podľa vlastných potrieb.</p>`;
  s.appendChild(c);
  const attr=h('div','card about-attr');
  attr.innerHTML=`
    <div class="attr-row"><span class="k">Vyvíja:</span><span class="v">[Názov organizácie]</span></div>
    <div class="attr-row"><span class="k">Projekt:</span><span class="v">[Názov projektu]</span></div>
    <div class="attr-row"><span class="k">Podpora financovania:</span><span class="v">[Program alebo poskytovateľ podpory]</span></div>`;
  s.appendChild(attr);
  return s;
}

// =====================================================================
// MOCK PROFILE (demo only — no auth, fictional data)
// =====================================================================
const DEMO_PROFILE={
  name:'Pedro Novák',
  email:'pedro.novak@example.com',
  initials:'PN',
  modules:[
    {moduleId:'mat_praca', title:'Práca a peniaze', pct:60, status:'Prebieha'},
    {moduleId:'cit_praca', title:'Čítanie a porozumenie textu', pct:35, status:'Prebieha'},
    {moduleId:'dig_praca', title:'Digitálne zručnosti', pct:10, status:'Začaté'},
  ],
};
function renderProfile(){
  const s=h('div','screen');
  s.appendChild(topbar('Profil', ()=>go('home')));
  const head=h('div','card profile-head');
  head.innerHTML=`<div class="profile-avatar">${DEMO_PROFILE.initials}</div>
    <div class="profile-id"><h2 style="margin:0">${DEMO_PROFILE.name}</h2>
    <div class="faint">${DEMO_PROFILE.email}</div></div>`;
  s.appendChild(head);
  s.appendChild(h('p','faint demo-note','Ukážkový profil — slúži len na predstavenie aplikácie. Nevyžaduje sa registrácia ani prihlásenie.'));

  const avg=Math.round(DEMO_PROFILE.modules.reduce((a,m)=>a+m.pct,0)/DEMO_PROFILE.modules.length);
  s.appendChild(h('div','center',`<div class="stat-row" style="justify-content:space-between">
    <div class="stat"><div class="big">${DEMO_PROFILE.modules.length}</div><div class="lab">rozpracovaných</div></div>
    <div class="stat"><div class="big">${avg}%</div><div class="lab">priemerný postup</div></div></div>`));

  s.appendChild(h('h2',null,'Rozpracované tematické moduly'));
  DEMO_PROFILE.modules.forEach(m=>{
    const mod=MODULES[m.moduleId]; const ar=mod?areaById(mod.area):null;
    const c=h('div','card tap profile-mod');
    c.innerHTML=`<div class="c-ico" style="background:${ar?ar.soft:'var(--soft)'};color:${ar?ar.accent:'var(--primary)'}">${ar?icons[ar.icon]:icons.learn}</div>
      <div style="flex:1">
        <div class="pm-top"><strong>${m.title}</strong><span class="tag ${m.pct>=50?'ok':''}">${m.status}</span></div>
        <div class="pm-bar"><i style="width:${m.pct}%"></i></div>
        <div class="faint">${m.pct}% dokončené</div>
      </div>
      <div class="arrow" style="color:var(--primary)">${icons.arrow}</div>`;
    c.onclick=()=>{ if(mod) go('path',{moduleId:m.moduleId}); };
    s.appendChild(c);
  });
  return s;
}

// =====================================================================
// SHARED UI
// =====================================================================
function topbar(title, onBack){
  const t=h('div','topbar');
  const b=h('button','back'); b.innerHTML=icons.back; b.onclick=onBack;
  t.appendChild(b); t.appendChild(h('h2',null,title)); return t;
}
function renderNav(){
  const nav=h('div','bottomnav'); const inner=h('div','inner');
  const items=[
    {k:'home', label:'Domov', icon:'home', match:['home']},
    {k:'areas', label:'Učenie', icon:'learn', match:['areas','area','path','lesson']},
    {k:'training', label:'Tréning', icon:'train', match:['training']},
    {k:'progress', label:'Pokrok', icon:'progress', match:['progress']},
  ];
  items.forEach(it=>{
    const b=h('button','navbtn'+(it.match.includes(route.name)?' on':''));
    b.innerHTML=`${icons[it.icon]}<span>${it.label}</span>`;
    b.onclick=()=>go(it.k);
    inner.appendChild(b);
  });
  nav.appendChild(inner); return nav;
}
function toast(msg){
  const t=h('div',null,msg);
  t.style.cssText='position:fixed;bottom:90px;left:50%;transform:translateX(-50%);background:#1f262e;color:#fff;padding:11px 18px;border-radius:12px;font-size:.9rem;z-index:99;max-width:86%;box-shadow:0 6px 24px rgba(0,0,0,.25);animation:fade .2s';
  document.body.appendChild(t); setTimeout(()=>t.remove(),2600);
}
function confetti(n=16){
  const colors=['#147D77','#2A6FD6','#C2971E','#2E9E6B','#B5407E'];
  for(let i=0;i<n;i++){ const c=h('div','confetti');
    c.style.left=(10+Math.random()*80)+'%'; c.style.background=colors[i%colors.length];
    c.style.animationDelay=(Math.random()*0.3)+'s'; document.body.appendChild(c);
    setTimeout(()=>c.remove(),1700);
  }
}

// ---- boot ----
const st=S.getState();
if(st.introDone) go('home'); else go('intro',{},0);
