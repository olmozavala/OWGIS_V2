goog.provide('owgis.ncwms.animation');

goog.require('ol.source.ImageStatic');
goog.require('ol.source.ImageWMS');
goog.require('goog.events');

var previousUrl; //compares the url requested for the animations. It is used in the ajax.js file
var currentFrame; // Current frame that is being displayed
var allFrames; // Will contain the 'dates' for each frame
owgis.ncwms.animation.animStatus = "none"; 
var animSpeed = 200;
// Is the animation status it can be:
// 		none -> There is not animation or is being stopped
// 		loading -> The animation is being requested but not all of the frames have loaded
//		playing -> Animation is being played at current speed
//		pause   -> Animation paused

var animLayer = null;
var animSource = null;
var intervalHandler;// This is the handler of the 'interval' function
var loadedFrames = 0;//Indicates how many frames have been loaded. 
var totalNumOfFrames = 0;//Total number of frames

/**
 * Modifies the visibility of different html elements involved on 
 * the displaying of the animations.
 * @param status - the status of the animation 
 * ['loading', 'playing', 'none','paused']
 */
function updateMenusDisplayVisibility(status){

    // ------- Visibility of top menus (general menus) -------
	if(netcdf){
		// When we are selecting dates. 
		switch( status ){
            case "loading":
                $('#CalendarsAndStopContainer').hide("fade");
                $('#animControls').hide("fade");
                $('#l-animation').show("fade");
                $('#minPal').disabled = true;
                $('#maxPal').disabled = true;
                $('#hideCalendarButtonParent').hide("fade");
                break;
            case "playing":
                $('#CalendarsAndStopContainer').hide("fade");
                $('#animControls').show("fade");
                $('#l-animation').hide("fade");
                $('#minPal').disabled = true;
                $('#maxPal').disabled = true;
                $('#elevationParent').hide("fade");
                $('#hideCalendarButtonParent').hide("fade");
                break;
            case "none":
            default:
                $("#palettesMenuParent").show();
                $("#lineToggle").show();
//                $("#downloadDataParent").hide();

                if(_mainlayer_zaxisCoord){
                    $('#elevationParent').show("fade");
                }else{
                    $('#elevationParent').hide();
                }
                if(_mainlayer_multipleDates){
                    $('#CalendarsAndStopContainer').show("fade");
                    $('#animControls').hide("fade");
                    $('#minPal').disabled = false;
                    $('#maxPal').disabled = false;
                    $('#hideCalendarButtonParent').show("fade");
                    $('#l-animation').hide("fade");
                }else{
                    $('#CalendarsAndStopContainer').hide("fade");
                }
                break;
		}
    }else{
        //Menus when the layer is not a netcdf
        $("#palettesMenuParent").hide();
        $("#lineToggle").hide();
        $("#downloadDataParent").show();
        $("#elevationParent").hide();
        $('#CalendarsAndStopContainer').hide();
    }

}

/**
 * Moves the animation to the first and last frame 
 * @returns {undefined}
 */
function animFirstFrame(){ currentFrame = 0; }
function animLastFrame(){ currentFrame = totalNumOfFrames - 1; }
/**
 * Decreases the frame of the animation, if it is on the first frame
 * it goes to the last one 
 * @returns {undefined}
 */
function animDecreaseFrame(){
	if(currentFrame > 0){
		currentFrame--;
	}else{
		currentFrame = totalNumOfFrames - 1;
	}
}

/**
 * Makes the animation 10% faster. 
 * @returns {undefined}
 */
function animFaster(){
	animSpeed = animSpeed*.90;
	startAnimationLoop();
}
/**
 * Makes the animation 10% slower. 
 * @returns {undefined}
 */
function animSlower(){
	animSpeed = animSpeed*1.10;
	startAnimationLoop();
}

/**
 * Increases the frame of the animation, if it is on the last frame
 * it goes to the first one 
 * @returns {undefined}
 */
function animIncreaseFrame(){
	if(currentFrame < totalNumOfFrames ){
		currentFrame++;
	}else{
		currentFrame = 0;
	}
}

/**
 * This function updates the status of the animation, it can be 
 * "paused", "none" or "playing"
 * @param {type} newStatus
 * @returns {undefined}
 */
function updateAnimationStatus(newStatus){
	owgis.ncwms.animation.animStatus = newStatus;
	switch(owgis.ncwms.animation.animStatus){
		case "none":
			updateMenusDisplayVisibility(owgis.ncwms.animation.animStatus);
			
			clearLoopHandler();
			
			if(animLayer !== null){//If the layer already existed, we remove it
				map.removeLayer(animLayer);
			}
			
			updateTitleAndKmlLink();
			break;
		case "pause": break;
		case "playing": break;
	}

}

/**
 * This function analyses the selected dates by the user and creates all
 * the string dates corresponding for each one 
 * @returns {undefined}
 */
function obtainSelectedDates(){
	// Obtains the selected dates 
	allFrames = new Array();
	totalNumOfFrames = 0;
	
	var startDate = Calendar.intToDate(calStart.selection.get());
	var endDate = Calendar.intToDate(calEnd.selection.get());
	
	var currYear, currMonth, currDay;
	currDate= startDate;
	
	while(currDate <= endDate){
		currYear = currDate.getUTCFullYear();
		currMonth = currDate.getUTCMonth();
		currDay = currDate.getUTCDate();
		//		allFrames.push(currYear+"-"+(currMonth+1)+"-"+currDay+"T00:00:00.000Z");
		allFrames.push(currYear+"-"+(currMonth+1)+"-"+currDay);
		currDate.setDate( currDate.getDate() + 1);
	}
	
	totalNumOfFrames = allFrames.length;
}

