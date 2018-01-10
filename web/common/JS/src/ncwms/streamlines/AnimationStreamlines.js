goog.provide('owgis.ncwms.currents');

goog.require('ol.source.ImageCanvas');
goog.require('ol.renderer.canvas.ImageLayer');
goog.require('goog.events');
goog.require('owgis.ncwms.currents.particles');
goog.require('owgis.ncwms.ncwmstwo');
goog.require('owgis.ncwms.animation.status');
goog.require('owgis.interf');
goog.require('owgis.transparency');
goog.require('owgis.utilities.mathgeo');

owgis.ncwms.currents.grids = new Array();

var currentsColor = (localStorage.particles_color !== "NaN" && localStorage.particles_color !== 'undefined') ? localStorage.particles_color : "rgba(255, 255, 255, .6)";
var currentsDefColor = "rgba(255, 255, 255, .6)";
var currAnimSpeed = 80;
var defLineWidth = 1.7;
var defLineWidthCesium = 2.5;

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

	owgis.transparency.changeTransp(.55);
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

	//If this layer is being server by ncWMS V2 or higher, then we 
	// need to replace the format attribute
	if(layerDetails.ncwmstwo){
		defLayer.set("format","application/prs.coverage+json");
	}	
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

/**
 *	This function changes the requested resolution depending on:
 *	If we are displaying an animation or not
 *	If is an animation, then we need to take into account the animation resolution
 *	If we are at a mobile device or not
 * @param {type} layerTemplate
 * @returns {unresolved}
 */
function updateWidthAndHeight(layerTemplate){


	var resolutionFactor = 1;//For desktop
	if(mobile){
		resolutionFactor *= .6;//In mobile devices by default the requested resolution is reduced
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

/**
 * Starts the streamlines when they are viewed with the Cesium 3D world 
 * @returns {undefined}
 */
function initstreamlineLayerCesium(){
	
	if(streamlineLayer !== null){//If the layer already existed, we remove it
		map.removeLayer(streamlineLayer);
	}

	c_scene = _cesium.getCesiumScene();
	c_handler = new Cesium.ScreenSpaceEventHandler(c_scene.canvas);

	owgis.ncwms.currents.cleanAnimationCurrentsAll();
	updateCurrentsCesium();

	//When the left mouse click has been released (UP)
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
			owgis.ncwms.currents.cleanAnimationCurrentsAll();
		}
	}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

	//Left click movement
	c_handler.setInputAction(function(event) {
		c_leftdown = true;
	}, Cesium.ScreenSpaceEventType.LEFT_DOWN);

	//Rotation of the mouse (ZOOM)
	c_handler.setInputAction(function(event) {
		updateCurrentsCesium(event);
	}, Cesium.ScreenSpaceEventType.WHEEL);
	
}

/**
 * This function is in charge of updating the extents in Cesium 
 * @param {type} event
 * @returns {undefined}
 */
