# Project Vital Quest: Judge Presentation Guide

Use this guide to prepare the required three-minute video, live Q&A, and judge follow-up. It describes the two prototypes currently associated with this repository. Before recording, decide which game is the official submission and make sure the link or files you present are from that exact version.

## Important Version Check

The project histories are currently split across branches:

- **Vital Quest: Triage** is documented on remote `main`. It is a Phaser browser game with patient cases, ESI triage, a three-minute shift, limited beds, and an end-of-shift report.
- **Care Route** is on the `aman` branch. It is a browser choice game with five community-care access scenarios and an Access Wins score.
- The combined chooser was developed in a separate local integration worktree and has not been merged or pushed. Do not tell judges that both games are available together in the shared repository unless the team has since integrated and verified them.
- The latest `main` contains the Triage game; Care Route remains on the separate `aman` branch. The two games have not been combined in the shared repository. Fetch the latest repo and open the branch for the game you are actually presenting.

Before the video, confirm with the team which game is the submission. A focused, polished explanation of one game is safer than showing two disconnected prototypes without explaining their relationship.

## Three-Minute Video Plan

Keep the video to three minutes as required. Show the real game running, with readable text and the relevant decisions visible.

| Time | Show and say |
| --- | --- |
| 0:00-0:20 | Introduce the team/project and name the healthcare problem. State the learning goal in one sentence. |
| 0:20-0:45 | Show the start screen and explain who the player is, the objective, and the controls. |
| 0:45-1:50 | Play one representative scenario or triage decision. Show the choice, its consequence, and the in-game explanation. |
| 1:50-2:20 | Explain the scoring/progression and how it reinforces the learning goal. Mention one limitation honestly. |
| 2:20-2:45 | Summarize research, testing, and one change made from feedback. Only describe work the team actually completed. |
| 2:45-3:00 | State why the topic matters, acknowledge tools/AI use, and close with the intended takeaway. |

Record a backup copy, check narration and screen readability, and submit using the Discord form before the stated deadline. The supplied event guide says the video is due by 4:30 PM on November 15; confirm the year/time zone and upload form in Discord.

## Project Summary: Care Route

Use this section if the team chooses the `aman` branch game.

- **Pitch:** Care Route is a short choice-based simulation where the player acts as a community health navigator, listens to neighbors, and chooses support for the access barrier each person describes.
- **Healthcare topic:** Non-clinical barriers to accessing care: transportation, language access, accessible clinic entrances, appointment timing, and cost information.
- **Learning goal:** Players should see that reaching care depends on more than the clinical service itself, and that support should match the person's stated barrier.
- **Audience and genre:** Students and general players; browser-based choice simulation.
- **Objective:** Complete five neighbor scenarios and select one of three responses for each.
- **Controls:** Start, choice, continue, and replay buttons; playable with mouse, touch, or keyboard activation.
- **Progression:** Five scenarios with immediate feedback after each decision.
- **Scoring:** One Access Win for each response that addresses the named barrier, for a possible total of five. The score reflects matching support to a need, not a person's health or worth.
- **End state:** A shift summary gives the score and restates the learning point; the player can replay.
- **Why it matters:** A person may know they need care but still face practical obstacles. The game asks players to notice the obstacle rather than assume one solution works for everyone.
- **Research status:** The Care Route README asks the team to verify health claims and cite sources, but the scenarios are simplified educational examples and the branch documentation does not currently list research citations. Before presenting, add and verify appropriate sources or describe the scenarios as design examples rather than research findings.

### Likely Care Route Questions

**Why did you choose access to care as the topic?**

Suggested answer: “We wanted to show that getting care can involve practical barriers outside the clinic. The scenarios let players consider different barriers and choose support that responds to the individual situation.” Add your team's actual reason for choosing the topic.

**How does the game teach instead of just explain?**

Suggested answer: “Players read a situation, make a choice, and immediately see feedback explaining whether that support addresses the stated barrier. They apply the idea repeatedly across five different situations.”

**Is there one universally correct way to help someone?**

Suggested answer: “The prototype simplifies each scenario to teach barrier matching. In real life, a navigator should ask the person what support they want and check what services are actually available. The game is not a substitute for that conversation.”

