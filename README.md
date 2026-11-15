# Project Vital Quest

Project Vital Quest prototypes use interactive games to explore healthcare. The current remote `main` branch contains **Vital Quest: Triage**. **Care Route** is a separate prototype on the `aman` branch and is not included in the current `main` build.

## Vital Quest: Triage

You are the triage nurse in a busy emergency department. Patients arrive faster than they can be treated. Review each fictional patient's complaint and vital signs, then assign a triage level using the five-level Emergency Severity Index (ESI).

- **Objective:** Prioritize patients during a three-minute shift while managing limited beds and time.
- **Controls:** Click a patient in the waiting room, then click ESI 1-5 or press keys 1-5.
- **Consequences:** Undertriage can make a sick patient wait too long. Overtriage uses capacity that may be needed by more urgent patients. Patients may worsen or leave without being seen if waits are too long.
- **Scoring:** +100 correct triage, +20 overtriage, -50 undertriage, +20 per patient treated, -150 bad outcome, and -40 for a patient leaving without being seen.
- **Feedback:** Each decision explains the intended ESI level and rationale; the shift ends with a results summary.

The patient cases are fictional learning examples, not medical advice or clinical training. Real triage requires qualified professionals and full patient context.

## Care Route

Care Route is a browser-based choice simulation on the `aman` branch. The player acts as a community health navigator, listens to five neighbors, and chooses support for the barrier each person describes.

- **Healthcare topic:** Access to care, including transportation, language access, accessible entrances, appointment availability, and cost information.
- **Learning goal:** Getting care can depend on more than the clinical service itself; useful support starts by understanding the person's specific barrier.
- **Objective and progression:** Complete five short scenarios, each with three possible responses.
- **Controls:** Use the on-screen buttons with a mouse, touch screen, or keyboard activation.
- **Scoring:** Earn one Access Win when the chosen support addresses the stated barrier. This is a learning-game score, not a measure of a person's health or worth.
- **Ending:** Immediate feedback follows each choice; a shift summary shows the score and learning point and allows replay.

The characters and scenarios are simplified examples. The game does not diagnose, prescribe treatment, or replace advice from a qualified healthcare professional. Verify and cite relevant sources before presenting health claims.

## Running the Games

For Triage, use the latest `main` branch. For Care Route, switch to `aman`. In either branch, open the repository's `index.html` in a browser, or start a local static server from the project folder:

```powershell
npx http-server -p 8000
```

Then visit `http://127.0.0.1:8000` and leave the terminal running. Triage loads Phaser 3.80.1 from jsDelivr and needs an internet connection for that library. Care Route uses browser HTML, CSS, and JavaScript. Do not run browser scripts such as `app.js` directly with Node.

## Triage Sources and Content Notes

- Emergency Nurses Association, *Emergency Severity Index Handbook*, 5th edition, and AHRQ, *ESI v4 Implementation Handbook*: triage levels, resources, and danger-zone vital signs.
- Sax DR et al., “Evaluation of the Emergency Severity Index in US Emergency Departments for the Rate of Mistriage.” *JAMA Network Open*, 2023.
- Sax DR et al., research on ESI v4 and pediatric emergency-department triage. *JAMA Pediatrics*, 2023.
- EMRA Health Policy Journal Club: ESI adoption information.
- CDC/NCHS Data Brief No. 503: U.S. emergency department visit rates, 2022.
- CMS Timely & Effective Care data and Emergency Medicine Journal review: left-without-being-seen context.

The README lists source names, but teams should verify each factual claim and statistic against the original publication before presenting it. Do not present unverified figures as settled fact.

## Adding Triage Cases

Copy an entry in the `CASES` array in `cases.js` and update it carefully. Follow the ESI guidance at the top of that file and verify the case with authoritative clinical references. Patient cases must remain fictional teaching examples.

## Team Testing and Presentation

Ask someone outside the development team to try the game without coaching. Check whether the player can start, understand the controls and objective, complete the core loop, and explain the intended learning. Record what you learned and what you changed; do not claim a playtest unless it happened.

In the presentation, explain the healthcare topic, intended audience, learning goal, controls, choices, scoring, consequences, tools, sources, AI assistance, and each team member's actual contribution. Be clear about the prototype's limitations and distinguish code checks from user playtesting.
