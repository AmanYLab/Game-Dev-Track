"use strict";

const scenarios = [
	{
		name: "Maya",
		initials: "M",
		role: "COLLEGE STUDENT",
		color: "coral",
		barrier: "GETTING THERE",
		story: "Maya has a clinic appointment after class, but the bus route near her campus is temporarily closed.",
		prompt: "What could help Maya reach her appointment?",
		options: [
			{ title: "Arrange a ride or transit pass", detail: "Help cover the trip to the clinic.", works: true, feedback: "A ride or transit support addresses the barrier Maya described: getting to the appointment." },
			{ title: "Send another appointment reminder", detail: "Make sure the date and time are clear.", works: false, feedback: "A reminder can be useful, but Maya already knows when her appointment is. The closed route is still in her way." },
			{ title: "Give her a clinic brochure", detail: "Share information about available services.", works: false, feedback: "Information about services does not solve the transportation problem Maya raised." }
		]
	},
	{
		name: "Luis",
		initials: "L",
		role: "LOCAL SHOP OWNER",
		color: "yellow",
		barrier: "BEING UNDERSTOOD",
		story: "Luis is comfortable speaking Spanish. He wants to ask the clinic a few questions, but the forms and phone line are only in English.",
		prompt: "What would make communication easier for Luis?",
		options: [
			{ title: "Offer a qualified interpreter", detail: "Help Luis communicate in his preferred language.", works: true, feedback: "Language support can help Luis communicate his questions and understand information. The clinic should arrange appropriate interpretation." },
			{ title: "Ask him to bring a family member", detail: "Have someone he knows translate for him.", works: false, feedback: "Family members may not be available or comfortable interpreting. A qualified interpreter is a more appropriate support to ask the clinic about." },
			{ title: "Move his appointment earlier", detail: "Find him the next open time.", works: false, feedback: "A sooner appointment does not address the language barrier on the forms and phone line." }
		]
	},
	{
		name: "Jordan",
		initials: "J",
		role: "NEIGHBORHOOD VOLUNTEER",
		color: "blue",
		barrier: "A WELCOMING SPACE",
		story: "Jordan uses a wheelchair. The closest clinic entrance has steps, and the accessible entrance is not clearly marked.",
		prompt: "What is the most useful next step?",
		options: [
			{ title: "Confirm an accessible entrance and route", detail: "Check access details with the clinic before the visit.", works: true, feedback: "Confirming an accessible route addresses the obstacle Jordan described. Clear access information should be easy to find before a visit." },
			{ title: "Book a different appointment time", detail: "Try a quieter time of day.", works: false, feedback: "A quieter time does not remove the steps or help Jordan find the accessible entrance." },
			{ title: "Offer a printed map of the area", detail: "Show nearby streets and landmarks.", works: false, feedback: "A street map may help with directions, but it does not confirm an accessible entrance at the clinic." }
		]
	},
	{
		name: "Amina",
		initials: "A",
		role: "PARENT AND SHIFT WORKER",
		color: "green",
		barrier: "FINDING A TIME",
		story: "Amina works changing shifts and cares for her child. The clinic's usual appointment hours overlap with work and school pickup.",
		prompt: "What could give Amina more flexibility?",
		options: [
			{ title: "Ask about evening or flexible hours", detail: "Check whether the clinic has appointments outside her shift.", works: true, feedback: "Flexible hours may fit Amina's schedule better. The key is asking what options the clinic actually offers." },
			{ title: "Give her a bus route map", detail: "Show the nearest stops and connections.", works: false, feedback: "A route map can help with transportation, but Amina's main barrier is the clinic's appointment hours." },
			{ title: "Send a reminder the night before", detail: "Help her keep the appointment on her calendar.", works: false, feedback: "A reminder cannot change the overlap between appointment hours, work, and school pickup." }
		]
	},
	{
		name: "Devon",
		initials: "D",
		role: "NEW TO THE NEIGHBORHOOD",
		color: "coral",
		barrier: "UNDERSTANDING COSTS",
		story: "Devon is interested in making an appointment but worries about the cost. He is not sure what questions to ask before booking.",
		prompt: "What information could help Devon decide what to do next?",
		options: [
			{ title: "Connect him with billing or cost-support staff", detail: "Help him ask about fees and available assistance.", works: true, feedback: "A billing or cost-support contact can explain the clinic's fees and any assistance options. Costs and eligibility vary, so Devon can ask before deciding." },
			{ title: "Book the first open appointment", detail: "Get a date on the calendar right away.", works: false, feedback: "Booking quickly does not answer Devon's concern about cost. He deserves clear information before deciding." },
			{ title: "Give him directions to the clinic", detail: "Show him where the building is located.", works: false, feedback: "Directions may help him find the clinic, but they do not answer his question about fees or assistance." }
		]
	}
];

const panel = document.querySelector("#game-panel");
const roundText = document.querySelector("#round-text");
const scoreText = document.querySelector("#score-text");
const progressFill = document.querySelector("#progress-fill");

let currentRound = -1;
let accessWins = 0;
let answered = false;

function updateHud() {
	scoreText.innerHTML = `ACCESS WINS <strong>${accessWins}</strong>`;
	const completed = Math.max(0, currentRound);
	progressFill.style.width = `${(completed / scenarios.length) * 100}%`;
	progressFill.parentElement.setAttribute("aria-valuenow", String(completed));
}

function startGame() {
	currentRound = 0;
	accessWins = 0;
	answered = false;
	renderRound();
}

