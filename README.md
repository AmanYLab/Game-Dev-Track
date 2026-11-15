# Challenge #2: Project Vital Quest

## The Healthcare Game Development Challenge

Design and build an interactive game that explores a healthcare topic. The game should be enjoyable to play while helping players learn, consider meaningful choices, and understand why the topic matters to individuals or communities.

You may work in any suitable game engine or platform, including Unity, Unreal Engine, Godot, Scratch, or another tool. A small, playable prototype is more important than a large, unfinished game.

## Our Game: Care Route

**Care Route** is a short browser-based community health game. The player is a community health navigator who listens to neighbors, identifies the obstacle making care difficult to reach, and chooses a support that addresses that obstacle.

- **Audience:** Students and other players learning about community health.
- **Healthcare topic:** Access to care and the everyday factors that can affect it, including transportation, language access, physical accessibility, appointment availability, and cost information.
- **Learning goal:** Players will recognize that getting healthcare can depend on more than the care itself, and that useful support starts by understanding the person's specific barrier.
- **Genre:** Choice-based simulation and educational game.
- **Objective:** Work through five neighbor scenarios and select a support for each one.
- **Controls:** Use a mouse, touch screen, or keyboard to activate the on-screen buttons.
- **Player actions:** Read a neighbor's situation, choose one of three responses, review feedback, and continue to the next neighbor.
- **Progression:** Five short scenarios covering transportation, language, accessible entrances, scheduling, and cost questions.
- **Scoring:** An Access Win is earned when the selected support addresses the barrier in that scenario. The score is feedback about matching support to a stated need, not a measure of a person's health or worth.
- **Ending:** A shift summary shows the score and repeats the central learning point. Players can restart and try different choices.

The characters and scenarios are simplified examples for learning. The game does not diagnose, prescribe treatment, or replace advice from a qualified healthcare professional. Before presenting, the team should verify health-related statements with trustworthy sources and add those sources to its presentation notes.

## Run the Game

The prototype uses HTML, CSS, and JavaScript and does not require Python or a game engine.

1. Open this repository's `index.html` in a browser, or use VS Code's **Open with Live Server** command if that extension is installed.
2. Select **Start your shift**.
3. Read each neighbor's situation and choose the response that best addresses the stated barrier.
4. Read the feedback, continue through all five neighbors, and review the shift summary.

If Node.js is installed, an optional local server can be started from the project folder:

```powershell
npx http-server -p 8000
```

Then visit `http://127.0.0.1:8000` in a browser and leave the terminal running while you play. Do not run `node app.js` directly: the script uses browser APIs and is loaded by `index.html`.

## Team Workflow

Each teammate can work on a separate branch. A branch created only on one computer is not visible to others until it is pushed to the shared repository.

```powershell
git switch -c your-name/feature
git add .
git commit -m "Describe your change"
git push -u origin your-name/feature
```

Share changes by opening a pull request on GitHub and merging it into the agreed shared branch. Before starting work, update your local copy of that shared branch. Avoid having multiple people edit the same file at the same time where possible.

## Testing and Presentation Notes

Before presenting, ask someone outside the development team to play without coaching. Check whether they can start the game, understand the choices, finish the shift, and explain what the scenarios taught them. Record the feedback and any changes made afterward; do not claim testing was completed until the team has done it.

In the demonstration, explain the learning goal, controls, five barriers, how the Access Win score works, one example of a choice and its consequence, and what the team changed after testing. Identify team contributions and any AI tools or generated content used. The team should review and understand all submitted code and content.

## Challenge Goals

Your project should:

- Include at least one healthcare-related topic in its gameplay, story, or overall experience.
- Give the player meaningful things to do, decide, explore, or solve.
- Explain how the game works, including its controls, objective, player actions, and scoring or progression where applicable.
- Communicate why the healthcare topic matters.
- Demonstrate that the team understands and can explain its design and development choices.

Possible topics include health and wellness, accessibility, medical science, public health, patient experiences, and real-world healthcare systems. Possible genres include simulation, adventure or RPG, strategy, puzzle, and platformer or action.

## Step-by-Step Instructions

### 1. Form a team and choose a topic

Discuss the healthcare areas that interest your team. Choose one focused topic that can be represented clearly through a short game. Identify the audience you are designing for and what you want players to understand or think about after playing.

Write a one-sentence learning goal, such as: "After playing, players will understand that access to healthcare can be affected by transportation, cost, and available services."

### 2. Research the topic responsibly