**What does the score mean?**

Suggested answer: “An Access Win means the selected response matches the barrier described in that scenario. It does not evaluate a patient or imply that healthcare access is fully solved.”

**How did you verify the scenarios?**

Answer truthfully. The branch README calls for research and citations, but do not claim expert review or fact-checking unless the team performed it. Explain what you verified, name the sources, and identify any remaining limitations.

## Project Summary: Vital Quest: Triage

Use this section if the team chooses the remote `main` Triage game.

- **Pitch:** The player takes a simulated emergency-department triage shift, assesses fictional patients, assigns ESI levels, and manages arrivals, waiting time, beds, and treatment capacity.
- **Healthcare topic:** Emergency-department triage, prioritization, and the tradeoffs involved when demand exceeds immediate capacity.
- **Learning goal:** Introduce the five-level Emergency Severity Index concept and show how undertriage, overtriage, delays, and limited capacity can affect patient flow.
- **Audience and genre:** Students and general players; time-management and decision simulation.
- **Objective:** During a three-minute simulated shift, prioritize patients and keep the emergency department operating.
- **Controls:** Click a patient to view the chart, then click ESI 1-5 or use keyboard keys 1-5.
- **Progression:** New patients arrive faster over the shift. Untriaged patients and patients waiting for beds can worsen or leave; beds complete treatment over time.
- **Scoring:** The README lists +100 correct triage, +20 overtriage, -50 undertriage, +20 per patient treated, -150 bad outcome, and -40 for leaving without being seen.
- **Feedback and ending:** Each decision explains the case's assigned ESI and rationale. The end report displays score, accuracy, outcomes, and educational facts.
- **Why it matters:** Prioritization decisions affect who waits and how limited clinical capacity is used. The simulation makes those competing consequences visible.
- **Safety boundary:** The patient cases are fictional teaching examples. This is not medical advice, clinical training, or a tool for making real triage decisions. Real decisions require qualified clinicians and full context.
- **Research status:** The Triage README names the Emergency Severity Index handbook/AHRQ materials, Sax et al. studies, EMRA, CDC/NCHS, and CMS-related data. Confirm exact publications, figures, and wording before repeating statistics in a video; the README gives source names but not full links for every claim.

### Likely Triage Questions

**What is ESI?**

Suggested answer: “The Emergency Severity Index is a five-level emergency-department triage framework. This prototype uses fictional cases to introduce the levels and the idea of prioritizing urgency and resource needs. It is not a clinical training substitute.”

**How do undertriage and overtriage differ in the game?**

Suggested answer: “Undertriage assigns a patient a less urgent level than the case's intended level, which can increase waiting and risk a modeled bad outcome. Overtriage assigns a more urgent level, which is modeled as safer for that patient but can consume capacity needed by someone more urgent.”

**Why are beds and waiting time part of the gameplay?**

Suggested answer: “They turn capacity constraints into visible mechanics. A correct label matters, but players also see how queues, treatment time, and limited beds shape what happens next.”

**Does the game teach real medical decisions?**

Suggested answer: “No. It introduces a simplified framework through fictional cases. It cannot represent the full context, judgment, protocols, or supervision required in real clinical work.”

**How accurate are the cases and statistics?**

Answer with the exact sources your team checked. The project README lists source organizations and publications; verify the specific case levels and every statistic before presenting. Do not present an unverified number as settled fact.

## Questions Across Both Games

**What is innovative about the project?**

Suggested answer: “We made the healthcare topic part of the player's decisions and consequences rather than only presenting informational text.” Then point to a specific implemented mechanic from the game you are presenting.

**How does the project encourage curiosity?**

Suggested answer: “Players can compare options, see feedback, and replay or continue to another case. That invites them to ask why a response fits one situation better than another.”

**How did you communicate the idea to players?**

Suggested answer: “The game introduces its role and goal, presents a concrete situation, makes the player choose, and explains the consequence in plain language.” Mention any playtest evidence only if you have it.

**What is the project's breadth and complexity?**

Suggested answer: “The prototype focuses on a deliberately small playable loop. Its scope is [five access scenarios / a three-minute triage shift], with [feedback, score, progression, and ending] implemented.” Be clear that the project is a prototype, not a complete healthcare system simulation.

