// ============================================================
// HOSPITAL MANAGER (simple version)
// Run a hospital for 7 days. Every tick = 1 hour.
// Admit patients into beds, hire doctors and nurses, and pay salaries every morning.
// Insured patients pay you. Uninsured patients don't, but the law
// (EMTALA) says you must treat the sickest patients first anyway.
// Sections: 1 Data | 2 Setup | 3 Game loop | 4 Player actions | 5 Drawing
// ============================================================
 
// ---------- 1. DATA (edit these to change the game!) ----------
const DAYS = 7;
// Staff: each DOCTOR can treat 2 patients at once (no free doctor = can't admit).
//        each NURSE can care for 3 patients (too few nurses = treatment at half speed).
const DOCTOR = { hire: 800, salary: 500, patients: 2 };   // hire = one-time cost, salary = per day
const NURSE  = { hire: 300, salary: 200, patients: 3 };
const BED    = { buy: 1000, upkeep: 100 };
const UNINSURED_RATE = 0.15;    // chance a patient has no insurance
 
// Difficulty: patients = how many arrive (x normal), costs = prices & salaries (x normal)
const DIFFICULTY = {
  easy:   { label: "Easy",   cash: 5000, patients: 0.75, costs: 0.75 },
  normal: { label: "Normal", cash: 4000, patients: 1.0,  costs: 1.0  },
  hard:   { label: "Hard",   cash: 3500, patients: 1.25, costs: 1.25 },
};
// Why uninsured patients have no insurance (shown on their card, to make them real people)
const UNINSURED_REASONS = [
  "between jobs", "works part-time, no benefits", "can't afford the monthly premium",
  "lost Medicaid coverage", "self-employed, no plan", "just moved, not signed up yet",
];
 
// "Did you know?" facts that pop up the FIRST time something happens in the game
const LESSONS = {
  uninsured: "💡 About 8% of Americans (27 million people) have no health insurance. For Hispanic adults it's 23%. (U.S. Census Bureau, 2024)",
  skip:      "💡 Before 1986, some hospitals turned away or transferred patients who couldn't pay (\"patient dumping\"). EMTALA made that illegal. (Congressional Research Service)",
  death:     "💡 When ERs are crowded and understaffed, sick patients wait longer, and waiting can be deadly. That's why staffing decisions matter.",
  nurses:    "💡 Nurse staffing directly affects patient care. Too few nurses means each patient gets less attention and recovers slower.",
  broke:     "💡 Hospitals that see many uninsured patients often struggle financially. U.S. hospitals gave $41.6 billion of unpaid care in 2019. (American Hospital Association)",
};
 
// Patients per hour ramp up each day: day 1 = START, day 7 = START + 6 * RAMP (never above MAX)
const ARRIVALS = { start: 0.30, ramp: 0.05, max: 0.85 };
const NAMES = ["Alex", "Maria", "Sam", "Priya", "Jordan", "Chen", "Fatima", "Luis", "Amara", "Noah", "Zoe", "Omar"];
const SEVERITY = ["", "Minor", "Urgent", "CRITICAL"];
const HEALTH_LOST_PER_HOUR = { 1: 2, 2: 5, 3: 12 };  // how fast waiting patients get worse
 
// sev: 1 minor, 2 urgent, 3 critical | hrs: hours in a bed | pay: what insurance pays
const CONDITIONS = [
  { name: "Sprained ankle", sev: 1, hrs: 3,  pay: 100 },
  { name: "Flu",            sev: 1, hrs: 4,  pay: 100 },
  { name: "Broken arm",     sev: 2, hrs: 5,  pay: 250 },
  { name: "Asthma attack",  sev: 2, hrs: 4,  pay: 200 },
  { name: "Heart attack",   sev: 3, hrs: 8,  pay: 600 },
  { name: "Stroke",         sev: 3, hrs: 10, pay: 700 },
];
 
// ---------- 2. SETUP ----------
let G;      // the whole game state
let timer;
 
function newGame(level) {
  const d = DIFFICULTY[level] || DIFFICULTY.normal;
  G = {
    diff: d, day: 1, hour: 7, cash: d.cash, beds: 3, doctors: 1, nurses: 1, rep: 70,
    waiting: [], ward: [], log: [], nextId: 1, paused: false, over: false,
    stats: { treated: 0, uninsuredTreated: 0, deaths: 0, skips: 0, freeCare: 0 }, seen: {},
  };
  document.getElementById("overlay").innerHTML = "";
  say(`Day 1 begins (${d.label}). Admit the sickest patients first!`);
  clearInterval(timer);
  timer = setInterval(() => { if (!G.paused && !G.over) tick(); }, 1000);
}
 
