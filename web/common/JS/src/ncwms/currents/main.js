/*
goog.provide('animate');

goog.require('ol.Map');
goog.require('ol.View');
goog.require('ol.extent');
goog.require('ol.layer.Tile');
goog.require('ol.proj');
goog.require('ol.source.OSM');
goog.require('ol.source.MapQuest');
goog.require('ol.source.WMTS');
goog.require('ol.tilegrid.WMTS');
goog.require('ol.format.WMSCapabilities');
 */

var nasa_layers = new Array();
var ol3_layers = new Array(81);
var currentLayer = 47; 
//var currentLayer = 60; 
var map_main;
var main_view;
var layercanvas;

var current_requests = new Array();

function runApp(){
	var o_map_main = $("#mainMap");
	var o_map_northpole= $("#northpoleMap");
	var o_map_antarctica = $("#antarcticaMap");
	
	initNasaLayers();
	initGui();
}

function initMaps(){
	main_view = new ol.View({
		projection: 'EPSG:4326',
		center: [0,0],
		zoom: 3
	});
	var view_northpole = new ol.View({
		center: ol.proj.transform([37.41, 8.82], 'EPSG:4326', 'EPSG:3857'),
		//		center: ol.proj.transform([0, 90], 'EPSG:4326', 'EPSG:3857'),
		zoom: 4
	});
	var view_antarctica = new ol.View({
		center: ol.proj.transform([37.41, 8.82], 'EPSG:4326', 'EPSG:3857'),
		//		center: ol.proj.transform([0, -90], 'EPSG:4326', 'EPSG:3857'),
		zoom: 4
	});
	
	var projection = ol.proj.get('EPSG:4326');
	var projectionExtent = projection.getExtent();
	
	var attribution = new ol.Attribution({
		html: "<a href='https://earthdata.nasa.gov/gibs'>NASA EOSDIS GIBS</a>," +
				"<a href='http://owgis.org'> OWGIS </a>" 
	});
	
	for(var i=0;i<nasa_layers.length;i++){
		var zoomLevels = nasa_layers[i].zoom;
		var maxResolution = nasa_layers[i].maxRes;
		
		var resolutions = new Array(zoomLevels);
		var matrixIds = new Array(zoomLevels);
		
		for (var z = 0; z < zoomLevels; ++z) {
			// generate resolutions and matrixIds arrays for this WMTS
			resolutions[z] = maxResolution/ Math.pow(2, z);
			matrixIds[z] = z;
		}
		
		var tempSource = new ol.source.WMTS({
			attributions: [attribution],
			url: nasa_layers[i].wmts,
			layer: nasa_layers[i].name,
			matrixSet: nasa_layers[i].matrix,
			format: nasa_layers[i].format, 
			projection: projection,
			tileGrid: new ol.tilegrid.WMTS({
				origin: ol.extent.getTopLeft(projectionExtent),
				resolutions: resolutions,
				matrixIds: matrixIds,
				tileSize: 512
			}),
			//				extent: nasa_layers[i].extent,
			extent: projectionExtent,
			style: ''
		});

		nasa_layers[i].resolutions = resolutions;
		
		
		ol3_layers[i] = new ol.layer.Tile({ source: tempSource});
	}// loop
	
	initMap('mainMap',main_view,[ol3_layers[currentLayer]]);
	//	initMap('northpoleMap',view_northpole,[def_layer]);
	//	initMap('antarcticaMap',view_antarctica,[def_layer]);
	
	// Run once the updateLayerDate function in order
	// to add the TIME parameter into the main layer
	updateLayerDate();

	//There is a bug or something that keeps showing a button on the ol attributions
//	$(".ol-attribution").hide();
	$(".ol-attribution>button").hide();
   
}//initMaps()

function initMap(id, view,layers){
	
	layercanvas = new ol.layer.Image({
		source: new ol.source.ImageCanvas({
			canvasFunction: canvasFunction,
			projection: 'EPSG:4326'
		})
	});	
	
	map_main = new ol.Map({
        target: id,
        layers: layers,
        view: view});
	
	map_main.addLayer(ol3_layers[20]);//Adding coastlines
	map_main.addLayer(layercanvas);
}

function initNasaLayers(){
	
	useGeoserver = false;
	if(useGeoserver){
		$.ajax('http://132.248.8.238:8080/geoserver/wms?service=WMS&version=1.3.0&request=GetCapabilities').then(function(response) {
			fillForGeoserver(response);
		});
	}else{
		$.ajax('http://map1.vis.earthdata.nasa.gov/wmts-geo/wmts.cgi?SERVICE=WMTS&request=GetCapabilities').then(function(response) {
			var url = $($(response).find('[name=GetTile] HTTP').children()[1]).attr("xlink:href");
			
			$(response).find('Layer').each(function (idx,layer){
				var name = $(layer).find('Title').text();
				
				//TODO I do not know if this will always work (removing 'default')
				name = name.replace('default','');
				
				var matrixSet = $.trim($(layer).find('TileMatrixSetLink').text());
				var zoomLevels = obtainZoomLevels(matrixSet);
				var format = $.trim($(layer).find('Format').text());
				
				var extent =  [$(layer).find('LowerCorner').text(), $(layer).find('UpperCorner').text()];
				
				var times = $($(layer).find('Dimension')).find('Value').text().split('/');
				
				//All layers have the same max resolution
				nasa_layers[idx] = new NasaLayer(name,extent,"",matrixSet,0.5625,"",zoomLevels,format,times[0],times[1]);
			});
			fillDropdown(nasa_layers,currentLayer,url);
			initMaps();
		});
	}
}

function fillForGeoserver(response){
	var url = $($(response).find('OnlineResource')[0]).attr("xlink:href");
	
	$(response).find('Layer[queryable]').each( function (idx,layer){
		var name = $(layer).find('Name').first().text();
		
		var format = "image/png"
		
		var bbox = $(layer).find("[CRS*=EPSG]");
		var extent = [bbox.attr('minx') +" "+ bbox.attr('miny'),
			bbox.attr('maxx') +" "+ bbox.attr('maxy')];
		
		//All layers have the same max resolution
		nasa_layers[idx] = new NasaLayer(name,extent,"","","","","",format,"","");
		
	});
	
	fillDropdown(nasa_layers,currentLayer,url);
	
	initMaps();
}