function renderIntro() {
	roundText.textContent = "YOUR SHIFT IS READY";
	progressFill.style.width = "0%";
	panel.innerHTML = `
		<div class="welcome-screen">
			<div class="welcome-art" aria-hidden="true">
				<span class="art-sun"></span>
				<span class="art-road"></span>
				<span class="art-house house-one"><i></i></span>
				<span class="art-house house-two"><i></i></span>
				<span class="art-clinic"><b>+</b><i></i><i></i><i></i></span>
				<span class="art-person">●</span>
			</div>
			<div class="welcome-copy">
				<p class="eyebrow">YOUR FIRST SHIFT / 5 NEIGHBORS</p>
				<h2>Welcome to the<br>neighborhood.</h2>
				<p>Each person has a different obstacle to care. Choose one support for each neighbor and see how it changes their route.</p>
				<div class="how-to-play"><span class="how-number">1</span><span>Read their situation</span><span class="how-number">2</span><span>Choose a support</span></div>
				<button class="primary-button start-button" type="button">Start your shift <span aria-hidden="true">→</span></button>
			</div>
		</div>`;
	panel.querySelector(".start-button").addEventListener("click", startGame);
}

function renderRound() {
	const person = scenarios[currentRound];
	answered = false;
	roundText.textContent = `NEIGHBOR ${String(currentRound + 1).padStart(2, "0")} / ${String(scenarios.length).padStart(2, "0")}`;
	updateHud();
	panel.innerHTML = `
		<div class="scenario-screen">
			<div class="scenario-heading">
				<div class="person-badge badge-${person.color}" aria-hidden="true">${person.initials}</div>
				<div class="person-details"><p class="eyebrow">${person.role}</p><h2>${person.name} needs a hand.</h2></div>
				<span class="barrier-tag">${person.barrier}</span>
			</div>
			<p class="scenario-story">${person.story}</p>
			<h3 class="question-title">${person.prompt}</h3>
			<div class="choice-list" role="group" aria-label="Choose a support">
				${person.options.map((option, index) => `
					<button class="choice-button" type="button" data-choice="${index}">
						<span class="choice-number">0${index + 1}</span>
						<span class="choice-copy"><strong>${option.title}</strong><small>${option.detail}</small></span>
						<span class="choice-arrow" aria-hidden="true">↗</span>
					</button>`).join("")}
			</div>
			<div class="feedback-slot" id="feedback-slot"></div>
			<p class="choice-hint">PICK THE SUPPORT THAT ADDRESSES THE BARRIER</p>
		</div>`;
	panel.querySelectorAll(".choice-button").forEach((button) => {
		button.addEventListener("click", () => chooseOption(Number(button.dataset.choice)));
	});
}

function chooseOption(optionIndex) {
	if (answered) return;
	answered = true;
	const person = scenarios[currentRound];
	const option = person.options[optionIndex];
	if (option.works) accessWins += 1;

	panel.querySelectorAll(".choice-button").forEach((button, index) => {
		button.disabled = true;
		if (index === optionIndex) button.classList.add(option.works ? "choice-correct" : "choice-missed");
		if (person.options[index].works) button.classList.add("choice-answer");
	});
	updateHud();

	const feedbackSlot = panel.querySelector("#feedback-slot");
	feedbackSlot.innerHTML = `
		<div class="feedback-box ${option.works ? "feedback-success" : "feedback-learning"}">
			<span class="feedback-mark" aria-hidden="true">${option.works ? "✓" : "↗"}</span>
			<div><strong>${option.works ? "Barrier addressed" : "A useful thought to carry forward"}</strong><p>${option.feedback}</p></div>
		</div>
		<button class="text-button next-button" type="button">${currentRound === scenarios.length - 1 ? "See your shift summary" : "Meet the next neighbor"}<span aria-hidden="true">→</span></button>`;
	feedbackSlot.querySelector(".next-button").addEventListener("click", nextRound);
	feedbackSlot.querySelector(".next-button").focus();
}

function nextRound() {
	currentRound += 1;
	if (currentRound >= scenarios.length) {
		renderSummary();
		return;
	}
	renderRound();
}

function renderSummary() {
	roundText.textContent = "SHIFT COMPLETE";
	progressFill.style.width = "100%";
	progressFill.parentElement.setAttribute("aria-valuenow", String(scenarios.length));
	const message = accessWins === scenarios.length
		? "You spotted every barrier. Remember: the best support starts by listening to what a person says they need."
		: accessWins >= 3
			? "You helped clear several barriers. Every situation is different, so listening first is a good place to start."
			: "You completed your first shift. Notice how the right support depends on the barrier, not a one-size-fits-all answer.";
	panel.innerHTML = `
		<div class="summary-screen">
			<div class="summary-stamp" aria-hidden="true">✳</div>
			<p class="eyebrow">SHIFT REPORT / COMMUNITY ACCESS</p>
			<h2>Good work,<br>health navigator.</h2>
			<div class="summary-score"><strong>${accessWins}<span>/${scenarios.length}</span></strong><span>barriers addressed</span></div>
			<p class="summary-message">${message}</p>
			<div class="takeaway"><span class="takeaway-mark" aria-hidden="true">↗</span><p><strong>The big idea</strong><br>Access to care can depend on everyday things like a ride, clear communication, flexible hours, an accessible entrance, and knowing what care may cost.</p></div>
			<button class="primary-button replay-button" type="button">Play another shift <span aria-hidden="true">↻</span></button>
		</div>`;
	panel.querySelector(".replay-button").addEventListener("click", () => {
		renderIntro();
		updateHud();
	});
}

const progressTrack = document.querySelector(".progress-track");
progressTrack.setAttribute("role", "progressbar");
progressTrack.setAttribute("aria-valuemin", "0");
progressTrack.setAttribute("aria-valuemax", String(scenarios.length));
renderIntro();

