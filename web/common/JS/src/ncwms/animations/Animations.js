goog.provide('owgis.ncwms.animation');

goog.require('ol.source.ImageStatic');
goog.require('ol.source.ImageWMS');
goog.require('ol.source.ImageCanvas');
goog.require('ol.renderer.canvas.ImageLayer');
goog.require('goog.events');
goog.require('owgis.ogc');
goog.require('owgis.ncwms.animation.status');
goog.require('owgis.ncwms.currents');
goog.require('owgis.ncwms.currents.particles');
goog.require('owgis.ncwms.animation.status');

owgis.ncwms.animation.currUrl = "Not yet defined";//Current base url used for the animation

var currentFrame; // Current frame that is being displayed
var allFrames; // Will contain the 'dates' for each frame
var animSpeed = 1000;
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

function hideAllAnimationControls(){
	$('#animControls a').hide();// Hidde all the animation controls 
}

function updateControlDynamically(selector, hide){
	if(hide){
		if(mobile){
			$(selector).hide();
		}else{
			$(selector).parent().hide();
		}
	}else{
		if(mobile){
			$(selector).show();
		}else{
			$(selector).parent().show();
		}
	}
}

/**
 * Modifies the visibility of different html elements involved on 
 * the displaying of the animations.
 * @param status - the status of the animation 
 * ['loading', 'playing', 'none','paused']
 */
function updateMenusDisplayVisibility(status){
	
    // ------- Visibility of top menus (general menus) -------
	//	console.log("Status: " + status);
	if(netcdf){
		hideAllAnimationControls();
		// When we are selecting dates. 
		switch( status ){
            case owgis.ncwms.animation.status.loadingplaying:
				$('#stopAnimText').hide();//Hides the stop animation text
				updateControlDynamically('#animControls [class*=glyphicon-backward]');
				updateControlDynamically('#animControls [class*=glyphicon-forward]');
				//For mobile
				updateControlDynamically('#animControls [class*=icon-backward]');
				updateControlDynamically('#animControls [class*=icon-forward]');
				
				updateControlDynamically('#animControls [class*=pause]');
				updateControlDynamically('#animControls [class*=stop]');
				updateControlDynamically('#animSpeed');
				//Sets the current transparency into the animation
				owgis.transparency.changeTransp(owgis.transparency.getTransp());
				// Hides the current main layer
				owgis.layers.getMainLayer().setVisible(false);
                break;
            case owgis.ncwms.animation.status.loading:
                $('#CalendarsAndStopContainer').hide("fade");
                $('#animControls').show("fade");//Show the stop button
				updateControlDynamically('#animControls [class*=stop]');
				//Only if we have at least one frame loaded we show the 'play'
				//button and the individual frame controls
				if(loadedFrames > 0){
					updateControlDynamically('#animControls [class*=play]');
					updateControlDynamically('#animControls [class*=step]');
				}else{
					$('#stopAnimText').show("fade");
				}
				//Show the 'loading' animation
				owgis.interf.loadingatmap(true);
                $('#hideCalendarButtonParent').hide("fade");//Hide the calendars
                break;
            case owgis.ncwms.animation.status.playing:
				owgis.interf.loadingatmap(false);// Stop showing the "loading"
				updateControlDynamically('#animSpeed');
				// Animation controls
				updateControlDynamically('#animControls [class*=glyphicon-backward]');
				updateControlDynamically('#animControls [class*=glyphicon-forward]');
				//For mobile
				updateControlDynamically('#animControls [class*=icon-backward]');
				updateControlDynamically('#animControls [class*=icon-forward]');
				
				updateControlDynamically('#animControls [class*=pause]');
				updateControlDynamically('#animControls [class*=stop]');
				updateControlDynamically('#animControls [class*=save]');
				updateControlDynamically('#animControls [class*=globe]');
                break;
            case owgis.ncwms.animation.status.paused:
				updateControlDynamically('#animSpeed',true);
				updateControlDynamically('#animControls [class*=step]');
				updateControlDynamically('#animControls [class*=fast-back]');
				updateControlDynamically('#animControls [class*=fast-forw]');
				updateControlDynamically('#animControls [class*=play]');
				updateControlDynamically('#animControls [class*=stop]');
				if(loadedFrames > 0){
					updateControlDynamically('#animControls [class*=save]');
					updateControlDynamically('#animControls [class*=globe]');
				}
				break;
            case owgis.ncwms.animation.status.none:
            default:
                $(".palettesMenuParent").show();
                $("#lineToggle").show();
				if(netcdf){
					$(".downloadDataParent").hide();
				}else{
					$(".downloadDataParent").show();
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
        $(".palettesMenuParent").hide();
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
	}while(imagesReady[currentFrame] === 0);
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
	}while(imagesReady[currentFrame] === 0);
}
/**
 * Makes the animation 10% faster. 
 * @returns {undefined}
 */
function animFaster(){
	animSpeed = animSpeed*.80;
	if(_mainlayer_streamlines){
		owgis.ncwms.currents.particles.setExternalAnimationSpeed(animSpeed);
	}
	startAnimationLoop();
}

/**
 * Makes the animation 10% slower. 
 * @returns {undefined}
 */
function animSlower(){
	animSpeed = animSpeed*1.20;
	if(_mainlayer_streamlines){
		owgis.ncwms.currents.particles.setExternalAnimationSpeed(animSpeed);
	}
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
			
			if(_mainlayer_streamlines){
				owgis.ncwms.currents.startSingleDateAnimation();
			}
			
			//Show main layer
			owgis.layers.getMainLayer().setVisible(true);
			//IF we had currents then start the animation
			if(_mainlayer_streamlines){
				owgis.ncwms.currents.playPause(false);//Play the currents animation
			}
			break;
		case owgis.ncwms.animation.status.paused: 
			//Pause the currents animation
			if(_mainlayer_streamlines){
				owgis.ncwms.currents.playPause(true);//Pause the currents animation
			}
			break;
		case owgis.ncwms.animation.status.playing:
			if(_mainlayer_streamlines){
				owgis.ncwms.currents.playPause(false);//Play the currents animation
			}
			break;
	}
	updateMenusDisplayVisibility(owgis.ncwms.animation.status.current);
	
}
/**
 * This function analyses the selected dates by the user and creates all
 * the string dates corresponding for each one 
 * @returns {undefined}
 */
