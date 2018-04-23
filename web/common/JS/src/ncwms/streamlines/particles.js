goog.provide('owgis.ncwms.currents.particles');

goog.require('owgis.layer');

var particlesArray  = new Array();
var defNumParticles = 20000;// Used to reset the number of particles	
var numparticles = (localStorage.particles_num !== "NaN" && typeof localStorage.particles_num !== 'undefined') ? parseInt(localStorage.particles_num) : defNumParticles;//Initial number of particles
var defParticleSpeed = (typeof layerDetails.defParticleSpeed !== 'undefined') ? parseFloat(layerDetails.defParticleSpeed) : 0.0003;
var particleSpeed = (localStorage.particles_speed !== "NaN" && typeof localStorage.particles_speed !== 'undefined') ? parseFloat(localStorage.particles_speed) : defParticleSpeed;
var currentResolutionParticleSpeed = particleSpeed;
var defTimeParticle = 80; // Deault Number of frames a particle is alive in the animation
var timeParticle = (localStorage.particles_lifetime !== "NaN" && typeof localStorage.particles_lifetime !== 'undefined') ? parseInt(localStorage.particles_lifetime) : defTimeParticle; // Number of frames a particle is alive in the animation

//These two variables are used in the trilinear interpolation,
// they indicate the animation speed of the particles and the 'main' animation
var internalAnimationSpeed;//Orginally set in AnimationStreamlines
var externalAnimationSpeed;
var currTime = 0;//Current Z time
var dt = internalAnimationSpeed/externalAnimationSpeed;

var limLonMin;
var limLatMin;

var lonDomain;
var latDomain;

var lonDomainRand;
var latDomainRand;
var currentExtent;
var currentGrid; 

// This is the height of the mobile navbar, we need to add it to the
// particles when displaying Cesium. TODO why?
var mobileNavBarHeight = 40;

// For Cesium
var c_scene;
var cam_lon_deg;//Longitude of camera
var cam_lat_deg;//Latitude of camera
var half_lon_domain; 
var half_lat_domain;
var long_domain;// Longitude domain used to fire random particles
var latg_domain;// Longitude domain used to fire random particles

var canvas;
var ctx;

var layer = 0;
var grids = new Array();
var gridInfo;//Contains the header info of all the grids

owgis.ncwms.currents.particles.clearGrids = function clearGrids(){
	grids = new Array();
}

owgis.ncwms.currents.particles.setInternalAnimationSpeed = function setInternalSpeed(speed){
	internalAnimationSpeed = speed;
	dt = internalAnimationSpeed/externalAnimationSpeed;
}
owgis.ncwms.currents.particles.setExternalAnimationSpeed = function setExternalSpeed(speed){ 
	externalAnimationSpeed = speed;
	dt = internalAnimationSpeed/externalAnimationSpeed;
}

owgis.ncwms.currents.particles.setParticleSpeed = function setParticleSpeed(speed){
//	console.log("Set Particle speed");
	particleSpeed = speed;
}
owgis.ncwms.currents.particles.getParticleSpeed= function getParticleSpeed(){
	return particleSpeed;
}
owgis.ncwms.currents.particles.getDefaultParticleSpeed = function getDefaultParticleSpeed(){
	return defParticleSpeed;
}
owgis.ncwms.currents.particles.setCurrentResolutionParticleSpeed = function setCurrentResolutionParticleSpeed(val){ 
	currentResolutionParticleSpeed = val;
}
owgis.ncwms.currents.particles.getCurrentResolutionParticleSpeed = function getCurrentResolutionParticleSpeed(){ 
	return currentResolutionParticleSpeed;
}

owgis.ncwms.currents.particles.setNumParticles = function setNumParticles(tot){
	console.log("setNumParticles: "+tot);
	numparticles = tot;
	initParticles();
}
owgis.ncwms.currents.particles.getNumParticles = function getNumParticles(){
	return numparticles;
}
owgis.ncwms.currents.particles.getDefaultNumParticles = function getDefaultNumParticles(){
	return defNumParticles;
}

owgis.ncwms.currents.particles.setParticlesLifeTime = function setParticlesLifeTime(tot){
//	console.log("setParticlesLifeTime");
	timeParticle = tot;
	initParticles();
}
owgis.ncwms.currents.particles.getParticlesLifeTime = function getParticlesLifeTime(){
	return timeParticle;
}
owgis.ncwms.currents.particles.getDefaultParticlesLifeTime= function getDefaultParticlesLifeTime(){
	return defTimeParticle;
}

