// CONWAY'S GAME OF LIFE
// http://en.wikipedia.org/wiki/Conway's_Game_of_Life
//
// this p5 sketch implements John Conway's Game of Life simulation
// as an image-processing system... it looks at pixels in an image
// and treats them as cells in a version of Conway's simulation.
//
// your tasks:
// (1) make this thing look more interesting... 
// hint: you don't have to display the image directly to the screen.
// another hint: you can draw other things (text, shapes, etc.) instead of the cells.
// (2) the RULES in the draw() loop determine how the simulation decides to keep a pixel
// alive or generate a new one from a dead pixel.  this rule set is sometimes referred to as
// B3/S23 (a pixel is "Born" with 3 neighbors and "Stays Alive" with 2 or 3 neighbors.
// tweak these rules and see if you can find other interesting (or self-sustaining) systems.
//

var howwide = 100;
var howtall = 50;
var img = new Array(10); // this is gonna store two arrays
var whichimage = 0;
var loadSound;

function preload()
{
	music = loadSound('mii.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

	// THIS IS THE IMPORTANT PART:
  img[0] = new Uint8Array(howwide*howtall); 
  img[1] = new Uint8Array(howwide*howtall);

	noSmooth(); // don't smooth anything
  randomize();
}

function draw() {
  // background(random(255,255,255), random(255,255,255), random(255,255,255), 90);
	music.play();
	
	for (var i = 1; i < howwide; i++) {
    for (var j = 1; j < howtall; j++) {
			// where are we talking about???
			var ul = (i-1+howwide)%howwide + howwide*((j-1+howtall)%howtall); // location of the UPPER LEFT
			var uc = (i-0+howwide)%howwide + howwide*((j-1+howtall)%howtall); // location of the UPPER MID
			var ur = (i+1+howwide)%howwide + howwide*((j-1+howtall)%howtall); // location of the UPPER RIGHT
			var ml = (i-1+howwide)%howwide + howwide*((j+0+howtall)%howtall); // location of the LEFT
			var mc = (i-0+howwide)%howwide + howwide*((j+0+howtall)%howtall); // location of the CENTER PIXEL
			var mr = (i+1+howwide)%howwide + howwide*((j+0+howtall)%howtall); // location of the RIGHT
			var ll = (i-1+howwide)%howwide + howwide*((j+1+howtall)%howtall); // location of the LOWER LEFT
			var lc = (i-0+howwide)%howwide + howwide*((j+1+howtall)%howtall); // location of the LOWER MID
			var lr = (i+1+howwide)%howwide + howwide*((j+1+howtall)%howtall); // location of the LOWER RIGHT
      var p0 = img[whichimage][ul]; // upper left
      var p1 = img[whichimage][uc]; // upper mid
      var p2 = img[whichimage][ur]; // upper right
      var p3 = img[whichimage][ml]; // left
      var p4 = img[whichimage][mc]; // center pixel
      var p5 = img[whichimage][mr]; // right
      var p6 = img[whichimage][ll]; // lower left
      var p7 = img[whichimage][lc]; // lower mid
      var p8 = img[whichimage][lr]; // lower right
      var neighbors = p0+p1+p2+p3+p5+p6+p7+p8; // how many neighbors are alive? SKIP p4: that's the center
      var result;
      
      // THESE ARE THE RULES FOR THE SIMULATION - 
      // by default, an alive cell stays alive if it has 2 or 3 live neighbors.
      // a dead cell becomes alive if it has three live neighbors.
			// ONE PLACE TO MESS AROUND IS HERE:
      if(p4==1) // center pixel is alive
      {
        // if two or three live neighbors, keep alive; otherwise die.
        if(neighbors==2 || neighbors==3) result = 1; else result = 0;
      }
      else // center pixel is DEAD
      {
        // if exactly three live neighbors, become alive; otherwise stay dead.
        if(neighbors==3) result = 1; else result = 0;
      }
     // write pixels into destination image, scaled to 0 or 255:
    	img[1-whichimage][mc] = result; 
    }
  }
	textSize(90);
	createCanvas(1000,500)
  whichimage = 1-whichimage; // flip source and destination
	
	// draw it
	// ANOTHER PLACE TO MESS AROUND IS HERE:
	for(var i = 0;i<howwide;i++)
	{
		for(var j = 0;j<howtall;j++)
		{
			var index = i + j*howwide;
			if(img[whichimage][index]>0) rect(i/howwide*width, j/howtall*height, width/howwide, height/howtall); // draw the new source
		}
	}
}

function mouseClicked()
{
  fillatmouse();
}

function mouseDragged()
{
  fillatmouse();
}

function mousePressed()
{
	if (music.isPlaying() ) { // .isPlaying() returns a boolean
    music.stop();
    background(random(255),random(255),random(255),90);
  } else {
    music.play();
    background(0,255,0,90);
  }
}
function keyReleased() // blow out the image with new stuff
{
  randomize();
}

// this completely recreates the simulation with binary noise (cells are on or off)
function randomize()
{
  var randthresh = 7; // 80% of pixels will be dead.
  for (var i = 0; i < img[whichimage].length; i++) {
    var r = random(10)>randthresh; // true or false?
		img[whichimage][i] = r;
		img[1-whichimage][i] = r;
  }
}

// set a pixel at the mouse position to ON
function fillatmouse()
{
  var thex = floor(mouseX/(width/howwide));
  var they = floor(mouseY/(height/howtall));
	var index = thex + they*howwide;
  img[whichimage][index] = 1;
}
