goog.provide('owgis.backlayers');

var backLayer;
var origBackLayer;
var firstTime = true;//First time the background layer is modified by the user

owgis.backlayers.update = function(type){
	switch(type){
		case "bluemarble":
			blueMarble();
			break;

		case "mapquest":
			mapquest();
			break;
	}
}

function mapquest(){
	backLayer =  new ol.layer.Tile({
			source: new ol.source.MapQuest({
				layer: 'sat'
			})});

	var allLayers = map.getLayers();
	
	if(firstTime){
		origBackLayer = allLayers.removeAt(0);
		firstTime = false;
		allLayers.insertAt(0,backLayer);
	}
}

function blueMarble(){
	console.log("Updating background layer to blue marble from NASA");
	var projection = ol.proj.get('EPSG:4326');
	var projectionExtent = projection.getExtent();
	
	var attribution = new ol.Attribution({
		html: "<a href='https://earthdata.nasa.gov/gibs'>NASA EOSDIS GIBS</a>," +
			"<a href='http://owgis.org'> OWGIS </a>" 
	});
	
	var resolutions = [0.5625, 0.28125, 0.140625, 0.0703125, 0.03515625, 0.017578125, 0.0087890625, 0.00439453125];
	var matrixIds = [0, 1, 2, 3, 4, 5, 6, 7];
	
	var tempSource = new ol.source.WMTS({
		attributions: [attribution],
		url: 'http://map1.vis.earthdata.nasa.gov/wmts-geo/wmts.cgi',
		layer: "BlueMarble_NextGeneration",
		matrixSet: "EPSG4326_500m",
		format: "image/jpeg",
		projection: projection,
		tileGrid: new ol.tilegrid.WMTS({
                origin: ol.extent.getTopLeft(projectionExtent),
			resolutions: resolutions,
			matrixIds: matrixIds,
			tileSize: 512
		}),
		//extent: nasa_layers[i].extent,
		extent: projectionExtent,
		style: ''
	});
	
	var allLayers = map.getLayers();
	backLayer =  new ol.layer.Tile({source: tempSource});
	
	if(firstTime){
		origBackLayer = allLayers.removeAt(0);
		firstTime = false;
		allLayers.insertAt(0,backLayer);
	}
	
}	