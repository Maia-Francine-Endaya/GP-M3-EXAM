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

function preload() {
  this.load.image('background', './assets/images/Background.png');
  this.load.image('thief', './assets/images/Thief.PNG');
  this.load.image('ground', './assets/images/Stone_Ground.PNG');
  this.load.image('bigCoin', './assets/images/Gold_Coin.PNG');
  this.load.image('midCoin', './assets/images/Silver_Coin.PNG');
  this.load.image('smallCoin', './assets/images/Bronze_Coin.PNG');
  this.load.image('merchant', './assets/images/Merchant.PNG');
};

function create() {

  platforms = this.physics.add.staticGroup();

  platforms.create(100, 780, 'ground');
  platforms.create(350, 780, 'ground');
  platforms.create(600, 780, 'ground');
  platforms.create(850, 780, 'ground');
  platforms.create(1100, 780, 'ground');
  platforms.create(1350, 780, 'ground');
  platforms.create(1600, 780, 'ground');
  platforms.create(1850, 780, 'ground');

  //Player TO DO: TWEAK THE CODE
  player = this.physics.add.sprite(100, 450, 'thief');

  player.setBounce(0.2);
  player.setCollideWorldBounds(false);
  player.body.setGravityY(290);

  //Player Animation
  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'turn',
    frames: [{ key: 'dude', frame: 4 }],
  });

  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
  });

  //Coins
  coins = this.physics.add.group({
    key: 'coin',
    repeat: 13,
    setXY: { x: 100, y: 0, stepX: 130 }
  });

  coins.children.iterate(function (child) {
    child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.4));
  });

  //Goal
  goal = this.physics.add.staticGroup();
  goal.create(40, 220, 'goal');


  //Cursors
  cursors = this.input.keyboard.createCursorKeys();

  //Physics
  this.physics.add.collider(player, platforms);
  this.physics.add.collider(coins, platforms);

  this.physics.add.overlap(player, coins, collectCoin, null, this);
  this.physics.add.overlap(player, goal, winFunction, null, this);
  this.physics.add.overlap(player, hazards, loseLives, null, this);
  ;

  function update() {
    //Player Movement
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
      player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down) {
      player.setVelocityY(-330);
    }
  }

  //Function of adding score and number of coins collected
  function collectCoin(player, coins) {

    coins.disableBody(true, true);

    score += 10;
    coinsCollected += 1;

    scoreText.setText('Score: ' + score);
    collectedText.setText('Coins Collected: ' + coinsCollected);
  }

  //Function of ending the game when goal is reached
  function winFunction(player, goal) {
    this.physics.pause();

    goal.disableBody(true, true);

    //Win Text
    winText = this.add.text(600, 300, 'YOU WIN!', { fontSize: '100px', fill: '#000' });

    player.setTint(0xffb608);
    player.anims.play('turn');
    win = true;
  }
}

//Function of subtracting lives as player collides with hazards
function loseLives(player, hazards) {

  lives -= 1;
  livesCounter.setText('Lives Left: ' + lives)

  if (lives == 0) {
    this.physics.pause();
    player.setTint(0xbd0000);
    player.anims.play('turn');

    gameOverText = this.add.text(600, 300, 'YOU LOSE!', { fontSize: '100px', fill: '#000' })
    gameOver = true;
  }
}