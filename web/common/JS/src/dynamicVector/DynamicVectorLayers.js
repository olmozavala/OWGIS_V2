goog.provide('owgis.vector.manager');

goog.require('owgis.ogc');
goog.require('owgis.vector.styles');
goog.require('ol.source.Vector');

var viewportInitialized = false;//Indicates if 'mousemove' function has already been initialized
var highlight;
var featureOverlay;


/**
 * Adds the JSON layer to the map.
 * This function is called when the data of a JSON layer ha arrived.
 * @param {type} geoJSONdata JSON data
 * @param {type} layerId Numeric identifier of the layer
 * @param {type} visible Indicates if the layer is visible or not
 * @returns {undefined}
 */
owgis.vector.manager.processJSON = function(geoJSONdata, layerId, visible) {
	
	var data = geoJSONdata;//Reads the data
	//Reads the projection of the layer from the returned JSON data
	var projection = geoJSONdata.crs.type+":"+geoJSONdata.crs.properties.code;
	
	//Creates the vector source from the data and the projection
	var vectorSource = new ol.source.Vector({
                features: (new ol.format.GeoJSON()).readFeatures(data)
                /*object: data ,
		projection: projection*/
            });

	// These two lines are required for the Closure compiler to be able to 
	// relate to the probler layer id
	var currLayer = "";
	window['owgis.vector.manager.tempLayer'] = currLayer;

	owgis.vector.manager.tempLayer = new ol.layer.Vector({ source: vectorSource, style: defaultStyleFunction}); 
	map.addLayer(owgis.vector.manager.tempLayer );

	eval('layer'+layerId+' = owgis.vector.manager.tempLayer');

	if(!visible){
		owgis.vector.manager.tempLayer.setVisible(false);
	}
}
window['owgis.vector.manager.processJSON'] = owgis.vector.manager.processJSON;

/**
 * This function initializes new JSON layers. The call to this function
 * is made by the OpenLayers.java file 
 * @param {string} layer details (the whole object of the layer)
 * @param {int} layerId (numeric identifier of the layer)
 * @param {boolean} visible Indicates if the layer is visible (is selected in the optional layers)
 * @returns {undefined}
 */

owgis.vector.manager.requestJSONLayer = function( layer, layerId, visible ){
	
	//TODO the original server should not have the wms in it
	var server = layer.server.substring(0,layer.server.length-3)+"ows?";//Change the server from wms to ows
	
	eval('globalCallback'+layerId+ " = function(geoJSON){ owgis.vector.manager.processJSON(geoJSON,"+layerId+","+visible+");};")
	
	var layerParams = {
		SERVICE:"WFS",
		VERSION: owgis.ogc.wmsversion,
		REQUEST: "GetFeature",
		TYPENAME: layer.name, 
		MAXFEATURES: 50,
		SRSNAME: _map_projection,
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
		//funcion obsoleta ver como cambiar a la nueva
		/*featureOverlay = new ol.FeatureOverlay({
			map: map,
			style: highlightStyleFunction
		});*/
                featureOverlay = new ol.layer.Vector({
			map: map,
                        source: new ol.source.Vector({
                            //features: collection,
                            useSpatialIndex: false // optional, might improve performance
                        }),
			style: highlightStyleFunction,
                        updateWhileAnimating: true, // optional, for instant visual feedback
                        updateWhileInteracting: true // optional, for instant visual feedback
		});
                
                map.addLayer(featureOverlay);

		//For each 'mousemove' event it calls displayFeatureInfo, to
		// draw features on map
		$(map.getViewport()).on('mousemove', function(evt) {
			var pixel = map.getEventPixel(evt.originalEvent);
			displayFeatureInfo(pixel);
		});
	}
}
window['owgis.vector.manager.requestJSONLayer'] = owgis.vector.manager.requestJSONLayer;

/**
 * Reads the default style of a geometry depending of its type. The
 * styles are defined at VectorStyles.js   
 * @param {type} feature Is the feature to be draw
 * @param {type} resolution Is the resolution of the map 
 * @returns  A style for the specified feature
 */
function defaultStyleFunction(feature, resolution) {
	return owgis.vector.styles.def[feature.getGeometry().getType()];
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
			featureOverlay.getSource().removeFeature(highlight);
		}
		if (feature) {
			featureOverlay.getSource().addFeature(feature);
		}
		highlight = feature;
	}
};



