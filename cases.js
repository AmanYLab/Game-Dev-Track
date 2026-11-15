// ===== Shared game data: patient cases, colors, facts =====
// Each case has its TRUE triage level (esi) based on the Emergency Severity Index (ESI v4/v5 rules):
//  ESI 1: needs immediate life-saving intervention
//  ESI 2: high-risk situation, confused/lethargic, severe pain, or "danger zone" vitals
//  ESI 3-5: stable, sorted by how many RESOURCES they need (3 = 2+, 4 = 1, 5 = none)
//  Resources = labs, X-ray/CT/ultrasound, IV fluids, IV/IM meds, specialist consult, procedures (stitches)
//  NOT resources = exam, oral meds, prescriptions, simple wound care, splints/crutches

const ESI_COLORS = { 1: 0xd64545, 2: 0xf08a24, 3: 0xf2c94c, 4: 0x4caf50, 5: 0x3b82f6 };
const ESI_HEX    = { 1: '#ff6b6b', 2: '#ffa94d', 3: '#ffd43b', 4: '#69db7c', 5: '#74c0fc' };

const FIRST_NAMES = ['Maria', 'James', 'Aisha', 'Wei', 'Carlos', 'Emily', 'DeShawn', 'Priya', 'Luis',
  'Hannah', 'Omar', 'Grace', 'Diego', 'Fatima', 'Tyler', 'Sofia', 'Kevin', 'Mei', 'Andre', 'Rosa',
  'Jamal', 'Ana', 'Ethan', 'Lucia', 'Noah', 'Amara'];

