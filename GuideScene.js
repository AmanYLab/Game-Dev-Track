// Explains the difference between the 5 triage levels
class GuideScene extends Phaser.Scene {
  constructor() { super('Guide'); }

  create() {
    this.add.text(550, 35, 'ESI LEVEL GUIDE', { fontSize: '36px', color: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5);
    this.add.text(550, 78,
      'ESI 1-2 depend on HOW SICK the patient is.   ESI 3-5 depend on how many RESOURCES they need.',
      { fontSize: '17px', color: '#ffd43b' }).setOrigin(0.5);

    const levels = [
      { n: 1, name: 'Resuscitation', meaning: 'Will die without help RIGHT NOW.',
        examples: 'Not breathing / no pulse, airway swelling shut, shock from heavy bleeding, seizure that won\'t stop' },
      { n: 2, name: 'Emergent', meaning: 'Not dying this second, but HIGH RISK if they wait.',
        examples: 'Crushing chest pain (heart attack?), face drooping (stroke?), "worst headache of my life", new confusion, severe trouble breathing' },
      { n: 3, name: 'Urgent', meaning: 'Stable, but needs 2 OR MORE resources.',
        examples: 'Belly pain needing blood tests + a CT scan, possible broken hip, dehydration needing labs + IV fluids' },
      { n: 4, name: 'Less urgent', meaning: 'Stable, needs exactly 1 resource.',
        examples: 'Twisted ankle (just an X-ray), small cut (just stitches), sore throat (just a strep test)' },
      { n: 5, name: 'Non-urgent', meaning: 'Stable, needs NO resources.',
        examples: 'Prescription refill, mild cold, poison ivy rash, getting stitches removed' }
    ];

    levels.forEach((lv, i) => {
      const y = 108 + i * 94;
      this.add.rectangle(40, y, 1020, 86, 0x1b2a3b).setOrigin(0).setStrokeStyle(2, ESI_COLORS[lv.n]);
      this.add.rectangle(40, y, 170, 86, ESI_COLORS[lv.n]).setOrigin(0);
      this.add.text(125, y + 28, `ESI ${lv.n}`, { fontSize: '26px', color: '#111111', fontStyle: 'bold' }).setOrigin(0.5);
      this.add.text(125, y + 60, lv.name, { fontSize: '15px', color: '#111111' }).setOrigin(0.5);
      this.add.text(228, y + 10, lv.meaning, { fontSize: '19px', color: '#ffffff', fontStyle: 'bold' });
      this.add.text(228, y + 40, 'Examples: ' + lv.examples, { fontSize: '15px', color: '#cfe3ff', wordWrap: { width: 815 } });
    });

    this.add.text(550, 590,
      'RESOURCES = lab tests, X-ray / CT scan, IV fluids or IV medicine, stitches, a specialist.\n' +
      'NOT resources = the exam itself, pills, prescriptions, splints or crutches.',
      { fontSize: '16px', color: '#dbe7f3', align: 'center', lineSpacing: 4 }).setOrigin(0.5);

    makeButton(this, 420, 655, '[ START SHIFT ]', '#77ff99', () => this.scene.start('Game'));
    makeButton(this, 700, 655, '[ BACK ]', '#74c0fc', () => this.scene.start('HowTo'));
  }
}
