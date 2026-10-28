// Reusable exercise interaction components + deterministic checking.
// Each builder returns a controller: { el, hasAnswer(), check()->bool, showResult(correct), reset() }
import { icons } from './icons.js?v=5';

function h(tag, cls, html){ const e=document.createElement(tag); if(cls)e.className=cls; if(html!=null)e.innerHTML=html; return e; }

// ---------- Multiple choice & visual ----------
function buildChoice(ex, visual){
  const wrap = h('div', visual ? 'opt-grid' : '');
  let selected = null; let locked=false;
  const opts = visual ? ex.choices : ex.options.map(t=>({label:t}));
  const nodes = opts.map((o,i)=>{
    const b = h('button','opt');
    b.type='button';
    if(visual){ b.innerHTML = `<span class="ico">${icons[o.icon]||''}</span><span>${o.label}</span>`; }
    else { b.innerHTML = `<span>${o.label}</span><span class="mark"></span>`; }
    b.addEventListener('click',()=>{
      if(locked) return;
      selected=i;
      nodes.forEach(n=>n.classList.remove('sel'));
      b.classList.add('sel');
      wrap.dispatchEvent(new Event('answerchange',{bubbles:true}));
    });
    wrap.appendChild(b); return b;
  });
  return {
    el:wrap,
    hasAnswer:()=>selected!==null,
    check:()=>selected===ex.correct,
    showResult(_c, reveal=true){ locked=true;
      nodes.forEach((n,i)=>{
        if(i===ex.correct && reveal) n.classList.add('correct');
        else if(i===selected) n.classList.add('wrong');
      });
    },
    reset(){ locked=false; selected=null; nodes.forEach(n=>n.classList.remove('sel','correct','wrong')); }
  };
}

// ---------- Document (click a row) ----------
function buildDocument(ex){
  const wrap = h('div');
  if(ex.context) wrap.appendChild(h('div','ex-context', ex.context.replace(/\n/g,'<br>')));
  const doc = h('div','doc');
  doc.appendChild(h('div','doc-title', ex.doc.title));
  let selected=null, locked=false;
  const rows = ex.doc.rows.map((r,i)=>{
    const row = h('div','doc-row');
    row.innerHTML = `<span class="k">${r.k}</span><span class="v">${r.v}</span>`;
    row.addEventListener('click',()=>{
      if(locked) return;
      selected=i; rows.forEach(x=>x.classList.remove('sel')); row.classList.add('sel');
      wrap.dispatchEvent(new Event('answerchange',{bubbles:true}));
    });
    doc.appendChild(row); return row;
  });
  wrap.appendChild(doc);
  return {
    el:wrap,
    hasAnswer:()=>selected!==null,
    check:()=>selected===ex.correct,
    showResult(_c, reveal=true){ locked=true;
      rows.forEach((n,i)=>{ if(i===ex.correct && reveal)n.classList.add('correct'); else if(i===selected)n.classList.add('wrong'); });
    },
    reset(){ locked=false; selected=null; rows.forEach(n=>n.classList.remove('sel','correct','wrong')); }
  };
}

// ---------- Fill in the blank (tap word into blank) ----------
function buildFill(ex){
  const wrap = h('div');
  const sent = h('div','fill-sentence');
  let filled=null, locked=false;
  // sentence is array; element '__' is the blank
  const blank = h('span','blank','____');
  sent.innerHTML='';
  ex.sentence.forEach(part=>{
    if(part==='__'){ sent.appendChild(blank); }
    else { sent.appendChild(document.createTextNode(' '+part+' ')); }
  });
  blank.addEventListener('click',()=>{ if(locked||!filled) return; // tap to clear
    filled=null; blank.textContent='____'; blank.classList.remove('filled');
    bank.forEach(b=>b.classList.remove('used'));
    wrap.dispatchEvent(new Event('answerchange',{bubbles:true}));
  });
  wrap.appendChild(sent);
  const bankWrap = h('div','word-bank');
  const bank = ex.bank.map(w=>{
    const b = h('button','word', w); b.type='button';
    b.addEventListener('click',()=>{
      if(locked) return;
      filled=w; blank.textContent=w; blank.classList.add('filled');
      bank.forEach(x=>x.classList.remove('used')); b.classList.add('used');
      wrap.dispatchEvent(new Event('answerchange',{bubbles:true}));
    });
    bankWrap.appendChild(b); return b;
  });
  wrap.appendChild(h('p','faint','Klepnite na slovo a doplní sa do medzery. Klepnutím na medzeru ho vymažete.'));
  wrap.appendChild(bankWrap);
  return {
    el:wrap,
    hasAnswer:()=>filled!==null,
    check:()=>filled===ex.correct,
    showResult(_c, reveal=true){ locked=true;
      blank.classList.add(filled===ex.correct?'filled':'');
      blank.style.borderColor = filled===ex.correct ? 'var(--ok)' : '#cf4b4b';
      blank.style.background = filled===ex.correct ? 'var(--ok-soft)' : '#fbeaea';
      if(filled!==ex.correct && reveal){ blank.textContent = ex.correct; }
    },
    reset(){ locked=false; filled=null; blank.textContent='____'; blank.classList.remove('filled');
      blank.style.borderColor=''; blank.style.background=''; bank.forEach(b=>b.classList.remove('used')); }
  };
}

