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
var gameState = 'ready';
var ground = {
  w: 168,
  h: 56,
  x: 0,
  y: (height - 56)
};
var bird = {
  w: 17,
  h: 12,
  x: 35,
  y: 120,
  v: 0
};
var pc = {
  w: 26,
  h: 160,
  xv: 2,
  gap_height: 50,
  wait_time: 50,
  start_x: width + 50,
  min_y: 70,
  max_y: 180
};
var pipes = [];
var pipe_timer = 0;
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
    initGame();
  }
};
// Define images
addImg('bg', 'imgs/background.png');
addImg('bird_up', 'imgs/bird_up.png');
addImg('ground', 'imgs/ground.png');
addImg('pipe_top', 'imgs/pipe_top.png');
addImg('pipe_bottom', 'imgs/pipe_bottom.png');
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
var initGame = function() {
  updateGame();
};



//-----------------------------------------//
//---------- HANDLING USER INPUT ----------//
//-----------------------------------------//
// Code that handles mouse clicks
var onCanvasMouseDown = function(e) {
  // Find the mouse x and y relative to the top-left corner of the canvas
  var x = e.layerX;
  var y = e.layerY;
  if (gameState === 'ready') {
    gameState = 'play';
  }
  if (gameState === 'play') {
    bird.v = Math.min(0, bird.v);
    bird.v -= 3;
    bird.v = Math.max(-3, bird.v);
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

// This is our main game loop
var updateGame = function() {
  var i, pipe, top_y;
  if (gameState === 'play') {
    if (pipe_timer >= pc.wait_time) {
      genPipe();
      pipe_timer = 0;
    }
    for (i = 0; i < pipes.length; i++) {
      pipes[i].x -= pc.xv;
    }
    if (pipes.length > 0 && pipes[0].x < -pc.w) {
      pipes.shift();
    }
    pipe_timer++;
    ground.x -= pc.xv;
    if (ground.x <= -(ground.w - width)) {
      ground.x = 0;
    }

    bird.y += bird.v;
    bird.v += .2;
  }
  //
  // ADD GAME LOGIC HERE!!!
  //

  drawImageScaled(imgs.bg, 0, 0, width, height);
  for (i = 0; i < pipes.length; i++) {
    pipe = pipes[i];
    drawImageScaled(imgs.pipe_bottom, pipe.x, pipe.y, pc.w, pc.h);
    top_y = pipe.y - pc.gap_height - pc.h;
    drawImageScaled(imgs.pipe_top, pipe.x, top_y, pc.w, pc.h);
  }
  drawImageScaled(imgs.ground, ground.x, ground.y, ground.w, ground.h);
  drawImageScaled(imgs.bird_up, bird.x, bird.y, bird.w, bird.h);
  //
  // ADD MORE IMAGE DRAWING HERE!!!
  //

  // Wait 25 milliseconds before starting next game frame
  // This line keeps the game running so it should always run no matter which
  // screen we're looking at
  setTimeout(updateGame, 25);
};