**What impact do you hope it has?**

Suggested answer: “We hope players leave more aware of [community access barriers / triage tradeoffs] and ask better questions about how those factors affect people. We have not measured real-world health outcomes.”

**How did you navigate the challenge?**

Suggested answer: “We selected a focused healthcare topic, built a playable browser prototype, connected the mechanics to the topic, and prepared to test it and explain our decisions.” Replace this with the team's actual process and evidence.

**What would you improve with more time?**

Suggested answer: “We would playtest with more people, improve [specific observed issue], and strengthen the research and accessibility review. For Care Route, we would add verified references and more player-led dialogue. For Triage, we would validate ESI rules and every factual statistic with qualified sources.” Select only improvements relevant to the submitted game.

**Who did what on the team?**

Prepare accurate names and contributions here before the Q&A:

| Teammate | Actual contribution |
| --- | --- |
| [Name] | [Design, coding, research, art, testing, presentation, or other work actually completed] |
| [Name] | [Actual contribution] |
| [Name] | [Actual contribution] |
| [Name] | [Actual contribution] |

**Did you use AI?**

Answer honestly and specifically. AI assistance was used during development of the Care Route prototype and documentation in this workspace. The team should confirm which generated code or text is included in the submitted version, identify any other AI tools used, review the material, and be able to explain it. Do not claim that no AI was used if AI-assisted work is part of the submission.

**How did you test it?**

Do not invent a playtest. Code syntax and local browser loading have been checked during development, but that is not the same as a user playtest. If your team has tested it, prepare the number and type of testers, what they did, what confused them, and what you changed. Otherwise say that external playtesting remains a limitation.

**What assets and tools did you use?**

Care Route uses HTML, CSS, and browser JavaScript. Triage uses JavaScript and Phaser 3.80.1 loaded from jsDelivr. Identify any additional graphics, sounds, fonts, libraries, or AI-generated material included in the exact version you show, and acknowledge their creators/licenses where required.

**Can this be used for real medical advice or training?**

“No. It is an educational prototype using simplified scenarios. It does not diagnose, recommend treatment, train clinicians, or replace professional judgment.”

## Judging Criteria: Evidence to Show

The rubric scores each category from 1 to 5. Do not claim a score for yourselves; show evidence for each category.

| Category | Evidence to point to |
| --- | --- |
| Innovation | The healthcare idea is expressed through player choices, consequences, and feedback. |
| Curiosity | Different scenarios and replay invite players to compare decisions and ask why. |
| Communication | Clear introduction, controls, readable feedback, and a concise explanation of the healthcare connection. |
| Project Breadth & Complexity | A complete playable loop, progression, scoring, feedback, and ending within the chosen prototype scope. |
| Impact | A specific learning goal and a respectful explanation of why the topic affects people. Do not claim measured impact without evaluation. |
| Challenge Navigation | A focused healthcare topic, functioning prototype, responsible limitations, and explanation of tools, research, and team process. |

## Final Preparation Checklist

- [ ] Choose the exact game and branch/build to submit; make sure its files are actually present in that build.
- [ ] Confirm the video form, deadline date, time zone, Zoom room, team display name, and assignment in Discord.
- [ ] Reconcile the schedule: the guide says “10 minutes total,” but its listed segments (3-minute video + 3-minute Q&A + 4-minute deliberations + 3-minute feedback) add up to 13 minutes. Ask an organizer what applies to presenters and when to leave or stay.
- [ ] Join Zoom at least 15 minutes early, test audio/video, and have all members available for Q&A if possible.
- [ ] Test the exact build and rehearse the three-minute video once with a timer.
- [ ] Keep a backup video, screenshots, repository link, and presentation notes accessible.
- [ ] Verify and prepare citations for every health-related factual claim and statistic used on screen or spoken aloud.
- [ ] Fill in actual team roles, test findings, and AI/tool disclosure. Do not present placeholders as facts.
- [ ] Contact organizers through Discord `#ask-an-organizer` for judging logistics. The supplied guide lists `abburi.4@osu.edu` and `tummala.43@osu.edu` as emergency contacts.
