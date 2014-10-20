goog.provide('owgis.ncwms.animation');

goog.require('ol.source.ImageStatic');
goog.require('ol.source.ImageWMS');
goog.require('ol.source.ImageCanvas');
goog.require('ol.renderer.canvas.ImageLayer');
goog.require('goog.events');
goog.require('owgis.ogc');
goog.require('owgis.ncwms.animation.status');

owgis.ncwms.animation.currUrl = "Not yet defined";//Current base url used for the animation

var currentFrame; // Current frame that is being displayed
var allFrames; // Will contain the 'dates' for each frame
var animSpeed = 300;
var imagesReady = new Array();//A bit array that indicates which layer are already loaded


var animLayer;
var animSource;
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
	console.log("Status: " + status);
	if(netcdf){
		// When we are selecting dates. 
		switch( status ){
            case owgis.ncwms.animation.status.loadingplaying:
				$('#stopAnimText').hide();//Hides the stop animation text
				$('#animControls a').hide();// Hidde all the animation controls 
				$('#animControls [class*=glyphicon-backward]').parent().show();
				$('#animControls [class*=glyphicon-forward]').parent().show();
				$('#animControls [class*=pause]').parent().show();
				$('#animControls [class*=stop]').parent().show();
				$('#animSpeed').parent().show("fade");
                break;
            case owgis.ncwms.animation.status.loading:
                $('#CalendarsAndStopContainer').hide("fade");
				$('#animControls a').hide();// Hidde all the animation controls 
                $('#animControls').show("fade");//Show the stop button
				$('#animControls [class*=stop]').parent().show();
				//Only if we have at least one frame loaded we show the 'play'
				//button and the individual frame controls
				if(loadedFrames > 0){
					$('#animControls [class*=play]').parent().show();
					$('#animControls [class*=step]').parent().show();
				}else{
					$('#stopAnimText').show("fade");
				}
				//Show the 'loading' animation
				owgis.interf.loadingatmap(true);
                $('#hideCalendarButtonParent').hide("fade");//Hide the calendars
//				$('#animSpeed').parent().hide();
                break;
            case owgis.ncwms.animation.status.playing:
				owgis.interf.loadingatmap(false);// Stop showing the "loading"
				$('#animControls a').hide();// Hidde all the animation controls 
				$('#animSpeed').parent().show("fade");
				// Animation controls
				$('#animControls [class*=glyphicon-backward]').parent().show();
				$('#animControls [class*=glyphicon-forward]').parent().show();
				$('#animControls [class*=pause]').parent().show();
				$('#animControls [class*=stop]').parent().show();
				$('#animControls [class*=save]').parent().show();
				$('#animControls [class*=globe]').parent().show();
                break;
            case owgis.ncwms.animation.status.paused:
				$('#animSpeed').parent().hide("fade");
				$('#animControls a').hide();// Hidde all the animation controls 
				$('#animControls [class*=step]').parent().show();
				$('#animControls [class*=fast-back]').parent().show();
				$('#animControls [class*=fast-forw]').parent().show();
				$('#animControls [class*=play]').parent().show();
				$('#animControls [class*=stop]').parent().show();
				if(loadedFrames > 0){
					$('#animControls [class*=save]').parent().show();
					$('#animControls [class*=globe]').parent().show();
				}
				break;
            case owgis.ncwms.animation.status.none:
            default:
                $("#palettesMenuParent").show();
                $("#lineToggle").show();
//                $("#downloadDataParent").hide();
				if(netcdf){
					$("#downloadDataParent").hide();
				}else{
					$("#downloadDataParent").show();
				}

                if(_mainlayer_zaxisCoord){
                    $('#elevationParent').show("fade");
                }else{
                    $('#elevationParent').hide();
                }
                if(_mainlayer_multipleDates){
                    $('#CalendarsAndStopContainer').show("fade");
                    if(mobile){
                        $('#drawer').hide("fade");
                    }
                    $('#animControls').hide("fade");
                    $('#minPal').disabled = false;
                    $('#maxPal').disabled = false;
                    $('#hideCalendarButtonParent').show("fade");
					owgis.interf.loadingatmap(false);
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
	do{
		if(currentFrame > 0){
			currentFrame--;
		}else{
			currentFrame = totalNumOfFrames - 1;
		}
	}while(imagesReady[currentFrame] === 0)
}
/**
 * Increases the frame of the animation, if it is on the last frame
 * it goes to the first one 
 * @returns {undefined}
 */
function animIncreaseFrame(){
	do{
		if(currentFrame < (totalNumOfFrames - 1) ){
			currentFrame++;
		}else{
			currentFrame = 0;
		}
	}while(imagesReady[currentFrame] === 0)
}
/**
 * Makes the animation 10% faster. 
 * @returns {undefined}
 */
function animFaster(){
	animSpeed = animSpeed*.80;
	startAnimationLoop();
}
/**
 * Makes the animation 10% slower. 
 * @returns {undefined}
 */
function animSlower(){
	animSpeed = animSpeed*1.20;
	startAnimationLoop();
}

/**
 * This function updates the status of the animation, it can be 
 * "paused", "none" or "playing"
 * @param {type} newStatus
 * @returns {undefined}
 */
function updateAnimationStatus(newStatus){

	//If the user starts playing the animation when it is 
	// still loading, then we set the "loading_playing" status
	if( owgis.ncwms.animation.status.current === owgis.ncwms.animation.status.loading 
			&& newStatus === owgis.ncwms.animation.status.playing){
		owgis.ncwms.animation.status.current = owgis.ncwms.animation.status.loadingplaying;
	}else{
		//If the user paused when the animation haven't finish loading
		if( owgis.ncwms.animation.status.current === owgis.ncwms.animation.status.loadingplaying 
				&& newStatus === owgis.ncwms.animation.status.paused){
			owgis.ncwms.animation.status.current = owgis.ncwms.animation.status.loading;
		}else{
			owgis.ncwms.animation.status.current = newStatus;
		}
	}

	switch(owgis.ncwms.animation.status.current){
		case owgis.ncwms.animation.status.none://When the animation has been stoped
			currentAnimation++;//It is used to stop any previous images
			
			clearLoopHandler();
			
			if(animLayer !== null){//If the layer already existed, we remove it
				map.removeLayer(animLayer);
			}
			
			owgis.kml.updateTitleAndKmlLink();
			break;
		case owgis.ncwms.animation.status.paused: break;
		case owgis.ncwms.animation.status.playing: break;
	}
	updateMenusDisplayVisibility(owgis.ncwms.animation.status.current);
	
}
/**
 * This function analyses the selected dates by the user and creates all
 * the string dates corresponding for each one 
 * @returns {undefined}
 */
function obtainSelectedDates(){

	if(getUserSelectedTimeFrame().indexOf("/") === -1){
		allFrames = getUserSelectedTimeFrame().split(",");
	}else{
		//In this case the user has selected full
		// we haven't find a proper way to find all the requests when is full.
		// We obtain the number of frames, divided by the number of days and assume
		// the hours all start at 0. Example. Full frames are 24, and is one day, then 
		// we assume there is one frame each hour, from hr 0 to 23
		allFrames = new Array();
		totalNumOfFrames = 0;
		
		var startDate = new Date($("#cal-start").val());
		var endDate = new Date($("#cal-end").val());

		var totalFramesTxt = $("#timeSelect :selected").text();
		var firstIndx = totalFramesTxt.indexOf("(");
		totalFramesTxt = totalFramesTxt.substr(firstIndx,totalFramesTxt.length);
		var secondIndx = totalFramesTxt.indexOf(" ");
		totalFramesTxt = totalFramesTxt.substr(1,secondIndx);

		var hrsIncrement = 24;
		try{
			var totFrames = parseInt(totalFramesTxt);
			var totDays = owgis.utils.days_between(startDate,endDate);
			var hrsPerDay = (totFrames - 1)/totDays;
			hrsIncrement = 24/hrsPerDay;
		}catch(e){

		}
		
		var currYear, currMonth, currDay;
		currDate= startDate;
		
		while(currDate <= endDate){
			currYear = currDate.getUTCFullYear();
			currMonth = currDate.getUTCMonth();
			currDay = currDate.getUTCDate();
			//		allFrames.push(currYear+"-"+(currMonth+1)+"-"+currDay+"T00:00:00.000Z");
			for(var hr = 0; hr < hrsPerDay; hr++){
				allFrames.push(currYear+"-"+(currMonth+1)+"-"+currDay+"T"+hr*hrsIncrement+":00:00.000Z");
			}
			currDate.setDate( currDate.getDate() + 1);
		}
	}

	totalNumOfFrames = allFrames.length;
}

/**
 * This function gets the selected dates from the user and starts
 * the ajax request to generate the animation of the NetCDF files.
 */

window['owgis.ncwms.animation.dispAnimation'] = owgis.ncwms.animation.dispAnimation;
owgis.ncwms.animation.dispAnimation = function dispAnimation(){

	//This check is necessary to avoid keep adding layers to the map
	if(animLayer !== null){//If the layer already existed, we remove it
		map.removeLayer(animLayer);
	}
	obtainSelectedDates();
	if(mobile) {
		$("#animContainer").css("display","block");
		$("#panel2").css("display","none");
		$("#drawer").css("display","block");
	}
	//Create the required global variables if they don't exist
//	console.log("TotalNumber of frames: "+ totalNumOfFrames);
	for(var i = 0; i < totalNumOfFrames; i++){
		try{// Hack to test if the variable already exists
			eval('imageNumber'+i);
		}
		catch(e){
			eval('window.imageNumber'+i+';');
			eval("imageNumber"+i+" = document.createElement('img');");
		}
	}
	
	//This is the source of the new map layer
	animSource= new ol.source.ImageCanvas({
		canvasFunction: canvasAnimationFunction,
		projection: layerDetails.srs
	});
	
	animLayer = new ol.layer.Image({
		source: animSource});

	// On the mobile interface we can't download from a link
	if(!mobile){
		//Creates a link to download the animation as kml for google earth
		// Copies original link from start date
		$("#animSaveAsKml").attr("href",$("#kmlLink").attr("href"));
		// Replaces time with whole the times being displayed
		owgis.utils.replaceGetParamInLink("#animSaveAsKml", "TIME", allFrames.join(","));
	}

	currentFrame = 0; //Set to use the first frame
//	map.addLayer(animLayer);
	var layersCollection = map.getLayers();
	layersCollection.insertAt(parseInt(idx_main_layer)+1,animLayer);//Adds the animation layer just above the main layer

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
			return .3;
			break;
		case "low":
			return .2;
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
	
	imagesReady = new Array();
	for(var i = 0; i < totalNumOfFrames; i++){
		eval("imageNumber"+i+".src = '';");
		imagesReady[i] = 0;//None of the image is ready
	}

//	console.log("----------- Canvas reload -----------");
    var canvasWidth = size[0];
    var canvasHeight = size[1];        

 	var canvas = getElementById('animationCanvas');    
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;   	
	clearCanvas();

	currentAnimation++;//Increments the animation counter;
	owgis.ncwms.animation.status.current = owgis.ncwms.animation.status.loading;
	owgis.kml.updateTitleAndKmlLink();

	loadedFrames = 0;// Reset the total number of images loaded
	owgis.interf.loadingatmap(true,0);
	updateMenusDisplayVisibility(owgis.ncwms.animation.status.current);

	//TODO depending on the WMS version that we are using the position
	//of the coordinates need to be swapped
	if(_map_projection === "EPSG:4326"){
		var tempExtent = [extent[1],extent[0],extent[3],extent[2]];
		extent = tempExtent;
	}

	bbox = extent;
	var animResolution = getResolutionRatio();
	var imgWidth = Math.ceil(canvasWidth*animResolution);
	var imgHeight = Math.ceil(canvasHeight*animResolution);
	
	//Generates the images urls based on the main layer
	var mainLayer = owgis.layers.getMainLayer();
	var mainSource = mainLayer.getSource();
	var mainParams = mainSource.getParams();
	var layerName = mainParams.LAYERS;
	
	if(mainSource.getUrls){
		owgis.ncwms.animation.currUrl = mainSource.getUrls()[0];//Get url for 
	}else{
		owgis.ncwms.animation.currUrl = mainSource.getUrl();//Get url for 
	}
	
	animParams = { 
		TIME: allFrames[0],
		LAYERS: layerName,
		BBOX: bbox.toString(),
		REQUEST: "GetMap",
		VERSION: owgis.ogc.wmsversion,
		STYLES: lay_style+"/"+mappalette,
		FORMAT: "image/png",
		TRANSPARENT: "TRUE",
		WIDTH: imgWidth,
		HEIGHT: imgHeight,
		NUMCOLORBANDS: 250,
		COLORSCALERANGE:  minPalVal + ',' + maxPalVal,
		CRS: _map_projection
	};
	
	if (layerDetails.zaxis !== undefined) {
		animParams.elevation =  layerDetails.zaxis.values[elev_glob_counter];
	}
	
	currentFrame = 0;// Reset to first frame
	
	// This loops starts 'n' number of parallel requests for animation
	// images.
	for(var i = 0; i < Math.min(numberOfParallelRquests,totalNumOfFrames); i++){
		animParams.TIME = allFrames[i];

		eval("imageNumber"+i+".src = '"+owgis.ncwms.animation.currUrl+"?"+owgis.utils.paramsToUrl(animParams)+"'");
		eval("imageNumber"+i+".id = "+i+";");
		eval("imageNumber"+i+".errorCount = 0;");
		eval("imageNumber"+i+".belongs = "+currentAnimation+";");//Attach an animation 'counter'
		eval("imageNumber"+i+".addEventListener('load', owgis.ncwms.animation.imageHasBeenLoadedParallel);");
		eval("imageNumber"+i+".addEventListener('error', errorFunction);");
	}

	//For the link to download the GIF
	animParams.FORMAT = "image/gif";
	animParams.TIME = allFrames.join(",");
	var gifLink = owgis.ncwms.animation.currUrl+"?"+owgis.utils.paramsToUrl(animParams);
	$('#animControls [class*=save]').parent().attr("href",gifLink);

	startAnimationLoop();
	
//	console.log("----------- Out of Canvas reload -----------");
    return canvas;
} 

/**
 * Clears the canvas by drawing an empty rectangle 
 * @returns {undefined}
 */
function clearCanvas(){
	var canvas = getElementById('animationCanvas');    
	
	//Clears any previous display in the canvas
    var ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, canvas.width, canvas.height);

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
		eval("imageNumber"+currentImage+".src = '"+owgis.ncwms.animation.currUrl+"?"+owgis.utils.paramsToUrl(animParams)+"'");
		eval("imageNumber"+currentImage+".errorCount = "+(errorCount+1)+";");
	}
}

