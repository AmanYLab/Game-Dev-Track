// ---------- 1. DATA (edit these to change the game!) ----------
const DAYS = 14;
const DECAY = { 1: 0.5, 2: 2, 3: 7 };  // health lost per waiting hour, by severity
const NAMES = ["Alex", "Maria", "Sam", "Priya", "Jordan", "Chen", "Fatima", "Luis", "Amara", "Noah", "Zoe", "Omar"];
// sev: 1 minor, 2 urgent, 3 critical | hrs: treatment time | sup: supplies used
// vent: needs a ventilator | pay: what insurance pays when discharged
const CONDS = [
  { n: "Sprained ankle",      sev: 1, hrs: 3,  sup: 1, pay: 120 },
  { n: "Flu / dehydration",   sev: 1, hrs: 4,  sup: 1, pay: 150 },
  { n: "Broken arm",          sev: 2, hrs: 5,  sup: 2, pay: 300 },
  { n: "Asthma attack",       sev: 2, hrs: 4,  sup: 2, pay: 280 },
  { n: "Severe infection",    sev: 2, hrs: 8,  sup: 3, pay: 450 },
  { n: "Heart attack",        sev: 3, hrs: 8,  sup: 4, pay: 900 },
  { n: "Stroke",              sev: 3, hrs: 10, sup: 4, pay: 1000 },
  { n: "Respiratory failure", sev: 3, hrs: 10, sup: 3, pay: 1200, vent: true },
];
// Random events that can happen at the start of a day
const EVENTS = [
  () => { G.surge = 1.8; say("🤧 Flu outbreak! Many more patients today."); },
  () => { for (let i = 0; i < 6; i++) addPatient(Math.random() < 0.5 ? 3 : 2); say("🚗 Highway pileup! 6 injured patients arrive."); },
  () => { G.mult = 2; say("📉 Supply shortage: supplies cost double today."); },
  () => { if (G.nurses > 1) { G.nurses--; G.sick = 1; say("🤒 A nurse called in sick today."); } },
  () => { G.cash += 2000; say("🏛️ Community health grant: +$2,000."); },
];

// ---------- 2. SETUP ----------
let G, timer; // G holds the whole game state

function newGame() {
  G = {
    day: 1, hour: 7, cash: 6000, sup: 20, docs: 2, nurses: 3, beds: 4, vents: 1, rep: 70,
    queue: [], ward: [], pending: [], log: [], sick: 0, mult: 1, surge: 1,
    speed: 1, paused: false, over: false, nextId: 1, uninsDay: 0,
    st: { treated: 0, deaths: 0, transfers: 0, unins: 0, earned: 0 },
  };
  document.getElementById("overlay").innerHTML = "";
  say("Day 1 begins. Admit the sickest patients first!");
  startTimer();
}

function startTimer() {
  clearInterval(timer);
  timer = setInterval(() => { if (!G.paused && !G.over) tick(); }, 900 / G.speed);
}

function showIntro() {
  document.getElementById("overlay").innerHTML = `<div class="box">
    <h1>🏥 Hospital Manager</h1>
    <p>You run a community hospital for ${DAYS} days. One tick = one hour.</p>
    <p><b>Admit</b> patients from the waiting room into a bed. Each needs a free bed, a doctor slot (2 per doctor), and supplies. Critical (red) patients get worse fast. Minor (green) can wait.</p>
    <p>Insured patients pay the hospital. <b>Uninsured patients pay nothing</b>, but treating them earns community grants and trust. Hire staff, buy supplies, and expand, but salaries are due every morning.</p>
    <p><b>Win:</b> finish day ${DAYS} with reputation above 40 and without going bankrupt (below -$3,000).</p>
    <button onclick="newGame()">Start shift</button></div>`;
}

// ---------- 3. GAME LOOP ----------
function tick() {
  G.hour++;
  if (G.hour >= 24) {
    G.hour = 0; G.day++;
    if (G.day > DAYS) return end("done");
    newDay();
    if (G.over) return;
  }
  // deliveries
  G.pending.forEach((p) => p.t--);
  G.pending.filter((p) => p.t <= 0).forEach((p) => { G.sup += p.n; say(`📦 ${p.n} supplies arrived.`); });
  G.pending = G.pending.filter((p) => p.t > 0);
  arrivals();
  // waiting patients get worse
  G.queue.forEach((p) => { p.hp -= DECAY[p.c.sev]; });
  G.queue = G.queue.filter((p) => {
    if (p.hp > 0) return true;
    G.st.deaths++; G.rep -= 5;
    say(`💀 ${p.name} (${p.c.n}) died waiting. Reputation -5.`);
    return false;
  });
  // treatment (slower if too few nurses: each nurse covers 3 patients)
  const speed = G.nurses * 3 >= G.ward.length ? 1 : 0.5;
  G.ward = G.ward.filter((p) => {
    p.prog += speed;
    if (p.prog < p.c.hrs) return true;
    discharge(p);
    return false;
  });
  if (G.rep <= 0) end("rep");
  render();
}

