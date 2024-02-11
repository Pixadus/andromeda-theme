// Forked from "Rainbow Galaxy by Matei Copot"
// https://codepen.io/towc/pen/eNEBQX

// Set up stars
let c;
let s;
if (document.getElementById('stars') != null) {
  s = true;
  c = document.getElementById('stars');

  var w = c.width = window.innerWidth,
      h = c.height = window.innerHeight,
      ctx = c.getContext('2d'),
      
      lines = [],
      stars = [],
      tick = 0,
      first = true;

  // Options
  opts = {
    starCount: 30,
    
    radVel: .025,
    lineBaseVel: .2,
    lineAddedVel: .2,
    lineBaseLife: .2,
    lineAddedLife: .6,
    
    starBaseLife: 10,
    starAddedLife: 10,
    
    ellipseTilt: -.3,
    ellipseBaseRadius: .15,
    ellipseAddedRadius: .02,
    ellipseAxisMultiplierX: 2,
    ellipseAxisMultiplierY: 0.8,
    ellipseCX: w / 2,
    ellipseCY: h / 2,
    
    repaintAlpha: .015
  }
} else if (document.getElementById('galaxy') != null) {
  s = false;
  c = document.getElementById('galaxy');

  var w = c.width = window.innerWidth,
      h = c.height = window.innerHeight,
      ctx = c.getContext('2d'),
      
      lines = [],
      stars = [],
      tick = 0,
      first = true;

  // Options
  opts = {
    starCount: 50,
    lineCount: 100,
    
    radVel: .025,
    lineBaseVel: .2,
    lineAddedVel: .2,
    lineBaseLife: .2,
    lineAddedLife: .6,
    
    starBaseLife: 10,
    starAddedLife: 10,
    
    ellipseTilt: -.3,
    ellipseBaseRadius: .15,
    ellipseAddedRadius: .02,
    ellipseAxisMultiplierX: 2,
    ellipseAxisMultiplierY: 0.8,
    ellipseCX: w / 2,
    ellipseCY: h / 2,
    
    repaintAlpha: .015
  }
}

function init() {
  
  lines.length = stars.length = 0;
  
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = '#333';
  ctx.fillRect( 0, 0, w, h );
  
  if( first ) {   
     loop();
     first = false;
   }
}

function loop() {  
  window.requestAnimationFrame( loop );
  step();
  draw();
}

function step() { 
  tick += .5;
  
  if( lines.length < opts.lineCount && Math.random() < .5 )
    lines.push( new Line );
  
  if( stars.length < opts.starCount )
    stars.push( new Star );
  
  lines.map( function( line ) { line.step(); } );
  stars.map( function( star ) { star.step(); } );
}

function draw() {
  
  ctx.shadowBlur = 0;
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = 'rgba(0,0,0,alp)'.replace( 'alp', opts.repaintAlpha );
  ctx.fillRect( 0, 0, w, h );
  
  ctx.globalCompositeOperation = 'lighter';
  
  ctx.translate( opts.ellipseCX, opts.ellipseCY );
  ctx.rotate( opts.ellipseTilt );
  ctx.scale( opts.ellipseAxisMultiplierX, opts.ellipseAxisMultiplierY );
  
  // ctx.shadowBlur here almost does nothing
  lines.map( function( line ) { line.draw(); } );
  
  ctx.scale( 1/opts.ellipseAxisMultiplierX, 1/opts.ellipseAxisMultiplierY );
  ctx.rotate( -opts.ellipseTilt );
  ctx.translate( -opts.ellipseCX, -opts.ellipseCY );
  
  stars.map( function( star ) { star.draw(); } );
}

// Set up galaxy if we want it (such as on index)
if (document.getElementById('galaxy') != null) {
// NOTE - Uncomment to re-enable galaxy
  function Line() {
    this.reset();
  }
  Line.prototype.reset = function() { 

    this.rad = Math.random() * Math.PI * 2,
    this.len = w * ( opts.ellipseBaseRadius + Math.random() * opts.ellipseAddedRadius );
    this.lenVel = opts.lineBaseVel + Math.random() * opts.lineAddedVel;
    
    this.x = this.px = Math.cos( this.rad ) * this.len;
    this.y = this.py = Math.sin( this.rad ) * this.len;
    
    this.life = this.originalLife = w * ( opts.lineBaseLife + Math.random() * opts.lineAddedLife );
    
    this.alpha = .2 + Math.random() * .8;
  }
  Line.prototype.step = function() {
    
    --this.life;
    
    var ratio = 1 - .1 *  this.life / this.originalLife;
    
    this.px = this.x;
    this.py = this.y;
    
    this.rad += opts.radVel;
    this.len -= this.lenVel;
    
    this.x = Math.cos( this.rad ) * this.len;
    this.y = Math.sin( this.rad ) * this.len;
    
    if( this.life <= 0 )
      this.reset();
  }
  Line.prototype.draw = function() {
    
    var ratio = Math.abs( this.life / this.originalLife - 1/2 );
    
    ctx.lineWidth = ratio * 5;
    // ctx.strokeStyle = ctx.shadowColor = 'hsla(hue, 80%, light%, alp)'
    //  .replace( 'hue', tick + this.x / ( w * ( opts.ellipseBaseRadius + opts.ellipseAddedRadius ) ) * 100 )
    //  .replace( 'light', 75 - ratio * 150 )
    //  .replace( 'alp', this.alpha );
    //
    // Values increase exponentially as distance to center decreases
    var center = Array((c.width/2), (c.height/2))
    var avg_rad = (center[0]+center[1])/4
    var dist_center = Math.sqrt(Math.pow(this.px,2)+Math.pow(this.py,2))
    ctx.strokeStyle = ctx.shadowColor = 'rgba(red, green, blue, alp)'
      .replace('red', 255*(1-dist_center/avg_rad))
      .replace('green', (50+205*(1-dist_center/avg_rad)))
      .replace('blue', 255)
      .replace('alp', (1-(dist_center/(avg_rad/1.2))));
    if(dist_center < 1) {
      this.life = 1;
    }
    ctx.beginPath();
    ctx.moveTo( this.px, this.py );
    ctx.lineTo( this.x, this.y );
    
    ctx.stroke();
  }
}

function Star() {
  
  this.reset();
};
Star.prototype.reset = function() {
  
  this.x = Math.random() * w;
  this.y = Math.random() * h;
  this.life = opts.starBaseLife + Math.random() * opts.starAddedLife;
}
Star.prototype.step = function() {
  
  --this.life;
  
  if( this.life <= 0 )
    this.reset();
}
Star.prototype.draw = function(){
  
  ctx.fillStyle = ctx.shadowColor = 'hsla(hue, 80%, 50%, .2)'
    .replace( 'hue', tick + this.x / w * 100 );
  ctx.shadowBlur = this.life;
  
  // If only stars, resize to deal with smaller sindow.
  if (s) {
    ctx.fillRect( this.x, this.y, 1, 7 );
  } else {
    ctx.fillRect( this.x, this.y, 1, 1 );
  }
};

window.addEventListener( 'resize', function() {
  
  w = c.width = window.innerWidth;
  h = c.height = window.innerHeight;
  
  opts.ellipseCX = w / 2;
  opts.ellipseCY = h / 2;
  
  init();
} );

function LuukLamers() {
  
  var i = 0,
      array = [ 300, 74, 0.04, 0.1, 0.1, .55, 10, 100, 10, -.15, .18, .01, 3, 1, w / 2, h / 2, 0.02 ];
  
  for( var key in opts ) {
    
    opts[ key ] = array[ i ];
    ++i;
  }
  
  init();
}

init();