function updateCurrentsCesium(event){
	canvas.width = $(window).width();
	canvas.height = $(window).height();

	var cam_rad = c_scene.camera.positionCartographic;
	var c_center = {
		longitude:cam_rad.longitude*180/Math.PI,
		latitude:cam_rad.latitude*180/Math.PI};

	//This is the hight were the user see at most 70 degrees from each direction
	var def_max_angle = 70;
	var hight_for_max_angle = 8000000; 

	//The proportion of the window affects how much the user can sees but
	// it also should take into account how far are we

	var win_prop = canvas.width/canvas.height;
	var view_angle_lat = Math.min(def_max_angle,def_max_angle*cam_rad.height/(hight_for_max_angle*Math.max(1,win_prop)));
	var view_angle_lon = Math.min(def_max_angle,def_max_angle*cam_rad.height*Math.min(1,win_prop)/hight_for_max_angle);


	//In this case we have to load all the space in the longitude
	// The 20 degrees indicates when we start requesting the whole 180
	// degrees, in this case if the camera is above view_angle_lat - 20
	if( (Math.abs(c_center.latitude) + view_angle_lat - 20) > 90){
//		console.log("Max lat: " + (Math.abs(c_center.latitude) + view_angle_lat + 10));
		currentExtent = [c_center.longitude-180,
						Math.max(-90, c_center.latitude-view_angle_lat),
						c_center.longitude+180,
						Math.min(90, c_center.latitude+view_angle_lat)];
	}else{
		currentExtent = [ c_center.longitude-view_angle_lon,
						c_center.latitude-view_angle_lat,
						c_center.longitude+view_angle_lon,
						c_center.latitude+view_angle_lat];
	}

/*
	console.log(cam_rad.height);
	console.log("****************************************************************");
	console.log("Hight: " + cam_rad.height/hight_for_max_angle);
	console.log("Win prop:" + win_prop);
	console.log("Angle lat: " + view_angle_lat);
	console.log("Angle lon: " + view_angle_lon);
	console.log("Camera center: (" + c_center.latitude + "," + c_center.longitude + ")");
	console.log("Computed extent: " + currentExtent);
	*/

	if(!isRunningUnderMainAnimation){
		if(updateURL()){
			//Trying to match the resolution obtained with the non-cesium version.
			// This is just to modify the the speed of the particles when zooming in/out
			var resolution = cam_rad.height/200000000;
			console.log("Computes res: "+resolution);
			owgis.ncwms.currents.style.updateParticleSpeedFromResolution(resolution, currentExtent);
			updateData();
		}
	}else{
		//TODO Cesium still doesn't do animations
		/*
		if(isFirstTime){
			if(updateURL()){
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
	
	streamlineLayer = new ol.layer.Image({source: animSource});
	
	var layersCollection = map.getLayers();
	if(_.isEmpty(animLayer)){
		layersCollection.insertAt(parseInt(_id_first_main_layer)+1,streamlineLayer);//Adds the animation layer just above the main layer
	}else{
		layersCollection.insertAt(parseInt(_id_first_main_layer)+2,streamlineLayer);//Adds the animation layer just above the main layer
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
			owgis.ncwms.currents.style.updateParticleSpeedFromResolution(resolution, extent);
			updateData();
		}
	}else{
		if(isFirstTime){
			if(updateURL()){
				owgis.ncwms.currents.style.updateParticleSpeedFromResolution(resolution, extent);
				updateData();
			}
			isFirstTime = false;
		}
	}
	return canvas;
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

/**
 * This function Reads the json files from the server and loads the vector field
 * into the proper variables,  
 * @returns {undefined}
 */
function updateData(){
	// Clears previous animations
	owgis.ncwms.currents.cleanAnimationCurrentsAll();

	var computedFileSize = estimatedFileSize*( ($(window).width()*$(window).height() ))/(800*800);
	
	var totalRequests = times.length;	
	var loadedRequests = 0;
	
	//Reads the data
	owgis.interf.loadingatmap(true,0,"Currents");
	
	totalFiles = times.length;

	var uData = new Array();
	var vData = new Array();
	
	abortPrevious();//Abort any previous premises we have
	readDataPremises = new Array();
	if(layerDetails.ncwmstwo){
		// Iterate over all the times we are displaying (only one, unless we have animations)
		_.each(times, function(time, idx){
			layerTemplate.set("time",time);	

			//We obtain the request URLs for each vector field U and V
			var compositeLayers = layerTemplate.get("layers");
			var tempULayer = layerTemplate.clone();
			var tempVLayer = layerTemplate.clone();
			tempULayer.set("layers",compositeLayers.split(':')[0]);//Get the proper format for U
			tempVLayer.set("layers",compositeLayers.split(':')[1]);//Get the proper format for V
			

			//Our premises are going to be 
			// (idx-1)*2 + 0 for u         and
			// (idx-1)*2 + 1 for v
			var uidx = idx*2 + 0;
			var vidx = idx*2 + 1;

			readDataPremises[uidx] = d3.json( tempULayer.getURL(), function(error, file){
						if(error){
							console.log("Not possible to read JSON data for U: "+error.statusText);
						}else{
							//TODO we need to be certain that this will work every case,
							// the problem is that updateParticles gets called more than one time
							// for each animation.
							uData[idx] = new Array();//Clear the array for this specific location
			//				console.log("Data has been received: "+idx);
							var gridInfo = owgis.ncwms.ncwmstwo.buildGridInfo(file);
							uData[idx] = file.ranges[Object.keys(file.ranges)[0]].values;
							//We only initialize the loop and the headers for the first request
							if(loadedRequests === 0){
								owgis.ncwms.currents.particles.initData(gridInfo,currentExtent);
							}
							
							if( !_.isUndefined(uData[idx]) && !_.isUndefined(vData[idx])){
								if( uData[idx].length > 0 && vData[idx].length){
									var grid = owgis.ncwms.ncwmstwo.buildGrid(gridInfo,uData[idx],vData[idx]);
//									console.log("Set grid for: ",idx);
									owgis.ncwms.currents.particles.setGrid(grid,idx);
								}
							}

							loadedRequests++;
							owgis.interf.loadingatmap(true,Math.floor( 100*(loadedRequests/(totalRequests*2))),"Currents");

							//Start the animation when 90% of the frames have been loaded
							if( (loadedRequests/(totalRequests*2)) > .9){
								owgis.interf.loadingatmap(false,0);
								startAnimationLoopCurrents();
							}
						}
					});

			readDataPremises[vidx] = d3.json( tempVLayer.getURL(), function(error, file){
						if(error){
							console.log("Not possible to read JSON data for V: "+error.statusText);
						}else{
							//TODO we need to be certain that this will work every case,
							// the problem is that updateParticles gets called more than one time
							// for each animation.
							vData[idx] = new Array();
							//We set the gridInfo only for the first time frame 
							var gridInfo = owgis.ncwms.ncwmstwo.buildGridInfo(file);
							vData[idx] = file.ranges[Object.keys(file.ranges)[0]].values;

							//We only initialize the loop and the headers for the first request
							if(loadedRequests === 0){
								owgis.ncwms.currents.particles.initData(gridInfo,currentExtent);
							}

							if( !_.isUndefined(uData[idx]) && !_.isUndefined(vData[idx])){
								if( uData[idx].length > 0 && vData[idx].length){
									var grid = owgis.ncwms.ncwmstwo.buildGrid(gridInfo,uData[idx],vData[idx]);
//									console.log("Set grid for: ",idx);
									owgis.ncwms.currents.particles.setGrid(grid,idx);
								}
							}
							
							loadedRequests++;
							owgis.interf.loadingatmap(true,Math.floor( 100*(loadedRequests/(totalRequests*2))),"Currents");

							//Start the animation when 90% of the frames have been loaded
							if( (loadedRequests/(totalRequests*2)) > .9){
								owgis.interf.loadingatmap(false,0);
								startAnimationLoopCurrents();
							}
						}
					});
			});
                        
	}else{
		// Iterate over all the times we are displaying (only one, unless we have animations)
		_.each(times, function(time, idx){
			layerTemplate.set("time",time);	
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
			var elev = layerDetails.zaxis.values[owgis.ncwms.zaxis.globcounter];
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
        if(localStorage.particles_speed !== 'undefined' && localStorage.particles_speed !== 'NaN'){
            console.log('set last speed.');
            owgis.ncwms.currents.particles.setParticleSpeed(parseFloat(localStorage.particles_speed));
        }
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
		ctx.fillStyle = "rgba(255, 255, 255, .1)";
		ctx.fillRect(0, 0, canvas.width,canvas.height);
		ctx.globalCompositeOperation = prev;
		ctx.strokeStyle = currentsColor;
		if(mobile){
			if(_.isEmpty(_cesium) || !_cesium.getEnabled()){
				//When Cesium is enabled
				ctx.lineWidth = defLineWidthCesium;
			}else{
				//When not Cesium and mobile
				ctx.lineWidth = defLineWidth;
			}
		}else{
			ctx.lineWidth = defLineWidth;
		}
		
		//Update particles positions
		owgis.ncwms.currents.particles.updateParticles();
		// Render again
		owgis.ncwms.currents.particles.drawParticles();
		
		ctx.stroke();
		
		map.render();
	}
}