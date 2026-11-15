// ===== Shared game data: patient cases, colors, facts =====
// Each case has its TRUE triage level (esi) based on the Emergency Severity Index (ESI) rules:
//  ESI 1: needs immediate life-saving intervention
//  ESI 2: high-risk situation (could get much worse if they wait), new confusion, severe distress
//  ESI 3-5: stable, sorted by how many RESOURCES they need (3 = 2+, 4 = 1, 5 = none)
//  Resources = labs, X-ray/CT/ultrasound, IV fluids, IV/IM meds, specialist consult, procedures (stitches)
//  NOT resources = exam, oral meds, prescriptions, simple wound care, splints/crutches

const ESI_COLORS = { 1: 0xd64545, 2: 0xf08a24, 3: 0xf2c94c, 4: 0x4caf50, 5: 0x3b82f6 };
const ESI_HEX    = { 1: '#ff6b6b', 2: '#ffa94d', 3: '#ffd43b', 4: '#69db7c', 5: '#74c0fc' };

const FIRST_NAMES = ['Maria', 'James', 'Aisha', 'Wei', 'Carlos', 'Emily', 'DeShawn', 'Priya', 'Luis',
  'Hannah', 'Omar', 'Grace', 'Diego', 'Fatima', 'Tyler', 'Sofia', 'Kevin', 'Mei', 'Andre', 'Rosa',
  'Jamal', 'Ana', 'Ethan', 'Lucia', 'Noah', 'Amara'];

