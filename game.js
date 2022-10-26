var config = {
    type : Phaser.AUTO, 
    width:2000,
    height :1200,
    parent:'gameContainer',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },

    scene: {
        preload: preload,
        create: create,
        update : update,
    },

    physics:{
        default:'arcade',
        arcade :{
            gravity :{ y : 0 },
            debug :false
        }
    }

};

var game = new Phaser.Game(config);
var scene;
var player;
var keyUp, keyDown, keyLeft, keyRight;
var keyFire01, keyFire02, keyFire03;
var bulletSpeed = 1200;
var playerBulletGrp;

var ufoAll;
var ufoSpacing = 220;

var mineAll;
var mineSpacing = 220;

var explosionAll;

var ufoLightGrp;

var playerStarPower = 10;

var starPowerGrp;

var score =0;
var gameOver = false;
var scoreText;




function preload(){
    // console.log('preloading');
    scene = this;

    //background game music
    scene.load.audio('gameMusic', ['./assets/sound/mixkit-trance-party-166.mp3', './assets/sound/mixkit-space-game-668.mp3']);

    //player bullet sound X rocket gun
    scene.load.audio('shootSound-X','./assets/sound/mixkit-falling-hit-757.wav' );
    //player bullet sound Z fire 
    scene.load.audio('shootSound-Z','./assets/sound/mixkit-wizard-fire-woosh-1326.wav' );
    //player bullet sound C Big Rocket fire 
    scene.load.audio('shootSound-C','./assets/sound/mixkit-sea-mine-explosion-1184.wav' );

    //enemy destroy sound
    scene.load.audio('destroySound','./assets/sound/explosion_01-6225.mp3' );

    

    //set background game
    scene.load.image('background' , './assets/img/planets_galaxy_stars_146448_1920x1200.jpg');


    scene.load.image('rocket','./assets/img/rocket03.png');

    scene.load.image('rocket_bullet', './assets/img/bullet02.png');
    scene.load.image('fire_bullet', './assets/img/bullet03.png');
    scene.load.image('bigRocket_bullet', './assets/img/bullet05.png');

    scene.load.image('ufo01', './assets/img/enemy_ufo01.png');

    scene.load.image('mine01', './assets/img/enemy_mine01.png');
    scene.load.image('meteorite01', './assets/img/meteorite01.png');

    scene.load.image('explosion01', './assets/img/explosion01.png');
    scene.load.image('explosion02', './assets/img/explosion02.png');
    scene.load.image('explosion03', './assets/img/explosion03.png');
    scene.load.image('explosion04', './assets/img/explosion04.png');
    scene.load.image('explosion11', './assets/img/explosion11.png');

    //Player has destroy
    scene.load.image('playerExplosion01', './assets/img/player_explosion1.png');

    //UFO light
    scene.load.image('ufo_light1', './assets/img/ufo_light1.png');

    //Player Star Power
    scene.load.image('playerPower', './assets/img/star_power.png');

}

//set sound variable



function create(){

    //create sound effect for game
    let gameMusic = this.sound.add('gameMusic');
    gameMusic.play();

    
     var shootSoundX  = this.sound.add('shootSound-X');
     this.input.keyboard.on('keydown-X' , function(){
        shootSoundX.play();
    })

     var shootSoundZ  = this.sound.add('shootSound-Z');
     this.input.keyboard.on('keydown-Z' , function(){
        shootSoundZ.play();
    })

    var shootSoundC  = this.sound.add('shootSound-C');
    this.input.keyboard.on('keydown-C' , function(){
       shootSoundC.play();
   })


    // var destroySound = this.sound.add('destroySound');
    // destroySound.on('destroy', listener);

  


    //load background

    this.add.sprite(0,0,'background').setOrigin(0,0);


  


    // console.log('create');
   createPlayer();

   playerBulletGrp = scene.add.group();

   ufoAll = scene.add.group();
   ufoLightGrp = scene.add.group();

   createUFO();

   mineAll = scene.add.group();
   createMine();
   createMeteorite();

   // game UI
   powerGrp = scene.add.group();
    createPlayerPower();

   //check collisions UFO
   scene.physics.add.overlap(ufoAll, playerBulletGrp , onUFOhit );
      //check collisions mine
   scene.physics.add.overlap(mineAll, playerBulletGrp , onMineHit );

    //check collisions meteorite
    scene.physics.add.overlap(mineAll, playerBulletGrp , onMeteoriteHit );

      //check collisions Player with enemy bullet
    scene.physics.add.overlap(player ,ufoLightGrp, onPlayerHit);

    //check collisions Player with ufoAll
    scene.physics.add.overlap(player ,ufoAll, onPlayerHit);

    
    //check collisions Player with mineAll
    scene.physics.add.overlap(player ,mineAll, onPlayerHit);




 

   explosionAll = scene.add.group();

    keyUp = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    keyDown = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    keyLeft = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    keyRight = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

    keyFire01 = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);

    keyFire02 = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);

    keyFire03 = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    
}