function obtainSelectedDates(){

	//------- Specifically for ncWMS 2--------
	//Example:
	//http://132.248.8.238:8080/ncWMS_2015/wms?REQUEST=GetMetadata&item=animationTimesteps&layerName=gfs_forecast/temp_surf&start=2017-09-08T00:00:00.000Z&end=2017-09-18T00:00:00.000Z
	//Result:
	//{"timeStrings":[
	//		{"timeString":"2017-09-08T00:00:00.000Z/2017-09-18T00:00:00.000Z", "title":"Full (41 frames)"},
	//		{"timeString":"2017-09-08T00:00:00.000Z/2017-09-18T00:00:00.000Z/P1D", "title":"Daily (11 frames)"},
	//		{"timeString":"2017-09-08T00:00:00.000Z/2017-09-18T00:00:00.000Z/P7D", "title":"Weekly (2 frames)"}]}
	//The dates are sent in the following way:
	// Full: 2017-09-08T00:00:00.000Z/2017-09-18T00:00:00.000Z
	// Daily: 2017-09-08T00:00:00.000Z/2017-09-18T00:00:00.000Z/P1D
	// Weekly: 2017-09-08T00:00:00.000Z/2017-09-18T00:00:00.000Z/P7D
	
	//Reads all the days selected
	allFrames =  $('#timeSelect :selected').attr('timestring').split(",");
	var key =  $('#timeSelect :selected').attr('key');
	totalNumOfFrames = parseInt($('#timeSelect :selected').attr('totFrames'));

	// Verify we are ncWMS2
	if(layerDetails['ncwmstwo']){
		//In this case we need to create the array of dates from the 'range string'
		var datesRange = moment.range(allFrames[0]);
		var allDates =  Array.from(datesRange.by('day'));
		allFrames = allDates.map(m => m.utc().format());
	}
	if(key === "0"){//It means we are requesting the 'full' dimension
		//Total number of frames in 'full' mode
		//Total number of frames in 'daily' mode
		var totFramesDaily= parseInt($('#timeSelect option[key="1"]').attr('totFrames'));
		totFramesDaily = _.isNaN(totFramesDaily)? 0:totFramesDaily;

		if(totalNumOfFrames > totFramesDaily){
			// In this case we have more than one data per day
			// We need to request the hours for each day

			var daysStr = new Array();
			daysStr = allFrames;
			allFrames = new Array();

			var currDate;
			var reqTIME;

			for(var i = 0; i < daysStr.length; i++){
				currDate = new Date(daysStr[i]);//Get next day
				reqTIME = owgis.utils.getDate("%Y-%m-%d",currDate,true);

				owgis.layers.getTimesForDay(owgis.layers.getMainLayer(),reqTIME,allFrames);
			}
		}
	}
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
		$("#drawer").css("display","block");
		owgis.mobile.closePanels();
		owgis.mobile.openDrawer();
	}
	//Create the required global variables if they don't exist
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
	//	if(!mobile){
	//Creates a link to download the animation as kml for google earth
	// Copies original link from start date
	$("#animSaveAsKml").attr("href",$("#kmlLink").attr("href"));
	// Replaces time with whole the times being displayed
	owgis.utils.replaceGetParamInLink("#animSaveAsKml", "TIME", allFrames.join(","));
	//	}
	
	currentFrame = 0; //Set to use the first frame
	//	map.addLayer(animLayer);
	var layersCollection = map.getLayers();
	layersCollection.insertAt(parseInt(_id_first_main_layer)+1,animLayer);//Adds the animation layer just above the main layer
	
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
	//Clear any previous currents animations
	if(_mainlayer_streamlines){
		owgis.ncwms.currents.cleanAnimationCurrentsAll();
		owgis.ncwms.currents.particles.setExternalAnimationSpeed(animSpeed);
	}
	
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
	var animResolution = owgis.ncwms.animation.status.getResolutionRatio();
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
	