- Use trustworthy, current sources such as public health agencies, hospitals or universities, and recognized nonprofit organizations.
- Record the source titles and links so you can cite them in your presentation or game materials.
- Check that your game does not present inaccurate health claims as facts.
- Keep the game educational. It should not diagnose players, prescribe treatment, or replace advice from a qualified healthcare professional.
- If you include sensitive or personal topics, use respectful language and avoid stereotyping people or communities.

### 3. Choose a game genre and define the core idea

Choose a genre that supports the learning goal. Describe the game in a short pitch that answers:

- Who does the player represent?
- What situation or world are they in?
- What is the player's main goal?
- How does the healthcare topic affect the player's experience?
- What should players learn, feel, or consider?

Keep the first version small enough to finish. Choose one core gameplay loop, such as exploring, making a choice, seeing its result, and trying the next challenge.

### 4. Design the gameplay

Before building, write down the following:

- **Objective:** What counts as completing the game or a level?
- **Controls:** What keys, mouse actions, touch gestures, or controller inputs can the player use?
- **Player actions:** What can the player do, and how do those actions connect to the healthcare topic?
- **Choices and consequences:** What decisions can the player make, and what feedback follows?
- **Progression:** How does the game get more challenging or reveal more information?
- **Scoring or success:** If you use points, time, resources, or another measure, explain what it represents. Do not reward behavior that contradicts the learning goal.
- **End state:** How does the player know they have succeeded, need to try again, or reached the end?
- **Feedback:** How does the game communicate results, explain a concept, or help players recover from a mistake?

The mechanics should teach through play where possible. Avoid relying only on blocks of text to deliver the lesson.

### 5. Plan the story and impact

Use characters, setting, events, or player choices to show why the healthcare issue matters. Consider how different people may experience the issue differently. Make the connection between the story and the learning goal clear without making the game feel like a lecture.

### 6. Select tools and divide team tasks

Choose the game engine, platform, art tools, and audio tools that suit your team's skills and the size of your idea. Agree on a simple task list and assign responsibilities, such as:

- Game design and writing
- Programming and implementation
- Art, animation, and user interface
- Audio and music
- Research and fact-checking
- Testing and presentation

Team members may share responsibilities. Keep track of which tools and assets you use, including any AI tools.

### 7. Build a playable prototype

Implement the smallest complete version of the game. Aim to include:

- A start screen or clear way to begin
- Instructions or discoverable controls
- At least one complete gameplay loop
- The healthcare topic integrated into play or story
- Feedback for player actions and choices
- A clear ending, success condition, or next step

Use placeholder art or sounds if needed. Make sure the core game can be played before spending time polishing optional features.

### 8. Test and improve

Ask someone who did not design the game to play it. Observe without explaining how it works, then ask:

- Could they start and understand the controls?
- Did they understand the objective and how to make progress?
- Did the healthcare topic come through during play?
- What did they learn or take away?
- Were any choices, rules, or outcomes confusing?
- Did they encounter bugs or difficulty using the game?

Fix the most important problems, then test again. Check that text is readable, instructions are clear, and the game can be completed in the time available for judging.

### 9. Prepare the presentation

Prepare a short demonstration that lets judges see the game being played. Be ready to explain:

- The healthcare topic and why your team chose it
- The intended audience and learning goal
- The genre, objective, controls, player actions, and progression or scoring
- How the story and mechanics communicate the topic
- What you learned from testing and what you changed
- The tools, sources, assets, and AI tools used
- Each team member's contribution

Be prepared to explain and discuss any AI-assisted work. Your team should understand the code, content, and design decisions included in the submission.

### 10. Run a final check

Before presenting, confirm that:

- The game runs on the device or platform you will use.
- A player can start, understand the controls, play, and reach an ending.
- The healthcare connection is clear and fact-checked.
- The game communicates why the topic matters.
- The team can explain the mechanics and development process.
- Research sources and any third-party or AI-assisted assets are acknowledged as appropriate.

## Suggested Submission Contents

Unless your event organizers specify a different format, prepare:

- A playable game or prototype
- A short description of the game, its audience, and its learning goal
- Controls, objective, player actions, and scoring or progression rules
- A list of research sources
- A brief account of tools, assets, and AI assistance used
- A short presentation or live demonstration

## Design Worksheet

Use this as a quick planning template:

```text
Game title:
Healthcare topic:
Intended audience:
Learning goal:
Genre and one-sentence pitch:
Player role and objective:
Controls:
Main player actions:
Choices and consequences:
Scoring or progression:
Story and why the topic matters:
Research sources:
Tools and team responsibilities:
How we will test the game:
AI tools or AI-assisted assets used:
```

## Learning Outcomes

By completing this challenge, participants will practice designing and implementing gameplay, creating an interactive experience, connecting a story and mechanics to a real-world topic, and using creative problem-solving to communicate ideas about health and healthcare.
