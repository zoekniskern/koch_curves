/* Koch Curve: Using recursive process directly to calculate and draw lines */

const canvas = document.getElementById("mainCanvas");
const ctx = mainCanvas.getContext('2d', {alpha: false});

let w, h, maxIterations; 

/* UTILITY CODE */

/* use to update global w and h and reset canvas width/height */ 
function updateCanvasSize() {
  w = window.innerWidth;
  h = window.innerHeight;
  canvas.width = w;
  canvas.height = h;

  maxIterations = 1;

  while((w / Math.pow(3, maxIterations) > 1)) {
    maxIterations += 1;
  }
}
updateCanvasSize();
window.addEventListener('resize', updateCanvasSize());

/* MAIN DRAWING CODE */

// multiplier for seg lens.  
let segLen = 1 / 3;

function drawKochCurve(width, iterations) {

  // this is the exit condition for the recursion
  // when we hit bottom, we draw the line
  if(iterations == 1) {
    ctx.moveTo(0,0);
    ctx.lineTo(width, 0);
  } else {

    // here we do the splitting of the line into segments
    // and apply translations and rotations to draw the koch curve
    // for the new segments
    let newWidth = width * segLen; 
    let newIterations = iterations - 1;

    ctx.save();

    // 1st segment
    drawKochCurve(newWidth, newIterations);

    // 2nd segment
    ctx.translate(newWidth, 0);
    ctx.rotate(-Math.PI * 1/3);  // 60 degrees counterclockwise
    drawKochCurve(newWidth, newIterations);

    // 3rd segment
    ctx.translate(newWidth, 0);
    ctx.rotate(Math.PI * 2/3);  // 120 degrees clockwise
    drawKochCurve(newWidth, newIterations);

    // 4th segment
    ctx.translate(newWidth, 0);
    ctx.rotate(-Math.PI * 1/3);  // 60 degrees counterclockwise
    drawKochCurve(newWidth, newIterations);

    ctx.restore();
  }

}

let counter = 0;
let iterations = 1;

function draw() {
    
    ctx.fillStyle = '#000014';
    ctx.fillRect(0,0,w,h);

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;

    // add some blurring  
    ctx.shadowBlur = 5;
    ctx.shadowColor = '#00c';

    ctx.save();
    ctx.translate(0, h/2);


    ctx.beginPath();
    drawKochCurve(w, iterations);
    ctx.stroke();

    ctx.restore();
}

function animate(t) {
  if((counter % 120) == 0) {
    draw();
    if(++iterations > maxIterations) {
      iterations = 1;  
    }
  }
  counter++;
  requestAnimationFrame(animate)
}

requestAnimationFrame(animate);

