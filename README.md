# Vital Quest: Triage
OSU Hackathon, Challenge #2 (Project Vital Quest)

You're the triage nurse in a busy Columbus ER. Patients arrive faster than you can treat them.
Read each patient's complaint and vital signs and assign a triage level using the real
**Emergency Severity Index (ESI)**, the 5-level system most U.S. ERs use.

## How it works
- **Controls:** click a patient in the waiting room, then click ESI 1-5 (or press keys 1-5).
- **Objective:** get the sickest patients care first during a 3-minute shift.
- **Consequences built into the mechanics:**
  - *Undertriage* a sick patient and they sit behind less urgent patients, which can cause a bad outcome.
  - *Overtriage* someone and they take a bed (or the resus bay) away from sicker patients.
  - Leave the waiting room full or people waiting too long and they leave without being seen.
- **Scoring:** +100 correct, +20 overtriage, -50 undertriage, +20 per patient treated,
  -150 bad outcome, -40 left without being seen.
- **Feedback:** after every decision the game explains the correct ESI level and why.

## Files
`index.html`, `main.js`, `cases.js` (all patient cases and facts),
`MenuScene.js`, `HowToScene.js`, `GameScene.js`, `EndScene.js`

## Adding patients
Copy any entry in `CASES` in `cases.js` and change it. Make sure the `esi` value follows the ESI rules
at the top of that file.

## Sources
- Emergency Severity Index Handbook (ENA, 5th ed.) / AHRQ ESI v4 Implementation Handbook: triage levels, resources, danger-zone vitals
- Sax DR et al. "Evaluation of the Emergency Severity Index in US Emergency Departments for the Rate of Mistriage." JAMA Network Open, 2023
- Sax DR et al. ESI v4 and Triage of Pediatric ED Patients. JAMA Pediatrics, 2023
- EMRA Health Policy Journal Club: >70% of U.S. EDs use ESI
- CDC/NCHS Data Brief No. 503: ED visit rates, 2022
- CMS Timely & Effective Care data (via Becker's Hospital Review): left-without-being-seen rate, 2024

Patient cases are fictional teaching examples, not medical advice.
