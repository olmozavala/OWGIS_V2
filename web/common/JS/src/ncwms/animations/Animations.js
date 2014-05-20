goog.provide('owgis.ncwms.animation');

goog.require('ol.source.ImageStatic');
goog.require('ol.source.ImageWMS');
goog.require('goog.events');

var previousUrl; //compares the url requested for the animations. It is used in the ajax.js file
var currentFrame; // Current frame that is being displayed
var allFrames; // Will contain the 'dates' for each frame
var animStatus = "none"; 
var animSpeed = 200;
// Is the animation status it can be:
// 		none -> There is not animation or is being stopped
// 		loading -> The animation is being requested but not all of the frames have loaded
//		playing -> Animation is being played at current speed
//		pause   -> Animation paused

var animLayer = null;
var animSource = null;
var intervalHandler;// This is the handler of the 'interval' function


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
                $('#CalendarParent').hide("fade");
                $('#s-animation').show("fade");
                $('#l-animation').show("fade");
                $('#minPal').disabled = true;
                $('#maxPal').disabled = true;
                $('#palettes-div').hide("fade");
                $('#hideCalendarButtonParent').hide("fade");
                break;
            case "playing":
                $('#CalendarParent').hide("fade");
                $('#s-animation').show("fade");
                $('#l-animation').hide("fade");
                $('#minPal').disabled = true;
                $('#maxPal').disabled = true;
                $('#palettes-div').hide("fade");
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
                    $('#CalendarsAndStopContainer').show();
                    $('#CalendarParent').show("fade");
                    $('#s-animation').hide("fade");
                    $('#minPal').disabled = false;
                    $('#maxPal').disabled = false;
                    $('#hideCalendarButtonParent').show("fade");
                    $('#l-animation').hide("fade");
                }else{
                    $('#CalendarsAndStopContainer').hide();
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
 * This function hides the 'stop animation' option and shows the
 * calendar and 'display animation' option
 */ 
function stopAnimation(){
	animStatus = "none";
	updateMenusDisplayVisibility(animStatus);

	if(typeof intervalHandler !== 'undefined'){
		clearInterval(intervalHandler);
	}

	if(animLayer !== null){//If the layer already existed, we remove it
		map.removeLayer(animLayer);
	}

	updateTitleAndKmlLink();
};

/**
 *This function is executed as soon as an event concerning the animation layer changes
 *for example if the animation is ready to be displayed or the user zooms the map when the animation is playing. 
 * it is called by animationLoaded(), or when the user puts full screen. 
 */
function Loaded() {
      
    updateTitleAndKmlLink();//change title resolution
	//check if the boundry box is still the same, should only enter this if the animation arrived. 
	if(currentBBOX === map.getExtent().toBBOX()){ 
           
		updateMenusDisplayVisibility('displaying');
		   
		owgis.layers.getMainLayer().setVisibility(true);
		map.setLayerZIndex(owgis.ncwms.animation.animLayer,parseInt(idx_main_layer)+1);

		anim_loaded = true;
		finishedLoading = true;
               
	}else{//this means the function was called becuase a change in zoom of the map while animation was loading or user put screen to full screen. 
		if(finishedLoading === false)
		{
			owgis.ncwms.animation.animLayer.events.un({
				loadend: Loaded
			});
                
			animationLoaded(owgis.ncwms.animation.animLayer.getURL());
		}
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

/**
 * This function gets the selected dates from the user and starts
 * the ajax request to generate the animation of the NetCDF files.
 */
function dispAnimation(){
	usingCanvas();
}

function usingCanvas(){
	obtainSelectedDates();

	//Create the required global variables if they don't exist
	for(i = 0; i <= allFrames.length; i++){
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
	map.addLayer(animLayer)
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
		STYLES: lay_style,
		FORMAT: "image/png",
		TRANSPARENT: "TRUE",
		PALETTE: mappalette,
		CRS:"CRS:84",
		WIDTH: imgWidth,
		HEIGHT: imgHeight,
		NUMCOLORBANDS: 250,
		COLORSCALERANGE:  minPalVal + ',' + maxPalVal};
	
	if (layerDetails.zaxis !== undefined) {
		animParams.elevation =  layerDetails.zaxis.values[elev_glob_counter];
	}
	
	var imgSrc;
	
	for(i = 0; i < allFrames.length; i++){
		animParams.TIME = allFrames[i];
		imgSrc = currUrl+"?"+owgis.utils.paramsToUrl(animParams);
		eval('imageNumber'+i+'.src = imgSrc;');
	}
	
	imageNumber0.addEventListener('load', function handler(e){
		if(typeof intervalHandler !== 'undefined'){
			clearInterval(intervalHandler);
		}
		
		intervalHandler = setInterval(loopAnimation,animSpeed);
		e.target.removeEventListener('load', handler, false); }, false);	
	
	animStatus = "loading"; 
	updateMenusDisplayVisibility(animStatus);
    return canvas;
} 

function loopAnimation(){
    var canvas = document.getElementById('animationCanvas');    
	
	currentFrame = currentFrame < allFrames.length? ++currentFrame: 0;
	
	ctx.drawImage(eval('imageNumber'+currentFrame), 0, 0, canvas.width, canvas.height);
	ctx.stroke();
	map.render();
}
