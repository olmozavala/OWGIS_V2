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
var intervalHandler;

var originalExtent; // This is the original extent loaded from the animation canvas
var originalResolution; // This the original resolution loaded by the animation canvas
var originalPixelsCenter;
var originalCenter;
var scaleRatio; // Scale ration that needs to be applied to the images

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
                displayingAnimation = true;//I believe it is used to control the async calls to obtain the animation
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
                finishedLoading = true;
                killTimeouts();
                break;
            case "none":
            default:
                $("#palettesMenuParent").show();
                $("#lineToggle").show();
                $("#downloadDataParent").hide();

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

/** this function clears all timeouts that are executed in ajax.js in CalculateTime() 
 */
function killTimeouts()
{
	for(var i = 0; i<=10; i++) {
		eval("clearTimeout(timeout"+i+")");//cancel the call to setimeout of lading percentage
	}
}


/**
 * This function hides the 'stop animation' option and shows the
 * calendar and 'display animation' option
 */ 
function stopAnimation(){

	killTimeouts();//destroy all the timers that update the loading % ...
	updateMenusDisplayVisibility("SelectingDates");

	owgis.layers.getMainLayer().setVisibility(true);
	if(owgis.ncwms.animation.animLayer !== undefined)//If animation has been called. 
	{             
		owgis.ncwms.animation.animLayer.setVisibility(false);
        
		owgis.ncwms.animation.animLayer.events.un({
			loadend: Loaded
		});
	}
        
	//change the global for stop so that we know it has been called.
	stoppedAnimation = true;  
	anim_loaded = false;
   
	updateTitleAndKmlLink();
}

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

	if(animLayer !== null){
		map.removeLayer(animLayer);
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

function canvasAnimationFunction(extent, resolution, pixelRatio, size, projection){
    var canvasWidth = size[0];
    var canvasHeight = size[1];        
	
    var canvas = document.getElementById('animationCanvas');    
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;
	
    ctx = canvas.getContext('2d');

	console.log("-----------------------");
	console.log("Extent:" + extent);
	console.log("Resolution: " + resolution);
	console.log("PixelRatio: " + pixelRatio);
	console.log("Size: " + size);

	if(originalResolution){
		scaleRatio = (originalResolution/resolution);
		console.log("Difference of resolution = " + scaleRatio); 

		
		var newLong = extent[0] - extent[2];
		var origLong = originalExtent[0] - originalExtent[2];
		var longRatio = origLong/newLong;
		console.log("Original longitude extent" + origLong);

		var newLat = extent[1] - extent[3];
		var origLat = originalExtent[1] - originalExtent[3];
		var latRatio = origLat/newLat;
		console.log("Original lattitude extent" + origLat);

		console.log("long ratio: "+longRatio);
		console.log("lat ratio: "+latRatio);

		ctx.restore();
		ctx.save();
		var longTranslate = (canvasWidth/origLong)*longRatio*(extent[0]-originalExtent[0]);
		var latTranslate = (canvasHeight/origLat)*latRatio*(extent[1]-originalExtent[1]);
		console.log(longTranslate);
		console.log(latTranslate);
		ctx.scale(scaleRatio, scaleRatio);

		var currentCenter = map.getPixelFromCoordinate(originalCenter);
		var centerDiffX = currentCenter[0] - originalPixelsCenter[0];
		var centerDiffY = currentCenter[1] - originalPixelsCenter[1];

		console.log("X increase: " + centerDiffX);
		console.log("Y increase: " + centerDiffY);
		var transX = canvasWidth*(1-scaleRatio) + centerDiffX;
		var transY = canvasHeight*(1-scaleRatio) + centerDiffY;
		console.log("X:"+transX+ " Y:"+transY);
		if(scaleRatio > 1){
			ctx.translate( -transX, -transY);
		}else{
			ctx.translate( transX, transY);
		}
	}


	if(animStatus === "none"){
		
		console.log("Updating animation...");
		originalResolution = resolution;
		originalExtent = extent;
		originalCenter = map.getView().getCenter();
		originalPixelsCenter = map.getPixelFromCoordinate(originalCenter);

		var bbox = extent;
		var imgWidth = Math.ceil(canvasWidth);
		var imgHeight = Math.ceil(canvasHeight);
		
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
			e.target.removeEventListener('load', handler, false);
		}, false);	
	}
	
	animStatus = "loading"; 
    return canvas;
} 

function loopAnimation(){
    var canvas = document.getElementById('animationCanvas');    
	
//	ctx.scale(scaleRatio, scaleRatio);
	currentFrame = currentFrame < allFrames.length? ++currentFrame: 0;
	
	ctx.drawImage(eval('imageNumber'+currentFrame), 0, 0, canvas.width, canvas.height);
	ctx.stroke();
	map.render();
}