function newDay() {
  if (G.sick) { G.nurses++; G.sick = 0; }
  G.surge = 1; G.mult = 1;
  const costs = G.docs * 400 + G.nurses * 180 + G.beds * 50;
  const grant = G.uninsDay * 60;
  G.cash -= costs; G.cash += grant;
  say(`📅 Day ${G.day}: paid $${costs} for staff and upkeep.` + (grant ? ` Community grant for uninsured care: +$${grant}.` : ""));
  G.uninsDay = 0;
  if (G.cash < -3000) return end("bankrupt");
  if (Math.random() < 0.4) EVENTS[Math.floor(Math.random() * EVENTS.length)]();
}

function arrivals() {
  const rush = G.hour >= 8 && G.hour <= 20 ? 1.5 : 0.6; // busier in the daytime
  const rate = (0.35 + G.day * 0.04) * rush * G.surge;  // grows each day
  const n = Math.floor(rate) + (Math.random() < rate % 1 ? 1 : 0);
  for (let i = 0; i < n; i++) addPatient();
}

function addPatient(forceSev) {
  const r = Math.random();
  const sev = forceSev || (r < 0.5 ? 1 : r < 0.83 ? 2 : 3);
  const opts = CONDS.filter((c) => c.sev === sev);
  G.queue.push({
    id: G.nextId++, c: opts[Math.floor(Math.random() * opts.length)],
    name: NAMES[Math.floor(Math.random() * NAMES.length)], age: 5 + Math.floor(Math.random() * 80),
    hp: 100, prog: 0, insured: Math.random() < 0.6,
  });
}

function discharge(p) {
  G.st.treated++; G.rep = Math.min(100, G.rep + p.c.sev);
  if (p.insured) { G.cash += p.c.pay; G.st.earned += p.c.pay; say(`✅ ${p.name} recovered. +$${p.c.pay}`); }
  else { G.uninsDay++; G.st.unins++; say(`✅ ${p.name} (uninsured) recovered. No payment.`); }
}

function end(reason) {
  G.over = true; clearInterval(timer);
  const win = reason === "done" && G.rep >= 40;
  const stars = 1 + (G.rep >= 60) + (G.st.deaths <= 5) + (G.cash >= 0) + (G.st.unins >= 10);
  const why = { done: win ? "You kept the doors open for 14 days!" : "You finished, but trust in your hospital collapsed.", bankrupt: "The hospital ran out of money.", rep: "The community lost all trust in the hospital." }[reason];
  document.getElementById("overlay").innerHTML = `<div class="box">
    <h1>${win ? "🎉 Shift complete" : "Game over"}</h1><p>${why}</p>
    <p>${"⭐".repeat(stars)}<br>Treated: ${G.st.treated} (${G.st.unins} uninsured) | Lives lost: ${G.st.deaths} | Transfers: ${G.st.transfers}<br>Cash: $${G.cash} | Reputation: ${Math.round(G.rep)}</p>
    <p><b>Why it matters:</b> Real hospitals make these tradeoffs every day: staffing shortages, supply delays, crowded waiting rooms, and patients who cannot pay. Funding and staffing decisions decide who gets care in time.</p>
    <button onclick="newGame()">Play again</button></div>`;
}

// ---------- 4. PLAYER ACTIONS ----------
function admit(id) {
  const p = G.queue.find((x) => x.id === id); if (!p) return;
  const c = p.c;
  if (G.beds - G.ward.length < 1) return say("❌ No free bed.");
  if (G.docs * 2 - G.ward.length < 1) return say("❌ No doctor slot free. Hire a doctor.");
  if (G.sup < c.sup) return say(`❌ Need ${c.sup} supplies. Order more.`);
  if (c.vent && G.vents - G.ward.filter((w) => w.c.vent).length < 1) return say("❌ No free ventilator.");
  G.sup -= c.sup;
  G.queue = G.queue.filter((x) => x !== p);
  G.ward.push(p);
  say(`🛏️ Admitted ${p.name} (${c.n}).`);
}