/**
 * This function is called when an image has been loaded and is also in charge
 * of 'fireing' the next corresponding image.  
 * @param {type} e Image that triggered the event
 * @returns {undefined}
 */

window['owgis.ncwms.animation.imageHasBeenLoadedParallel'] = owgis.ncwms.animation.imageHasBeenLoadedParallel;
owgis.ncwms.animation.imageHasBeenLoadedParallel = function(e){
	e.target.removeEventListener('load', owgis.ncwms.animation.imageHasBeenLoadedParallel, false); 

	// This force to clear the canvas is to avoid bug in
	// firefox that displays previous images
	clearCanvas();

	if( owgis.ncwms.animation.status.current === owgis.ncwms.animation.status.loading ||
		owgis.ncwms.animation.status.current === owgis.ncwms.animation.status.loadingplaying){

		var currentImage = parseInt(e.target.id);
		var currentBelongs = parseInt(e.target.belongs);//Reads the image animation belonging

		imagesReady[currentImage] = 1;//This image is ready

		//When the first frame is loaded we start looping the animation
		if(loadedFrames === 1){
			owgis.ncwms.animation.status.current = owgis.ncwms.animation.status.loadingplaying;
			updateMenusDisplayVisibility(owgis.ncwms.animation.status.current);
			currentFrame = currentImage;
		}

//		console.log('Loaded image:'+currentImage+" belongs: "+currentBelongs);
		
		//Being sure that we are in order, if not then we dont' do anything
		if( currentBelongs === currentAnimation ){
			loadedFrames++; 
			
			if(loadedFrames >= totalNumOfFrames ){
				owgis.ncwms.animation.status.current = owgis.ncwms.animation.status.playing;
				updateMenusDisplayVisibility(owgis.ncwms.animation.status.current);
			}else{//then we still need to load more
				owgis.interf.loadingatmap(true,Math.ceil(100*(loadedFrames/totalNumOfFrames)));
				if( (currentImage + numberOfParallelRquests) < totalNumOfFrames ){
					var nextImage = currentImage + numberOfParallelRquests;
					animParams.TIME = allFrames[nextImage];
					
					eval("imageNumber"+nextImage+".belongs = "+currentAnimation+";");//Attach an animation 'counter'
					eval("imageNumber"+nextImage+".src = '"+owgis.ncwms.animation.currUrl+"?"+owgis.utils.paramsToUrl(animParams)+"'");
					eval("imageNumber"+nextImage+".id = "+nextImage+";");
					eval("imageNumber"+nextImage+".addEventListener('load', owgis.ncwms.animation.imageHasBeenLoadedParallel);");
				}
			}
			
		}
	}
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
	$('#animSpeed').text( (1000/animSpeed).toFixed(1) +" fps");
}

