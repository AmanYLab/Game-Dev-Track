class EndScene extends Phaser.Scene {
  constructor() { super('End'); }

  init(data) { this.stats = data.stats; }

  create() {
    const s = this.stats;
    const acc = s.triaged ? Math.round(100 * s.correct / s.triaged) : 0;
    const mis = s.triaged ? 100 - acc : 0;

    let rank = 'Nursing Student';
    if (acc >= 85 && s.bad === 0) rank = 'Charge Nurse';
    else if (acc >= 70 && s.bad <= 1) rank = 'Experienced Triage Nurse';
    else if (acc >= 50) rank = 'New Grad Nurse';

    this.add.text(550, 40, 'SHIFT OVER', { fontSize: '44px', color: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5);
    this.add.text(550, 88, `Rank: ${rank}`, { fontSize: '24px', color: '#ffd43b' }).setOrigin(0.5);

    this.add.text(70, 130, [
      `Final score:              ${s.score}`,
      `Patients triaged:         ${s.triaged}`,
      `Triage accuracy:          ${acc}%`,
      `Overtriaged:              ${s.over}`,
      `Undertriaged:             ${s.under}`,
      `Patients treated:         ${s.treated}`,
      `Bad outcomes:             ${s.bad}`,
      `Left without being seen:  ${s.lwbs}`
    ].join('\n'), { fontSize: '18px', color: '#cfe3ff', fontFamily: 'monospace', lineSpacing: 6 });

    this.add.text(560, 130,
      `Your mistriage rate: ${mis}%\n` +
      'Real ERs: about 32% in a study of\n5.3 million visits (Sax et al., 2023).\n\n' +
      'Triage is hard because nurses decide in\nseconds with incomplete information, and\nevery wrong call either delays someone\nsick or uses up a bed.',
      { fontSize: '17px', color: '#ffffff', lineSpacing: 4 });

    // Real facts with sources
    this.add.text(70, 380, 'WHY IT MATTERS', { fontSize: '18px', color: '#ff6b6b', fontStyle: 'bold' });
    const picks = Phaser.Utils.Array.Shuffle([...FACTS]).slice(0, 3);
    let y = 410;
    picks.forEach(f => {
      const t = this.add.text(70, y, `• ${f.text}`, { fontSize: '16px', color: '#dbe7f3', wordWrap: { width: 960 } });
      y += t.height + 2;
      this.add.text(90, y, `Source: ${f.src}`, { fontSize: '12px', color: '#6c829a' });
      y += 24;
    });

    makeButton(this, 420, 650, '[ PLAY AGAIN ]', '#77ff99', () => this.scene.start('Game'));
    makeButton(this, 700, 650, '[ MENU ]', '#74c0fc', () => this.scene.start('Menu'));
  }
}
