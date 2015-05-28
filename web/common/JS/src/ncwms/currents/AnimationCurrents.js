goog.provide('owgis.ncwms.currents');

goog.require('ol.source.ImageCanvas');
goog.require('ol.renderer.canvas.ImageLayer');
goog.require('goog.events');
goog.require('owgis.ncwms.currents.particles');
goog.require('owgis.ncwms.animation.status');
goog.require('owgis.interf');

owgis.ncwms.currents.grids = new Array();

var currentsColor = "rgba(255, 255, 255, .5)";
var currAnimSpeed = 100;

// This is the amount of data requested for every 800 pixels
var imageRequestResolution = 350;

var layerTemplate;
var times = new Array();

var intervalHandlerCurrents;// This is the handler of the 'interval' function
var canvas;
var ctx;
var currentExtent;
var currentsLayer;

var grids;
var gridsHeaders;

var readDataPremises;

var animationPaused = false;
//This variable is used to stop refreshing the data when the 'main' animation is
// running. Afther all the images have been loaded the the particles data is reloaded
var isRunningUnderMainAnimation = false;
var isFirstTime = true;//Only important when been run under main animation

window['owgis.ncwms.currents.setColor'] = owgis.ncwms.currents.setColor;
owgis.ncwms.currents.setColor= function setColor(color){
	currentsColor = color;
}
owgis.ncwms.currents.getColor= function getColor(){
	return currentsColor;
}

owgis.ncwms.currents.playPause = function playPause(){
	if(!animationPaused){
		$("#currentsPlayPauseButton").removeClass("glyphicon-pause");
		$("#currentsPlayPauseButton").addClass("glyphicon-play");
	}else{
		$("#currentsPlayPauseButton").removeClass("glyphicon-play");
		$("#currentsPlayPauseButton").addClass("glyphicon-pause");
	}
	animationPaused = !animationPaused;
}

/**
 * Main function that starts the animation of the currents. It reads the
 * current layer data and it is done then starts the animation loop 
 * @returns {undefined}
 */
window['owgis.ncwms.currents.startSingleDateAnimation'] = owgis.ncwms.currents.startSingleDateAnimation;
owgis.ncwms.currents.startSingleDateAnimation = function startSingleDateAnimation(){
	isRunningUnderMainAnimation = false;
	
	//Creates new currents layer model
	layerTemplate = getDefaultLayer();

	times = new Array();
	// Updating current date
	var mainLayerParams = owgis.layers.getMainLayer().getSource().getParams();
	if( !_.isEmpty(mainLayerParams.TIME)){
		times.push( mainLayerParams.TIME);	
	}else{
		times.push( layerDetails.nearestTimeIso );
	}

	//Reads and updates the data
	initCurrentsLayer();
}

/**
 * Main function that starts the animation of the currents. It reads the
 * current layer data and it is done then starts the animation loop 
 * @returns {undefined}
 */
window['owgis.ncwms.currents.startMultipleDateAnimation'] = owgis.ncwms.currents.startMultipleDateAnimation;
owgis.ncwms.currents.startMultipleDateAnimation = function startMultipleDateAnimation(dates){
	
	isRunningUnderMainAnimation = true;
	isFirstTime = true;
	//Creates new currents layer model
	times = dates;

	//Adds the only model into the available layers
	layerTemplate = getDefaultLayer();
	//Reads and updates the data
	initCurrentsLayer();
}

/**
 * Clears the canvas by drawing an empty rectangle 
 * @returns {undefined}
 */
owgis.ncwms.currents.cleanAnimationCurrentsAll = function cleanAnimationCurrentsAll(){
	//Clears any previous display in the canvas
	abortPrevious();
	clearLoopHandlerCurrents();
	// We always start with the current grid = 0 
	owgis.ncwms.currents.particles.setCurrentGrid(0);
	owgis.ncwms.currents.particles.clearGrids();
	owgis.ncwms.currents.clearCurrentsCanvas();

}

/**
 * This function is only used to clear the current canvas. It is necessary when
 * the 'main' animation has been restarded 
 * @returns {undefined}
 */