//		TIME: allFrames[0],
	// Creating dhe default parameters for the images
	// Setting the default parameters for the layers being requested in the animation
	animParams = { 
				TIME:allFrames[0],
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
				CRS: _map_projection,
		};
	
	if( layerDetails.aboveMaxColor[1] !== null && layerDetails.belowMinColor[1] !== null ){
            animParams.BELOWMINCOLOR = layerDetails.belowMinColor[1];
            animParams.ABOVEMAXCOLOR = layerDetails.aboveMaxColor[1];
        } else if(layerDetails.belowMinColor[1] !== null){
            animParams.BELOWMINCOLOR = layerDetails.belowMinColor[1];
        } else if(layerDetails.aboveMaxColor[1] !== null){
            animParams.ABOVEMAXCOLOR = layerDetails.aboveMaxColor[1];
		}	

	if (layerDetails.zaxis !== undefined) {
		animParams.elevation =  layerDetails.zaxis.values[owgis.ncwms.zaxis.globcounter];
	}
	
	currentFrame = 0;// Reset to first frame
	
	// This loops starts 'n' number of parallel requests for animation
	// images.
	console.log("START");
	for(var i = 0; i < Math.min(numberOfParallelRquests,totalNumOfFrames); i++){
		animParams.TIME = allFrames[i];
//		console.log(owgis.ncwms.animation.currUrl+"?"+owgis.utils.paramsToUrl(animParams));
		eval("imageNumber"+i+".src = '"+owgis.ncwms.animation.currUrl+"?"+owgis.utils.paramsToUrl(animParams)+"'");
		eval("imageNumber"+i+".id = "+i+";");
		eval("imageNumber"+i+".errorCount = 0;");
		eval("imageNumber"+i+".belongs = "+currentAnimation+";");//Attach an animation 'counter'
		eval("imageNumber"+i+".addEventListener('load', owgis.ncwms.animation.imageHasBeenLoadedParallel);");
		eval("imageNumber"+i+".addEventListener('error', errorFunction);");
	}
	console.log("END");
	
	//For the link to download the GIF
	animParams.FORMAT = "image/gif";
	animParams.TIME = allFrames.join(",");
	var gifLink = owgis.ncwms.animation.currUrl+"?"+owgis.utils.paramsToUrl(animParams)+'&ANIMATION=TRUE';
	if(mobile){
		$('#animControls [class*=save]').attr("href",gifLink);
	}else{
		$('#animControls [class*=save]').parent().attr("href",gifLink);
	}
	
	startAnimationLoop();
	
	//	console.log("----------- Out of Canvas reload -----------");
	return canvas;
} 

/**
 * Clears the canvas by drawing an empty rectangle 
 * @returns {undefined}
 */
function clearCanvas(){
	var canvas = document.getElementById('animationCanvas');    
	
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
				//Load the currents if the animation finished loading
				if(_mainlayer_streamlines){
					//					console.log("Loading particles!!!!!!!!");
					owgis.ncwms.currents.startMultipleDateAnimation(allFrames);
				}
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
		}while(imagesReady[currentFrame] === 0);
	}
	
	if(_mainlayer_streamlines){
		owgis.ncwms.currents.particles.setCurrentGrid(currentFrame);
		// IF WE WANT TO CLEAR THE PARTICLES WHEN THE ANIMATION STARTS AGAIN
		/*
		if(currentFrame === 0){
			owgis.ncwms.currents.clearCurrentsCanvas();
		}*/
	}
	
	clearCanvas();
	ctx.drawImage(eval('imageNumber'+currentFrame), 0, 0, canvas.width, canvas.height);
	
	// Removing the :00:00.000Z from the text
	var finalText = allFrames[currentFrame];
	finalText = finalText.substring(0,finalText.lastIndexOf("."));
	finalText = finalText.replace("T",' ');
	
	$("#animDate").text(finalText);
	
	map.render();
}

/**
 * Public function used to initilize the control buttons
 * of the animation 
 * @returns {undefined}
 */
owgis.ncwms.animation.initAnimationControls = function(){
	if(!mobile){
		$('#animControls a').tooltip({ position: "bottom left", opacity: 0.7});
	}
};