owgis.ncwms.currents.particles.initDataNcWMSTwo = function initDataNcWMSTwo(GridInfo,currentE){
//	console.log("initData for particles");
	
	canvas = document.getElementById("currentsCanvas");
	ctx = canvas.getContext('2d');
	gridInfo = GridInfo;
	currentExtent = currentE;
	
	lonDomain = Math.abs(currentExtent[0] - currentExtent[2]);
	latDomain = Math.abs(currentExtent[1] - currentExtent[3]);

	updateDomains();
	initParticles();
}

owgis.ncwms.currents.particles.initData = function initData(GridInfo,currentE){
//	console.log("initData for particles");
	
	canvas = document.getElementById("currentsCanvas");
	ctx = canvas.getContext('2d');
	
	gridInfo = GridInfo;
	currentExtent = currentE;
	lonDomain = Math.abs(currentExtent[0] - currentExtent[2]);
	latDomain = Math.abs(currentExtent[1] - currentExtent[3]);

	updateDomains();
	initParticles();
}

/**
 * 
 * @returns {undefined}Updates the limits of the particles taking into account the limits
 * of the map and the limits of the layer.
 */
function updateDomains(){
	var extent = layerTemplate.get("extbbox");
	limLonMin = Math.max(extent[0], gridInfo.lo1);
	limLatMin = Math.max(extent[1], gridInfo.la1);
	
	var limLonMax = Math.min(extent[2], gridInfo.lo2);
	var limLatMax = Math.min(extent[3], gridInfo.la2);
	
	lonDomainRand = Math.abs(limLonMin - limLonMax);
	latDomainRand = Math.abs(limLatMin - limLatMax);
    
    console.log("-->>extencion domains: " + limLonMin + ', ' + limLatMin + ', ' + lonDomainRand + ', ' + latDomainRand);

	if(!_.isEmpty(_cesium) && _cesium.getEnabled()){
		// This one is only used in cesium. It defines the radius
		// of the random particles
        var oheighty = ol.proj.transform([180, null], PROJ_4326, _map_projection)[0];
        if(lonDomainRand >= oheighty){//In this case we need to create particles in all the globe
			long_domain = oheighty;//180;
			latg_domain = latDomainRand;
		}else{
			//Depending on the height of the camera we decide the max angle
			// to generate random particles
			var cam_rad = c_scene.camera.positionCartographic;
			var cam_height = cam_rad.height;
			var norm_cam_height = cam_height/7000000; 
			var angle = 90*Math.atan(owgis.utilities.mathgeo.degtorad(45))*norm_cam_height;
//			long_domain = Math.min(angle,lonDomainRand*.7);
//			latg_domain=  Math.min(angle,latDomainRand*.7);
			long_domain = Math.min(angle,70);
			latg_domain =  Math.min(angle,70);
		}
        console.log("extencion new domains: " + limLonMin + ', ' + limLatMin + ', ' + lonDomainRand + ', ' + latDomainRand);
		console.log("SIZE OF LAT RANDOM: "+latg_domain);
		console.log("SIZE OF LON RANDOM: "+long_domain);
	}
}

owgis.ncwms.currents.particles.setGrid = function setGrid(grid, idx){
	grids[idx] = grid;
}

owgis.ncwms.currents.particles.setCurrentGrid= function setCurrentGrid(CurrentGrid){
	currentGrid = CurrentGrid;
	currTime = 0;//When we upate the grid we reset the time for the interpolation
} 

/**
 * Updates the positions of the particles using the
 * vector field stored at 'grid' 
 * @returns {undefined}
 */
