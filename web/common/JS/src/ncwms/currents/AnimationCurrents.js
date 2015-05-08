goog.provide('owgis.ncwms.currents')

goog.require('ol.source.ImageCanvas');
goog.require('ol.renderer.canvas.ImageLayer');
goog.require('goog.events');
goog.require('owgis.ncwms.currents.particles');

owgis.ncwms.currents.currentFrame = 0;
owgis.ncwms.currents.grids = new Array();
owgis.ncwms.currents.layers;

var intervalHandler;// This is the handler of the 'interval' function
var canvas;
var ctx;
var currentExtent;
var currentsLayer;

window['owgis.ncwms.currents.dispAnimation'] = owgis.ncwms.currents.dispAnimation;
owgis.ncwms.currents.dispAnimation = function dispAnimation(){

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
	layersCollection.insertAt(parseInt(idx_main_layer)+1,currentsLayer);//Adds the animation layer just above the main layer
}

function canvasAnimationCurrents(extent, resolution, pixelRatio, size, projection) {	
	
	canvas = document.getElementById("currentsCanvas");
	ctx = canvas.getContext('2d');
	
    var canvasWidth = size[0];
    var canvasHeight = size[1];        
	
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;   	
	
	currentExtent = extent;
	
	updateURL();
	clearCanvas();
	startAnimation();
    return canvas;
}

/**
 * This function updates the BBOX of the layers in order to modify the request.
 * The objective is to request only what is in the visible map 
 * @returns {undefined}
 */
function updateURL(){
	var origBBOX = owgis.ncwms.currents.layers[owgis.ncwms.currents.currentFrame].get("origbbox").split(',');
	
	limLonMin = Math.max(currentExtent[0], origBBOX[0]);
	limLatMin = Math.max(currentExtent[1], origBBOX[1]);
	
	var limLonMax = Math.min(currentExtent[2], origBBOX[2]);
	var limLatMax = Math.min(currentExtent[3], origBBOX[3]);
	
	owgis.ncwms.currents.layers[owgis.ncwms.currents.currentFrame].set("bbox",limLonMin+","+limLatMin+","+limLonMax+","+limLatMax);	
	
	console.log(owgis.ncwms.currents.layers[owgis.ncwms.currents.currentFrame].get("bbox"));
}

/**
 * Main function that starts the animation of the currents. It reads all the
 * layers and when all are done then starts the animation loop 
 * @returns {undefined}
 */
function startAnimation(){
	clearAnimation();
	owgis.ncwms.currents.currentFrame = 0;
	
	d3.json(owgis.ncwms.currents.layers[owgis.ncwms.currents.currentFrame].getURL(),readData);
}

/**
 * Reads the data of an ncwmsProduct 
 * @param {type} file
 * @returns {undefined}
 */
function readData(file){
	
	var uData = file[0].data;
	var vData = file[1].data;
	
	gridInfo = file[0].header;
	//TODO I don't know why latitude ranges come flipped
	temp = gridInfo.la1;
	gridInfo.la1 = gridInfo.la2;
	gridInfo.la2 = temp;
	grid = new Array();
	
	for (j = 0, p = 0; j < gridInfo.nx; j++) {
		row = [];
		for (i = 0; i < gridInfo.ny; i++, p++) {
			row[gridInfo.ny-1-i] = [uData[p], vData[p]];
		}
		grid[j] = row;
	}
	
	owgis.ncwms.currents.particles.initData([grid],[gridInfo],0,currentExtent);
	startAnimationLoop();
}

/**
 * Removes previously defined animation callback functions 
 * @returns {undefined}
 */
function clearLoopHandler(){
	if(typeof intervalHandler !== 'undefined'){
		clearInterval(intervalHandler);
	}
}

/**
 * Initilizes the callback function to start the animation loop 
 * @returns {undefined}
 */
function startAnimationLoop(){
	clearLoopHandler();
	intervalHandler = setInterval(loopAnimation,animSpeed);
}


/**
 * This is the callback function in charge of displaying
 * the proper frames of the animations 
 * @returns {undefined}
 */
function loopAnimation(){
	//When the animation is 'playing' it loops on all the frames
	//	if(anim_status.current === anim_status.playing){
	
	ctx.beginPath();

	//Make previous ones transparent
	var prev = ctx.globalCompositeOperation;
	ctx.globalCompositeOperation = "destination-out";
	ctx.fillStyle = "rgba(255, 255, 255, .2)";
	ctx.fillRect(0, 0, canvas.width,canvas.height);
	ctx.globalCompositeOperation = prev;
//	ctx.strokeStyle = "rgba(0, 0, 255, .8)";
//	ctx.strokeStyle = "rgba(255, 255, 255, .4)";
	ctx.strokeStyle = "rgba(255, 255, 255, .4)";

	//Update particles positions
	owgis.ncwms.currents.particles.updateParticles();
	// Render again
	owgis.ncwms.currents.particles.drawParticles();

	ctx.stroke();
	
	map.render();
}

/**
 * Clears the canvas by drawing an empty rectangle 
 * @returns {undefined}
 */
function clearCanvas(){
	//Clears any previous display in the canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function clearAnimation(){
	clearLoopHandler();
}