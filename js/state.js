// Local state + persistence (localStorage). No backend.
import { MODULES } from './data/content.js?v=5';

const KEY = 'zruc_progress_v1';
const DEFAULT = {
  introDone:false,
  placement:{},            // moduleId -> {done, score, total, outcome, recommendedUnit}
  completedLessons:{},     // lessonId -> true
  completedUnits:{},       // "moduleId:unitN" -> true
  current:null,            // {areaId, moduleId, unit, lessonId}
  training:[],             // recent sessions [{mode, correct, total, date}]
  badges:{},               // badgeId -> true
};

let state = load();

function load(){
  try{
    const raw = localStorage.getItem(KEY);
    if(raw) return Object.assign(JSON.parse(JSON.stringify(DEFAULT)), JSON.parse(raw));
  }catch(e){ console.warn('load failed', e); }
  return JSON.parse(JSON.stringify(DEFAULT));
}
export function save(){ try{ localStorage.setItem(KEY, JSON.stringify(state)); }catch(e){} }
export function getState(){ return state; }
export function resetState(){ state = JSON.parse(JSON.stringify(DEFAULT)); save(); }

export function setIntroDone(){ state.introDone = true; save(); }

export function recordPlacement(moduleId, result){
  state.placement[moduleId] = result; save();
}
export function getPlacement(moduleId){ return state.placement[moduleId] || null; }

export function isLessonDone(id){ return !!state.completedLessons[id]; }
export function markLessonDone(id){
  if(!state.completedLessons[id]){ state.completedLessons[id]=true; save(); }
}
const unitKey = (mId,n)=>`${mId}:${n}`;
export function isUnitDone(mId,n){ return !!state.completedUnits[unitKey(mId,n)]; }
export function markUnitDone(mId,n){ state.completedUnits[unitKey(mId,n)]=true; save(); }

export function setCurrent(cur){ state.current = cur; save(); }
export function addBadge(id){ if(!state.badges[id]){ state.badges[id]=true; save(); } }

export function addTraining(session){
  state.training.unshift(session);
  state.training = state.training.slice(0,5);
  save();
}

// ===== UNLOCK LOGIC (deterministic, per placement rules) =====
// Beginner  -> recommend Unit 1, normal progression (unit N unlocks after N-1 completed).
// Advanced  -> recommend Unit 3; U1 & U2 immediately AVAILABLE as OPTIONAL (not auto-completed);
//              U3 available; U4 after U3, U5 after U4.
// Skipped placement -> start U1, do NOT auto-unlock U3.
// Returns per-unit status for a module: 'locked' | 'available' | 'current' | 'completed'
// plus 'optional' flag for advanced U1/U2.
export function unitStatus(moduleId){
  const mod = MODULES[moduleId];
  const pl = state.placement[moduleId];
  const advanced = pl && pl.outcome === 'advanced';
  const out = {};
  mod.units.forEach(u=>{
    const n = u.n;
    const done = isUnitDone(moduleId, n);
    let available = false, optional = false;
    if(advanced){
      if(n===1 || n===2){ available = true; optional = true; }
      else if(n===3){ available = true; }
      else { available = isUnitDone(moduleId, n-1); } // U4 after U3, U5 after U4
    } else {
      // beginner / no placement: normal progression
      if(n===1) available = true;
      else available = isUnitDone(moduleId, n-1);
    }
    let status;
    if(done) status='completed';
    else if(available) status='available';
    else status='locked';
    out[n] = { status, optional, hasLessons:(u.lessons&&u.lessons.length>0) };
  });
  // mark the first non-completed available unit as "current" (recommended focus)
  const rec = (advanced ? 3 : 1);
  // prefer recommended unit if available & not done, else first available not-done
  let currentN = null;
  if(out[rec] && out[rec].status==='available') currentN = rec;
  if(currentN===null){
    for(const u of mod.units){ if(out[u.n].status==='available'){ currentN=u.n; break; } }
  }
  if(currentN!==null && out[currentN].status==='available') out[currentN].status='current';
  return { units: out, currentUnit: currentN, advanced, placed: !!pl };
}

// Is a specific lesson open? available if its unit is available/current/completed.
export function lessonOpen(moduleId, unitN){
  const st = unitStatus(moduleId).units[unitN];
  return st && (st.status==='available' || st.status==='current' || st.status==='completed');
}

// After finishing a lesson: if all lessons in its unit are done, mark unit complete.
// Returns {unitCompleted, unitN, nextUnitUnlocked}
export function completeLessonAndCheck(moduleId, lessonId){
  markLessonDone(lessonId);
  const mod = MODULES[moduleId];
  const unit = mod.units.find(u=>u.lessons.includes(lessonId));
  if(!unit) return { unitCompleted:false };
  const allDone = unit.lessons.every(l=>isLessonDone(l));
  let unitCompleted=false, nextUnlocked=false;
  if(allDone && !isUnitDone(moduleId, unit.n)){
    markUnitDone(moduleId, unit.n);
    addBadge(`${moduleId}:u${unit.n}`);
    unitCompleted=true;
    // check whether next unit becomes available now
    const after = unitStatus(moduleId).units[unit.n+1];
    nextUnlocked = after && after.status!=='locked';
  }
  return { unitCompleted, unitN:unit.n, nextUnlocked };
}
