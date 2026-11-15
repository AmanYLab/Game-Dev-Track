// ============================================================
// HOSPITAL MANAGER (simple version)
// Run a hospital for 7 days. Every tick = 1 hour.
// Admit patients into beds and pay your staff every morning.
// Insured patients pay you. Uninsured patients don't, but the law
// (EMTALA) says you must treat the sickest patients first anyway.
// Sections: 1 Data | 2 Setup | 3 Game loop | 4 Player actions | 5 Drawing
// ============================================================

// ---------- 1. DATA (edit these to change the game!) ----------
const DAYS = 7;
const BED_COST_PER_DAY = 400;   // staff for each bed, paid every morning
const NEW_BED_PRICE = 1500;
const UNINSURED_RATE = 0.15;    // chance a patient has no insurance
const NAMES = ["Alex", "Maria", "Sam", "Priya", "Jordan", "Chen", "Fatima", "Luis", "Amara", "Noah", "Zoe", "Omar"];
const SEVERITY = ["", "Minor", "Urgent", "CRITICAL"];
const HEALTH_LOST_PER_HOUR = { 1: 1, 2: 3, 3: 8 };  // how fast waiting patients get worse

// sev: 1 minor, 2 urgent, 3 critical | hrs: hours in a bed | pay: what insurance pays
const CONDITIONS = [
  { name: "Sprained ankle", sev: 1, hrs: 3,  pay: 150 },
  { name: "Flu",            sev: 1, hrs: 4,  pay: 150 },
  { name: "Broken arm",     sev: 2, hrs: 5,  pay: 350 },
  { name: "Asthma attack",  sev: 2, hrs: 4,  pay: 300 },
  { name: "Heart attack",   sev: 3, hrs: 8,  pay: 900 },
  { name: "Stroke",         sev: 3, hrs: 10, pay: 1000 },
];

// ---------- 2. SETUP ----------
let G;      // the whole game state
let timer;

function newGame() {
  G = {
    day: 1, hour: 7, cash: 5000, beds: 2, rep: 70,
    waiting: [], ward: [], log: [], nextId: 1, paused: false, over: false,
    stats: { treated: 0, uninsuredTreated: 0, deaths: 0, skips: 0 },
  };
  document.getElementById("overlay").innerHTML = "";
  say("Day 1 begins. Admit the sickest patients first!");
  clearInterval(timer);
  timer = setInterval(() => { if (!G.paused && !G.over) tick(); }, 1000);
}

function showIntro() {
  document.getElementById("overlay").innerHTML = `<div class="box">
    <h1>🏥 Hospital Manager</h1>
    <p>Run a hospital for ${DAYS} days. Click <b>Admit</b> to put a waiting patient in a free bed.</p>
    <p><span class="red">Critical</span> patients get worse fast and can die while waiting.</p>
    <p>💳 Insured patients pay when they recover. 🚫 Uninsured patients pay nothing. Every morning you pay $${BED_COST_PER_DAY} per bed for staff.</p>
    <p>⚖️ <b>The law (EMTALA):</b> ERs must treat the sickest patients first, whether or not they can pay. Skip a sicker uninsured patient to treat a paying one and your reputation drops.</p>
    <p><b>Win:</b> finish day ${DAYS} with reputation 40+ and without going bankrupt.</p>
    <button onclick="newGame()">Start</button> <a class="back" href="../">All games</a></div>`;
}

// ---------- 3. GAME LOOP (runs once per hour) ----------
function tick() {
  G.hour++;
  if (G.hour === 24) { G.hour = 0; G.day++; }
  if (G.hour === 7 && G.day > 1) {           // every morning at 7:00
    if (G.day > DAYS) return end();
    payStaff();
    if (G.over) return;
  }

  newArrivals();

  // waiting patients get worse
  G.waiting.forEach((p) => { p.health -= HEALTH_LOST_PER_HOUR[p.c.sev]; });
  G.waiting.filter((p) => p.health <= 0).forEach((p) => {
    G.stats.deaths++; G.rep -= 10;
    say(`💀 ${p.name} (${p.c.name}) died waiting. Reputation -10.`);
  });
  G.waiting = G.waiting.filter((p) => p.health > 0);

  // patients in beds get treated
  G.ward.forEach((p) => p.progress++);
  G.ward.filter((p) => p.progress >= p.c.hrs).forEach(discharge);
  G.ward = G.ward.filter((p) => p.progress < p.c.hrs);

  if (G.rep <= 0) return end();
  render();
}

function payStaff() {
  const bill = G.beds * BED_COST_PER_DAY;
  G.cash -= bill;
  say(`📅 Day ${G.day}: paid $${bill} for staff (${G.beds} beds).`);
  if (G.cash < -2000) end();
}

function newArrivals() {
  const daytime = G.hour >= 8 && G.hour <= 20;
  const chance = (0.25 + G.day * 0.03) * (daytime ? 1.5 : 0.6);   // a bit busier each day
  if (Math.random() < chance) addPatient();
}

function addPatient() {
  const r = Math.random();
  const sev = r < 0.5 ? 1 : r < 0.83 ? 2 : 3;
  const options = CONDITIONS.filter((c) => c.sev === sev);
  G.waiting.push({
    id: G.nextId++,
    c: options[Math.floor(Math.random() * options.length)],
    name: NAMES[Math.floor(Math.random() * NAMES.length)],
    insured: Math.random() >= UNINSURED_RATE,
    health: 100, progress: 0,
  });
}

