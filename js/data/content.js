// ===== MOCK DATA (kept separate from UI) =====
// Content adapted & simplified from the provided Slovak question bank
// (Banka_Uloh_Chatbot.xlsx). Only a small, representative selection is used.
// "level" (L1/L2) is INTERNAL SKKR metadata — never shown to users.

export const AREAS = [
  { id:'mat', name:'Matematická a finančná gramotnosť', short:'Mat. a financie', icon:'math',   accent:'#2A6FD6', soft:'#e7f0fc', reference:true },
  { id:'cit', name:'Čitateľská gramotnosť',             short:'Čítanie',        icon:'read',   accent:'#C7622E', soft:'#fbeee5' },
  { id:'dig', name:'Digitálna gramotnosť',              short:'Digitálne',      icon:'digital',accent:'#6E54B5', soft:'#efebf9' },
  { id:'obc', name:'Občianska gramotnosť',              short:'Občianske',      icon:'civic',  accent:'#B5407E', soft:'#fbe8f1' },
  { id:'pri', name:'Prírodovedná gramotnosť',           short:'Príroda',        icon:'science',accent:'#2E9E6B', soft:'#e5f4ec' },
  { id:'osob',name:'Osobnostný rozvoj',                 short:'Osobný rozvoj',  icon:'self',   accent:'#C2971E', soft:'#f8f1dc' },
];
export const areaById = id => AREAS.find(a=>a.id===id);

// Unit titles (5 units, internal level mapping). SKKR not shown to users.
const UNIT_META = [
  { n:1, title:'Základy',            level:'L1' },
  { n:2, title:'Praktické základy',  level:'L1' },
  { n:3, title:'Prechod ďalej',      level:'L1' }, // transition L1<->L2
  { n:4, title:'Pokročilé',          level:'L2' },
  { n:5, title:'Zložité situácie',   level:'L2' },
];

// ---- MODULES ----
// Reference module = fully built. Others = reduced demonstration (U1 functional, U2-U5 locked preview).
export const MODULES = {
  mat_praca: {
    id:'mat_praca', area:'mat', reference:true,
    title:'Práca a peniaze',
    desc:'Výplatná páska, rozpočet a praktické počítanie v práci.',
    units:[
      { n:1, title:'Základy', level:'L1', lessons:['mat_1','mat_2'] },
      { n:2, title:'Praktické základy', level:'L1', lessons:['mat_3','mat_4'] },
      { n:3, title:'Prechod ďalej', level:'L1', lessons:['mat_5','mat_6'] },
      { n:4, title:'Pokročilé', level:'L2', lessons:['mat_7','mat_8'] },
      { n:5, title:'Zložité situácie', level:'L2', lessons:['mat_9','mat_10'] },
    ],
  },
  cit_praca: {
    id:'cit_praca', area:'cit',
    title:'Čítame s porozumením',
    desc:'Porozumenie pracovnému inzerátu a dokumentom.',
    units:[
      { n:1, title:'Základy', level:'L1', lessons:['cit_1','cit_2'] },
      { n:2, title:'Praktické základy', level:'L1', lessons:[] },
      { n:3, title:'Prechod ďalej', level:'L1', lessons:[] },
      { n:4, title:'Pokročilé', level:'L2', lessons:[] },
      { n:5, title:'Zložité situácie', level:'L2', lessons:[] },
    ],
  },
  dig_praca: {
    id:'dig_praca', area:'dig',
    title:'Práca s mobilom',
    desc:'Bezpečné používanie telefónu a appiek pri práci.',
    units:[
      { n:1, title:'Základy', level:'L1', lessons:['dig_1','dig_2'] },
      { n:2, title:'Praktické základy', level:'L1', lessons:[] },
      { n:3, title:'Prechod ďalej', level:'L1', lessons:[] },
      { n:4, title:'Pokročilé', level:'L2', lessons:[] },
      { n:5, title:'Zložité situácie', level:'L2', lessons:[] },
    ],
  },
  obc_praca: {
    id:'obc_praca', area:'obc',
    title:'Práca a spoločnosť',
    desc:'Dôveryhodné zdroje a povolania okolo nás.',
    units:[
      { n:1, title:'Základy', level:'L1', lessons:['obc_1','obc_2'] },
      { n:2, title:'Praktické základy', level:'L1', lessons:[] },
      { n:3, title:'Prechod ďalej', level:'L1', lessons:[] },
      { n:4, title:'Pokročilé', level:'L2', lessons:[] },
      { n:5, title:'Zložité situácie', level:'L2', lessons:[] },
    ],
  },
  pri_praca: {
    id:'pri_praca', area:'pri',
    title:'Práca a bezpečnosť',
    desc:'Bezpečnosť pri práci a šetrné správanie.',
    units:[
      { n:1, title:'Základy', level:'L1', lessons:['pri_1','pri_2'] },
      { n:2, title:'Praktické základy', level:'L1', lessons:[] },
      { n:3, title:'Prechod ďalej', level:'L1', lessons:[] },
      { n:4, title:'Pokročilé', level:'L2', lessons:[] },
      { n:5, title:'Zložité situácie', level:'L2', lessons:[] },
    ],
  },
  osob_praca: {
    id:'osob_praca', area:'osob',
    title:'Práca a ja',
    desc:'Komunikácia a príprava na pracovné situácie.',
    units:[
      { n:1, title:'Základy', level:'L1', lessons:['osob_1','osob_2'] },
      { n:2, title:'Praktické základy', level:'L1', lessons:[] },
      { n:3, title:'Prechod ďalej', level:'L1', lessons:[] },
      { n:4, title:'Pokročilé', level:'L2', lessons:[] },
      { n:5, title:'Zložité situácie', level:'L2', lessons:[] },
    ],
  },
};
export const moduleByArea = areaId => Object.values(MODULES).find(m=>m.area===areaId);

