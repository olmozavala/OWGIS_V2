goog.provide('owgis.vector.manager');

goog.require('owgis.ogc');
goog.require('owgis.vector.styles');

var viewportInitialized = false;//Indicates if 'mousemove' function has already been initialized
var highlight;
var featureOverlay;

var defaultStyleFunction = function(feature, resolution) {
	return owgis.vector.styles.default[feature.getGeometry().getType()];
};	

var highlightStyleFunction = function(feature, resolution) {
	return owgis.vector.styles.highlight[feature.getGeometry().getType()];
};	

function getFeature(feature, layer){
	var delLayer = layer;
//	console.log(feature.getId());
	return feature;
}

var displayFeatureInfo = function(pixel) {
	
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


function requestJSONLayer( layer, layerId ){
//	console.log(layer);
	
	//TODO the original server should not have the wms in it
	var server = layer.server.substring(0,layer.server.length-3)+"ows?";//Change the server from wms to ows
	
	eval('globalCallback'+layerId+ " = function(geoJSON){ processJSON(geoJSON,"+layerId+");};")
	
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
	
	var url= server+owgis.utils.paramsToUrl(layerParams);
//	console.log(url);
	
	// This is required to avoid the cross origin problem
	$.ajax({
		url: url,
		dataType: "jsonp",
		error: function (err) {
			//console.log(err);
		},
		success: function () {
//			console.log("success");
		}
	});
	
	
	if(!viewportInitialized){
		
		featureOverlay = new ol.FeatureOverlay({
			map: map,
			style: highlightStyleFunction
		});

		$(map.getViewport()).on('mousemove', function(evt) {
			var pixel = map.getEventPixel(evt.originalEvent);
			displayFeatureInfo(pixel);
		});

		
	}
}

function processJSON(geoJSONdata, layerId) {
	
//	console.log(geoJSONdata);
	var data = geoJSONdata;
	
	var projection = geoJSONdata.crs.type+":"+geoJSONdata.crs.properties.code;
	
	var vectorSource = new ol.source.GeoJSON({
		object: data ,
		projection: projection});
	
	eval("layer"+layerId+" = new ol.layer.Vector({ source: vectorSource, style: defaultStyleFunction})"); 
	eval("map.addLayer(layer"+layerId+");");
	
	
}