window['owgis.ncwms.currents.clearCurrentsCanvas'] = owgis.ncwms.currents.clearCurrentsCanvas;
owgis.ncwms.currents.clearCurrentsCanvas= function clearCurrentsCanvas(){
	console.log("CLEARING!!!!!!!!!!!!");
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * This function builds the layer with the information retrieved
 * from the main layer but using the 'currentsLayer' name. 
 * @returns {owgis.layer.model}
 */
function getDefaultLayer(){

	var defLayer = new owgis.layer.model({
			server: layerDetails.server,
			layers: layerDetails.currentsLayer,
			bbox: layerDetails.bbox.join(","),
			origbbox: layerDetails.bbox.join(",")
		}); 
	//If the layer has the whole longitude space (-180, 180) we modify
	// the original extent to -360,360 in order to be able to visualize
	// currents in the middle
	var origBBOX = defLayer.get("origbbox").split(',');
	if(Number(origBBOX[0]) === -180 && Number(origBBOX[2]) === 180 ){
		origBBOX[0] = -360;
		origBBOX[2] = 360;
	}
	defLayer.set("origbbox",origBBOX.join(","));	

	return defLayer;
}

function updateWidthAndHeight(layerTemplate){
	//This function needs to change the requested resolution depending on:
	// If we are displaying an animation or not
	// If is an animation, then we need to take into account the animation resolution
	// If we are at a mobile device or not

	var resolutionFactor = 1;//For desktop
	if(mobile){
		resolutionFactor *= .5;//In mobile devices by default the requested resolution is half
	}
	if( owgis.ncwms.animation.status.current !== owgis.ncwms.animation.status.none ){ 
		resolutionFactor *= owgis.ncwms.animation.status.getResolutionRatio();
	}

	var width = Math.ceil(($(window).width()/800)*imageRequestResolution*resolutionFactor);
	var height = Math.ceil(($(window).height()/800)*imageRequestResolution*resolutionFactor);
	console.log("Requested resolution is: "+width+" x "+height);
	layerTemplate.set("width",width);	
	layerTemplate.set("height",height);	
	return layerTemplate;

}

function initCurrentsLayer(){
	
	if(currentsLayer !== null){//If the layer already existed, we remove it
		map.removeLayer(currentsLayer);
	}
	
	//This is the source of the new map layer
	var animSource= new ol.source.ImageCanvas({
		canvasFunction: canvasAnimationCurrents,
		projection: layerDetails.srs
	});
	
	currentsLayer = new ol.layer.Image({
		source: animSource});
	
	var layersCollection = map.getLayers();
	//TODO when the normal animation is running this +1 wont work
	if(_.isEmpty(animLayer)){
		layersCollection.insertAt(parseInt(idx_main_layer)+1,currentsLayer);//Adds the animation layer just above the main layer
	}else{
		layersCollection.insertAt(parseInt(idx_main_layer)+2,currentsLayer);//Adds the animation layer just above the main layer
	}
}

/**
 * Main function called by Ol3 everytime the map is updated by the user.
 * It is called when changing the zoom or panning. 
 * @param {type} extent
 * @param {type} resolution
 * @param {type} pixelRatio
 * @param {type} size
 * @param {type} projection
 * @returns {Element|canvas}
 */
function canvasAnimationCurrents(extent, resolution, pixelRatio, size, projection) {	
	
	canvas = document.getElementById("currentsCanvas");
	ctx = canvas.getContext('2d');
	
	var canvasWidth = size[0];
	var canvasHeight = size[1];        
	
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;   	
	
	currentExtent = extent;

	
	if(!isRunningUnderMainAnimation){
		if(updateURL()){
			updateParticlesParameters(extent,resolution);
			updateData();
		}
	}else{
		if(isFirstTime){
			if(updateURL()){
				updateParticlesParameters(extent,resolution);
				updateData();
			}
			isFirstTime = false;
		}
	}
	return canvas;
}

function updateParticlesParameters(extent, resolution){
	$("#particleSpeedSlider").slider("option","value",
		1500*resolution*owgis.ncwms.currents.particles.getDefaultParticleSpeed() );

	var currBBOX = layerTemplate.get("bbox").split(',');	
	var estimatedArea = (Number(currBBOX[2])-Number(currBBOX[0])) * (Number(currBBOX[3])-Number(currBBOX[1]));

/*
	var newNumberOfParticles = Math.ceil(Math.sqrt(estimatedArea*owgis.ncwms.currents.particles.getDefaultNumberOfParticles()));
	console.log(estimatedArea);
	console.log(newNumberOfParticles);
//	$("#numParticles").text( newNumberOfParticles );
//	$("#numParticlesSlider").slider("option","value", newNumberOfParticles);
	*/
}

/**
 * This function is used to cancel all the previous json request that
 * haven't finish. 
 * @returns {undefined}
 */
function abortPrevious(){
	if(!_.isEmpty(readDataPremises)){
		_.each(readDataPremises, function(premise,id){
			//		console.log("The premise "+id+" has been aborted");
			if(!_.isEmpty(premise)){
				premise.abort();
			}
		});
	}
}

function updateData(){
	// Clears previous animations
	owgis.ncwms.currents.cleanAnimationCurrentsAll();

	var totalRequests = times.length;	
	var loadedRequests = 0;
	
	//Reads the data
	owgis.interf.loadingatmap(true,0,"Currents");
	_.each(times, function(time, idx){
		layerTemplate.set("time",time);	
		readDataPremises = new Array();
//		console.log(layerTemplate.getURL());
		readDataPremises[idx] = d3.json(layerTemplate.getURL(), 
		function(error, file){
			if(error){
				console.log("Not possible to read JSON data: "+error.statusText);
			}else{
				console.log("Data has been received: "+idx);
				var uData = file[0].data;
				var vData = file[1].data;
				
				//We set the gridInfo only for the first time frame 
				
				var gridInfo = file[0].header;
				//TODO I don't know why latitude ranges come flipped
				var temp = gridInfo.la1;
				gridInfo.la1 = gridInfo.la2;
				gridInfo.la2 = temp;
				
				//We only initialize the loop and the headers for the first request
				if(loadedRequests === 0){
					owgis.ncwms.currents.particles.initData(gridInfo,currentExtent);
					startAnimationLoopCurrents();
				}
				
				var grid = new Array();
				for (j = 0, p = 0; j < gridInfo.ny; j++) {
					var row = [];
					for (i = 0; i < gridInfo.nx; i++, p++) {
						row[gridInfo.nx-1-i] = [uData[p], vData[p]];
					}
					grid[j] = row;
				}
				owgis.ncwms.currents.particles.setGrid(grid,idx);
				
				loadedRequests++;
				owgis.interf.loadingatmap(true,Math.floor( 100*(loadedRequests/totalRequests) ),"Currents");
//				owgis.interf.loadingatmouse(true);
				if(loadedRequests === totalRequests){
					owgis.interf.loadingatmap(false,0);
//					owgis.interf.loadingatmouse(false);
				}
			}
		});
	});
	
}

/**
 * This function updates the BBOX of the layers in order to modify the request.
 * The objective is to request only what is in the visible map 
 * @returns {undefined}
 */
function updateURL(){
	var origBBOX = layerTemplate.get("origbbox").split(',');
	// Validate that the user is viewing some area of the data
	if( (currentExtent[0] > origBBOX[2]) ||
			(currentExtent[2] < origBBOX[0]) ||
			(currentExtent[1] > origBBOX[3]) ||
			(currentExtent[3] < origBBOX[1]) ){
		//In this case the current map view is outside the limits of the data
		return false;
	}else{
		// Updating current BBOX
		limLonMin = Math.max(currentExtent[0], origBBOX[0]);
		limLatMin = Math.max(currentExtent[1], origBBOX[1]);
		
		var limLonMax = Math.min(currentExtent[2], origBBOX[2]);
		var limLatMax = Math.min(currentExtent[3], origBBOX[3]);
		
		var newbbox = limLonMin+","+limLatMin+","+limLonMax+","+limLatMax;
		layerTemplate.set("bbox",newbbox);	
		
		// Updating current zaxis
		if( !_.isEmpty(layerDetails.zaxis)){
			var elev = layerDetails.zaxis.values[elev_glob_counter];
			layerTemplate.set("elevation",elev);	
		}else{
			layerTemplate.set("elevation",null);	
		}
		
		layerTemplate = updateWidthAndHeight(layerTemplate);
		return true;
	}
}

/**
 * Removes previously defined animation callback functions 
 * @returns {undefined}
 */
function clearLoopHandlerCurrents(){
	if(typeof intervalHandlerCurrents !== 'undefined'){
		clearInterval(intervalHandlerCurrents);
	}
}

/**
 * Initilizes the callback function to start the animation loop 
 * @returns {undefined}
 */
function startAnimationLoopCurrents(){
	clearLoopHandlerCurrents();
	owgis.ncwms.currents.particles.setInternalAnimationSpeed(currAnimSpeed);
	intervalHandlerCurrents = setInterval(loopAnimationCurrents,currAnimSpeed);
}

/**
 * This is the callback function in charge of displaying
 * the proper frames of the animations 
 * @returns {undefined}
 */
function loopAnimationCurrents(){
	//When the animation is 'playing' it loops on all the frames
	if(!animationPaused){
		
		ctx.beginPath();
		
		//Make previous ones transparent
		var prev = ctx.globalCompositeOperation;
		ctx.globalCompositeOperation = "destination-out";
		ctx.fillStyle = "rgba(255, 255, 255, .2)";
		ctx.fillRect(0, 0, canvas.width,canvas.height);
		ctx.globalCompositeOperation = prev;
		ctx.strokeStyle = currentsColor;
		
		//Update particles positions
		owgis.ncwms.currents.particles.updateParticles();
		// Render again
		owgis.ncwms.currents.particles.drawParticles();
		
		ctx.stroke();
		
		map.render();
	}
}