function discharge(p) {
  G.stats.treated++;
  G.rep = Math.min(100, G.rep + p.c.sev);
  if (p.insured) {
    G.cash += p.c.pay;
    say(`✅ ${p.name} recovered. Insurance paid +$${p.c.pay}.`);
  } else {
    G.stats.uninsuredTreated++;
    say(`✅ ${p.name} (uninsured) recovered. No payment.`);
  }
}

function end() {
  G.over = true; clearInterval(timer);
  const win = G.day > DAYS && G.rep >= 40;
  const reason = win ? "You kept the doors open and the community trusts you!"
    : G.cash < -2000 ? "The hospital went bankrupt."
    : G.rep <= 0 ? "The community lost all trust in your hospital."
    : "You made it to the end, but trust in your hospital is too low.";
  document.getElementById("overlay").innerHTML = `<div class="box">
    <h1>${win ? "🎉 You did it!" : "Game over"}</h1><p>${reason}</p>
    <p>Treated: ${G.stats.treated} (${G.stats.uninsuredTreated} uninsured) | Lives lost: ${G.stats.deaths} | Sicker patients skipped: ${G.stats.skips}<br>
       Cash: $${G.cash} | Reputation: ${Math.round(G.rep)}</p>
    <p><b>Why it matters:</b> Real hospitals juggle staff costs, crowded waiting rooms, and patients who can't pay, and the law still requires them to treat the sickest first.</p>
    <ul>
      <li>Congress passed EMTALA in 1986 to stop "patient dumping": turning away or transferring emergency patients because they couldn't pay. <small>(Congressional Research Service)</small></li>
      <li>About 8% of Americans (27 million people) had no health insurance in 2024. <small>(U.S. Census Bureau)</small></li>
      <li>U.S. hospitals provided $41.6 billion of uncompensated care in 2019 alone. <small>(American Hospital Association)</small></li>
    </ul>
    <button onclick="newGame()">Play again</button> <a class="back" href="../">All games</a></div>`;
}

// ---------- 4. PLAYER ACTIONS ----------
function admit(id) {
  const p = G.waiting.find((x) => x.id === id);
  if (!p || G.over) return;
  if (G.ward.length >= G.beds) return say("❌ No free bed. Add a bed or wait.");

  // EMTALA: treat by medical need, not by who can pay
  const sicker = G.waiting.find((x) => !x.insured && x.c.sev > p.c.sev);
  if (p.insured && sicker) {
    G.rep -= 12; G.stats.skips++;
    say(`⚖️ You treated ${p.name} (insured) before ${sicker.name} (uninsured, sicker). ERs must treat the sickest first. Reputation -12.`);
  }

  G.waiting = G.waiting.filter((x) => x !== p);
  G.ward.push(p);
  say(`🛏️ Admitted ${p.name} (${p.c.name}).`);
  if (G.rep <= 0) end();
}

function addBed() {
  if (G.over) return;
  if (G.cash < NEW_BED_PRICE) return say("❌ Not enough cash.");
  G.cash -= NEW_BED_PRICE; G.beds++;
  say(`🛏️ Added a bed (-$${NEW_BED_PRICE}, +$${BED_COST_PER_DAY}/day staff).`);
}

function togglePause() { G.paused = !G.paused; render(); }

function say(msg) {
  G.log.unshift(msg);
  if (G.log.length > 30) G.log.pop();
  render();
}

// ---------- 5. DRAWING (turns the game state into HTML) ----------
// Buttons use onpointerdown (not onclick) because the screen redraws every hour,
// and a redraw in the middle of a click would swallow it.
const $ = (id) => document.getElementById(id);

function render() {
  $("top").innerHTML = `
    <span class="chip"><b>Day ${G.day}/${DAYS}</b> ${String(G.hour).padStart(2, "0")}:00</span>
    <span class="chip">💰 <b>$${G.cash}</b></span>
    <span class="chip">⭐ Reputation <b>${Math.round(G.rep)}</b></span>
    <span class="chip">🛏️ Beds <b>${G.ward.length}/${G.beds}</b></span>
    <button class="alt" onpointerdown="togglePause()">${G.paused ? "▶ Resume" : "⏸ Pause"}</button>`;

  $("queue").innerHTML = G.waiting.length ? G.waiting.map((p) => `
    <div class="card s${p.c.sev}">
      <b>${p.name}</b> ${p.insured ? "💳 insured" : "🚫 uninsured"}
      <small>${p.c.name} | ${SEVERITY[p.c.sev]}</small>
      <div class="bar hp"><i style="width:${Math.max(0, p.health)}%"></i></div>
      <button onpointerdown="admit(${p.id})">Admit</button>
    </div>`).join("") : "<p>No one waiting. 🎉</p>";

  $("wards").innerHTML = G.ward.map((p) => `
    <div class="card s${p.c.sev}">
      <b>${p.name}</b> <small>${p.c.name}</small>
      <div class="bar"><i style="width:${(p.progress / p.c.hrs) * 100}%"></i></div>
    </div>`).join("") || "<p>All beds empty.</p>";

  $("manage").innerHTML = `
    <button onpointerdown="addBed()">Add a bed ($${NEW_BED_PRICE}, +$${BED_COST_PER_DAY}/day)</button>`;

  $("log").innerHTML = G.log.map((line) => `<div>${line}</div>`).join("");
}

showIntro();
