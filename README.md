# Project Vital Quest (OSU Hackathon, Challenge #2)

The current `main` branch has a game-select page linking to two browser games about healthcare: emergency triage and hospital resource management. **Care Route** is an additional community-health prototype on the separate `aman` branch and is not currently linked from `main`.

| Folder | Game | Healthcare topic |
|---|---|---|
| `triage/` | **Triage Game**: you're an ER triage nurse ranking patients ESI 1-5 | How ERs decide who is seen first (Emergency Severity Index), and the cost of mistriage |
| `hospital-game/` | **Hospital Manager**: run a hospital for 7 days | Money vs. care: staffing, supplies, uninsured patients, and emergency-care obligations |

## How the files fit together
- `index.html` (top level): the game-select page. It just links to the two folders.
- `triage/`: built with Phaser (game library). `cases.js` = patient data and facts, `GameScene.js` = the game, other `*Scene.js` files = menu/instructions/guide/results screens.
- `hospital-game/`: plain HTML + JavaScript, no library. `game.js` (about 200 lines) has 5 labeled sections: Data (all the numbers to tweak), Setup, Game loop (runs once per in-game hour), Player actions, Drawing. `style.css` = the look.

## Triage Game
- **Controls:** click a patient, then ESI 1-5 (or keys 1-5).
- **Goal:** sickest patients first, 3-minute shift.
- **Scoring:** +100 correct, +20 overtriage, -50 undertriage, +20 treated, -150 bad outcome, -40 left without being seen.

## Hospital Manager
- **Controls:** click **Admit** on a waiting patient, **Add a bed** on the right, and **Pause** at the top.
- **Goal:** survive 7 days with reputation 40 or higher without going bankrupt.
- **The money dilemma:** insured patients pay, uninsured patients don't, and every bed costs $400/day in staff. But EMTALA says ERs must treat the sickest first, whether or not they can pay. Admit a paying patient ahead of a sicker uninsured one and you lose 12 reputation. Patients who die waiting cost 10.
- **Tested:** in simulated games, a "sickest first" player always wins, while a "paying patients first" player loses about half the time.

## Care Route (separate `aman` branch)

Care Route is a browser choice game in which the player acts as a community health navigator. Across five scenarios, the player chooses support for barriers involving transportation, language access, accessible entrances, appointment schedules, and cost information. A correct barrier match earns one Access Win; feedback explains each outcome, and a shift summary closes the game. This prototype is not part of the current `main` launcher unless it is merged and integrated.

## Sources
- Emergency Severity Index Handbook (ENA, 5th ed.) / AHRQ ESI v4 Implementation Handbook
- Sax DR et al., "Evaluation of the ESI in US Emergency Departments for the Rate of Mistriage," JAMA Network Open, 2023; and ESI v4 pediatric study, JAMA Pediatrics, 2023
- EMRA Health Policy Journal Club: >70% of U.S. EDs use ESI
- CDC/NCHS Data Brief No. 503 (ED visit rates, 2022)
- CMS Timely & Effective Care data via Becker's Hospital Review (left-without-being-seen rate, 2024)
- Congressional Research Service, "EMTALA: Access to Emergency Medical Care"; StatPearls, "EMTALA and Transfers"
- U.S. Census Bureau, Health Insurance Coverage in the United States: 2024 (8% uninsured)
- American Hospital Association, uncompensated care data ($41.6B in 2019)

Patients and hospitals in these games are fictional teaching examples, not medical or legal advice.