function createPlayer(){
    player = scene.physics.add.sprite(config.width/2, config.height/2, 'rocket');

    player.speed = 500;
    player.setScale(0.25);

    //when player Hits by enemy
     player.immortal = false;

}

function createUFO() {
    for (var i=0 ; i<8; i++ ){
        var ufo = scene.physics.add.sprite(2000, 200 + (i * ufoSpacing),'ufo01');  // ufo space y-axis
        ufo.setScale(0.5);

        ufo.speed = (Math.random()*2) +1 ;
        ufo.startX = config.width + (ufo.width/2);
        ufo.startY = 100 + (i * ufoSpacing);
        ufo.x = ufo.startX;
        ufo.y = ufo.startY;
        ufo.magnitude = Math.random() * 250;
        ufo.fireInterval = (Math.random() * 1500) +1500 ;
        ufo.fireTimer = scene.time.addEvent({
            delay: ufo.fireInterval,
            args :[ufo],
            callback : ufoFire,
            repeat : -1
        });

        ufoAll.add(ufo);
    }
}

function createMine(){
    for (var i=0;i<7; i++) {
        var mine = scene.physics.add.sprite(2000, 200 + (i* mineSpacing), 'mine01'); //nine space y-axis
        mine.setScale(0.75);

        mine.speed = (Math.random()*2) +1 ;
        mine.startX = config.width + (mine.width/2);
        mine.x = mine.startX;

        mineAll.add(mine);
    }

}

function createMeteorite(){
    for (var i=0;i<10; i++) {
        var meteorite = scene.physics.add.sprite(1000, 200 + (i* mineSpacing), 'meteorite01'); //nine space y-axis
        meteorite.setScale(0.25);

        meteorite.speed = (Math.random()*1.5) +1 ;
        meteorite.startX = config.width + (meteorite.width/2);
        meteorite.x = meteorite.startX;

        mineAll.add(meteorite);
    }

}

function createPlayerPower(){
    for(let i=0; i<playerStarPower; i++){
        let power = scene.add.sprite(40 +(i*65),40,'playerPower');
        power.setScale(0.1);

        power.depth = 10;

        powerGrp.add(power);
    }
}

function update(){
    updatePlayer();
    updatePlayerBullet();
    updateUFO();
    updateMine();
    updateMeteorite();

    updateExplosions();

    updateUFOBullets();

}

function updatePlayer(){
    // console.log('update');
    if(keyUp.isDown){
        player.setVelocityY(-player.speed);
    } 
    else if (keyDown.isDown){
        player.setVelocityY(player.speed);
    }
   
    else{
        player.setVelocityY(0);
    }

        //check for left right keys
   if (keyLeft.isDown){
        player.setVelocityX(-player.speed);
    }
    else if (keyRight.isDown){
        player.setVelocityX(player.speed);
    }
    else{
        player.setVelocityX(0);
    }

    if(player.y<0 +(player.getBounds().height/2)) {
        // console.log('hit the top screen')
        player.y = (player.getBounds().height/2);
    }
    else if(player.y > config.height -(player.getBounds().height/2)){
        // console.log('hit the bottom screen ')
        player.y = config.height -(player.getBounds().height/2);
    }

    if(player.x<0 +(player.getBounds().width/2)) {
        // console.log('hit the left screen')
        player.x = (player.getBounds().width/2);
    }
    else if(player.x > config.width -(player.getBounds().width/2)){
        // console.log('hit the right screen ')
        player.x = config.width -(player.getBounds().width/2);
    }

    //check for space bar tp rocket fire

    if(Phaser.Input.Keyboard.JustDown(keyFire03)){
        // console.log('rocket fire!');
        fire_bullet();
    }
    else if(Phaser.Input.Keyboard.JustDown(keyFire02)){
        // console.log('rocket fire!');
        rocket_fire();
    }
    else if(Phaser.Input.Keyboard.JustDown(keyFire01)){
        // console.log('rocket fire!');
        bigRocket_bullet();
    }
}

