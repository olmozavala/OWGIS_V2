goog.provide('owgis.vector.manager');

goog.require('owgis.ogc');
goog.require('owgis.vector.styles');

var viewportInitialized = false;//Indicates if 'mousemove' function has already been initialized
var highlight;
var featureOverlay;


/**
 * Reads the default style of a geometry depending of its type. The
 * styles are defined at VectorStyles.js   
 * @param {type} feature Is the feature to be draw
 * @param {type} resolution Is the resolution of the map 
 * @returns  A style for the specified feature
 */
var defaultStyleFunction = function(feature, resolution) {
	return owgis.vector.styles.default[feature.getGeometry().getType()];
};	

/**
 * Reads the heighlighted style of a geometry depending of its type. The
 * styles are defined at VectorStyles.js   
 * @param {type} feature Is the feature to be draw
 * @param {type} resolution Is the resolution of the map 
 * @returns  A style for the specified feature
 */
var highlightStyleFunction = function(feature, resolution) {
	return owgis.vector.styles.highlight[feature.getGeometry().getType()];
};	

/**
 * Function called for every feature that is displayed at the mouse position 
 * @param {type} feature
 * @param {type} layer
 * @returns {unresolved}
 */
function getFeature(feature, currLayer, pixel){
	//TODO this function is the one we can manipulate to do something
	// to the 'feature' been hover by the mouse

	$("#jsonpdata").html(feature.getProperties().name)
	$("#jsonpdata").show();
	
	return feature;
}

/**
 * Draws an specific feature into the map, depending of the pixel received.  
 * @param {type} pixel Position of the mouse
 * @returns {undefined}
 */
var displayFeatureInfo = function(pixel) {
	//If there is any feature at 'pixel' then the function getFeatures
	// is called

	$("#jsonpdata").hide();
	var feature = map.forEachFeatureAtPixel(pixel, getFeature);

	if (feature !== highlight) {
		if (highlight) {
			featureOverlay.removeFeature(highlight);
		}
		if (feature) {
			featureOverlay.addFeature(feature);
		}
		highlight = feature;
	}
};

/**
 * This function initializes new JSON layers. The call to this function
 * is made by the OpenLayers.java file 
 * @param {string} layer details (the whole object of the layer)
 * @param {int} layerId (numeric identifier of the layer)
 * @param {boolean} visible Indicates if the layer is visible (is selected in the optional layers)
 * @returns {undefined}
 */
function requestJSONLayer( layer, layerId, visible ){
	
	//TODO the original server should not have the wms in it
	var server = layer.server.substring(0,layer.server.length-3)+"ows?";//Change the server from wms to ows
	
	eval('globalCallback'+layerId+ " = function(geoJSON){ processJSON(geoJSON,"+layerId+","+visible+");};")
	
	var layerParams = {
		SERVICE:"WFS",
		VERSION: owgis.ogc.wmsversion,
		REQUEST: "GetFeature",
		TYPENAME: layer.name, 
		MAXFEATURES: 50,
		SRSNAME: layer.srs,
		OUTPUTFORMAT: "text/javascript",
		FORMAT_OPTIONS: "callback:globalCallback"+layerId
	};
	
	//Converts all the parameters to a URL
	var url= server+owgis.utils.paramsToUrl(layerParams);
	
	// This is required to avoid the cross origin problem
	$.ajax({
		url: url,
		dataType: "jsonp",
		error: function (err) {
		},
		success: function () {
		}
	});
	
	
	// Adds the 'mousemove' event into the map
	if(!viewportInitialized){
		
		featureOverlay = new ol.FeatureOverlay({
			map: map,
			style: highlightStyleFunction
		});

		//For each 'mousemove' event it calls displayFeatureInfo, to
		// draw features on map
		$(map.getViewport()).on('mousemove', function(evt) {
			var pixel = map.getEventPixel(evt.originalEvent);
			displayFeatureInfo(pixel);
		});
	}
}

/**
 * Adds the JSON layer to the map.
 * This function is called when the data of a JSON layer ha arrived.
 * @param {type} geoJSONdata JSON data
 * @param {type} layerId Numeric identifier of the layer
 * @param {type} visible Indicates if the layer is visible or not
 * @returns {undefined}
 */
function processJSON(geoJSONdata, layerId, visible) {
	
	var data = geoJSONdata;//Reads the data
	//Reads the projection of the layer from the returned JSON data
	var projection = geoJSONdata.crs.type+":"+geoJSONdata.crs.properties.code;
	
	//Creates the vector source from the data and the projection
	var vectorSource = new ol.source.GeoJSON({
		object: data ,
		projection: projection});
	
	eval("layer"+layerId+" = new ol.layer.Vector({ source: vectorSource, style: defaultStyleFunction})"); 
	eval("map.addLayer(layer"+layerId+");");
	if(!visible){
		eval("layer" + layerId + ".setVisible(false);");
	}
}