/**
 * This is the callback function in charge of displaying
 * the proper frames of the animations 
 * @returns {undefined}
 */
function loopAnimation(){
	var canvas = getElementById('animationCanvas');    
    var ctx = canvas.getContext('2d');
	
	//When the animation is 'playing' it loops on all the frames
	if(owgis.ncwms.animation.status.current === owgis.ncwms.animation.status.playing){
			currentFrame = currentFrame < (totalNumOfFrames-1)? ++currentFrame: 0;
	}
	// When the animatino is being loaded it loops between the 
	// images that have already been loaded
	if(owgis.ncwms.animation.status.current === owgis.ncwms.animation.status.loadingplaying){
		//In this case we display only the frames that have already been loaded
		do{
			currentFrame = currentFrame < (totalNumOfFrames-1)? ++currentFrame: 0;
		}while(imagesReady[currentFrame] === 0)
	}
	
	clearCanvas();
	ctx.drawImage(eval('imageNumber'+currentFrame), 0, 0, canvas.width, canvas.height);
	
	// Removing the :00:00.000Z from the text
	var finalText = allFrames[currentFrame];
	finalText = finalText.replace(":00:00.000Z",'');
	finalText = finalText.replace("T",' Hr ');
	
	$("#animDate").text(finalText);
	
	map.render();
}

/**
 * Public function used to initilize the control buttons
 * of the animation 
 * @returns {undefined}
 */
owgis.ncwms.animation.initAnimationControls = function(){
	$('#animControls a').tooltip({ position: "bottom left", opacity: 0.7});
};
