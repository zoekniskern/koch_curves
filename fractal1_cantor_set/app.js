const canvas = document.getElementById("mainCanvas");
const ctx = mainCanvas.getContext('2d', {alpha: false});

let w, h, bandSize; 

/* UTILITY CODE */

/* use to update global w and h and reset canvas width/height */ 
function updateCanvasSize() {
  w = window.innerWidth;
  h = window.innerHeight;
  canvas.width = w;
  canvas.height = h;
  bandSize = h / 8;
}
updateCanvasSize();

/* MAIN DRAWING CODE */

// Drawing the Cantor Set involves a recursive process: 
//
// 1. Draw line
// 2. Remove middle third 
// 3. Repeat step 2 for remaining line segments
//
// The "remove middle third" isn't done physically here but handled in the calculation 
// to continue drawing and splitting into two further recursive calls. 
function drawCantorSet(x, y, len) {

  ctx.fillRect(x,y, len, bandSize / 2);

  let nextLen = len / 3;

  // We end recursion when the next length is < 1 pixel width
  if(nextLen > 1) {
    drawCantorSet(x, y + bandSize, nextLen); 
    drawCantorSet(x + (2 * nextLen), y + bandSize, nextLen); 
  }

}

function draw(t) {
    
    ctx.fillStyle = '#000014';
    ctx.fillRect(0,0,w,h);

    ctx.strokeStyle = 'white';
    ctx.fillStyle = 'white';
    ctx.lineWidth = 10;

    // add some blurring  
    ctx.shadowBlur = 5;
    ctx.shadowColor = '#00c';

    drawCantorSet(bandSize /2, bandSize/ 2, w - (2 * bandSize/ 2));

}

requestAnimationFrame(draw);

// Use event listener for resize to update canvas size when necessary
window.addEventListener('resize', () => {
    updateCanvasSize();
    // only need this here for static images. can remove if doing animation with requestAnimationFrame().
    draw();
});
