goog.provide('owgis.ncwms.currents');

goog.require('ol.source.ImageCanvas');
goog.require('ol.renderer.canvas.ImageLayer');
goog.require('goog.events');
goog.require('owgis.ncwms.currents.particles');
goog.require('owgis.ncwms.animation.status');
goog.require('owgis.interf');
goog.require('owgis.transparency');

owgis.ncwms.currents.grids = new Array();

var currentsColor = "rgba(255, 255, 255, .5)";
var currentsDefColor = "rgba(255, 255, 255, .5)";
var currAnimSpeed = 100;

// This is the amount of data requested for every 800 pixels
var imageRequestResolution = 300;

var layerTemplate;
var times = new Array();

var intervalHandlerCurrents;// This is the handler of the 'interval' function
var canvas;
var ctx;
var currentExtent;
var streamlineLayer;

var grids;
var gridsHeaders;

var readDataPremises;
// This is the estimated file size for a screen with 800x800 pixels
var estimatedFileSize = 2000000;

var animationPaused = false;
//This variable is used to stop refreshing the data when the 'main' animation is
// running. Afther all the images have been loaded the the particles data is reloaded
var isRunningUnderMainAnimation = false;
var isFirstTime = true;//Only important when been run under main animation

// ------------------ Cesium related -------------
var c_move = false;//Used to detect movement of the mouse
var c_leftdown = false;//Used to detect a left click of the mouse
var c_x = 0.0350; // Used to increase the longitude angle
var c_y = -0.75;// Used to increase the longitude angle
var c_scene;
var c_handler;

window['owgis.ncwms.currents.setColor'] = owgis.ncwms.currents.setColor;
owgis.ncwms.currents.setColor= function setColor(color){
	currentsColor = color;
}
owgis.ncwms.currents.getColor= function getColor(){
	return currentsColor;
}
owgis.ncwms.currents.getDefColor= function getDefColor(){
	return currentsDefColor;
}

/**
 * This function is used to play/pause the animation of the currents. 
 * If not parameters are received it toggles the play/pause. 
 * Else it sets the status depending on the 'pause' parameter 
 * @param {type} pause
 * @returns {undefined}
 */
owgis.ncwms.currents.playPause = function playPause(pause){
	//If the play variable is empty we toogle the animation
	if(!_.isBoolean(pause)){
		animationPaused = !animationPaused;
	}else{
		animationPaused = pause;
	}
	if(!mobile){
		if(animationPaused){
			$("#currentsPlayPauseButton").removeClass("glyphicon-pause");
			$("#currentsPlayPauseButton").addClass("glyphicon-play");
		}else{
			$("#currentsPlayPauseButton").removeClass("glyphicon-play");
			$("#currentsPlayPauseButton").addClass("glyphicon-pause");
		}
	}else{
		if(animationPaused){
			$("#currentsPlayPauseButton").text("Play");
			$("#currentsPlayPauseButton").addClass("ui-icon-play");
			$("#currentsPlayPauseButton").removeClass("ui-icon-pause");
		}else{
			$("#currentsPlayPauseButton").text("Pause");
			$("#currentsPlayPauseButton").addClass("ui-icon-pause");
			$("#currentsPlayPauseButton").removeClass("ui-icon-play");
		}
	}
}

/**
 * Main function that starts the animation of the currents. It reads the
 * current layer data and it is done then starts the animation loop 
 * @returns {undefined}
 */
