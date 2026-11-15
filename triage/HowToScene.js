// Instructions screen
class HowToScene extends Phaser.Scene {
  constructor() { super('HowTo'); }

  create() {
    this.add.text(550, 50, 'HOW TO PLAY', { fontSize: '40px', color: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5);

    const lines = [
      '1.  Patients arrive in the WAITING ROOM (left). Click one to read their complaint.',
      '2.  Decide how urgent they are and assign a triage level, ESI 1 to 5',
      '     (click a button or press keys 1-5). ESI 1 = most urgent, ESI 5 = least urgent.',
      '3.  Triaged patients wait for a bed. Lower ESI numbers go first. ESI 1 patients',
      '     go straight to the RESUS BAY.',
      '4.  UNDERTRIAGE a sick patient (call them less urgent than they are) and they may wait',
      '     too long and have a bad outcome. OVERTRIAGE and you fill beds sicker people need.',
      '5.  Leave people in the waiting room too long and they get worse or leave without being seen.',
      '6.  Your shift lasts 3 minutes, and patients arrive faster as the night goes on.',
      '',
      'SCORING:   +100 correct triage    +20 overtriage    -50 undertriage',
      '                  +20 patient treated    -150 bad outcome    -40 left without being seen',
      '',
      'New to triage? Check the ESI LEVEL GUIDE to see how the 5 levels differ.'
    ];
    this.add.text(70, 105, lines.join('\n'), { fontSize: '20px', color: '#cfe3ff', lineSpacing: 9 });

    makeButton(this, 290, 630, '[ START SHIFT ]', '#77ff99', () => this.scene.start('Game'));
    makeButton(this, 590, 630, '[ ESI LEVEL GUIDE ]', '#ffd43b', () => this.scene.start('Guide'));
    makeButton(this, 870, 630, '[ BACK ]', '#74c0fc', () => this.scene.start('Menu'));
  }
}