//window['owgis.ncwms.currents.particles.updateParticles'] = owgis.ncwms.currents.particles.updateParticles;
owgis.ncwms.currents.particles.updateParticles  = function updateParticles(i, j){

	//This is used internally by OWGIS (leave the 5) if you want a faster speed
	// modify the XML of the layer
	var localParticleSpeed = 2.5*particleSpeed;
	var randomFunction;//Identifies which random function will be used 
	if(!_.isEmpty(_cesium) && _cesium.getEnabled()){
		randomFunction = randomParticleDenseCenter;
	}else{
		randomFunction = randomParticle;
	}
	if(!_.isEmpty(grids[currentGrid])){

		//We make the if here even when we have to repeat the code
		// because it is more efficient to do it this way. 
		// Check if we have only one time step or multiple time steps
		if( (grids.length === 1) || (currentGrid === (grids.length - 1)) ) {
			for(var idx = j - 1; i <= idx; idx--) {
                var particle = particlesArray[idx];
            //_.each(particlesArray,function(particle,idx){
                    
				//Validate that particle is in range
				//The previous position of the particle is in 0 and 1
				//the new position will be in 2 and 3
				particle[0] = particle[2];
				particle[1] = particle[3];
				if(particle[4] > timeParticle){
					particlesArray[idx]= randomFunction();
				}
				
				var lo1 = gridInfo.lo1;
				var la1 = gridInfo.la1;
				var lo2 = gridInfo.lo2;
				var la2 = gridInfo.la2;
				var dx =  gridInfo.dx;
				var dy =  gridInfo.dy;
				var nx =  gridInfo.nx;
				var ny =  gridInfo.ny;
				//Validate the position of the particle is between the limits of the grid
				if( (particle[0] > lo1) && (particle[1] > la1) && 
						(particle[0] < lo2) && (particle[1] < la2)){
					
					//Obtain the decimal index of the grid
					var row = (particle[1] - la1)/dy;
					var col = (particle[0] - lo1)/dx;
					
					// Obtain the final indices of the grid below
					var row1 = ny - 1 - Math.floor(row);
					var col1 = Math.floor(col);
					
					// Obtain the final indices of the grid above
					var row2 = Math.max(row1-1,0);
					var col2 = Math.min(col1+1,nx-1);
					
					//Obtain the corresponding values
					var q11 = grids[currentGrid][row1][col1];
					var q12 = grids[currentGrid][row2][col1];
					var q21 = grids[currentGrid][row1][col2];
					var q22 = grids[currentGrid][row2][col2];
					
					if( q11[0] === null || q12[0] === null || q12[0] === null || q22[0] === null){ 
						//If any of the values does not exist, it means we are
						// outside the vector field and we restart the particle
						particlesArray[idx]= randomFunction();
					}else{
						var x1 = lo1+col1*dx;
						var x2 = x1 + dx;
						var y1 = la1+(ny - 1 - row1)*dy;
						var y2 = y1 + dy;
						var uv = bilinearInterpolation( particle, x1, x2, y1, y2, q11, q21, q12, q22); 
						particle[2] =  particle[0]  + localParticleSpeed*uv[0];
						particle[3] =  particle[1]  + localParticleSpeed*uv[1];
					}
				}else{
					//If the particle is not on the limitis of the grid, we create a new one
					particlesArray[idx]= randomFunction();
				}
				//Increase the time of the particle
				particle[4]++;
				
			};//);
		}else{
			if(!_.isEmpty(grids[currentGrid+1])){
                for(var idx = j - 1; i <= idx; idx--) {
                    var particle = particlesArray[idx];
				//_.each(particlesArray,function(particle,idx){
					//Validate that particle is in range
					//The previous position of the particle is in 0 and 1
					//the new position will be in 2 and 3
					particle[0] = particle[2];
					particle[1] = particle[3];
					if(particle[4] > timeParticle){
						particlesArray[idx]= randomFunction();
					}
					//Validate the position of the particle is between the limits of the grid
					if( (particle[0] > gridInfo.lo1) && (particle[1] > gridInfo.la1) && 
							(particle[0] < gridInfo.lo2) && (particle[1] < gridInfo.la2)){
						
						//Obtain the decimal index of the grid
						var y = (particle[1] - gridInfo.la1)/gridInfo.dy;
						var x = (particle[0] - gridInfo.lo1)/gridInfo.dx;
						
						// Obtain the final indices of the grid below
						var i = gridInfo.ny - 1 - Math.floor(y);
						var j = Math.floor(x);
						
						// Obtain the final indices of the grid above
						var im1 = Math.max(i-1,0);
						var jp1 = Math.min(j+1,gridInfo.nx-1);
						
						//Obtain the corresponding values
						var q11 = grids[currentGrid][i][j];
						var q12 = grids[currentGrid][im1][j];
						var q21 = grids[currentGrid][i][jp1];
						var q22 = grids[currentGrid][im1][jp1];
						
						var q_next_11 = grids[currentGrid+1][i][j];
						var q_next_12 = grids[currentGrid+1][im1][j];
						var q_next_21 = grids[currentGrid+1][i][jp1];
						var q_next_22 = grids[currentGrid+1][im1][jp1];
						
						if( q11[0] === null || q12[0] === null || q12[0] === null || q22[0] === null  ||
								q_next_11[0] === null || q_next_12[0] === null || q_next_12[0] === null || q_next_22[0] === null  ){
							//If any of the values does not exist, it means we are
							// outside the vector field and we restart the particle
							particlesArray[idx]= randomFunction();
						}else{
							var x1 = gridInfo.lo1+j*gridInfo.dx;
							var x2 = x1 + gridInfo.dx;
							var y1 = gridInfo.la1+(gridInfo.ny - 1 - i)*gridInfo.dy;
							var y2 = y1 + gridInfo.dy;
							var zd = currTime*dt;
							var uv = trilinearInterpolation( particle, x1, x2, y1, y2, zd, q11, q21, q12, q22, 
							q_next_11, q_next_21, q_next_12, q_next_22);
							particle[2] =  particle[0]  + localParticleSpeed*uv[0];
							particle[3] =  particle[1]  + localParticleSpeed*uv[1];
						}
					}else{
						//If the particle is not on the limitis of the grid, we create a new one
						particlesArray[idx]= randomFunction();
					}
					//Increase the time of the particle
					particle[4]++;
				};//);
			}//Next grid is not empty
			currTime++;
		}//Else
	}//Test empty grid
}//Function 
/**
 * Draws the particles with the updated positions 
 * @returns {undefined}
 */