// ---------- Calculation (numeric input) ----------
function buildCalc(ex){
  const wrap = h('div');
  if(ex.context) wrap.appendChild(h('div','ex-context', ex.context.replace(/\n/g,'<br>')));
  const row = h('div','calc-in');
  const input = h('input'); input.type='number'; input.inputMode='decimal'; input.placeholder='Zadajte číslo';
  const unit = h('span','unit', ex.unitLabel||'');
  row.appendChild(input); row.appendChild(unit); wrap.appendChild(row);
  let locked=false;
  input.addEventListener('input',()=>wrap.dispatchEvent(new Event('answerchange',{bubbles:true})));
  return {
    el:wrap,
    hasAnswer:()=>input.value.trim()!=='',
    check:()=>{ const v=parseFloat(input.value.replace(',','.')); return !isNaN(v) && Math.abs(v-ex.answer)<=(ex.tolerance||0); },
    showResult(c){ locked=true; input.disabled=true;
      input.style.borderColor = c ? 'var(--ok)' : '#cf4b4b';
      input.style.background = c ? 'var(--ok-soft)' : '#fbeaea';
    },
    reset(){ locked=false; input.disabled=false; input.value=''; input.style.borderColor=''; input.style.background=''; }
  };
}

// ---------- Matching (tap left then right) ----------
function buildMatch(ex){
  const wrap = h('div');
  const cols = h('div','match-cols');
  const colL = h('div','match-col'); const colR = h('div','match-col');
  let selLeft=null, locked=false;
  const pairs={}; // leftId -> rightId
  const leftNodes={}, rightNodes={};
  // shuffle right deterministically? keep stable for determinism; present as given
  ex.left.forEach(l=>{
    const n=h('button','match-item', l.text); n.type='button';
    n.addEventListener('click',()=>{ if(locked) return;
      selLeft=l.id; Object.values(leftNodes).forEach(x=>x.classList.remove('sel'));
      if(!n.classList.contains('done')) n.classList.add('sel');
    });
    leftNodes[l.id]=n; colL.appendChild(n);
  });
  ex.right.forEach(r=>{
    const n=h('button','match-item', r.text); n.type='button';
    n.addEventListener('click',()=>{ if(locked||!selLeft) return;
      // remove any previous pairing to this right or from this left
      for(const k in pairs){ if(pairs[k]===r.id) { delete pairs[k]; leftNodes[k].classList.remove('done'); } }
      pairs[selLeft]=r.id;
      leftNodes[selLeft].classList.remove('sel'); leftNodes[selLeft].classList.add('done');
      renderPairs();
      selLeft=null;
      wrap.dispatchEvent(new Event('answerchange',{bubbles:true}));
    });
    rightNodes[r.id]=n; colR.appendChild(n);
  });
  cols.appendChild(colL); cols.appendChild(colR); wrap.appendChild(cols);
  wrap.appendChild(h('p','faint','Klepnite na položku vľavo a potom na zodpovedajúcu vpravo.'));
  const pairBox = h('div','match-pairs'); wrap.appendChild(pairBox);
  function labelOf(side,id){ const arr=side==='l'?ex.left:ex.right; return (arr.find(x=>x.id===id)||{}).text||''; }
  function renderPairs(){ pairBox.innerHTML='';
    Object.keys(pairs).forEach(lid=>{
      pairBox.appendChild(h('div','pair-chip', `<strong>${labelOf('l',lid)}</strong> → ${labelOf('r',pairs[lid])}`));
    });
  }
  return {
    el:wrap,
    hasAnswer:()=>Object.keys(pairs).length===ex.left.length,
    check:()=>ex.left.every(l=>pairs[l.id]===ex.correct[l.id]),
    showResult(_c, reveal=true){ locked=true;
      ex.left.forEach(l=>{ const ok=pairs[l.id]===ex.correct[l.id];
        if(ok && !reveal) return; // don't reveal which pairings are correct
        leftNodes[l.id].classList.add(ok?'done':''); 
        leftNodes[l.id].style.borderColor = ok?'var(--ok)':'#cf4b4b';
        leftNodes[l.id].style.background = ok?'var(--ok-soft)':'#fbeaea';
      });
    },
    reset(){ locked=false; selLeft=null; for(const k in pairs) delete pairs[k];
      Object.values(leftNodes).forEach(n=>{n.classList.remove('sel','done'); n.style.borderColor='';n.style.background='';});
      pairBox.innerHTML=''; }
  };
}