function updatePlayerBullet() {
    for (var i = 0 ; i<playerBulletGrp.getChildren().length; i++) {
        // console.log(playerBulletGrp.getChildren()[i]);

        var bullet = playerBulletGrp.getChildren()[i];
        bullet.rotation += 0;

        if (bullet.x > config.width) {
            bullet.destroy();
        }
    }

    // console.log('===========')
}


function updateUFO() {
    for (var i=0 ; i< ufoAll.getChildren().length; i++){
        var enemy = ufoAll.getChildren()[i];
        enemy.x -= enemy.speed;
        //enemy move as sinewave
        enemy.y = enemy.startY + (Math.sin(game.getTime()/1000)* enemy.magnitude);



        if (enemy.x < 0 - (enemy.width/2) ){
            enemy.speed = (Math.random()*5) +1;
            enemy.x = enemy.startX;
            enemy.magnitude = Math.random() *60 ;
        }
    }
}

function updateMine() {
    for (var i=0 ; i< mineAll.getChildren().length; i++){
        var enemy = mineAll.getChildren()[i];
        enemy.rotation += 0.01;
        enemy.x -= enemy.speed;

        if (enemy.x < 0 - (enemy.width/2) ){
            enemy.x = enemy.startX;
        }
    }
}

function updateMeteorite() {
    for (var i=0 ; i< mineAll.getChildren().length; i++){
        var enemy = mineAll.getChildren()[i];
        enemy.rotation += 0.02;
        enemy.x -= enemy.speed;

        if (enemy.x < 0 - (enemy.width/2) ){
            enemy.x = enemy.startX;
        }
    }
}

//make explosion effect
function updateExplosions() {
    for(let i= explosionAll.getChildren().length-1; i>=0; i-- ){
        let explosion = explosionAll.getChildren()[i];
        explosion.rotation += 0.04;

        explosion.scale += 0.02;

        explosion.alpha -= 0.05;

        if(explosion.alpha<=0) {
            explosion.destroy();
        }
    }
}


function updateUFOBullets() {
    for(let i=0; i< ufoLightGrp.getChildren().length;i++){
        let ufo_light = ufoLightGrp.getChildren()[i];

        if(ufo_light.x < 0 - (ufo_light.width/2)) {
            ufo_light.destroy();
        }
    }
}




//create function rocket to fire
function fire_bullet() {


    console.log("fire a bullet fire");
    var bullet_fire = scene.physics.add.sprite(player.x+50, player.y+10, 'fire_bullet');
    
    bullet_fire.body.velocity.x = bulletSpeed;
    

    playerBulletGrp.add(bullet_fire);

    console.log(playerBulletGrp.children);

}
function rocket_fire() {
    console.log("fire a rocket bullet");
    var rocket_fire = scene.physics.add.sprite(player.x+50, player.y+10, 'rocket_bullet');
    rocket_fire.setScale(1.5);
    rocket_fire.body.velocity.x = bulletSpeed;

    playerBulletGrp.add(rocket_fire);
}

function bigRocket_bullet() {
    console.log("fire a Big Mine!");
    var bigRocket_bullet = scene.physics.add.sprite(player.x+50, player.y+10, 'bigRocket_bullet');
    bigRocket_bullet.setScale(0.5);
    bigRocket_bullet.body.velocity.x = bulletSpeed;

    playerBulletGrp.add(bigRocket_bullet);
}




