goog.provide('owgis.ncwms.currents');

goog.require('ol.source.ImageCanvas');
goog.require('ol.renderer.canvas.ImageLayer');
goog.require('goog.events');
goog.require('owgis.ncwms.currents.particles');

owgis.ncwms.currents.grids = new Array();

var currentsColor = "rgba(255, 255, 255, .4)";
var currAnimSpeed = 100;

// This is the amount of data requested for every 800 pixels
var imageRequestResolution = 100;

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

window['owgis.ncwms.currents.setColor'] = owgis.ncwms.currents.setColor;
owgis.ncwms.currents.setColor= function setColor(color){
	currentsColor = color;
}
owgis.ncwms.currents.getColor= function getColor(){
	return currentsColor;
}

owgis.ncwms.currents.pause = function pause(){
	animationPaused = true;
}
owgis.ncwms.currents.play = function play(){
	animationPaused = false;
}

/**
 * Main function that starts the animation of the currents. It reads the
 * current layer data and it is done then starts the animation loop 
 * @returns {undefined}
 */
window['owgis.ncwms.currents.startSingleDateAnimation'] = owgis.ncwms.currents.startSingleDateAnimation;
owgis.ncwms.currents.startSingleDateAnimation = function startSingleDateAnimation(){
	
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
owgis.ncwms.currents.clearCurrentsCanvas= function clearCurrentsCanvas(){
	//Clears any previous display in the canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * This function builds the layer with the information retrieved
 * from the main layer but using the 'currentsLayer' name. 
 * @returns {owgis.layer.model}
 */
function getDefaultLayer(){

//	var width = Math.ceil(($(window).width()/800)*imageRequestResolution);
//	var height = Math.ceil(($(window).height()/800)*imageRequestResolution);
	var width = Math.ceil(($(window).width()/800)*imageRequestResolution);
	var height = Math.ceil(($(window).width()/800)*imageRequestResolution);
	console.log("Resolution is: "+width+" x "+height);
	return new owgis.layer.model({
			server: layerDetails.server,
			layers: layerDetails.currentsLayer,
			bbox: layerDetails.bbox.join(","),
			origbbox: layerDetails.bbox.join(","),
			width: width,
			height: height
		}); 
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
	
	if(updateURL()){
		abortPrevious();
		owgis.ncwms.currents.clearCurrentsCanvas();
		updateData();
		//Initializes the layer in the map
	}

	return canvas;
}

/**
 * This function is used to cancel all the previous json request that
 * haven't finish. 
 * @returns {undefined}
 */
function abortPrevious(){
	_.each(readDataPremises, function(premise,id){
		premise.abort();
		console.log("The premise "+id+" has been aborted");
	});
}

function updateData(){
	// Clears previous animations
	clearAnimationCurrents();
	// We always start with the current grid = 0 
	owgis.ncwms.currents.particles.setCurrentGrid(0);
	//Reads the data
	_.each(times, function(time, idx){
		layerTemplate.set("time",time);	
		readDataPremises = new Array();
		readDataPremises[idx] = d3.json(layerTemplate.getURL(), function(error, file){
			if(error){
				console.log("Not possible to read JSON data: "+error.statusText);
			}else{
				var uData = file[0].data;
				var vData = file[1].data;
				
				//We set the gridInfo only for the first time frame 

				var gridInfo = file[0].header;
				//TODO I don't know why latitude ranges come flipped
				var temp = gridInfo.la1;
				gridInfo.la1 = gridInfo.la2;
				gridInfo.la2 = temp;

				//TODO everytime the gridInfo and extent is set, this is a waste
				// of time
				owgis.ncwms.currents.particles.initData(gridInfo,currentExtent);

				var grid = new Array();
				for (j = 0, p = 0; j < gridInfo.nx; j++) {
					var row = [];
					for (i = 0; i < gridInfo.ny; i++, p++) {
						row[gridInfo.ny-1-i] = [uData[p], vData[p]];
					}
					grid[j] = row;
				}
				owgis.ncwms.currents.particles.setGrid(grid,idx);
				
				startAnimationLoopCurrents();
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


function clearAnimationCurrents(){
	clearLoopHandlerCurrents();
}