// Price after difficulty, rounded to the nearest $10
function price(amount) { return Math.round(amount * G.diff.costs / 10) * 10; }
 
function showIntro() {
  document.getElementById("overlay").innerHTML = `<div class="box">
    <h1>🏥 Hospital Manager</h1>
    <p><i>Every real hospital faces the same question: how do you pay the bills while still caring for everyone who comes through the door, including people who can't pay?</i></p>
    <p>Run a hospital for ${DAYS} days. Click <b>Admit</b> to put a waiting patient in a free bed.</p>
    <p>👩‍⚕️ Each <b>doctor</b> can treat ${DOCTOR.patients} patients at once. 🧑‍⚕️ Each <b>nurse</b> can care for ${NURSE.patients}. Too few nurses and treatment slows to half speed.</p>
    <p><span class="red">Critical</span> patients get worse fast and can die while waiting.</p>
    <p>💳 Insured patients pay when they recover. 🚫 Uninsured patients pay nothing. Every morning you pay salaries for doctors, nurses, and beds. Hire too many and you go broke!</p>
    <p>⚖️ <b>The law (EMTALA):</b> ERs must treat the sickest patients first, whether or not they can pay. Skip a sicker uninsured patient to treat a paying one and your reputation drops.</p>
    <p><b>Win:</b> make it to the end of day ${DAYS} with reputation 50+ and without going bankrupt.</p>
    <p><b>Choose a difficulty:</b></p>
    <div class="levels">
      <button onclick="newGame('easy')">😊 Easy<small>Fewer patients, cheaper staff</small></button>
      <button onclick="newGame('normal')">🙂 Normal<small>The standard shift</small></button>
      <button onclick="newGame('hard')">😰 Hard<small>More patients, pricier staff</small></button>
    </div>
    <a class="back" href="../">All games</a></div>`;
}
 
// ---------- 3. GAME LOOP (runs once per hour) ----------
function tick() {
  G.hour++;
  if (G.hour === 24) {                       // midnight: next day
    G.hour = 0; G.day++;
    if (G.day > DAYS) return end();          // game ends at the end of the last day
  }
  if (G.hour === 7) {                        // every morning at 7:00
    payStaff();
    if (G.over) return;
  }
 
  newArrivals();
 
  // waiting patients get worse
  G.waiting.forEach((p) => { p.health -= HEALTH_LOST_PER_HOUR[p.c.sev]; });
  G.waiting.filter((p) => p.health <= 0).forEach((p) => {
    G.stats.deaths++; G.rep -= 15;
    say(`💀 ${p.name} (${p.c.name}) died waiting. Reputation -15.`);
    lesson("death");
  });
  G.waiting = G.waiting.filter((p) => p.health > 0);
 
  // patients in beds get treated
  if (!enoughNurses()) lesson("nurses");
  G.ward.forEach((p) => { p.progress += enoughNurses() ? 1 : 0.5; });
  G.ward.filter((p) => p.progress >= p.c.hrs).forEach(discharge);
  G.ward = G.ward.filter((p) => p.progress < p.c.hrs);
 
  if (G.rep <= 0) return end();
  render();
}
 
// Show a lesson only the first time it happens
function lesson(key) {
  if (G.seen[key]) return;
  G.seen[key] = true;
  G.tip = LESSONS[key];          // stays visible in the "Did you know?" box
  say(LESSONS[key], "lesson");
}
 
function doctorsFull() { return G.ward.length >= G.doctors * DOCTOR.patients; }
function enoughNurses() { return G.nurses * NURSE.patients >= G.ward.length; }
function dailyBill() { return price(G.doctors * DOCTOR.salary + G.nurses * NURSE.salary + G.beds * BED.upkeep); }
 
function payStaff() {
  const bill = dailyBill();
  G.cash -= bill;
  say(`📅 Day ${G.day}: paid $${bill} in salaries and upkeep.`);
  if (G.cash < 0) lesson("broke");
  if (G.cash < -2000) end();
}
 
function newArrivals() {
  const daytime = G.hour >= 8 && G.hour <= 20;
  const perHour = Math.min(ARRIVALS.max, ARRIVALS.start + (G.day - 1) * ARRIVALS.ramp);  // ramps up each day
  const chance = perHour * G.diff.patients * (daytime ? 1.4 : 0.5);   // busier during the day
  if (Math.random() < chance) addPatient();   // at most one new patient per hour
}
 
