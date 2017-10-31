goog.provide('owgis.ol3');

var width;
var height;
var currPopupText;//Text of the the popup

// TODO verify how this variable works for other layers and see
// from where we can obtain the current elevation.
var elevation = 0;

//Should contain the selected start date and is used to obtain punctual
// data from the temporal data.
var startDate;

// Is used to know if the user did only click with the mouse or he/she
// panned the map
var isOnlyClick = false; 

//Creates 100 layer objects
for (var i = 0; i < 100; i++) {
	eval("var layer" + i);
}

/**
 * This function is in charge of displaying the 'progress' cursor
 * when the user has requested some punctual data 
 * @returns {undefined}
 */
function setMouseClickOnMap(){

	$("#map").on('mousedown', function() { isOnlyClick = true; })
	.on('mousemove', function() { isOnlyClick = false; })
	.on('mouseup', function(){
		if(isOnlyClick){
			//Verify that the transect tools is not turned on
			if(!transectOn){
				owgis.interf.loadingatmouse(true);
			}
		}
	});
}

function initOl3(){
	/*  -------------------- Popup.js -------------------------
	 * This file contains all the functions related with the Ol3 popup
	 */
	
    $("#popup-closer").click(function() {
		$("#popup").hide();
		$("#popup-closer").blur();
	});

	setMouseClickOnMap();
	
	/**
	 * Create an ol_popup to anchor the popup to the map.
	 */
	ol_popup = new ol.Overlay({
		element: getElementById('popup'),
		stopEvent:true//Used to not show the popup again when closing it
	});
	
	
//	var bounds = mapConfig.mapBounds;
//	var extent = mapConfig.restrictedExtent;
//	var maxRes = mapConfig.maxResolution;
//	var minRes = mapConfig.minResolution;
	
	var strCenter = mapConfig.mapcenter.split(",");
	
	var lat = 0;
	var lon = 0;
	if( strCenter[0].split("=")[0].toLowerCase() === "lat"){
		lat = Number(strCenter[0].split("=")[1]);
		lon = Number(strCenter[1].split("=")[1]);
	}else{
		lat = Number(strCenter[1].split("=")[1]);
		lon = Number(strCenter[0].split("=")[1]);
	}
	
	var changeProj;//Indicates if we need to change the projections
	var defCenter;
	var resExtent;
	
	if(_map_bk_layer === "wms"){
		//If the default projection is not 4326 then we need to transform 
		// the projections to the default map projection
		if(_map_projection !== 'EPSG:4326'){
			changeProj = true;
		}else{
			defCenter= [lon,lat];
		}
	}else{
		if( (_map_bk_layer === "osm") || 
			(_map_bk_layer.indexOf("bing") !== -1) ||  
			(_map_bk_layer.indexOf("mapquest") !== -1)){
			_map_projection = 'EPSG:3857';//Force projection for osm background layer
			changeProj = true;
		}
	}
	
	
	if(changeProj){
		defCenter = ol.proj.transform([lon, lat], 'EPSG:4326', _map_projection);
		resExtent = ol.proj.transform(mapConfig.restrictedExtent.split(",").map(Number), 'EPSG:4326', _map_projection);
	}

	//This control is used to display Lat and Lon when the user is moving the mouse over the map
	var mousePositionControl = new ol.control.MousePosition({
		coordinateFormat: ol.coordinate.createStringXY(4),
		projection: 'EPSG:4326',
		// comment the following two lines to have the mouse position
		// be placed within the map.
		className: 'ol-lat-lon',
		target: getElementById('location'),
		undefinedHTML: '&nbsp;'
	});
	
	//This is the control for the scale line at the bottom of the map
	var scaleLineControl = new ol.control.ScaleLine();
	var fullScreen = new ol.control.FullScreen();//Causes troubles with the windows
	
	ol3view = new ol.View({
		projection: _map_projection,
		center: defCenter,
                zoom: mapConfig.zoom,
		maxZoom: mapConfig.zoomLevels,
		zoomFactor: mapConfig.zoomFactor,
		maxResolution: mapConfig.maxResolution
//		extent: resExtent  // Not working
	});

 	map = new ol.Map({
                //interactions: ol.interaction.defaults({mouseWheelZoom:false}),
                /*.extend([
                    new ol.interaction.MouseWheelZoom({
                      constrainResolution: true, // force zooming to a integer zoom
                      duration: 1000, timeout: 500
                    })
                  ]),*/ //This is what I use to prevent the scroll wheel from zooming all the way in or out too rapidly. 
		controls:ol.control.defaults().extend([mousePositionControl, scaleLineControl]),
		overlays: [ol_popup], //Overlay used for popup
		target: 'map', // Define 'div' that contains the map
                renderer: 'canvas', // ['canvas','dom','webgl']
		logo: false,
		view: ol3view
	});
        
	var numInFlightTiles = 0;
        map.getLayers().forEach(function (layer) {
            var source = layer.getSource();
            if (source instanceof ol.source.TileImage) {
                source.on('tileloadstart', function () {++numInFlightTiles})
                source.on('tileloadend', function () {--numInFlightTiles})
            }
        })

        /*
        map.on('postrender', function (evt) {
            if (!evt.frameState)
                return;

            var numHeldTiles = 0;
            var wanted = evt.frameState.wantedTiles;
            for (var layer in wanted)
                if (wanted.hasOwnProperty(layer))
                    numHeldTiles += Object.keys(wanted[layer]).length;

            var ready = numInFlightTiles === 0 && numHeldTiles === 0;
            if (map.get('ready') !== ready){
                map.set('ready', ready);
                
                map.addInteraction(new ol.interaction.MouseWheelZoom({
                    constrainResolution: true, duration: 300, timeout: 100 // force zooming to a integer zoom
                }));
                
            }
        });

        map.set('ready', false);

        function whenMapIsReady(callback) {
            if (map.get('ready'))
                callback();
            else
                map.once('change:ready', whenMapIsReady.bind(null, callback));
        }
        */
}

//TODO clean and document this function
function detectMapLayersStatus(){
	var mapLayers = map.getLayers().getArray();
	var mapDoneRendering = true;
	console.log("change in a layer");
	for(var i=0; i < mapLayers.length; i++){
		if( mapLayers[i].getSource().getState() !== "ready"){
			mapDoneRendering = false;
			break;
		}
	}

	if(mapDoneRendering){
		console.log("MAP IS READY!");
	}else{
		console.log("MAP IS NOT ready!");
	}
}

owgis.ol3.positionMap = function(){
	// --------------- Map visualization and hover texts
	if( localStorage.zoom !== undefined) ol3view.setResolution(localStorage.zoom);// Zoom of map 
	if( localStorage.map_center!== undefined){
		var strCenter = localStorage.map_center.split(",")
		var lat = Number(strCenter[0]);
		var lon = Number(strCenter[1]);
		ol3view.setCenter([lat,lon]);// Center of the map
	}
	
}