// ---- EXERCISES ----
// type: mcq | fill | visual | document | calc | match | order
export const EXERCISES = {
  // ===== REFERENCE MODULE: mat / Práca a peniaze =====
  mat_1: {
    id:'mat_1', area:'mat', module:'mat_praca', unit:1, level:'L1', skill:'Identifikovať údaj na doklade',
    type:'document', title:'Výplatná páska',
    instruction:'Nájdite na výplatnej páske riadok s čistou mzdou a klepnite naň.',
    doc:{ title:'Výplatná páska – jún', rows:[
      { k:'Hrubá mzda', v:'950 €' },
      { k:'Dane a odvody', v:'170 €' },
      { k:'Čistá mzda', v:'780 €' },
      { k:'Dátum výplaty', v:'10. 7.' },
    ]},
    correct:2,
    explanation:'Čistá mzda (780 €) je suma, ktorú reálne dostanete na účet.',
    hint:'Hľadajte slovo „čistá“ — to je suma po odpočítaní daní.',
  },
  mat_2: {
    id:'mat_2', area:'mat', module:'mat_praca', unit:1, level:'L1', skill:'Vybrať správnu ponuku',
    type:'mcq', title:'Správny inzerát',
    instruction:'Hľadáte prácu pomocného pracovníka do skladu. Ktorý inzerát je ten správny?',
    options:[
      'Hľadáme pomocného pracovníka do skladu, 750 €/mesiac',
      'Predám 2-izbový byt v centre mesta',
      'Kurz angličtiny pre začiatočníkov',
    ],
    correct:0,
    explanation:'Len prvý inzerát ponúka prácu pomocného pracovníka do skladu.',
    hint:'Všímajte si, čo inzerát ponúka — prácu, byt alebo kurz?',
  },
  mat_3: {
    id:'mat_3', area:'mat', module:'mat_praca', unit:2, level:'L1', skill:'Sčítať výdavky',
    type:'calc', title:'Mesačné výdavky',
    instruction:'Spočítajte, koľko eur spolu tvoria tieto tri mesačné výdavky.',
    context:'Nájom: 400 €\nElektrina: 60 €\nPotraviny: 220 €',
    unitLabel:'€', answer:680, tolerance:0,
    explanation:'400 + 60 + 220 = 680 €.',
    hint:'Spočítajte postupne: 400 + 60 = 460, potom pridajte 220.',
  },
  mat_4: {
    id:'mat_4', area:'mat', module:'mat_praca', unit:2, level:'L1', skill:'Vybrať správny nástroj',
    type:'visual', title:'Nástroj na počítanie',
    instruction:'Ktorá ikona slúži na počítanie peňazí?',
    choices:[
      { icon:'calculator', label:'Kalkulačka' },
      { icon:'alarm', label:'Budík' },
      { icon:'camera', label:'Fotoaparát' },
      { icon:'leaf', label:'Príroda' },
    ],
    correct:0,
    explanation:'Na počítanie používame kalkulačku.',
    hint:'Hľadajte nástroj s číslami a tlačidlami.',
  },
  mat_5: {
    id:'mat_5', area:'mat', module:'mat_praca', unit:3, level:'L1', skill:'Doplniť správny pojem',
    type:'fill', title:'Doplňte vetu',
    instruction:'Doplňte do vety správne slovo.',
    sentence:['Suma, ktorú dostanem na účet, sa volá', '__', 'mzda.'],
    bank:['čistá','hrubá','minimálna'],
    correct:'čistá',
    explanation:'Suma na účet = čistá mzda (po daniach a odvodoch).',
    hint:'Je to suma „očistená“ od daní a odvodov.',
  },
  mat_6: {
    id:'mat_6', area:'mat', module:'mat_praca', unit:3, level:'L2', skill:'Vypočítať týždenný zárobok',
    type:'calc', title:'Týždenný zárobok',
    instruction:'Vypočítajte, koľko zarobíte za týždeň.',
    context:'Pracujete 40 hodín týždenne.\nHodinová mzda: 6 € / hodina.',
    unitLabel:'€', answer:240, tolerance:0,
    explanation:'40 hodín × 6 € = 240 €.',
    hint:'Vynásobte počet hodín hodinovou mzdou: 40 × 6.',
  },
  mat_7: {
    id:'mat_7', area:'mat', module:'mat_praca', unit:4, level:'L2', skill:'Vypočítať čistú mzdu',
    type:'calc', title:'Z hrubej na čistú',
    instruction:'Koľko eur je čistá mzda?',
    context:'Hrubá mzda: 950 €\nDane a odvody: 170 €',
    unitLabel:'€', answer:780, tolerance:0,
    explanation:'950 − 170 = 780 €. Čistá mzda je hrubá mzda mínus dane a odvody.',
    hint:'Od hrubej mzdy odpočítajte dane a odvody.',
  },
  mat_8: {
    id:'mat_8', area:'mat', module:'mat_praca', unit:4, level:'L2', skill:'Vysvetliť vzťah údajov',
    type:'mcq', title:'Prečo je suma nižšia?',
    instruction:'Prečo je suma na účte nižšia ako hrubá mzda?',
    options:[
      'Pretože zamestnávateľ urobil chybu',
      'Pretože sa platia dane a odvody',
      'Pretože si banka berie polovicu',
    ],
    correct:1,
    explanation:'Z hrubej mzdy sa odpočítavajú dane a odvody, preto je čistá mzda nižšia.',
    hint:'Čo sa odpočítava z každej výplaty podľa zákona?',
  },
  mat_9: {
    id:'mat_9', area:'mat', module:'mat_praca', unit:5, level:'L2', skill:'Vypočítať rezervu',
    type:'calc', title:'Mesačná rezerva',
    instruction:'Koľko eur zostane rodine na konci mesiaca?',
    context:'Príjmy spolu: 900 €\nVýdavky spolu: 760 €',
    unitLabel:'€', answer:140, tolerance:0,
    explanation:'900 − 760 = 140 €. Táto suma je mesačná rezerva (úspora).',
    hint:'Od príjmov odpočítajte výdavky.',
  },
  mat_10: {
    id:'mat_10', area:'mat', module:'mat_praca', unit:5, level:'L2', skill:'Zoradiť kroky rozpočtu',
    type:'order', title:'Zostavenie rozpočtu',
    instruction:'Zoraďte kroky, ako si správne zostaviť mesačný rozpočet.',
    items:[
      { id:'a', text:'Spíšem si všetky príjmy' },
      { id:'b', text:'Spíšem si všetky výdavky' },
      { id:'c', text:'Odčítam výdavky od príjmov' },
      { id:'d', text:'Rozhodnem, koľko ušetrím' },
    ],
    correct:['a','b','c','d'],
    explanation:'Najprv príjmy a výdavky, potom rozdiel a nakoniec úspora.',
    hint:'Najskôr treba vedieť, koľko máte a koľko miniete.',
  },

  // ===== cit / Čítanie v práci =====
  cit_1: {
    id:'cit_1', area:'cit', module:'cit_praca', unit:1, level:'L1', skill:'Nájsť kontaktný údaj',
    type:'document', title:'Pracovný inzerát',
    instruction:'Nájdite v inzeráte telefónne číslo a klepnite naň.',
    doc:{ title:'Inzerát: Skladník', rows:[
      { k:'Pozícia', v:'Skladník' },
      { k:'Telefón', v:'0905 123 456' },
      { k:'Plat', v:'750 €' },
      { k:'Nástup', v:'ihneď' },
    ]},
    correct:1,
    explanation:'Telefónne číslo je 0905 123 456 — naň zavoláte.',
    hint:'Telefónne číslo sa začína číslicami 09…',
  },
  cit_2: {
    id:'cit_2', area:'cit', module:'cit_praca', unit:1, level:'L1', skill:'Posúdiť dôveryhodnosť',
    type:'mcq', title:'Dôveryhodný inzerát',
    instruction:'Podľa čoho spoznáte dôveryhodný pracovný inzerát?',
    options:[
      'Uvádza názov firmy a kontakt na konkrétnu osobu',
      'Sľubuje veľmi vysoký plat za nič',
      'Žiada od vás peniaze vopred',
    ],
    correct:0,
    explanation:'Dôveryhodný inzerát uvádza firmu a kontakt. Platba vopred je varovný signál.',
    hint:'Seriózny zamestnávateľ od vás nepýta peniaze vopred.',
  },

  // ===== dig / Práca s mobilom =====
  dig_1: {
    id:'dig_1', area:'dig', module:'dig_praca', unit:1, level:'L1', skill:'Rozpoznať ikonu',
    type:'visual', title:'Priložiť životopis',
    instruction:'K e-mailu chcete priložiť životopis. Na ktorú ikonu klepnete?',
    choices:[
      { icon:'clip', label:'Spinka' },
      { icon:'trash', label:'Kôš' },
      { icon:'star', label:'Hviezda' },
      { icon:'camera', label:'Fotoaparát' },
    ],
    correct:0,
    explanation:'Ikona spinky slúži na priloženie súboru k e-mailu.',
    hint:'Príloha sa označuje ikonou spinky (kancelárskej sponky).',
  },
  dig_2: {
    id:'dig_2', area:'dig', module:'dig_praca', unit:1, level:'L1', skill:'Rozpoznať podvod',
    type:'mcq', title:'Podozrivá SMS',
    instruction:'Prišla vám SMS: „Ste prijatý! Zaplaťte 15 € za pracovné oblečenie.“ Čo urobíte?',
    options:[
      'Nezaplatím — je to podozrivá ponuka (podvod)',
      'Hneď zaplatím 15 €',
      'Pošlem im aj svoje heslo',
    ],
    correct:0,
    explanation:'Seriózny zamestnávateľ nepýta platbu vopred. Je to podvod.',
    hint:'Nikdy neplaťte a neposielajte heslá na základe SMS.',
  },

  // ===== obc / Práca a spoločnosť =====
  obc_1: {
    id:'obc_1', area:'obc', module:'obc_praca', unit:1, level:'L1', skill:'Vybrať dôveryhodný zdroj',
    type:'mcq', title:'Kde hľadať prácu',
    instruction:'Kde je najbezpečnejšie hľadať pracovnú ponuku?',
    options:[
      'Na oficiálnom portáli práce alebo úrade práce',
      'V reťazovom e-maile od neznámeho',
      'Na letáku bez názvu firmy',
    ],
    correct:0,
    explanation:'Oficiálne portály a úrad práce sú dôveryhodné zdroje.',
    hint:'Dôveryhodný zdroj má jasného prevádzkovateľa.',
  },
  obc_2: {
    id:'obc_2', area:'obc', module:'obc_praca', unit:1, level:'L1', skill:'Priradiť rolu k činnosti',
    type:'match', title:'Povolanie a úloha',
    instruction:'Priraďte povolanie k správnej pracovnej úlohe.',
    left:[ {id:'kuchar',text:'Kuchár'}, {id:'murar',text:'Murár'}, {id:'vodic',text:'Vodič'} ],
    right:[ {id:'vari',text:'varí jedlo'}, {id:'stavia',text:'stavia múry'}, {id:'soferuje',text:'šoféruje auto'} ],
    correct:{ kuchar:'vari', murar:'stavia', vodic:'soferuje' },
    explanation:'Kuchár varí, murár stavia a vodič šoféruje.',
    hint:'Premyslite si, čo každé povolanie bežne robí.',
  },

  // ===== pri / Práca a bezpečnosť =====
  pri_1: {
    id:'pri_1', area:'pri', module:'pri_praca', unit:1, level:'L1', skill:'Zodpovedné správanie',
    type:'visual', title:'Šetrná doprava',
    instruction:'Ktorý spôsob dopravy do práce je najšetrnejší k prírode?',
    choices:[
      { icon:'bike', label:'Bicykel' },
      { icon:'car', label:'Auto' },
      { icon:'plane', label:'Lietadlo' },
    ],
    correct:0,
    explanation:'Bicykel neznečisťuje ovzdušie — je najšetrnejší k prírode.',
    hint:'Ktorý z nich nespaľuje palivo?',
  },
  pri_2: {
    id:'pri_2', area:'pri', module:'pri_praca', unit:1, level:'L1', skill:'Vysvetliť pravidlo',
    type:'mcq', title:'Ochranná prilba',
    instruction:'Prečo je dôležité nosiť v práci ochrannú prilbu?',
    options:[
      'Chráni hlavu pred úrazom pri páde predmetu',
      'Aby ste vyzerali lepšie',
      'Nie je to dôležité',
    ],
    correct:0,
    explanation:'Prilba chráni hlavu pred vážnym úrazom.',
    hint:'Čo sa môže stať, ak na stavbe spadne predmet?',
  },

  // ===== osob / Práca a ja (illustrative mock content) =====
  osob_1: {
    id:'osob_1', area:'osob', module:'osob_praca', unit:1, level:'L1', skill:'Asertívna reakcia',
    type:'mcq', title:'Sťažnosť zákazníka',
    instruction:'Zákazník sa v práci sťažuje. Ako reagujete najslušnejšie a najúčinnejšie?',
    options:[
      'Vypočujem ho, uznám problém a slušne navrhnem riešenie',
      'Nahnevám sa a zakričím na neho',
      'Budem ho ignorovať',
    ],
    correct:0,
    explanation:'Asertívna reakcia: vypočuť, uznať a navrhnúť riešenie.',
    hint:'Najlepšie je zostať pokojný a ponúknuť riešenie.',
  },
  osob_2: {
    id:'osob_2', area:'osob', module:'osob_praca', unit:1, level:'L1', skill:'Zoradiť postup',
    type:'order', title:'Príprava na pohovor',
    instruction:'Zoraďte kroky, ako sa pripraviť na pracovný pohovor.',
    items:[
      { id:'a', text:'Zistím si informácie o firme' },
      { id:'b', text:'Pripravím si životopis' },
      { id:'c', text:'Vyberiem si vhodné oblečenie' },
      { id:'d', text:'Prídem načas na pohovor' },
    ],
    correct:['a','b','c','d'],
    explanation:'Najprv príprava (firma, životopis, oblečenie) a potom samotný pohovor.',
    hint:'Čo robíte skôr — zháňate informácie, alebo už sedíte na pohovore?',
  },
};