function transfer(id) {
  const p = G.queue.find((x) => x.id === id); if (!p) return;
  G.queue = G.queue.filter((x) => x !== p);
  G.st.transfers++; G.rep -= 3;
  say(`🚑 ${p.name} sent to another hospital. Reputation -3.`);
}

function spend(cost, fn, msg) {
  if (G.cash < cost) return say("❌ Not enough cash.");
  G.cash -= cost; fn(); say(msg);
}
function hireDoctor() { spend(1000, () => G.docs++, "👩‍⚕️ Hired a doctor (-$1000, salary $400/day)."); }
function hireNurse()  { spend(400, () => G.nurses++, "🧑‍⚕️ Hired a nurse (-$400, salary $180/day)."); }
function buyBeds()    { spend(1500, () => G.beds += 2, "🛏️ Added 2 beds (-$1500)."); }
function buyVent()    { spend(2500, () => G.vents++, "🫁 Bought a ventilator (-$2500)."); }
function orderSupplies() {
  const cost = 200 * G.mult;
  spend(cost, () => G.pending.push({ n: 10, t: 4 }), `📦 Ordered 10 supplies (-$${cost}), arriving in 4 hours.`);
}
function togglePause() { G.paused = !G.paused; render(); }
function setSpeed(s) { G.speed = s; startTimer(); render(); }

function say(msg) {
  G.log.unshift(msg);
  if (G.log.length > 40) G.log.pop();
  render();
}

// ---------- 5. DRAWING (turns game state into HTML) ----------
const $ = (id) => document.getElementById(id);

function render() {
  const hh = String(G.hour).padStart(2, "0");
  $("top").innerHTML = `
    <span class="chip"><b>Day ${G.day}/${DAYS}</b> ${hh}:00</span>
    <span class="chip">💰 <b>$${G.cash}</b></span>
    <span class="chip">⭐ Reputation <b>${Math.round(G.rep)}</b></span>
    <span class="chip">📦 Supplies <b>${G.sup}</b></span>
    <span class="chip">🛏️ <b>${G.ward.length}/${G.beds}</b></span>
    <span class="chip">👩‍⚕️ Doctors <b>${G.docs}</b></span>
    <span class="chip">🧑‍⚕️ Nurses <b>${G.nurses}</b></span>
    <span class="chip">🫁 <b>${G.vents}</b></span>
    <button class="alt" onclick="togglePause()">${G.paused ? "▶ Resume" : "⏸ Pause"}</button>
    <button class="alt" onclick="setSpeed(1)">1x</button>
    <button class="alt" onclick="setSpeed(2)">2x</button>
    <button class="alt" onclick="setSpeed(4)">4x</button>`;

  $("queue").innerHTML = G.queue.length ? G.queue.map((p) => `
    <div class="card s${p.c.sev}">
      <b>${p.name}, ${p.age}</b> ${p.insured ? "💳" : "🚫 uninsured"}
      <small>${p.c.n} | ${["", "Minor", "Urgent", "CRITICAL"][p.c.sev]} | needs ${p.c.sup} supplies${p.c.vent ? " + ventilator" : ""}</small>
      <div class="bar hp"><i style="width:${Math.max(0, p.hp)}%"></i></div>
      <button onclick="admit(${p.id})">Admit</button>
      <button class="alt" onclick="transfer(${p.id})">Transfer out</button>
    </div>`).join("") : "<p>No one waiting. 🎉</p>";

  $("wards").innerHTML = (G.ward.map((p) => `
    <div class="card s${p.c.sev}">
      <b>${p.name}</b> <small>${p.c.n}${p.c.vent ? " 🫁" : ""}</small>
      <div class="bar"><i style="width:${(p.prog / p.c.hrs) * 100}%"></i></div>
    </div>`).join("") || "<p>All beds empty.</p>")
    + (G.nurses * 3 < G.ward.length ? "<p>⚠️ Not enough nurses: treatment is half speed.</p>" : "");

  $("manage").innerHTML = `
    <button onclick="hireDoctor()">Hire doctor $1000</button>
    <button onclick="hireNurse()">Hire nurse $400</button>
    <button onclick="buyBeds()">Add 2 beds $1500</button>
    <button onclick="buyVent()">Buy ventilator $2500</button>
    <button onclick="orderSupplies()">Order 10 supplies $${200 * G.mult}</button>
    <small>Incoming supply orders: ${G.pending.length}</small>`;

  $("log").innerHTML = G.log.map((l) => `<div>${l}</div>`).join("");
}

showIntro();