const CASES = [
  // ---------- ESI 1: life-saving intervention NOW ----------
  { esi: 1, age: 58, sex: 'M', short: 'Collapsed, not breathing',
    complaint: 'Friend dragged him in after he collapsed in the parking lot. Not breathing, no pulse.',
    vitals: { hr: '0', bp: '--', rr: '0', spo2: '--', temp: '--' },
    why: 'No pulse and no breathing = cardiac arrest. He needs CPR right now.' },
  { esi: 1, age: 24, sex: 'F', short: 'Lips swelling, can\'t breathe',
    complaint: 'Ate a cookie with peanuts 10 minutes ago. Lips and tongue swelling, wheezing, struggling to breathe.',
    vitals: { hr: '132', bp: '84/50', rr: '30', spo2: '86%', temp: '98.6' },
    why: 'Severe allergic reaction (anaphylaxis) closing her airway, with low blood pressure. She needs epinephrine and airway support immediately.' },
  { esi: 1, age: 35, sex: 'M', short: 'Car crash, bleeding, pale',
    complaint: 'Car crash. Pale, sweaty, barely responding. Bleeding heavily from his leg.',
    vitals: { hr: '142', bp: '72/40', rr: '28', spo2: '93%', temp: '97.9' },
    why: 'Very low blood pressure + racing heart + barely responsive = shock from blood loss. Needs immediate life-saving care.' },
  { esi: 1, age: 4, sex: 'F', short: 'Shaking, not responding',
    complaint: 'Mom says she has been shaking all over and not responding for 8 minutes.',
    vitals: { hr: '160', bp: '100/60', rr: '36', spo2: '88%', temp: '101.8' },
    why: 'An active seizure that will not stop, with low oxygen, needs medication and airway support right away.' },

  // ---------- ESI 2: high risk / shouldn't wait ----------
  { esi: 2, age: 62, sex: 'M', short: 'Crushing chest pain',
    complaint: 'Crushing chest pain spreading to his left arm, sweating. Started 30 minutes ago.',
    vitals: { hr: '98', bp: '158/94', rr: '20', spo2: '96%', temp: '98.6' },
    why: 'Classic heart attack warning signs. Vitals look OK, but this is HIGH RISK: every minute of delay damages heart muscle.' },
  { esi: 2, age: 71, sex: 'F', short: 'Face drooping, slurred speech',
    complaint: 'Daughter says her face started drooping and her speech got slurred about 40 minutes ago.',
    vitals: { hr: '88', bp: '172/96', rr: '18', spo2: '97%', temp: '98.2' },
    why: 'Possible stroke. Clot-busting treatment only works within a few hours, so she is high risk even with OK vitals.' },
  { esi: 2, age: 45, sex: 'F', short: '"Worst headache of my life"',
    complaint: 'Sudden "worst headache of my life" that hit like a thunderclap an hour ago.',
    vitals: { hr: '92', bp: '168/100', rr: '18', spo2: '98%', temp: '98.6' },
    why: 'A sudden thunderclap headache can mean bleeding in the brain. High-risk, even though she is awake and talking.' },
  { esi: 2, age: 30, sex: 'M', short: 'Fever, confused',
    complaint: 'Fever and chills for 2 days. Now confused about where he is.',
    vitals: { hr: '124', bp: '98/60', rr: '24', spo2: '94%', temp: '103.1' },
    why: 'New confusion + fever + danger-zone heart rate (>100) and breathing (>20) suggest sepsis, a life-threatening infection.' },
  { esi: 2, age: 67, sex: 'M', short: 'Short of breath, getting worse',
    complaint: 'Short of breath, getting worse all day. Has COPD (a lung disease).',
    vitals: { hr: '108', bp: '142/88', rr: '26', spo2: '88%', temp: '98.9' },
    why: 'Oxygen below 92% and breathing over 20/min are danger-zone vitals, so he must be seen fast.' },

  // ---------- ESI 3: stable, 2+ resources ----------
  { esi: 3, age: 28, sex: 'F', short: 'Lower right belly pain',
    complaint: 'Pain in her lower right belly since last night, getting worse. Threw up twice.',
    vitals: { hr: '96', bp: '122/78', rr: '18', spo2: '99%', temp: '100.6' },
    why: 'Stable vitals, but possible appendicitis needs blood tests AND a CT scan (2+ resources), so ESI 3.' },
  { esi: 3, age: 52, sex: 'M', short: 'Side pain in waves',
    complaint: 'Pain in his side that comes in waves (6/10), some blood in his urine.',
    vitals: { hr: '94', bp: '140/86', rr: '18', spo2: '98%', temp: '98.4' },
    why: 'Likely kidney stone: needs labs, a CT scan, and IV pain medicine (2+ resources). Vitals are stable, so ESI 3.' },
  { esi: 3, age: 80, sex: 'F', short: 'Fell, hip pain, can\'t walk',
    complaint: 'Tripped on a rug at home. Hip hurts and she can\'t put weight on it.',
    vitals: { hr: '84', bp: '150/82', rr: '16', spo2: '96%', temp: '98.0' },
    why: 'Possible broken hip: X-ray, labs, and an orthopedic specialist (2+ resources). Stable vitals, so ESI 3.' },
  { esi: 3, age: 40, sex: 'M', short: 'Vomiting 2 days, dizzy',
    complaint: 'Vomiting and diarrhea for 2 days. Feels dizzy when he stands up.',
    vitals: { hr: '98', bp: '118/74', rr: '18', spo2: '98%', temp: '99.5' },
    why: 'Dehydrated: needs blood tests and IV fluids (2 resources). Vitals are not in the danger zone, so ESI 3.' },
  { esi: 3, age: 34, sex: 'F', short: 'Cough, fever, chest pain',
    complaint: 'Cough and fever for 4 days, sharp pain on one side when breathing deeply.',
    vitals: { hr: '96', bp: '120/76', rr: '20', spo2: '94%', temp: '101.2' },
    why: 'Possible pneumonia: chest X-ray and labs (2 resources). Oxygen is above 92% and vitals are not past the danger limits, so ESI 3.' },

  // ---------- ESI 4: stable, 1 resource ----------
  { esi: 4, age: 22, sex: 'M', short: 'Twisted ankle',
    complaint: 'Rolled his ankle playing basketball. Swollen, but he can limp on it.',
    vitals: { hr: '82', bp: '128/76', rr: '16', spo2: '99%', temp: '98.6' },
    why: 'Only needs an X-ray (1 resource). A splint or crutches do not count as resources, so ESI 4.' },
  { esi: 4, age: 36, sex: 'F', short: 'Cut finger, needs stitches',
    complaint: 'Cut her finger with a kitchen knife. About 2 cm long, bleeding is controlled.',
    vitals: { hr: '78', bp: '118/72', rr: '14', spo2: '99%', temp: '98.4' },
    why: 'Just needs stitches (1 resource: a simple procedure), so ESI 4.' },
  { esi: 4, age: 17, sex: 'F', short: 'Sore throat, fever',
    complaint: 'Sore throat and fever, hurts to swallow.',
    vitals: { hr: '96', bp: '112/70', rr: '16', spo2: '99%', temp: '101.0' },
    why: 'Needs a strep test (1 lab resource). Antibiotic pills do not count as a resource, so ESI 4.' },
  { esi: 4, age: 27, sex: 'F', short: 'Burning when peeing',
    complaint: 'Burning when she pees and needs to go often.',
    vitals: { hr: '80', bp: '116/74', rr: '14', spo2: '99%', temp: '98.8' },
    why: 'Likely urinary tract infection: one urine test (1 resource), so ESI 4.' },

  // ---------- ESI 5: stable, 0 resources ----------
  { esi: 5, age: 49, sex: 'M', short: 'Needs prescription refill',
    complaint: 'Ran out of his blood pressure pills and needs a refill.',
    vitals: { hr: '76', bp: '138/88', rr: '14', spo2: '98%', temp: '98.4' },
    why: 'A prescription refill uses no ESI resources, so ESI 5.' },
  { esi: 5, age: 31, sex: 'F', short: 'Itchy rash (poison ivy?)',
    complaint: 'Itchy rash on her arms after hiking. Looks like poison ivy.',
    vitals: { hr: '72', bp: '114/70', rr: '14', spo2: '99%', temp: '98.6' },
    why: 'Exam plus a cream or pills: zero resources, so ESI 5.' },
  { esi: 5, age: 55, sex: 'M', short: 'Stitches removal',
    complaint: 'Here to get stitches taken out of his hand. Wound looks healed.',
    vitals: { hr: '70', bp: '126/80', rr: '14', spo2: '99%', temp: '98.2' },
    why: 'Suture removal needs no resources, so ESI 5.' },
  { esi: 5, age: 20, sex: 'M', short: 'Runny nose, mild cough',
    complaint: 'Runny nose and mild cough for 2 days. Feels fine otherwise.',
    vitals: { hr: '74', bp: '120/76', rr: '14', spo2: '99%', temp: '99.0' },
    why: 'A common cold needs only an exam, so ESI 5. In real life many patients like this could use urgent care instead.' }
];

