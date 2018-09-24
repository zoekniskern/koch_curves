/* Koch Curve: Using recursive process to generate vertices using a generational strategy */

const canvas = document.getElementById("mainCanvas");
const ctx = mainCanvas.getContext('2d', {alpha: false});


const Vec2 = (x, y) => {
  return {
    x, y,
    translate(v) {
      this.x += v.x;
      this.y += v.y;
      return this;
    },
    subtract(v) {
      this.x -= v.x;
      this.y -= v.y;
      return this;
    },
    mul(v) {
      this.x *= v;
      this.y *= v;
      return this;
    },
    rotate(theta) {
      let newX = this.x * Math.cos(theta) - this.y * Math.sin(theta);
      this.y = this.x * Math.sin(theta) + this.y * Math.cos(theta);
      this.x = newX;
      return this;
    },
    mag() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    },
    copy() {
      return Vec2(this.x, this.y);
    }
  };
}


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
let kochVertices;

function resetKochCurve() {
  kochVertices = [Vec2(0,0), Vec2(w,0)];
}
resetKochCurve();

function computeNextGeneration() {
  let nextGen = [];

  for (let i = 0; i < kochVertices.length - 1; i++) {
    let v0 = kochVertices[i];
    let v4 = kochVertices[i + 1];

    let vDiff = v4.copy().subtract(v0);

    let v1 = v0.copy().translate(vDiff.copy().mul(segLen));
    let v2 = v1.copy().translate(vDiff.copy().mul(segLen).rotate(-Math.PI * 1/3));
    let v3 = v0.copy().translate(vDiff.copy().mul(segLen * 2));

    nextGen.push(v0);
    nextGen.push(v1);
    nextGen.push(v2);
    nextGen.push(v3);
  }

  nextGen.push(kochVertices[kochVertices.length - 1]);

  kochVertices = nextGen;
}

function drawKochCurve() {
  ctx.save();
  ctx.beginPath();
  for(let i = 0; i < kochVertices.length - 1; i++) {
    let v0 = kochVertices[i];
    let v1 = kochVertices[i + 1];

    ctx.moveTo(v0.x, v0.y);
    ctx.lineTo(v1.x, v1.y);
  }
  ctx.stroke();
  ctx.restore();
}

let counter = 0;
let iterations = 0;

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

    drawKochCurve();

    ctx.restore();
}

function animate(t) {
  if((counter % 120) == 0) {

    draw();
    if(++iterations > maxIterations) {
      iterations = 0;  
      resetKochCurve();
    } else {
      computeNextGeneration();
    }

  }
  counter++;
  requestAnimationFrame(animate)
}

requestAnimationFrame(animate);