// ---------- Ordering (move up/down) ----------
function buildOrder(ex){
  const wrap = h('div');
  const list = h('div','order-list');
  // deterministic non-trivial starting order: reverse of correct
  let order = ex.items.map(i=>i.id);
  order = applyStart(ex, order);
  let locked=false;
  function textOf(id){ return (ex.items.find(i=>i.id===id)||{}).text||''; }
  function render(){
    list.innerHTML='';
    order.forEach((id,idx)=>{
      const item=h('div','order-item');
      item.innerHTML = `<span class="num">${idx+1}</span><span class="txt">${textOf(id)}</span>`;
      const mv=h('div','mv');
      const up=h('button',null, icons.back.replace('viewBox="0 0 24 24"','viewBox="0 0 24 24" style="transform:rotate(90deg)"'));
      const dn=h('button',null, icons.back.replace('viewBox="0 0 24 24"','viewBox="0 0 24 24" style="transform:rotate(-90deg)"'));
      up.type='button'; dn.type='button';
      up.disabled = idx===0 || locked; dn.disabled = idx===order.length-1 || locked;
      up.addEventListener('click',()=>{ if(locked)return; [order[idx-1],order[idx]]=[order[idx],order[idx-1]]; render(); });
      dn.addEventListener('click',()=>{ if(locked)return; [order[idx+1],order[idx]]=[order[idx],order[idx+1]]; render(); });
      mv.appendChild(up); mv.appendChild(dn); item.appendChild(mv);
      list.appendChild(item);
    });
  }
  render();
  wrap.appendChild(list);
  wrap.appendChild(h('p','faint','Pomocou šípok posúvajte kroky do správneho poradia.'));
  return {
    el:wrap,
    hasAnswer:()=>true,
    check:()=>order.every((id,i)=>id===ex.correct[i]),
    showResult(_c, reveal=true){ locked=true;
      const paint=()=>Array.from(list.children).forEach((item,i)=>{
        const ok = order[i]===ex.correct[i];
        if(ok && !reveal){ item.style.borderColor=''; item.style.background=''; return; }
        item.style.borderColor = ok?'var(--ok)':'#cf4b4b';
        item.style.background = ok?'var(--ok-soft)':'#fbeaea';
      });
      paint();
      render(); // disable buttons
      paint();
    },
    reset(){ locked=false; order=applyStart(ex, ex.items.map(i=>i.id)); render(); }
  };
}
function applyStart(ex, ids){
  // start from a shuffled-but-deterministic order different from correct
  const start = [...ids].reverse();
  if(start.every((id,i)=>id===ex.correct[i])){ // if reverse equals correct, rotate
    start.push(start.shift());
  }
  return start;
}

const BUILDERS = { mcq:ex=>buildChoice(ex,false), visual:ex=>buildChoice(ex,true),
  document:buildDocument, fill:buildFill, calc:buildCalc, match:buildMatch, order:buildOrder };

export function buildExercise(ex){
  const b = BUILDERS[ex.type];
  if(!b){ const d=h('div',null,'<p>Neznámy typ úlohy.</p>'); return {el:d,hasAnswer:()=>false,check:()=>false,showResult(){},reset(){}}; }
  return b(ex);
}
export const typeLabel = { mcq:'Výber odpovede', visual:'Výber obrázka', document:'Práca s dokumentom',
  fill:'Doplnenie slova', calc:'Výpočet', match:'Priraďovanie', order:'Zoraďovanie' };