// ---- PLACEMENT (per module). Uses same templates, different variations. ----
// Deterministic scoring; threshold configurable. score >= threshold => advanced.
export const PLACEMENT = {
  mat_praca: {
    module:'mat_praca', threshold:3,
    questions:[
      { id:'mp1', level:'L1', type:'mcq', title:'Pojem', instruction:'Čo znamená „hrubá mzda“?',
        options:['Suma pred odpočítaním daní a odvodov','Peniaze, ktoré máte v peňaženke','Peniaze na dovolenku'],
        correct:0, explanation:'Hrubá mzda je suma pred zdanením.' },
      { id:'mp2', level:'L1', type:'document', title:'Výplatná páska',
        instruction:'Klepnite na riadok s hrubou mzdou.',
        doc:{ title:'Výplatná páska', rows:[
          {k:'Hrubá mzda', v:'900 €'}, {k:'Dane a odvody', v:'160 €'},
          {k:'Čistá mzda', v:'740 €'}, {k:'Dovolenka', v:'5 dní'} ]},
        correct:0, explanation:'Hrubá mzda je 900 € — suma pred zdanením.' },
      { id:'mp3', level:'L1', type:'calc', title:'Súčet', instruction:'Spočítajte dva výdavky.',
        context:'Nájom: 300 €\nInternet: 150 €', unitLabel:'€', answer:450, tolerance:0,
        explanation:'300 + 150 = 450 €.' },
      { id:'mp4', level:'L2', type:'calc', title:'Zárobok', instruction:'Koľko zarobíte?',
        context:'35 hodín × 8 € / hodina', unitLabel:'€', answer:280, tolerance:0,
        explanation:'35 × 8 = 280 €.' },
      { id:'mp5', level:'L2', type:'mcq', title:'Rozpočet',
        instruction:'Rodina má príjem 800 € a výdavky 950 €. Čo by mala urobiť?',
        options:['Znížiť výdavky alebo nájsť ďalší príjem','Míňať ešte viac','Nerobiť nič'],
        correct:0, explanation:'Keď výdavky prevyšujú príjem, treba šetriť alebo zvýšiť príjem.' },
    ],
  },
};

// ---- TRAINING MODES (reference module). Percentages = intended L1/L2 composition. ----
export const TRAINING_MODES = [
  { id:'zaklady',  title:'Zopakovať základy', desc:'Prevažne jednoduchšie úlohy na precvičenie základov.', l1:0.7, l2:0.3, mix:'70/30' },
  { id:'vyvazeny', title:'Vyvážený tréning',  desc:'Rovnomerná zmes jednoduchších a náročnejších úloh.',   l1:0.5, l2:0.5, mix:'50/50' },
  { id:'vyzva',    title:'Výzva',             desc:'Prevažne náročnejšie úlohy pre tých, čo chcú viac.',    l1:0.3, l2:0.7, mix:'30/70' },
];
export const TRAINING_SIZE = 6;
export const TRAINING_MODULE = 'mat_praca';
