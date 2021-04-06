var mario, enemy, background, pipe, fireball, ground, coinCount,invisibleBlock,castle;
var count = 3;
var PLAY = 1;
var END = 0;
var WIN=2;
var gameState = PLAY;
var score = 0;
var enemyGroup, pipeGroup, fireballGroup, coinGroup,invisibleBlockGroup;
var coinCount=0;

function preload() {
  backgroundImg = loadImage("Images/bg.png");
  cloudImg = loadImage("Images/cloud.png");
  enemyAnimation = loadAnimation("Images/enemy1.png","Images/enemy2.png");
  marioAnimation = loadAnimation("Images/mario1.png","Images/mario2.png");
  marioJump = loadAnimation("Images/mario-jump.png");
  marioDead = loadAnimation ("Images/dead mario.png");
  pipeImg = loadImage("Images/pipeimg.png");
  groundImg = loadImage("Images/ground.png");
  cloudImg = loadImage("Images/cloud.png");
  fireballImg = loadImage("Images/fireballimg.png"); 
  textImg = loadImage("Images/text.png");
  gameOverImg = loadImage("Images/Game Over.png");
  restartImg = loadImage("Images/restartimg.png");
  coinImg = loadImage("Images/coin.png");
  marioHeadImg = loadImage("Images/mariohead.png");
  backgroundImg2 = loadImage("Images/background2.png");
  marioStanding = loadImage("Images/mario2.png");
  castleImg = loadImage("Images/castle.png");
  marioWinImg = loadAnimation("Images/mario-win.png");
}

function setup() {
  createCanvas(2130, 800);
  mario = createSprite(50,680,30,30);
  mario.shapeColor = "orange";
  mario.debug = true;
  mario.addAnimation("Walking",marioAnimation);
  mario.addAnimation("mario jump",marioJump);
  mario.addAnimation("mario dead", marioDead);
  mario.addAnimation("mario standing", marioStanding);
  mario.addAnimation("mario winning", marioWinImg);
  mario.scale=0.5
  ground = createSprite(1065, 790, 2500, 10);
  ground.x = ground.width/2+100;

  ground.addImage("ground",groundImg);
  coinsCount = createSprite(200,50,10,10);
  coinsCount.addImage(coinImg);

  marioHead = createSprite(50,50,10,10);
  marioHead.addImage(marioHeadImg);

  gameOver = createSprite(1060,300,10,10);
  gameOver.scale = 0.5;
  gameOver.addImage(gameOverImg);

  invisibleGround = createSprite(1065, 795, 2500, 50);
  invisibleGround.x = invisibleGround.width/2;
  invisibleGround.visible = false;
  
  restart=createSprite(1065,400,10,10);
  restart.addImage("restart",restartImg);
  restart.scale=0.5;
  enemyGroup = createGroup();
  pipeGroup = createGroup();
  fireballGroup = createGroup();
  coinGroup = createGroup();
  invisibleBlockGroup=createGroup();
}
function draw() {
  if(coinCount>=150){
    background(backgroundImg2);
  }else{
    background("skyBlue");
  }
 
  drawSprites();
  fill("black");
  textFont("monospace");
  textSize(35);
  text("x",230,60);
  text(coinCount,260,60);
  text("x",75,60);
  text("score : "+score,360,60);
  text(count,100,60);
  if(gameState === PLAY){
    mario.changeAnimation("Walking",marioAnimation);
    score = score+Math.round(getFrameRate()/50);
    restart.visible=false;
    gameOver.visible = false;
    if(coinCount>=50){
       
      ground.velocityX = -(5+coinCount/50);
    }
    else{
      ground.velocityX = -5;
    }

    if(ground.x<1065){
      ground.x = ground.width/2;
    }
    if(keyWentDown("space") && mario.y>702){
      mario.velocityY = -20;
      //mario.changeAnimation("mario jump",marioJump);
    }
    //console.log(mario.y);
    mario.velocityY+=0.8;
    if(keyDown("B")){
      fireball = createSprite(mario.x,mario.y,10,10);
      fireball.addImage("fireball",fireballImg);
      fireball.velocityX = 3;
      fireball.shapeColor = "red";
      fireball.depth = mario.depth;
      mario.depth +=1;
      fireball.lifetime = 425;
      fireballGroup.add(fireball);
    }
    spawnEnemies();
    spawnPipes();
    spawnCoins();

    if(enemyGroup.isTouching(mario)){
			//score=score-1;
			count = count-1;
      gameState = END;
    }

    if(invisibleBlockGroup.isTouching(mario)){
      //coinCount = coinCount-1;
      //score = score-10;
      mario.velocityY=0;
      mario.changeAnimation("mario standing", marioStanding)
      //mario animation or in end state
    }

   
    if(enemyGroup.isTouching(fireballGroup)){
      enemyGroup.destroyEach();
      fireballGroup.destroyEach();
    }

    for(var i=0; i <enemyGroup.length;i++){
    if(enemyGroup.get(i).isTouching(fireballGroup)){
      enemyGroup.get(i).destroy();  
      fireballGroup.destroyEach();
    }

  }
    for(var j =0; j<coinGroup.length;j++){
    if(coinGroup.get(j).isTouching(mario)){
      coinCount+=1;
      coinGroup.get(j).destroy();
      console.log(coinGroup.get(j))
    }
    
  }
  if(coinCount>=300){
    spawnCastle();
    if(castle.isTouching(mario)){ 
      gameState = WIN;
   }
   if(keyDown(RIGHT_ARROW)){
     mario.x=mario.x+5;
   }
  }
 

 
}

  if(gameState === END){
    if(count===0){
      if(mousePressedOver(restart)){
        
        resetGame();
      }
    }
    if(count!==0){
      if(mousePressedOver(restart)){
      
        reset();
      }
    }
    ground.velocityX = 0;
    enemyGroup.setVelocityXEach(0);
    pipeGroup.setVelocityXEach(0);
    invisibleBlockGroup.setVelocityXEach(0);
    mario.velocityY = 0;  
    enemyGroup.setLifetimeEach(-1);
    pipeGroup.setLifetimeEach(-1);
    coinGroup.setLifetimeEach(-1);
    invisibleBlockGroup.setLifetimeEach(-1);
    coinGroup.setVelocityXEach(0);
    mario.changeAnimation("mario dead",marioDead);
    restart.visible=true;
    gameOver.visible = true;
    //console.log("alkjsdh");
  
  }

  if(gameState === WIN){
    ground.velocityX = 0;
    enemyGroup.setVelocityXEach(0);
    pipeGroup.setVelocityXEach(0);
    invisibleBlockGroup.setVelocityXEach(0);
    mario.velocityY = 0;  
    enemyGroup.setLifetimeEach(-1);
    pipeGroup.setLifetimeEach(-1);
    coinGroup.setLifetimeEach(-1);
    invisibleBlockGroup.setLifetimeEach(-1);
    coinGroup.setVelocityXEach(0);
    mario.changeAnimation("mario winning", marioWinImg);
    textSize(50);
    text("THE PRINCESS WAS RESCUED", 750, 300);
    restart.visible = true;
    if(mousePressedOver(restart)){
        
      resetGame();
    }
  }

  mario.collide(invisibleGround);
}
function reset(){
  gameState = PLAY;
  coinGroup.destroyEach();
  enemyGroup.destroyEach();
  pipeGroup.destroyEach();
  invisibleBlockGroup.destroyEach();
 
}
function resetGame(){
  gameState = PLAY;
  score = 0;
  coinCount = 0;
  count = 3;
  mario.x=50;
  coinGroup.destroyEach();
  enemyGroup.destroyEach();
  pipeGroup.destroyEach();
  invisibleBlockGroup.destroyEach()
  castle.destroy();
 
}

