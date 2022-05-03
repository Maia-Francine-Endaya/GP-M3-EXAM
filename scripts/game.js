var config = {
  type: Phaser.AUTO,
  width: 2000,
  height: 800,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var game = new Phaser.Game(config);

var platforms;
var player;
var coins;
var cursors;

function preload() {
  this.load.image('background', './assets/images/Background.png');
  this.load.image('ground', './assets/images/Stone_Ground.PNG');
  this.load.image('bigCoin', './assets/images/Gold_Coin.PNG');
  this.load.image('midCoin', './assets/images/Silver_Coin.PNG');
  this.load.image('smallCoin', './assets/images/Bronze_Coin.PNG');
  this.load.image('merchant', './assets/images/Merchant.PNG');
  this.load.spritesheet('thief', './assets/images/Thief.PNG', { frameWidth: 32, frameHeight: 38 });
};

function create() {

  //Platforms
  platforms = this.physics.add.staticGroup();

  platforms.create(100, 780, 'ground');
  platforms.create(350, 780, 'ground');
  platforms.create(600, 780, 'ground');
  platforms.create(850, 780, 'ground');
  platforms.create(1100, 780, 'ground');
  platforms.create(1350, 780, 'ground');
  platforms.create(1600, 780, 'ground');
  platforms.create(1850, 780, 'ground');

  //Coins
  coins = this.physics.add.staticGroup();

  coins.create(250, 743, 'bigCoin');
  coins.create(370, 747, 'smallCoin');
  coins.create(567, 745, 'midCoin');
  coins.create(621, 747, 'smallCoin');
  coins.create(675, 747, 'smallCoin');
  coins.create(812, 743, 'bigCoin');
  coins.create(903, 745, 'midCoin');

  //Player
  player = this.physics.add.sprite(100, 450, 'thief');

  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('thief', { start: 4, end: 7 }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'idle',
    frames: [{ key: 'thief', frame: 1 }],
    frameRate: 20
  });

  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('thief', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });

  //Cursors
  cursors = this.input.keyboard.createCursorKeys();

  //Physics
  this.physics.add.collider(player, platforms);
  this.physics.add.overlap(player, coins, collectCoin, null, this);
};

function update() {
  if (cursors.left.isDown) {
    player.setVelocityX(-160);

    player.anims.play('left', true);
  }
  else if (cursors.right.isDown) {
    player.setVelocityX(160);

    player.anims.play('right', true);
  }
  else {
    player.setVelocityX(0);

    player.anims.play('idle');
  }

  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-330);
  }

};

function collectCoin(player, coins) {
  coins.disableBody(true, true);
}