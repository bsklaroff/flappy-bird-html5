// Get access to canvas in HTML file
var canvas = document.getElementById('game_canvas');
var context = canvas.getContext('2d');



//-------------------------------------------//
//---------- GAME GLOBAL VARIABLES ----------//
//-------------------------------------------//
// Game dimensions
var scale = 3;
var width = 144;
var height = 257;
// Set canvas dimensions to correct width and height
canvas.width = width * scale;
canvas.height = height * scale;
var pc = {
  w: 26,
  h: 160,
  xv: 1.6,
  gap_height: 50,
  wait_time: 50,
  start_x: width + 50,
  min_y: 70,
  max_y: 180
};
var pb = {
  w: 52,
  h: 29,
  x: width / 2 - 26,
  y: height / 2 - 14
};
var gameState;
var ground;
var bird;
var pipes;
var pipeTimer;
var score;
var gameTimer;
//
// ADD MORE VARIABLES HERE!!!
//


//---------------------------------------//
//---------- PRELOADING IMAGES ----------//
//---------------------------------------//
// Create mapping from image names to objects
var imgs = {};
var addImg = function(name, src) {
  imgs[name] = new Image();
  imgs[name].src = src;
  imgs[name].onload = function() {
    imageLoaded();
  }
  numImages++;
};
// Ensure all images have loaded before starting the game
var numImages = 0;
var numLoaded = 0;
var imageLoaded = function() {
  numLoaded++;
  if (numLoaded === numImages) {
    resetGame();
  }
};
// Define images
addImg('bg', 'imgs/background.png');
addImg('bird_up', 'imgs/bird_up.png');
addImg('ground', 'imgs/ground.png');
addImg('pipe_top', 'imgs/pipe_top.png');
addImg('pipe_bottom', 'imgs/pipe_bottom.png');
addImg('play_btn', 'imgs/play_btn.png');
addImg('0', 'imgs/zero.png');
addImg('1', 'imgs/one.png');
addImg('2', 'imgs/two.png');
addImg('3', 'imgs/three.png');
addImg('4', 'imgs/four.png');
addImg('5', 'imgs/five.png');
addImg('6', 'imgs/six.png');
addImg('7', 'imgs/seven.png');
addImg('8', 'imgs/eight.png');
addImg('9', 'imgs/nine.png');
//
// ADD MORE IMAGES HERE!!!
//


//-----------------------------------------//
//---------- GAME INITIALIZATION ----------//
//-----------------------------------------//
//
// ADD MORE RESET FUNCTIONS HERE!!!
//
// Initialize game objects and start game loop
var resetGame = function() {
  clearTimeout(gameTimer);
  gameState = 'ready';
  ground = {
    w: 168,
    h: 56,
    x: 0,
    y: (height - 56)
  };
  bird = {
    w: 17,
    h: 12,
    x: 35,
    y: 120,
    v: 0
  };
  pipes = [];
  pipeTimer = 0;
  score = 0;
  updateGame();
};



//-----------------------------------------//
//---------- HANDLING USER INPUT ----------//
//-----------------------------------------//
// Code that handles mouse clicks
var onCanvasMouseDown = function(e) {
  // Find the mouse x and y relative to the top-left corner of the canvas
  var x = e.layerX / scale;
  var y = e.layerY / scale;
  if (gameState === 'ready') {
    gameState = 'play';
  }
  if (gameState === 'play' && bird.y + bird.h > 0) {
    bird.v = Math.min(0, bird.v);
    bird.v -= 3;
    bird.v = Math.max(-3, bird.v);
  } else if (gameState == 'gameOver') {
    if ((x > pb.x && x < pb.x + pb.w) &&
        (y > pb.y && y < pb.y + pb.h)) {
      resetGame();
    }
  }
  //
  // ADD CLICK HANDLING CODE HERE!!!
  //
};
canvas.addEventListener('mousedown', onCanvasMouseDown);


//------------------------------------//
//---------- MAIN GAME LOOP ----------//
//------------------------------------//
// This scales up all our images from phone size
var drawImageScaled = function(img, x, y, w, h) {
  context.drawImage(img, x * scale, y * scale, w * scale, h * scale);
};

// This generates a new pipe in our pipes array
var genPipe = function() {
  var pipe = {
    x: pc.start_x,
    y: pc.min_y + Math.random() * (pc.max_y - pc.min_y),
  };
  pipes.push(pipe);
};

// This tests if our bird has hit a pipe
var collide = function(bird, pipe) {
  return (bird.x + bird.w > pipe.x && bird.x < pipe.x + pc.w) &&
    (bird.y + bird.h > pipe.y || bird.y < pipe.y - pc.gap_height)
};

// This draws the game score
var drawScore = function() {
  var i, x, y, img, scoreWidth = 0, scoreStr = score.toString();
  for (i = 0; i < scoreStr.length; i++) {
    scoreWidth += imgs[scoreStr.charAt(i)].width;
  }
  x = width / 2 - scoreWidth / 2;
  y = height / 6;
  for (i = 0; i < scoreStr.length; i++) {
    img = imgs[scoreStr.charAt(i)];
    drawImageScaled(img, x, y, img.width, img.height);
    x += img.width;
  }
};

// This is our main game loop
var updateGame = function() {
  var i, pipe, topY;
  if (gameState === 'play') {
    if (pipeTimer >= pc.wait_time) {
      genPipe();
      pipeTimer = 0;
    }
    for (i = 0; i < pipes.length; i++) {
      pipes[i].x -= pc.xv;
      if (pipes[i].x < bird.x && pipes[i].x + pc.xv > bird.x) {
        score++;
      }
    }
    if (pipes.length > 0 && pipes[0].x < -pc.w) {
      pipes.shift();
    }
    pipeTimer++;
    ground.x -= pc.xv;
    if (ground.x <= -(ground.w - width)) {
      ground.x = 0;
    }

    bird.y += bird.v;
    bird.v += .2;

    for (i = 0; i < pipes.length; i++) {
      if (collide(bird, pipes[i])) {
        gameState = 'gameOver';
      }
    }
    if (bird.y + bird.h > ground.y) {
      gameState = 'gameOver';
    }
  }
  //
  // ADD GAME LOGIC HERE!!!
  //

  drawImageScaled(imgs.bg, 0, 0, width, height);
  for (i = 0; i < pipes.length; i++) {
    pipe = pipes[i];
    drawImageScaled(imgs.pipe_bottom, pipe.x, pipe.y, pc.w, pc.h);
    topY = pipe.y - pc.gap_height - pc.h;
    drawImageScaled(imgs.pipe_top, pipe.x, topY, pc.w, pc.h);
  }
  drawImageScaled(imgs.ground, ground.x, ground.y, ground.w, ground.h);
  drawImageScaled(imgs.bird_up, bird.x, bird.y, bird.w, bird.h);
  drawScore();
  if (gameState == 'gameOver') {
    drawImageScaled(imgs.play_btn, pb.x, pb.y, pb.w, pb.h);
  }
  //
  // ADD MORE IMAGE DRAWING HERE!!!
  //

  // Wait 25 milliseconds before starting next game frame
  // This line keeps the game running so it should always run no matter which
  // screen we're looking at
  gameTimer = setTimeout(updateGame, 25);
};