//window['owgis.ncwms.currents.particles.drawParticles'] = owgis.ncwms.currents.particles.drawParticles;
owgis.ncwms.currents.particles.drawParticles = function drawParticles(i, j){
	
	if(!_.isEmpty(_cesium) && _cesium.getEnabled()){
		var cesiumNavBarHeight = 0;//We need to add the hight of the navbar
		if(mobile){
			cesiumNavBarHeight = mobileNavBarHeight;
		}
        for(var idx = i; idx < j; idx++) {
            var particle = particlesArray[idx];
		//_.each(particlesArray,function(particle){
            //We do not display any particle that is on the other side of the earth
//			particle = [10,10];
            
			var pangle = owgis.utilities.mathgeo.anglebetweenspherical(particle, [cam_lon_deg, cam_lat_deg]);
            if( pangle > 70) {
//				var a = particle;
//				var b =  [cam_lon_deg, cam_lat_deg];
//				console.log("A("+a[0]+","+a[1]+") B("+b[0]+","+b[1]+")");
//				console.log("Final angle is: "+  pangle);
				particle[4] = timeParticle;
			}else{
				var pixParticle = particleToCanvasCesium(particle, cesiumNavBarHeight);
                ctx.moveTo(pixParticle[0], pixParticle[1]);
				ctx.lineTo(pixParticle[2], pixParticle[3]);
			}
		};//);
	}else{
        for(var idx = i; idx < j; idx++) {
            var particle = particlesArray[idx];
		//_.each(particlesArray,function(particle){
			
            var pixParticle = particleToCanvas(particle,lonDomain, latDomain);
			//			ctx.fillRect( pixParticle[0], pixParticle[1], 6, 6 );
                
            ctx.moveTo(pixParticle[0], pixParticle[1]);
			ctx.lineTo(pixParticle[2], pixParticle[3]);
		};//);
	}
}

/**
 * Transforms a particle position into a pixel position in the canvas
 * @param {type} particle
 * @param {type} lonDomain
 * @param {type} latDomain
 * @returns {Array}
 */
