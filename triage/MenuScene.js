// Title screen
class MenuScene extends Phaser.Scene {
  constructor() { super('Menu'); }

  create() {
    this.add.text(550, 200, 'TRIAGE GAME', { fontSize: '68px', color: '#ffffff', fontStyle: 'bold' }).setOrigin(0.5);
    this.add.text(550, 310,
      'It\'s a Friday night in a busy Columbus ER and you\'re the triage nurse.\n' +
      'You can\'t treat everyone at once. Who gets care first?',
      { fontSize: '22px', color: '#cfe3ff', align: 'center', lineSpacing: 8 }).setOrigin(0.5);

    makeButton(this, 550, 420, '[ START SHIFT ]', '#77ff99', () => this.scene.start('Game'));
    makeButton(this, 550, 490, '[ HOW TO PLAY ]', '#74c0fc', () => this.scene.start('HowTo'));
    makeButton(this, 550, 560, '[ ALL GAMES ]', '#ffd43b', () => { window.location.href = '../'; });
  }
}

// Reusable button helper (used by other scenes too)
function makeButton(scene, x, y, label, color, onClick) {
  const btn = scene.add.text(x, y, label, {
    fontSize: '30px', color, backgroundColor: '#22344a', padding: { x: 18, y: 8 }
  }).setOrigin(0.5).setInteractive({ useHandCursor: true });
  btn.on('pointerover', () => btn.setColor('#ffffff'));
  btn.on('pointerout', () => btn.setColor(color));
  btn.on('pointerdown', onClick);
  return btn;
}