function spawnEnemies(){
  if(frameCount%130===0){
    enemy = createSprite(2130,730,30,30);
    
    enemy.addAnimation("running",enemyAnimation);
    if(coinCount>=50){
       
      enemy.velocityX = -(5+coinCount/50);
    }
    else{
      enemy.velocityX = -5;
    }
    
    enemy.lifetime = 425;
    enemy.scale = 0.2;
    enemy.shapeColor = "brown";
    enemyGroup.add(enemy);
  }
}

function spawnPipes(){
  if(frameCount%100===0){
    pipe = createSprite(2130,700,10,10);
    pipe.addImage("pipe",pipeImg)
    invisibleBlock=createSprite(pipe.x,630,60,10);
    
    pipe.scale=0.7
    if(coinCount>=50){
       
      pipe.velocityX = -(5+coinCount/50);
     
    }
    else{
      pipe.velocityX = -5;
    }
    //pipe.velocityX = -5;
    invisibleBlock.velocityX=pipe.velocityX;
    invisibleBlock.visible = false;
    pipe.lifetime = 425;
    invisibleBlock.lifetime = pipe.lifetime;
    pipe.shapeColor = "green";

    pipeGroup.add(pipe);
    invisibleBlockGroup.add(invisibleBlock)
  }
}

function spawnCoins(){
  if(frameCount%200===0){
    for(var i =0;i<=5;i++){
      coin = createSprite(2230 + i*20,500,10,10);
      coin.addImage("coin", coinImg);
      coin.shapeColor = "yellow";
      coin.velocityX = -4;
      coin.lifetime = 1000;
      coinGroup.add(coin);
    }
  }
}
function spawnCastle(){
  castle=createSprite(2000,620,10,10);
  castle.addImage(castleImg)
  castle.debug = true;
  castle.setCollider("rectangle",0,0,100,200);
  castle.depth=mario.depth;
  mario.depth=mario.depth+1;
}
//Make an if loop that switches the arena which is level 2. 
//If coincount is equal to 100 then this will come.

