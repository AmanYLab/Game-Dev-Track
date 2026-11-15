const config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: 1100,
  height: 700,
  backgroundColor: '#14202e',
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: [MenuScene, HowToScene, GuideScene, GameScene, EndScene]
};

new Phaser.Game(config);