// attack UFO
function onUFOhit(ufo, bullet) {

    createExplosionUFO(ufo.x , ufo.y);

    bullet.destroy();
    ufo.x = ufo.startX;  //ufo reset position
    ufo.speed = (Math.random() * 2 ) +1;
}


function createExplosionUFO(posX, posY) {
    var explosion11 = scene.add.sprite(posX, posY, 'explosion11');
    explosion11.setScale(0.1);
    explosion11.rotation = Phaser.Math.Between(0,360);

    var explosion03 = scene.add.sprite(posX, posY , 'explosion03');
    explosion03.setScale(0.2);
    explosion03.rotation = Phaser.Math.Between(0,360);

    explosionAll.add(explosion11)
    explosionAll.add(explosion03)

}


// attack mine bomb
function onMineHit (mine, bullet) {
    createExplosionMine(mine.x , mine.y);

    bullet.destroy();
    mine.x = mine.startX;  //mind reset position
    mine.speed = (Math.random() * 2 ) +1;
}
function createExplosionMine(posX, posY) {
    var explosion02 = scene.add.sprite(posX, posY, 'explosion01');
    explosion02.setScale(0.25);
    explosion02.rotation = Phaser.Math.Between(0,360);

    var explosion04 = scene.add.sprite(posX, posY, 'explosion04');
    explosion04.setScale(0.2);
    explosion04.rotation = Phaser.Math.Between(0,360);

    explosionAll.add(explosion02)
    explosionAll.add(explosion04)
}


// attack meteorite attack 
function onMeteoriteHit(meteorite, bullet) {
    createExplosionMeteorite(meteorite.x ,meteorite.y);

    bullet.destroy();
    meteorite.x = meteorite.startX;  //meteorite reset position
    meteorite.speed = (Math.random() * 2 ) +1;
}

function createExplosionMeteorite(posX, posY) {
    var explosion01 = scene.add.sprite(posX, posY, 'explosion01');
    explosion01.setScale(0.35);
    explosion01.rotation = Phaser.Math.Between(0,360);

    explosionAll.add(explosion01)
  
}




function ufoFire(enemy) {
    let ufo_light = scene.physics.add.sprite(enemy.x, enemy.y, 'ufo_light1');
    ufo_light.setScale(0.1);
    ufo_light.body.velocity.x = -bulletSpeed;

    ufoLightGrp.add(ufo_light);


}

// create function player has destroyed

function createExplosionPlayer(posX, posY){
    var playerExplosion01 = scene.add.sprite(posX, posY , 'playerExplosion01');
    playerExplosion01.setScale(0.03);
    playerExplosion01.rotation = Phaser.Math.Between(0,360);

    explosionAll.add(playerExplosion01);
}


function onPlayerHit(player, obstacle) {

    // use function player has destroyed or attack by obstacle show effect 
    // createExplosionPlayer(player.x, player.y);
    createExplosionPlayer(obstacle.x, obstacle.y);
    obstacle.destroy();
    

    if(player.immortal == false) {
        if(obstacle.texture.key == "ufo_light1"){
                obstacle.destroy();
        }
    
        
        //when player power has decreased 
    
        playerStarPower--;
        if(playerStarPower<=0){
            playerStarPower ===0;
            
            console.log('Game Over!');
        }
    
        updatePlayerPower();
        

        //player delay 15 time when attack
        player.immortal = true;
        player.flickerTimer = scene.time.addEvent({
            delay : 100,
            callback: playerFlickering,
            repeat : 15
        });
    
    }
    } 

    function playerFlickering() {
        player.setVisible(!player.visible);

            // reset to visible
        if(player.flickerTimer.repeatCount ==0) {
            player.immortal = false;
            player.setVisible(true);
            player.flickerTimer.remove();
        }
    }

    

function updatePlayerPower(){
    for(let i=powerGrp.getChildren().length-1; i>=0 ; i-- ){
        if(playerStarPower< i+1){
            powerGrp.getChildren()[i].setVisible(false);
        } 
        else{
            powerGrp.getChildren()[i].setVisible(true);
        }
    }
}