/**
 * This function gets the selected dates from the user and starts
 * the ajax request to generate the animation of the NetCDF files.
 */
owgis.ncwms.animation.dispAnimation = function dispAnimation(){
	obtainSelectedDates();
	
	//Create the required global variables if they don't exist
	for(i = 0; i <= totalNumOfFrames; i++){
		try{// Hack to test if the variable already exists
			eval('imageNumber'+i);
		}
		catch(e){
			eval('window.imageNumber'+i+';');
			eval("imageNumber"+i+" = document.createElement('img');");
		}
	}
	
	animSource= new ol.source.ImageCanvas({
		canvasFunction: canvasAnimationFunction,
		projection: _map_projection 
	});
	
	animLayer = new ol.layer.Image({
		source: animSource});
	
	currentFrame = 0; //Set to use the first frame
	map.addLayer(animLayer);
}

/**
 * The resolution of the animation depends on the size of the screen. Assuming
 * that if you have a larger screen then you will have a better internet 
 * @returns {Number}
 */
function getResolutionRatio(){
	var selectedRes = $("[name=video_res]:checked").val(); 
	switch(selectedRes){
		case "high":
			return .55;
			break;
		case "normal":
			return .4;
			break;
		case "low":
			return .3;
			break;
	}
}

function canvasAnimationFunction(extent, resolution, pixelRatio, size, projection){

	owgis.ncwms.animation.animStatus = "loading"; 
	loadedFrames = 0;// Reset the total number of images loaded
	$("#loadperc").text( Math.ceil(100*(loadedFrames/totalNumOfFrames)));
	updateMenusDisplayVisibility(owgis.ncwms.animation.animStatus);

    var canvasWidth = size[0];
    var canvasHeight = size[1];        
	
    var canvas = document.getElementById('animationCanvas');    
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;
	
    ctx = canvas.getContext('2d');
	
	/*
	console.log("-----------------------");
	console.log("Extent:" + extent);
	console.log("Resolution: " + resolution);
	console.log("PixelRatio: " + pixelRatio);
	console.log("Size: " + size);
	 */
	
	originalResolution = resolution;
	originalExtent = extent;
	originalCenter = map.getView().getCenter();
	originalPixelsCenter = map.getPixelFromCoordinate(originalCenter);
	
	var bbox = extent;
	var animResolution = getResolutionRatio();
	var imgWidth = Math.ceil(canvasWidth*animResolution);
	var imgHeight = Math.ceil(canvasHeight*animResolution);
	
	//Check status of previous animation and deletes it if exists
	var mainLayer = owgis.layers.getMainLayer();
	var mainSource = mainLayer.getSource();
	var mainParams = mainSource.getParams();
	var layerName = mainParams.LAYERS;
	
	var currUrl = mainSource.getUrls()[0];//Get url for 
	
	var animParams = { 
		TIME: allFrames[0],
		LAYERS: layerName,
		BBOX: bbox.toString(),
		REQUEST: "GetMap",
		VERSION: "1.3.0",
		STYLES: lay_style+"/"+mappalette,
		FORMAT: "image/png",
		TRANSPARENT: "TRUE",
		CRS:"CRS:84",
		WIDTH: imgWidth,
		HEIGHT: imgHeight,
		NUMCOLORBANDS: 250,
		COLORSCALERANGE:  minPalVal + ',' + maxPalVal};
	
	if (layerDetails.zaxis !== undefined) {
		animParams.elevation =  layerDetails.zaxis.values[elev_glob_counter];
	}
	
	var imgSrc;
	
	currentFrame = 0;// Reset to first frame
	for(i = 0; i < totalNumOfFrames; i++){
		animParams.TIME = allFrames[i];
		imgSrc = currUrl+"?"+owgis.utils.paramsToUrl(animParams);
		eval('imageNumber'+i+'.src = imgSrc;');
		eval("imageNumber"+i+".addEventListener('load', imageHasBeenLoaded);");
	}
	
	startAnimationLoop();

    return canvas;
} 

function clearLoopHandler(){
	if(typeof intervalHandler !== 'undefined'){
		clearInterval(intervalHandler);
	}
}

function startAnimationLoop(){
	clearLoopHandler();
	intervalHandler = setInterval(loopAnimation,animSpeed);
}
/**
 * This function is called for every image when they have been loaded. 
 */
function imageHasBeenLoaded(e){
	e.target.removeEventListener('load', imageHasBeenLoaded, false); 
	loadedFrames++; 
	if(loadedFrames === totalNumOfFrames ){
		owgis.ncwms.animation.animStatus = "playing";
		updateMenusDisplayVisibility(owgis.ncwms.animation.animStatus);
	}
	$("#loadperc").text( Math.ceil(100*(loadedFrames/totalNumOfFrames)));
//	console.log('Loaded images:'+loadedFrames);
}


function loopAnimation(){
	var canvas = document.getElementById('animationCanvas');    
	
	if( (owgis.ncwms.animation.animStatus === "playing") || (owgis.ncwms.animation.animStatus === "loading")){
		currentFrame = currentFrame < totalNumOfFrames? ++currentFrame: 0;
	}
	
//	console.log("Displaying Frame: "+ currentFrame);
	ctx.drawImage(eval('imageNumber'+currentFrame), 0, 0, canvas.width, canvas.height);
	ctx.stroke();
	map.render();
}
