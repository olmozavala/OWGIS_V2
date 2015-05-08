goog.provide('owgis.ncwms.currents.particles')

goog.require('owgis.layer.model')
var particles  = new Array();
var numparticles = 10000;
var lineSize = .3;

var limLonMin;
var	limLatMin;

var lonDomain;
var latDomain;

var lonDomainRand;
var latDomainRand;
var currentExtent;

var timeParticle = 20; // Number of frames a particle is alive in the animation
var canvas;
var ctx;

var layer = 0;
var currentGrid = 0; 
var grids = new Array();
var gridsHeaders = new Array();
var grid;
var gridInfo;

//window['owgis.ncwms.currents.particles.initData'] = owgis.ncwms.currents.particles.initData;
owgis.ncwms.currents.particles.initData = 
		function initData(Grids, GridsHeaders, CurrentGrid, currentE){

	canvas = document.getElementById("currentsCanvas");
	ctx = canvas.getContext('2d');

	gridHeaders = GridsHeaders;
	grids = Grids;
	grid = Grids[CurrentGrid];
	gridInfo = gridHeaders[CurrentGrid];
	currentExtent = currentE;

	lonDomain = Math.abs(currentExtent[0] - currentExtent[2]);
	latDomain = Math.abs(currentExtent[1] - currentExtent[3]);

	initParticles();
	owgis.ncwms.currents.particles.drawParticles();
}

owgis.ncwms.currents.particles.grid = function setGrid(CurrentGrid){
	currentGrid = CurrentGrid;
} 

/**
 * Creates a random particle position 
 * @returns {Array}
 */
function randomParticle(){
	//The latitude is flipped in the data
	x = limLonMin + Math.random()*lonDomainRand;
	y = limLatMin + Math.random()*latDomainRand;
	t = Math.random()*timeParticle;
	return [x,y,x,y,t];
}

/**
 * Updates the positions of the particles using the
 * vector field stored at 'grid' 
 * @returns {undefined}
 */

//window['owgis.ncwms.currents.particles.updateParticles'] = owgis.ncwms.currents.particles.updateParticles;
owgis.ncwms.currents.particles.updateParticles
		=  function updateParticles(){
	
	limLonMin = Math.max(currentExtent[0], gridInfo.lo1);
	limLatMin = Math.max(currentExtent[1], gridInfo.la1);
	
	var limLonMax = Math.min(currentExtent[2], gridInfo.lo2);
	var limLatMax = Math.min(currentExtent[3], gridInfo.la2);
	
	lonDomainRand = Math.abs(limLonMin - limLonMax);
	latDomainRand = Math.abs(limLatMin - limLatMax);
	
	_.each(particles,function(particle,idx){
		//Validate that particle is in range
		particle[0] = particle[2];
		particle[1] = particle[3];
		if(particle[4] > timeParticle){
			particles[idx] = randomParticle();
		}
		if( (particle[0] > gridInfo.lo1) && (particle[1] > gridInfo.la1) && 
				(particle[0] < gridInfo.lo2) && (particle[1] < gridInfo.la2)){
			
			//Make bilinear interpolation, following wikipedia :)
			var y = (particle[1] - gridInfo.la1)/gridInfo.dy;
			var x = (particle[0] - gridInfo.lo1)/gridInfo.dx;
			
			var i = gridInfo.ny - 1 - Math.floor(y);
			var j = Math.floor(x);
			
			var im1 = Math.max(i-1,0);
			var jp1 = Math.min(j+1,gridInfo.nx-1);
			
			var q11 = grid[i][j];
			var q12 = grid[im1][j];
			var q21 = grid[i][jp1];
			var q22 = grid[im1][jp1];
			
			
			if( q11[0] === null || q12[0] === null || q12[0] === null || q22[0] === null  ){
				particle[2] =  particle[0];
				particle[3] =  particle[1];
			}else{
				//This value already goes from 0 to 1
				var x1 = gridInfo.lo1+j*gridInfo.dx;
				var x2 = x1 + gridInfo.dx;
				var y1 = gridInfo.la1+(gridInfo.ny - 1 - i)*gridInfo.dy;
				var y2 = y1 + gridInfo.dy;
				uv = bilinearInterpolation(particle, x1, x2, y1, y2, q11, q21, q12, q22);
				//				uv = q11;
				particle[2] =  particle[0]  + lineSize*uv[0];
				particle[3] =  particle[1]  + lineSize*uv[1];
			}
		}
		particle[4]++;
	});
}

/**
 * Performs bilinear interpolation following wikipedia 
 * @param {type} particle
 * @param {type} x1
 * @param {type} x2
 * @param {type} y1
 * @param {type} y2
 * @param {type} q11
 * @param {type} q21
 * @param {type} q12
 * @param {type} q22
 * @returns {Array}
 */
function bilinearInterpolation( particle, x1, x2, y1, y2, q11, q21, q12, q22){
	var x2_x = x2-particle[0];
	var y2_y = y2-particle[1];
	var x_x1 = particle[0]-x1;
	var y_y1 = particle[1]-y1;
	var a = x2_x*y2_y; 
	var b = x_x1*y2_y;
	var c = x2_x*y_y1;
	var d = x_x1*y_y1;
	var e = gridInfo.dx*gridInfo.dy;
	
	
	var u = (q11[0]*a + q21[0]*b + q12[0]*c + q22[0]*d)/e;
	var v = (q11[1]*a + q21[1]*b + q12[1]*c + q22[1]*d)/e;
	
	return [u,v];
}

/**
 * Initializes all the particles with random positions 
 * @returns {undefined}
 */
function initParticles(){
	for(i = 0; i < numparticles; i++){
		particles[i] = randomParticle();
	}
}

/**
 * Draws the particles with the updated positions 
 * @returns {undefined}
 */

//window['owgis.ncwms.currents.particles.drawParticles'] = owgis.ncwms.currents.particles.drawParticles;
owgis.ncwms.currents.particles.drawParticles = function drawParticles(){
	
	_.each(particles,function(particle){
		if( (particle[0] > gridInfo.lo1) && (particle[1] > gridInfo.la1) && 
				(particle[0] < gridInfo.lo2) && (particle[1] < gridInfo.la2)){
			pixParticle = particleToCanvas(particle,lonDomain, latDomain);
			ctx.moveTo(pixParticle[0], pixParticle[1]);
			ctx.lineTo(pixParticle[2], pixParticle[3]);
		}
	});
	
	ctx.stroke();
}

/**
 * Transforms a particle position into a pixel position in the canvas
 * @param {type} particle
 * @param {type} lonDomain
 * @param {type} latDomain
 * @returns {Array}
 */
function particleToCanvas(particle, lonDomain, latDomain){
	// Particles values go from -180 to 180 and -90 to 90
	var x =((particle[0] - currentExtent[0])/lonDomain)*canvas.width; 
	var y =canvas.height -((particle[1] - currentExtent[1])/latDomain)*canvas.height; 
	var dx =((particle[2] - currentExtent[0])/lonDomain)*canvas.width; 
	var dy =canvas.height -((particle[3] - currentExtent[1])/latDomain)*canvas.height; 
	return [x,y,dx,dy,particle[4]];
}