const CASES = [
  // ---------- ESI 1: life-saving help NOW ----------
  { esi: 1, age: 58, sex: 'M', short: 'Collapsed, not breathing',
    complaint: 'Friend dragged him in after he collapsed in the parking lot. He is not breathing and has no pulse.',
    why: 'No pulse and no breathing = cardiac arrest. He needs CPR right now.' },
  { esi: 1, age: 24, sex: 'F', short: 'Lips swelling, can\'t breathe',
    complaint: 'Ate a cookie with peanuts 10 minutes ago. Her lips and tongue are swelling and she is struggling to breathe.',
    why: 'A severe allergic reaction (anaphylaxis) is closing her airway. She needs epinephrine immediately.' },
  { esi: 1, age: 35, sex: 'M', short: 'Car crash, bleeding, pale',
    complaint: 'Car crash. Bleeding heavily from his leg. Pale, sweaty, and barely responding.',
    why: 'Heavy bleeding + barely responding = shock from blood loss. He needs life-saving care immediately.' },
  { esi: 1, age: 4, sex: 'F', short: 'Shaking, not responding',
    complaint: 'Mom says she has been shaking all over and not responding for 8 minutes.',
    why: 'A seizure that will not stop needs medicine right away to protect her brain and breathing.' },

  // ---------- ESI 2: high risk, can't wait ----------
  { esi: 2, age: 62, sex: 'M', short: 'Crushing chest pain',
    complaint: 'Crushing chest pain spreading to his left arm, and he is sweating. Started 30 minutes ago.',
    why: 'Classic heart attack warning signs. HIGH RISK: every minute of delay damages heart muscle.' },
  { esi: 2, age: 71, sex: 'F', short: 'Face drooping, slurred speech',
    complaint: 'Daughter says her face started drooping and her speech got slurred about 40 minutes ago.',
    why: 'Possible stroke. Treatment only works within a few hours, so she is high risk even though she is awake.' },
  { esi: 2, age: 45, sex: 'F', short: '"Worst headache of my life"',
    complaint: 'Sudden "worst headache of my life" that hit like a thunderclap an hour ago.',
    why: 'A sudden thunderclap headache can mean bleeding in the brain. High risk, even though she is talking.' },
  { esi: 2, age: 30, sex: 'M', short: 'High fever, confused',
    complaint: 'High fever and chills for 2 days. Now he is confused about where he is.',
    why: 'New confusion with a high fever can mean sepsis, a life-threatening infection. Confusion alone makes someone ESI 2.' },
  { esi: 2, age: 67, sex: 'M', short: 'Can barely breathe',
    complaint: 'Short of breath, getting worse all day. He can only say a few words at a time. Has a lung disease (COPD).',
    why: 'Severe breathing trouble that keeps getting worse is high risk. He can\'t wait, but he is still breathing on his own, so ESI 2.' },

  // ---------- ESI 3: stable, needs 2+ resources ----------
  { esi: 3, age: 28, sex: 'F', short: 'Lower right belly pain',
    complaint: 'Pain in her lower right belly since last night, getting worse. Threw up twice.',
    why: 'Possible appendicitis. She is stable but needs blood tests AND a CT scan (2+ resources), so ESI 3.' },
  { esi: 3, age: 52, sex: 'M', short: 'Side pain in waves',
    complaint: 'Pain in his side that comes and goes in waves, and some blood in his urine.',
    why: 'Likely kidney stone: needs labs, a CT scan, and IV pain medicine (2+ resources), so ESI 3.' },
  { esi: 3, age: 80, sex: 'F', short: 'Fell, hip pain, can\'t walk',
    complaint: 'Tripped on a rug at home. Her hip hurts and she can\'t put weight on it.',
    why: 'Possible broken hip: X-ray, labs, and a bone specialist (2+ resources), so ESI 3.' },
  { esi: 3, age: 40, sex: 'M', short: 'Vomiting 2 days, dizzy',
    complaint: 'Vomiting and diarrhea for 2 days. Feels dizzy when he stands up.',
    why: 'Dehydrated: needs blood tests and IV fluids (2 resources), so ESI 3.' },
  { esi: 3, age: 34, sex: 'F', short: 'Cough, fever, chest pain',
    complaint: 'Cough and fever for 4 days, sharp pain on one side when she breathes deeply. Breathing fine at rest.',
    why: 'Possible pneumonia: chest X-ray and labs (2 resources). She is breathing OK, so ESI 3.' },

  // ---------- ESI 4: stable, needs 1 resource ----------
  { esi: 4, age: 22, sex: 'M', short: 'Twisted ankle',
    complaint: 'Rolled his ankle playing basketball. It is swollen, but he can limp on it.',
    why: 'Only needs an X-ray (1 resource). Splints and crutches do not count, so ESI 4.' },
  { esi: 4, age: 36, sex: 'F', short: 'Cut finger, needs stitches',
    complaint: 'Cut her finger with a kitchen knife. About 2 cm long, and the bleeding is under control.',
    why: 'Just needs stitches (1 resource), so ESI 4.' },
  { esi: 4, age: 17, sex: 'F', short: 'Sore throat, fever',
    complaint: 'Sore throat and fever. It hurts to swallow.',
    why: 'Needs a strep test (1 lab resource). Antibiotic pills do not count, so ESI 4.' },
  { esi: 4, age: 27, sex: 'F', short: 'Burning when peeing',
    complaint: 'Burning when she pees and she needs to go often.',
    why: 'Likely urinary tract infection: one urine test (1 resource), so ESI 4.' },

  // ---------- ESI 5: stable, needs 0 resources ----------
  { esi: 5, age: 49, sex: 'M', short: 'Needs prescription refill',
    complaint: 'Ran out of his blood pressure pills and needs a refill.',
    why: 'A prescription refill uses no resources, so ESI 5.' },
  { esi: 5, age: 31, sex: 'F', short: 'Itchy rash (poison ivy?)',
    complaint: 'Itchy rash on her arms after hiking. Looks like poison ivy.',
    why: 'An exam plus a cream or pills: zero resources, so ESI 5.' },
  { esi: 5, age: 55, sex: 'M', short: 'Stitches removal',
    complaint: 'Here to get stitches taken out of his hand. The cut looks healed.',
    why: 'Removing stitches needs no resources, so ESI 5.' },
  { esi: 5, age: 20, sex: 'M', short: 'Runny nose, mild cough',
    complaint: 'Runny nose and mild cough for 2 days. Feels fine otherwise.',
    why: 'A common cold needs only an exam, so ESI 5. Patients like this could often use urgent care instead.' }
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