// How often each true level shows up (roughly realistic: ESI 3 is the most common)
const ESI_WEIGHTS = [[1, 0.08], [2, 0.20], [3, 0.35], [4, 0.22], [5, 0.15]];

function pickCase(lastIndex) {
  let r = Math.random(), esi = 3;
  for (const [lvl, w] of ESI_WEIGHTS) { if (r < w) { esi = lvl; break; } r -= w; }
  const options = CASES.map((c, i) => i).filter(i => CASES[i].esi === esi && i !== lastIndex);
  return CASES[options[Math.floor(Math.random() * options.length)]];
}

// Seconds a patient can wait UNTRIAGED in the waiting room before something bad happens
const UNTRIAGED_LIMIT = { 1: 15, 2: 30, 3: 70, 4: 60, 5: 60 };
// Seconds a patient can wait for a bed AFTER triage
const QUEUE_LIMIT = { 1: 10, 2: 25, 3: 80, 4: 50, 5: 50 };
// Seconds of treatment once in a bed
const TREAT_TIME = { 1: 14, 2: 12, 3: 10, 4: 6, 5: 5 };

// Real facts shown at the end (keep sources for judges!)
const FACTS = [
  { text: 'More than 70% of U.S. emergency departments use the Emergency Severity Index (ESI), the same 5-level system in this game.',
    src: 'EMRA Health Policy Journal Club' },
  { text: 'A study of 5.3 million adult ER visits found about 1 in 3 patients were mistriaged: 28.9% overtriaged and 3.3% undertriaged.',
    src: 'Sax et al., JAMA Network Open, 2023' },
  { text: 'The same study found Black patients had an 18.5% higher relative risk of being undertriaged than White patients. Accurate, fair triage matters.',
    src: 'Sax et al., JAMA Network Open, 2023' },
  { text: 'In 2022 there were about 47 emergency department visits for every 100 people in the U.S.',
    src: 'CDC / NCHS Data Brief No. 503' },
  { text: 'In 2024, about 2% of U.S. ER patients left before being seen. Long waits are the most common reason people leave.',
    src: 'CMS Timely & Effective Care data (via Becker\'s); Emergency Medicine Journal review' },
  { text: 'About half of ER patients end up as ESI 3, the hardest group to sort and where the most mistriage happens.',
    src: 'Sax et al., JAMA Pediatrics, 2023 (51% of pediatric visits were ESI 3)' }
];