function addPatient() {
  const r = Math.random();
  const sev = r < 0.5 ? 1 : r < 0.83 ? 2 : 3;
  const options = CONDITIONS.filter((c) => c.sev === sev);
  const insured = Math.random() >= UNINSURED_RATE;
  G.waiting.push({
    id: G.nextId++,
    c: options[Math.floor(Math.random() * options.length)],
    name: NAMES[Math.floor(Math.random() * NAMES.length)],
    insured,
    why: insured ? "" : UNINSURED_REASONS[Math.floor(Math.random() * UNINSURED_REASONS.length)],
    health: 100, progress: 0,
  });
  if (!insured) lesson("uninsured");
}
 
function discharge(p) {
  G.stats.treated++;
  if (p.insured) {
    G.cash += p.c.pay;
    say(`✅ ${p.name} recovered. Insurance paid +$${p.c.pay}.`);
  } else {
    G.stats.uninsuredTreated++;
    G.stats.freeCare += p.c.pay;
    G.rep = Math.min(100, G.rep + 2);
    say(`✅ ${p.name} (uninsured) recovered. No payment, but community trust +2.`);
  }
}
 
function end() {
  G.over = true; clearInterval(timer);
  const win = G.day > DAYS && G.rep >= 50;
  const reason = win ? "You kept the doors open and the community trusts you!"
    : G.cash < -2000 ? "The hospital went bankrupt."
    : G.rep <= 0 ? "The community lost all trust in your hospital."
    : "You made it to the end, but trust in your hospital is too low.";
  document.getElementById("overlay").innerHTML = `<div class="box">
    <h1>${win ? "🎉 You did it!" : "Game over"}</h1><p>${reason} <small>(${G.diff.label})</small></p>
    <p>Treated: ${G.stats.treated} (${G.stats.uninsuredTreated} uninsured) | Lives lost: ${G.stats.deaths} | Sicker patients skipped: ${G.stats.skips}<br>
       Cash: $${G.cash} | Reputation: ${Math.round(G.rep)}</p>
    <h3>Your shift, in real-world terms</h3>
    <ul>
      <li>💸 You gave <b>$${G.stats.freeCare}</b> of free care to ${G.stats.uninsuredTreated} uninsured patients. Real hospitals call this <b>uncompensated care</b>, and they have to cover it somehow.</li>
      ${G.stats.skips ? `<li>⚖️ You put a paying patient ahead of a sicker uninsured one <b>${G.stats.skips} time${G.stats.skips > 1 ? "s" : ""}</b>. In a real ER, that breaks federal law (EMTALA).</li>` : `<li>⚖️ You never skipped a sicker patient because they couldn't pay. That's exactly what the law requires.</li>`}
      ${G.stats.deaths ? `<li>💀 <b>${G.stats.deaths}</b> patient${G.stats.deaths > 1 ? "s" : ""} died waiting. Understaffing and crowding cause real harm.</li>` : ""}
    </ul>
    <p><b>Why it matters:</b> Hospitals juggle staff costs, crowded waiting rooms, and patients who can't pay, and the law still requires them to treat the sickest first. Who pays for that care is one of the biggest debates in American health care.</p>
    <h3>Real facts</h3>
    <ul>
      <li>Congress passed EMTALA in 1986 to stop "patient dumping": turning away or transferring emergency patients because they couldn't pay. <small>(Congressional Research Service)</small></li>
      <li>About 8% of Americans (27 million people) had no health insurance in 2024. <small>(U.S. Census Bureau)</small></li>
      <li>U.S. hospitals provided $41.6 billion of uncompensated care in 2019 alone. <small>(American Hospital Association)</small></li>
    </ul>
    <button onclick="showIntro()">Play again</button> <a class="back" href="../">All games</a></div>`;
}
 
// ---------- 4. PLAYER ACTIONS ----------
function admit(id) {
  const p = G.waiting.find((x) => x.id === id);
  if (!p || G.over) return;
  if (G.ward.length >= G.beds) return say("❌ No free bed. Add a bed or wait.");
  if (doctorsFull()) return say("❌ All doctors are busy. Hire a doctor or wait.");
 
  // EMTALA: treat by medical need, not by who can pay
  const sicker = G.waiting.find((x) => !x.insured && x.c.sev > p.c.sev);
  if (p.insured && sicker) {
    G.rep -= 15; G.stats.skips++;
    say(`⚖️ You treated ${p.name} (insured) before ${sicker.name} (uninsured, sicker). ERs must treat the sickest first. Reputation -15.`);
    lesson("skip");
  }
 
  G.waiting = G.waiting.filter((x) => x !== p);
  G.ward.push(p);
  say(`🛏️ Admitted ${p.name} (${p.c.name}).`);
  if (G.rep <= 0) end();
}
 