window['owgis.ncwms.currents.startSingleDateAnimation'] = owgis.ncwms.currents.startSingleDateAnimation;
owgis.ncwms.currents.startSingleDateAnimation = function startSingleDateAnimation(){

	owgis.transparency.changeTransp(.35);
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
	if(!_.isEmpty(_cesium) && _cesium.getEnabled()){
		$("#currentsCanvas").css({position:'absolute', left:'0px',top:'0px','pointer-events':'none'});
		$(".layersLonLat").hide();
		initstreamlineLayerCesium();
	}else{
		$("#currentsCanvas").removeAttr('style');
		$(".layersLonLat").show();
		initstreamlineLayer();
	}
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
	initstreamlineLayer();
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
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * This function builds the layer with the information retrieved
 * from the main layer but using the 'streamlineLayer' name. 
 * @returns {owgis.layer.model}
 */
function getDefaultLayer(){

	var defLayer = new owgis.layer.model({
			server: layerDetails.server,
			layers: layerDetails.streamlineLayer,
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
		resolutionFactor *= .8;//In mobile devices by default the requested resolution is reduced
	}
	if( owgis.ncwms.animation.status.current !== owgis.ncwms.animation.status.none ){ 
		resolutionFactor *= owgis.ncwms.animation.status.getResolutionRatioCurrents();
	}

	var width = Math.ceil(($(window).width()/800)*imageRequestResolution*resolutionFactor);
	var height = Math.ceil(($(window).height()/800)*imageRequestResolution*resolutionFactor);
//	console.log("Requested resolution is: "+width+" x "+height);
	layerTemplate.set("width",width);	
	layerTemplate.set("height",height);	
	return layerTemplate;

}

function initstreamlineLayerCesium(){
	
	if(streamlineLayer !== null){//If the layer already existed, we remove it
		map.removeLayer(streamlineLayer);
	}

	c_scene = _cesium.getCesiumScene();
	c_handler = new Cesium.ScreenSpaceEventHandler(c_scene.canvas);

	updateCurrentsCesium(event);

	c_handler.setInputAction(function(event) {
		if(c_leftdown && c_move){
			updateCurrentsCesium(event);
		}
		c_move = false;
		c_leftdown = false;
	}, Cesium.ScreenSpaceEventType.LEFT_UP);

	//Mouse movement
	c_handler.setInputAction(function(event) {
		if(c_leftdown){
			c_move = true;
		}
	}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

	//Left click movement
	c_handler.setInputAction(function(event) {
		c_leftdown = true;
	}, Cesium.ScreenSpaceEventType.LEFT_DOWN);

	c_handler.setInputAction(function(event) {
		updateCurrentsCesium(event);
	}, Cesium.ScreenSpaceEventType.WHEEL);
	
}

function updateCurrentsCesium(event){
	canvas.width = $(window).width();
	canvas.height = $(window).height();

	var c_center_rad = c_scene.camera.positionCartographic;
	var c_center = {
		longitude:c_center_rad.longitude*180/Math.PI,
		latitude:c_center_rad.latitude*180/Math.PI};

	var def_max_angle = 70;
	var hight_for_max_angle = 9000000;
	var view_angle_lat = Math.min(def_max_angle,def_max_angle*c_center_rad.height/hight_for_max_angle);
	var inc_angle_by = Math.abs(c_center.latitude)*c_x + c_y;
	var view_angle_lon;
	if(inc_angle_by > 1){
		view_angle_lon = Math.min(180, Math.max(1,inc_angle_by)*(def_max_angle*c_center_rad.height/hight_for_max_angle));
	}else{
		view_angle_lon = Math.min(def_max_angle, def_max_angle*c_center_rad.height/hight_for_max_angle);
	}
	currentExtent = [c_center.longitude-view_angle_lon,
					c_center.latitude-view_angle_lat,
					c_center.longitude+view_angle_lon,
					c_center.latitude+view_angle_lat];
	console.log(inc_angle_by);
	console.log(view_angle_lat);
	console.log(view_angle_lon);
	console.log(currentExtent);

	if(!isRunningUnderMainAnimation){
		if(updateURL()){
			updateData();
		}
	}else{
		//TODO
		/*
		if(isFirstTime){
			if(updateURL()){
				updateParticlesParameters(extent,resolution);
				updateData();
			}
			isFirstTime = false;
		}
		*/
	}

}

function initstreamlineLayer(){
	
	if(streamlineLayer !== null){//If the layer already existed, we remove it
		map.removeLayer(streamlineLayer);
	}
	
	//This is the source of the new map layer
	var animSource= new ol.source.ImageCanvas({
		canvasFunction: canvasAnimationCurrents,
		projection: layerDetails.srs
	});
	
	streamlineLayer = new ol.layer.Image({
		source: animSource});
	
	var layersCollection = map.getLayers();
	if(_.isEmpty(animLayer)){
		layersCollection.insertAt(parseInt(idx_main_layer)+1,streamlineLayer);//Adds the animation layer just above the main layer
	}else{
		layersCollection.insertAt(parseInt(idx_main_layer)+2,streamlineLayer);//Adds the animation layer just above the main layer
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
	
//	console.log("Update currents view and data");
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
	owgis.ncwms.currents.style.updateParticleSpeedFromResolution(resolution, extent);
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

	var computedFileSize = estimatedFileSize*( ($(window).width()*$(window).height() ))/(800*800);
	
	var totalRequests = times.length;	
	var loadedRequests = 0;
	
	//Reads the data
	owgis.interf.loadingatmap(true,0,"Currents");
	
	totalFiles = times.length;
	loadedRequests
	
	_.each(times, function(time, idx){
		layerTemplate.set("time",time);	
		readDataPremises = new Array();
		//		console.log(layerTemplate.getURL());
		readDataPremises[idx] = d3.json( layerTemplate.getURL(), function(error, file){
					if(error){
						console.log("Not possible to read JSON data: "+error.statusText);
					}else{
						//				console.log("Data has been received: "+idx);
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
						
						// We read the data and create the grid
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
						}
					}
				});
				
				//This function is used to display the progress of the download, only used when
				// we have one time
				if(times.length === 1){
					readDataPremises[idx].on("progress",function(){
						owgis.interf.loadingatmap(true,Math.round((d3.event.loaded/computedFileSize)*100),"Currents");
					});
				}
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