function particleToCanvasCesium(particle, cesiumNavBarHeight){
    var cart3Pos = Cesium.Cartesian3.fromDegrees(particle[0], particle[1])
	var position = Cesium.SceneTransforms.wgs84ToWindowCoordinates(c_scene, cart3Pos);
	var x = position.x;
	var y = position.y;
	position = Cesium.SceneTransforms.wgs84ToWindowCoordinates(c_scene,
			Cesium.Cartesian3.fromDegrees(particle[2], particle[3]));
	var dx = position.x;
	var dy = position.y;
    return [x,y+cesiumNavBarHeight,dx,dy+cesiumNavBarHeight,particle[4]];
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

/**
 * This function returns a random particle but setting more particles in the
 * center, in a radial way. 
 * @returns {Array}
 */
function randomParticleDenseCenter(){
	//The latitude is flipped in the data
	//This is for a denser centerd circle random values
	/*
	var randVal = Math.random();
	 r = ((randVal + Math.random() + Math.random() + Math.random() ) - 2) / 2;
	// Changing the 'radial' dense area
	//r = Math.pow(r,8/10);
	var theta = 2*Math.PI*Math.random();

	var x = limLonMin + lonDomainRand/2 + r*Math.sin(theta)*lonDomainRand;
	var y = limLatMin + latDomainRand/2 + r*Math.cos(theta)*latDomainRand;

	var t = randVal*timeParticle;
	 */
	var randVal = Math.random();

	var Rlon = long_domain;
	var Rlat = latg_domain;

	var r = Math.pow(randVal,.8); 
	var theta = 2*Math.PI*Math.random();
	
	var x = cam_lon_deg + Rlon*r*Math.sin(theta);
	var y = cam_lat_deg + Rlat*r*Math.cos(theta);
	
	var t = randVal*timeParticle;
    return [x,y,x,y,t];
	
}
/**
 * Creates a random particle position 
 * @returns {Array}
 */
function randomParticle(){
	//The latitude is flipped in the data
	var randVal = Math.random();
	var x = limLonMin + randVal*lonDomainRand;
	var y = limLatMin + Math.random()*latDomainRand;
	
	var t = Math.random()*timeParticle;
	return [x,y,x,y,t];
}

function trilinearInterpolation( particle, x1, x2, y1, y2, zd, q11, q21, q12, q22, 
q_next_11, q_next_21, q_next_12, q_next_22){
	
	var xd = (particle[0] - x1)/(x2 - x1);
	var yd = (particle[1] - y1)/(y2 - y1);
	
	//---------------- Obtaining u -----------------
	var c00 = q11[0]*(1-xd) + q12[0]*xd;
	var c10 = q21[0]*(1-xd) + q22[0]*xd;
	var c01 = q_next_11[0]*(1-xd) + q_next_12[0]*xd;
	var c11 = q_next_21[0]*(1-xd) + q_next_22[0]*xd;
	
	c0 = c00*(1-yd) + c10*yd;
	c1 = c01*(1-yd) + c11*yd;
	
	var u = c0*(1-zd)+c1*zd;
	
	//---------------- Obtaining v -----------------
	var c00 = q11[1]*(1-xd) + q12[1]*xd;
	var c10 = q21[1]*(1-xd) + q22[1]*xd;
	var c01 = q_next_11[1]*(1-xd) + q_next_12[1]*xd;
	var c11 = q_next_21[1]*(1-xd) + q_next_22[1]*xd;
	
	c0 = c00*(1-yd) + c10*yd;
	c1 = c01*(1-yd) + c11*yd;
	
	var v = c0*(1-zd)+c1*zd;
	
	return [u,v];
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
	particlesArray = new Array();
	
	if(!_.isEmpty(_cesium) && _cesium.getEnabled()){
		//For Cesium we used a distribution function that has 
		// more particles in the center
	// Particles values go from -180 to 180 and -90 to 90
		if(_.isEmpty(c_scene)){
			c_scene = _cesium.getCesiumScene();
		}
        
        var cam_rad = c_scene.camera.positionCartographic;
		
        cam_lon_deg = owgis.utilities.mathgeo.radtodeg(cam_rad.longitude);
		cam_lat_deg = owgis.utilities.mathgeo.radtodeg(cam_rad.latitude);

        console.log("cam long: " + cam_lon_deg);
		console.log("cam lat: " + cam_lat_deg);
		//avoid computing this value for every particle
		half_lon_domain =  (limLonMin + lonDomainRand/2);
		half_lat_domain =  (limLatMin + latDomainRand/2);
//		console.log("Using dense random");
		for(i = 0; i < numparticles; i++){
			particlesArray[i] = randomParticleDenseCenter();
		}
	}else{
//		console.log("Using Normal random");
		for(i = 0; i < numparticles; i++){
			particlesArray[i] = randomParticle();
		}
		
	}
}