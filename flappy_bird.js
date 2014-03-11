// Get access to canvas in HTML file
var canvas = document.getElementById('game_canvas');
var context = canvas.getContext('2d');



//-------------------------------------------//
//---------- GAME GLOBAL VARIABLES ----------//
//-------------------------------------------//
// Game dimensions
var scale = 3;
var width = 144 * scale;
var height = 257 * scale;
// Set canvas dimensions to correct width and height
canvas.width = width;
canvas.height = height;
var gameState = 'ready';
var bird = {
  w: 17 * scale,
  h: 12 * scale,
  x: 35 * scale,
  y: 120 * scale,
  v: 0
};
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
    bird.v -= 3 * scale;
    bird.v = Math.max(-3 * scale, bird.v);
  }
  //
  // ADD CLICK HANDLING CODE HERE!!!
  //
};
canvas.addEventListener('mousedown', onCanvasMouseDown);

// Code that handles key presses
var onCanvasKeyDown = function(e) {
  // Uncomment this log statement to figure out which keys have which keyCode
  // console.log(e.keyCode);
  //
  // ADD KEYBOARD HANDLING CODE HERE!!!
  //
};
window.addEventListener('keydown', onCanvasKeyDown);



//------------------------------------//
//---------- MAIN GAME LOOP ----------//
//------------------------------------//
var updateGame = function() {
  // Draw the background image
  context.drawImage(imgs.bg, 0, 0, width, height);

  if (gameState === 'play') {
    bird.y += bird.v;
    bird.v += .2 * scale;
  }
  //
  // ADD GAME LOGIC HERE!!!
  //

  // Draw the bird
  context.drawImage(imgs.bird_up, bird.x, bird.y, bird.w, bird.h);
  //
  // ADD MORE IMAGE DRAWING HERE!!!
  //

  // Wait 25 milliseconds before starting next game frame
  // This line keeps the game running so it should always run no matter which
  // screen we're looking at
  setTimeout(updateGame, 25);
};
