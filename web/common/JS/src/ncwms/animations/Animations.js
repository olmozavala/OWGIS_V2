goog.provide('owgis.ncwms.animation');

goog.require('ol.source.ImageStatic');
goog.require('ol.source.ImageWMS');
goog.require('goog.events');

owgis.ncwms.animation.animStatus = "none"; 

var currentFrame; // Current frame that is being displayed
var allFrames; // Will contain the 'dates' for each frame
var animSpeed = 200;
// Is the animation status it can be:
// 		none -> There is not animation or is being stopped
// 		loading -> The animation is being requested but not all of the frames have loaded
//		playing -> Animation is being played at current speed
//		pause   -> Animation paused

var animLayer;
var animSource;
var currUrl;
var animParams; //Parameters requested for the animation
var intervalHandler;// This is the handler of the 'interval' function
var loadedFrames = 0;//Indicates how many frames have been loaded. 
var totalNumOfFrames = 0;//Total number of frames
var numberOfParallelRquests = 4;
//This animation is used to stop images requested for a 'different' animation.
var currentAnimation = 0;

var errorRetryNumber = 5; //How many times try to reload an image before considering a fail

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
				$('#animControls a').hide();// Hidde the rest of the buttons
                $('#animControls').show("fade");//Show the stop button
				$('#stopAnimText').show("fade");
				$('#animControls [class*=stop]').parent().show("fade");
                $('#l-animation').show("fade");
                $('#minPal').disabled = true;
                $('#maxPal').disabled = true;
                $('#hideCalendarButtonParent').hide("fade");
                break;
            case "playing":
                $('#CalendarsAndStopContainer').hide("fade");
				$('#stopAnimText').hide();
				$('#animControls a').show("fade");// Show all the buttons
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
 * Increases the frame of the animation, if it is on the last frame
 * it goes to the first one 
 * @returns {undefined}
 */
function animIncreaseFrame(){
	if(currentFrame < (totalNumOfFrames - 1) ){
		currentFrame++;
	}else{
		currentFrame = 0;
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
 * This function updates the status of the animation, it can be 
 * "paused", "none" or "playing"
 * @param {type} newStatus
 * @returns {undefined}
 */
function updateAnimationStatus(newStatus){
	owgis.ncwms.animation.animStatus = newStatus;
	switch(owgis.ncwms.animation.animStatus){
		case "none"://When the animation has been stoped
			currentAnimation++;//It is used to stop any previous images
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
	if(getUserSelectedTimeFrame().indexOf("/") === -1){
		allFrames = getUserSelectedTimeFrame().split(",");
	}else{
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
	console.log("TotalNumber of frames: "+ totalNumOfFrames);
	for(var i = 0; i < totalNumOfFrames; i++){
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
/**
 * This is the main function in charge of creating the animatinons.
 * It is called by Ol3 everytime there is a change in the map (zoom, pan, etc).
 * It receives the location and resolution of the map and it returns a canvas with
 * the desired display.  
 * @param {type} extent
 * @param {type} resolution
 * @param {type} pixelRatio
 * @param {type} size
 * @param {type} projection
 * @returns {Element|canvasAnimationFunction.canvas}
 */
function canvasAnimationFunction(extent, resolution, pixelRatio, size, projection){
	
	console.log("----------- Canvas reload -----------");

	currentAnimation++;//Increments the animation counter;
	owgis.ncwms.animation.animStatus = "loading"; 
	updateTitleAndKmlLink();

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
	
	currUrl = mainSource.getUrls()[0];//Get url for 
	
	animParams = { 
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
	
	// This loops starts 'n' number of parallel requests for animation
	// images.
	for(i = 0; i < Math.min(numberOfParallelRquests,totalNumOfFrames); i++){
		animParams.TIME = allFrames[i];
		imgSrc = currUrl+"?"+owgis.utils.paramsToUrl(animParams);
		eval('imageNumber'+i+'.src = imgSrc;');
		eval("imageNumber"+i+".id = "+i+";");
		eval("imageNumber"+i+".errorCount = 0;");
		eval("imageNumber"+i+".belongs = "+currentAnimation+";");//Attach an animation 'counter'
		eval("imageNumber"+i+".addEventListener('load', imageHasBeenLoadedParallel);");
		eval("imageNumber"+i+".addEventListener('error', errorFunction);");
	}

	startAnimationLoop();
	
    return canvas;
} 

/**
 * Log the error and try to load the image again 
 * @param {type} e
 * @returns {undefined}
 */
function errorFunction(e){

	var currentImage = parseInt(e.target.id);
	var errorCount = parseInt(e.target.errorCount);

	if(errorCount > errorRetryNumber){
		alert("There has been a problem loading image with date: "+ allFrames[currentImage] 
					+" please stop the animation and reload it");
	}else{
		console.log("Error loading image: "+currentImage);

		animParams.TIME = allFrames[currentImage];
		var imgSrc = currUrl+"?"+owgis.utils.paramsToUrl(animParams);

		eval('imageNumber'+currentImage+'.src = imgSrc;');
		eval("imageNumber"+currentImage+".errorCount = "+(errorCount+1)+";");
	}
}

function imageHasBeenLoadedParallel(e){
	e.target.removeEventListener('load', imageHasBeenLoadedParallel, false); 

	if( owgis.ncwms.animation.animStatus === "loading"){
		var currentImage = parseInt(e.target.id);
		var currentBelongs = parseInt(e.target.belongs);//Reads the image animation belonging
		console.log('Loaded image:'+currentImage+" belongs: "+currentBelongs);
		
		//Being sure that we are in order, if not then we dont' do anything
		if( currentBelongs === currentAnimation ){
			loadedFrames++; 
			
			if(loadedFrames >= totalNumOfFrames ){
				owgis.ncwms.animation.animStatus = "playing";
				updateMenusDisplayVisibility(owgis.ncwms.animation.animStatus);
			}else{//then we still need to load more
				if( (currentImage + numberOfParallelRquests) < totalNumOfFrames ){
					var nextImage = currentImage + numberOfParallelRquests;
					animParams.TIME = allFrames[nextImage];
					
					var imgSrc = currUrl+"?"+owgis.utils.paramsToUrl(animParams);
					eval("imageNumber"+nextImage+".belongs = "+currentAnimation+";");//Attach an animation 'counter'
					eval('imageNumber'+nextImage+'.src = imgSrc;');
					eval("imageNumber"+nextImage+".id = "+nextImage+";");
					eval("imageNumber"+nextImage+".addEventListener('load', imageHasBeenLoadedParallel);");
				}
			}
			
			$("#loadperc").text( Math.ceil(100*(loadedFrames/totalNumOfFrames)));
		}
	}
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


function loopAnimation(){
	var canvas = document.getElementById('animationCanvas');    
	
	if(owgis.ncwms.animation.animStatus === "playing"){ 
		currentFrame = currentFrame < (totalNumOfFrames-1)? ++currentFrame: 0;
	}
	if(owgis.ncwms.animation.animStatus === "loading"){
		currentFrame = currentFrame < (loadedFrames)? ++currentFrame: 0;
	}
	
	//	console.log("Displaying Frame: "+ currentFrame);
	
	ctx.drawImage(eval('imageNumber'+currentFrame), 0, 0, canvas.width, canvas.height);
	$("#animDate").text(allFrames[currentFrame]);
	ctx.stroke();
	map.render();
}

owgis.ncwms.animation.initAnimationControls = function(){
	$('#animControls a').tooltip({ position: "bottom left", opacity: 0.7});
}