function buy(cost, action, message) {
  if (G.over) return;
  if (G.cash < cost) return say("❌ Not enough cash.");
  G.cash -= cost; action(); say(message);
}
function hireDoctor() { buy(price(DOCTOR.hire), () => G.doctors++, `👩‍⚕️ Hired a doctor (-$${price(DOCTOR.hire)}, salary $${price(DOCTOR.salary)}/day).`); }
function hireNurse()  { buy(price(NURSE.hire),  () => G.nurses++,  `🧑‍⚕️ Hired a nurse (-$${price(NURSE.hire)}, salary $${price(NURSE.salary)}/day).`); }
function addBed()     { buy(price(BED.buy),     () => G.beds++,    `🛏️ Added a bed (-$${price(BED.buy)}, upkeep $${price(BED.upkeep)}/day).`); }
 
function togglePause() { G.paused = !G.paused; render(); }
 
function say(msg, type = "") {
  G.log.unshift({ msg, type });
  if (G.log.length > 30) G.log.pop();
  render();
}
 
// ---------- 5. DRAWING (turns the game state into HTML) ----------
// Buttons use onpointerdown (not onclick) because the screen redraws every hour,
// and a redraw in the middle of a click would swallow it.
const $ = (id) => document.getElementById(id);
 
function render() {
  $("top").innerHTML = `
    <span class="chip"><b>Day ${G.day}/${DAYS}</b> ${String(G.hour).padStart(2, "0")}:00 · ${G.diff.label}</span>
    <span class="chip">💰 <b>$${G.cash}</b></span>
    <span class="chip">⭐ Reputation <b>${Math.round(G.rep)}</b></span>
    <span class="chip">🛏️ Beds <b>${G.ward.length}/${G.beds}</b></span>
    <span class="chip ${doctorsFull() ? "full" : ""}">👩‍⚕️ Doctors <b>${G.doctors}</b> (${G.ward.length}/${G.doctors * DOCTOR.patients} patients)</span>
    <span class="chip ${enoughNurses() ? "" : "full"}">🧑‍⚕️ Nurses <b>${G.nurses}</b> (${G.ward.length}/${G.nurses * NURSE.patients} patients)</span>
    <button class="alt" onpointerdown="togglePause()">${G.paused ? "▶ Resume" : "⏸ Pause"}</button>`;
 
  $("queue").innerHTML = G.waiting.length ? G.waiting.map((p) => `
    <div class="card s${p.c.sev}">
      <b>${p.name}</b> ${p.insured ? "💳 insured" : `🚫 uninsured <i>(${p.why})</i>`}
      <small>${p.c.name} | ${SEVERITY[p.c.sev]}</small>
      <div class="bar hp"><i style="width:${Math.max(0, p.health)}%"></i></div>
      <button onpointerdown="admit(${p.id})">Admit</button>
    </div>`).join("") : "<p>No one waiting. 🎉</p>";
 
  $("wards").innerHTML = G.ward.map((p) => `
    <div class="card s${p.c.sev}">
      <b>${p.name}</b> <small>${p.c.name}</small>
      <div class="bar"><i style="width:${(p.progress / p.c.hrs) * 100}%"></i></div>
    </div>`).join("") || "<p>All beds empty.</p>";
  if (doctorsFull() && G.ward.length < G.beds && G.waiting.length) {
    $("wards").innerHTML += `<p class='red'>👩‍⚕️ All doctors are busy! You have a free bed, but no doctor to treat another patient. Hire a doctor to use it.</p>`;
  }
  if (!enoughNurses()) $("wards").innerHTML += "<p class='red'>⚠️ Not enough nurses: treatment is at half speed!</p>";
 
  $("manage").innerHTML = `
    <button onpointerdown="hireDoctor()">Hire doctor $${price(DOCTOR.hire)} (+$${price(DOCTOR.salary)}/day)</button>
    <button onpointerdown="hireNurse()">Hire nurse $${price(NURSE.hire)} (+$${price(NURSE.salary)}/day)</button>
    <button onpointerdown="addBed()">Add a bed $${price(BED.buy)} (+$${price(BED.upkeep)}/day)</button>
    <small>Tomorrow morning's bill: $${dailyBill()}</small>`;
 
  $("tip").innerHTML = G.tip ? `<h2>Did you know?</h2>${G.tip.replace("💡 ", "")}` : "";
  $("log").innerHTML = G.log.map((line) => `<div class="${line.type}">${line.msg}</div>`).join("");
}
 
showIntro();
 