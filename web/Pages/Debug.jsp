<!DOCTYPE HTML>
<html xmlns="http://www.w3.org/1999/xhtml" lang="EN">
    <head>

		<script type="text/javascript"  >
			var layerDetails = {"name": "postgis:all_cruises", "srs": "EPSG:4326", "server": "http://viewer.coaps.fsu.edu/geoserver/wms"}; //layer details such as title, server, ect in a json object. 
			var mainLayer = 'postgis:all_cruises'; //main layer title
			var mappalette = 'default'; // palette color
			var paletteUrl = ''; //palette server url
			var basepath = '/DeepCProject'; //url base path ex:/DeepCProject
			var lay_style = ''; //layer color style, part of the url to request the pallete.
			var newSession = false; // session var to tell if it is the first time the user visits the page. 
			var mobile = false; // check to see if we are in mobile version
			var map; //map variable that contains the OpenLayers map
			var ol3view;//View that contains the map
			var widthNum = 0; //user screen width, used in resizeMap()
			var heightNum = 0; //user screen height
			var netcdf = false; //true if layer displayed is netcdf, false otherwise
			var minPalVal = -1; //minimum value of palette
			var maxPalVal = -1;//maximum value of palette

			//if file is netcdf it means it has color palettes based on temperature, salinity, etc...
			if (netcdf) {
				minPalVal = layerDetails.scaleRange[0];
				maxPalVal = layerDetails.scaleRange[1];
			}
			var max_time_range = 'week'; //calendar time range
			var idx_main_layer = '1';// What is the index of the main layer (depending on the number of background layers)
			var first_optional_layer = '2';//Which number correponds to the first optional layer
			var mapConfig = {'numZoomLevels': 8, 'menuDesign': 'topMenu', 'mapcenter': 'lon=-87.81606, lat=28.45786', 'minResolution': 0.0002, 'basepath': '/DeepCProject', 'restrictedExtent': '-180,-90,180,90', 'mapBounds': '-180,-90,180,90', 'maxResolution': 0.15, 'tilesOrigin': '-180,-90', 'baseLayerMenuOrientation': 'vertical', 'zoom': 1}; //configurations such as resolution, size, zoom levels, etc...
			var userConfig = {'mainMenuParent': 'default', 'palettes_div': 'default', 'palettePos': 'default', 'optionalMenuParent': 'default', 'CalendarsAndStopContainer': 'default', 'helpInstructions': 'default', 'mapCenter': 'lon=-87.81606, lat=28.45786', 'mainMenuMinimize': 'default', 'calendarsMinimize': 'default', 'optionalsMinimize': 'default'};//json object that contains the positions of the dragable windows. 
			var transectOn = false; //boolean for transect tool if the netcdf has the option or not
			var currentZoom = 0; //This variable is used to avoid removing the 'Loading' text after zooming into the map (When an animation is been loading)
			var cql_cols = ''; // Set of columns that can be filtered by CQL
			var cqlFilter = false; //Indicates if the base layer uses CQL filtering

			// For popup
			var ol_popup = null;
			var popup_container;
			var pup_content;
			var popup_closer;

			//Possible text for zaxis
			var depthText = "Depth";
			var presText = "Pressure";
			var hideCal = "Hide Calendar";
			var showCal = "Show Calendar";
			var unselectTransect = "Unselect Tool";
			var transect = "Transect Tool";

			//resolutions
			var resolutionGlob = "Resolution";
			var resolutionHigh = "High (slow)";
			var resolutionMiddle = "Default";
			var resolutionLow = "Low (fast)";

		</script>

		<link rel="glyphicon glyphicon-" href="/DeepCProject/common/images/glyphicon glyphicon-/Gulf.ico" type="image/x-glyphicon glyphicon-" />
        <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
        <meta name="Description" content="Deep-C atlas" />
        <meta name="Keywords" content="DeepC, GIS, COAPS, map viewer, Deep-C, Oceanography" />

		<link href="/DeepCProject/common/CSS/Calendars.css" rel="stylesheet" type="text/css"/>
		<link href="/DeepCProject/common/CSS/MapInstructions.css" rel="stylesheet" type="text/css"/>
		<link href="/DeepCProject/common/CSS/GeneralStyles.css" rel="stylesheet" type="text/css"/>
        <link href="/DeepCProject/common/CSS/Buttons.css" rel="stylesheet" type="text/css"/>
        <link href="/DeepCProject/common/CSS/Elevation.css" rel="stylesheet" type="text/css"/>
        <link href="/DeepCProject/common/CSS/BaseLayers.css" rel="stylesheet" type="text/css"/>
        <link href="/DeepCProject/common/CSS/Palettes.css" rel="stylesheet" type="text/css"/>
		<link href="/DeepCProject/common/CSS/Popup.css" rel="stylesheet" type="text/css"/>
		<link href="/DeepCProject/common/CSS/OpenLayersRelated.css" rel="stylesheet" type="text/css"/>
		<link href="/DeepCProject/common/CSS/cqlFilter.css" rel="stylesheet" type="text/css"/>
		<link href="/DeepCProject/common/CSS/OptionalLayersMenu.css" rel="stylesheet" type="text/css"/>
		<link href="/DeepCProject/common/CSS/MenuOptions.css" rel="stylesheet" type="text/css"/>
		<link href="/DeepCProject/common/CSS/MinimizedWindows.css" rel="stylesheet" type="text/css"/>

        <link href="/DeepCProject/common/CSS/calendar/jscal2.css" rel="stylesheet" type="text/css"/>
        <link href="/DeepCProject/common/CSS/calendar/border-radius.css" rel="stylesheet" type="text/css"/>
        <link href="/DeepCProject/common/CSS/calendar/reduce-spacing.css" rel="stylesheet" type="text/css"/>
        <link href="/DeepCProject/common/CSS/calendar/steel/steel.css" rel="stylesheet" type="text/css"/>

		<!--Specific for OpenLayers3 -->
		<link rel="stylesheet" href="http://ol3js.org/en/master/build/ol.css"/>
		<!--<link rel="stylesheet" href="/DeepCProject/common/CSS/ol.css"/>-->
		<script src="http://ol3js.org/en/master/build/ol.js"></script>
		<!--<script src="/DeepCProject/common/JS/ol3/ol.js"></script>-->
		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
		<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js"></script>
		<!--<script src="/DeepCProject/common/JS/jquery/jquery-2.0.3.min.js"></script>-->
		<!--<script src="/DeepCProject/common/JS/jquery/ui/jquery-ui.js"></script>-->

		<link href="/DeepCProject/common/CSS/Ol3.css" rel="stylesheet" type="text/css"/>
		<link href="/DeepCProject/common/JS/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css"/>
		<link href="/DeepCProject/common/JS/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css"/>
		<script src="/DeepCProject/common/JS/bootstrap/js/bootstrap.min.js"></script>
		<script src="/DeepCProject/common/JS/bootstrap/paginator/bootstrap-paginator.min.js"></script>
		<!--Specific for OpenLayers3 -->

        <script type="text/javascript" src="/DeepCProject/common/JS/utilities.js"></script>
		<script type="text/javascript" src="/DeepCProject/common/JS/mapDisplay/InterfaceDependent.js"></script>
        <script type="text/javascript" src="/DeepCProject/common/JS/mapDisplay/HelpInstructions.js"></script>
        <script type="text/javascript" src="/DeepCProject/common/JS/mapDisplay/mapDisplay.js"></script>

		<script type="text/javascript" src="/DeepCProject/common/JS/mapDisplay/Calendars.js"></script>
		<script type="text/javascript" src="/DeepCProject/common/JS/mapDisplay/Elevation.js"></script>
		<script type="text/javascript" src="/DeepCProject/common/JS/mapDisplay/OpenLayersRelated.js"></script>
        <script type="text/javascript" src="/DeepCProject/common/JS/mapDisplay/animation.js"></script>
        <script type="text/javascript" src="/DeepCProject/common/JS/validation.js"></script>
        <script type="text/javascript" src="/DeepCProject/common/JS/ajax/ajax.js"></script>
		<script type="text/javascript" src="/DeepCProject/common/JS/mapDisplay/Palettes.js"></script>
		<script type="text/javascript" src="/DeepCProject/common/JS/mapDisplay/CQL.js"></script>
		<script type="text/javascript" src="/DeepCProject/common/JS/mapDisplay/OptionalLayersMenu.js"></script>
		<script type="text/javascript" src="/DeepCProject/common/JS/mapDisplay/VisualizationTools.js"></script>

        <script type="text/javascript" src="/DeepCProject/common/JS/calendar/jscal2.js"></script>
        <script type="text/javascript" src="/DeepCProject/common/JS/calendar/lang/en.js"></script>

        <title>Deep-C Web Map Viewer</title>

        <script type="text/javascript"  >
			var width;
			var height;
			var currPopupText;//Text of the the popup

			// TODO verify how this variable works for other layers and see
			// from where we can obtain the current elevation.
			var elevation = 0;

			//Should contain the selected start date and is used to obtain punctual
			// data from the temporal data.
			var startDate;

			//Creates 100 layer objects
			for (var i = 0; i < 100; i++) {
				eval("var layer" + i);
			}

			function initOl3() {


				/*  -------------------- Popup.js -------------------------
				 * This file contains all the functions related with the Ol3 popup
				 */
				popup_container = document.getElementById('popup');
				popup_content = document.getElementById('popup-content');
				popup_closer = document.getElementById('popup-closer');

				/**
				 * Add a click handler to hide the popup.
				 * @return {boolean} Don't follow the href.
				 */
				popup_closer.onclick = function() {
					popup_container.style.display = 'none';
					popup_closer.blur();
					return false;
				};


				/**
				 * Create an ol_popup to anchor the popup to the map.
				 */
				ol_popup = new ol.Overlay({
					element: popup_container
				});



				var bounds = mapConfig.mapBounds;
				var extent = mapConfig.restrictedExtent;
				var maxRes = mapConfig.maxResolution;
				var minRes = mapConfig.minResolution;
				//extent
				var zoomLevels = mapConfig.numZoomLevels;

				//This openLayerConfig is generated by the java file OpenLayersManager.java 
				//it loads all the layers that are needed for the map. 

				var gulfMexLatLon = ol.proj.transform([-89, 25], 'EPSG:4326', 'EPSG:3857');
				ol3view = new ol.View2D({
					center: gulfMexLatLon,
					zoom: 4
				});

				/**
				 * Create the map.
				 */
				map = new ol.Map({
					overlays: [ol_popup], //Overlay used for popup
					target: 'map', // Define 'div' that contains the map
					view: ol3view
				});



				layer0 = new ol.layer.Tile({
					source: new ol.source.TileWMS({
						url: 'http://viewer.coaps.fsu.edu/geoserver/wms',
						params: {LAYERS: 'comm:pyrResult512', TILED: true, STYLES: '', SRS: 'EPSG:4326'}
					})
				});
				layer1 = new ol.layer.Tile({
					source: new ol.source.TileWMS({
						url: 'http://viewer.coaps.fsu.edu/geoserver/wms',
						params: {LAYERS: 'postgis:all_cruises', TILED: true, STYLES: '', SRS: 'EPSG:4326'}
					})
				});
				layer2 = new ol.layer.Tile({
					source: new ol.source.TileWMS({
						url: 'http://viewer.coaps.fsu.edu/geoserver/wms',
						params: {LAYERS: 'comm:states', TILED: true, STYLES: '', SRS: 'EPSG:4326'}
					})
				});
				layer3 = new ol.layer.Tile({
					source: new ol.source.TileWMS({
						url: 'http://viewer.coaps.fsu.edu/geoserver/wms',
						params: {LAYERS: 'postgis:all_cruises', TILED: true, STYLES: '', SRS: 'EPSG:4326'}
					})
				});
				layer3.setVisible(false);
				layer4 = new ol.layer.Tile({
					source: new ol.source.TileWMS({
						url: 'http://viewer.coaps.fsu.edu/geoserver/wms',
						params: {LAYERS: 'comm:states', TILED: true, STYLES: '', SRS: 'EPSG:4326'}
					})
				});
				layer4.setVisible(false);
				layer5 = new ol.layer.Tile({
					source: new ol.source.TileWMS({
						url: 'http://viewer.coaps.fsu.edu/geoserver/wms',
						params: {LAYERS: 'se_clim:TotPrec2010Jan', TILED: true, STYLES: '', SRS: 'EPSG:4326'}
					})
				});
				layer5.setVisible(false);
				map.addLayer(layer0);
				map.addLayer(layer1);
				map.addLayer(layer2);
				map.addLayer(layer3);
				map.addLayer(layer4);
				map.addLayer(layer5);

				map.on('click', function(evt) {
					 var coordinate = evt.getCoordinate();
					 popup_container.style.display = 'none';
					 currPopupText = '';
					 ol_popup.setPosition(coordinate);
					map.getFeatureInfo({
						pixel: evt.getPixel(),
						success: function(featureInfoByLayer) {
							AsyncPunctualData(featureInfoByLayer);
						}});
				});

			}
		</script>

    </head>

    <body id="bodyClass" onresize="refreshWindow();" >

		<span id="helpInstrContainer" class="draggableWindow" >



			<div class="helpInstructionsParentTable" id="helpInstructions" >

				<div class="row ">
					<div class="col-xs-11  title text-center ">
						<span class="titleWOhalo"> Help </span> 
					</div>
					<div class="col-xs-1 text-right">
						<a class="btn btn-default btn-xs" href="#" onclick="displayHelp();">
							<span class="glyphicon glyphicon-remove"> </span> </a>
					</div>
				</div>
				<hr>
					<div class="row ">
						<div class="col-sm-3 title"> Base Layers </div>
						<div class="col-sm-9"> You can toggle between the different variable options for the layers such as temperature, salinity, velocity, etc. </div>
					</div>
					<div class="row defRowSpace">
						<div class="col-sm-3 title"> Calendars</div>
						<div class="col-sm-9"> You can select the specific date of data that you want to display if available. Choose an end date to create time range animations. </div>
					</div>
					<div class="row defRowSpace">
						<div class="col-sm-3 title">Optional Layers</div>
						<div class="col-sm-9"> These are the layers that you can choose optionally to display or not. You can place as many optional layers as you want on a single map. </div>
					</div>
					<div class="row defRowSpace">
						<div class="col-sm-3 title">Google Earth</div>
						<div class="col-sm-9"> Download the layer and display in a Google Earth format. </div>
					</div>
					<div class="row defRowSpace">
						<div class="col-sm-3 title">Transect Tool</div>
						<div class="col-sm-9"> -With this tool you can choose different points under the map, and it will create two graphs. The first graph will show you how the variables (temperature, salinity, velocity, etc.) change as they move along the points you draw based on latitude and longitude. The second graph shows how the chosen variable changes through out different depths <br/>- First click on the Transect tool icon to get started.<Br/>- Then click some point in the map to select your starting point in the transect. Keep clicking around to create more points. Once the last point is chosen, double click it to pop up the graphs.<BR/>- To create another graph, simply make a new drawing and the last one will disappear.<BR/>- To exit the transect tool click on the Unselect icon.</div>
					</div>
					<div class="row defRowSpace">
						<div class="col-sm-3 title">Depth</div>
						<div class="col-sm-9"> -By default the application starts with the possible highest elevation/precipitation, if you click the + or - it will change the elevation/precipitation. If you click the elevation/precipitation text then a windows will pop up and will let you choose the desired elevation/precipitation.</div>
					</div>
					<div class="row defRowSpace">
						<div class="col-sm-3 title">Transparency</div>
						<div class="col-sm-9"> You can the transparency of the colors of the layer that you are viewing.</div>
					</div>
					<div class="row defRowSpace">
						<div class="col-sm-3 title">Color Palette</div>
						<div class="col-sm-9">You can change the color ranges for maximum or minimum variable as well as choose any pallete color of your choice. You can also let the system choose the perfect balance of colors with the auto botton. </div>
					</div>
					<div class="row defRowSpace">
						<div class="col-sm-3 title">Custom filter</div>
						<div class="col-sm-9">Use the cql filter to filter data that you would like to view. For example if you want to view all the sailbouy points where it has measure a ct_temperature level of greater than 20. Then you input into the cql filter: ct_temperature > 20.</div>
					</div>
			</div>

		</span> 


		<!-- Map title -->
		<div class="mapTitle" id="layerTitle"> <p id="pTitleText"> VectTest </p> </div>

		<!-- This div contains all the map --> 
		<div id="map"> </div>      
		<div class="layersLongLat">
			<!-- This div displays the specific data of the map -->
			<b>Longitude:&nbsp;&nbsp;Latitude: &nbsp;</b>
			<div id="location" ></div>
		</div>    

		<div id="popup" class="ol-popup">
			<a href="#" id="popup-closer" class="ol-popup-closer"></a>
			<div id="popup-content"></div>
		</div> 


        <form id="baseForm" class="form-inline" name="baseForm" action="/DeepCProject/mapviewer" method="post">

            <!-- List of optional layers -->
            <div class="transDraggableWindow" id="optionalMenuParent" 
				 onmouseover="hoverInstructionsFixedPos('optionalLayersParentHover', '1')" 
				 onmouseout="hoverInstructionsFixedPos('optionalLayersParentHover', '2')" >



				<!-- This sections generate the menu of optional layers, normally vector layers -->
				<div class="row">
					<div class="col-xs-9 title noShadow text-center">
						Optional Layers

					</div>
					<div class="col-xs-3 text-right">
						<a class="btn btn-default btn-xs " href="#" 
						   onclick="minimizeWindow('optionalsMinimize', 'optionalMenuParent')" >
							<span class="glyphicon glyphicon-resize-small "></span>
						</a>
					</div>
				</div>
				<div class="row">
					<div class="col-xs-12">

						<ul class='opt_lay_list_root' id='optUl0'>
							<li class='opt_lay_menu' id='menuOpt1'><p class='opt_lay_par'>
									<input id="checkBox1" type="checkbox" name="vectorLayersSelected" 
										   value="teststates" onclick="manageOptionalLayers(layer2, this.checked);
												   DisableTranspOptionalLayers(1, 'minusButtonOptional1', 'plusButtonOptional1', 'checkBox1');" checked>
										US states
										<span style='float: right'>
											<button id="minusButtonOptional1" class="minusButtonSmall" type="button" disabled="disabled" 
													onmouseover ="changeColor(this, 1);" onmouseout ="changeColor(this, 0);" 
													onmouseup ="changeColor(this, 1);" onmousedown ="changeColor(this, 2);" 
													onclick="changeTranspOptionalLayers(layer2, .20, 1, 'minusButtonOptional1', 'plusButtonOptional1', 'checkBox1');">-</button> <button id="plusButtonOptional1" class="plusButtonSmall" type="button" disabled="disabled" 
													onmouseover ="changeColor(this, 1);" onmouseout ="changeColor(this, 0);" 
													onmouseup ="changeColor(this, 1);" onmousedown ="changeColor(this, 2);" 
													onclick="changeTranspOptionalLayers(layer2, -.20, 1, 'minusButtonOptional1', 'plusButtonOptional1', 'checkBox1');">+</button>
											<A href="http://viewer.coaps.fsu.edu/geoserver/wms?layers=comm:states&REQUEST=GetMap&VERSION=1.1.1&BBOX=-120.0,-59.983333333333,-10.0,50.0166666666666&WIDTH=512&HEIGHT=512&SRS=EPSG:4326&FORMAT=application/vnd.google-earth.kml+xml">
												<img class="optionalImg" src="/DeepCProject/common/images/kmz/kmz.png" 
													 onmouseover="rollImage(this, '/DeepCProject/common/images/kmz/kmz_over.png')" 
													 onmouseout="rollImage(this, '/DeepCProject/common/images/kmz/kmz.png')" 
													 onmousedown="rollImage(this, '/DeepCProject/common/images/kmz/kmz_over_click.png')" 
													 border="0" alt="Descargar KMZ" onload="CreateArraysOptional(1);
															 DisableTranspOptionalLayers(1, 'minusButtonOptional1', 'plusButtonOptional1', 'checkBox1');"></A> 
											<A href="http://viewer.coaps.fsu.edu/geoserver/wms?SERVICE=WFS&VERSION=1.0.0&REQUEST=GetFeature&typeName=comm:states&outputFormat=SHAPE-ZIP&CRS=EPSG:4326">
												<img class="optionalImg" src="/DeepCProject/common/images/Download/LayerDownload.png" 
													 onmouseover="rollImage(this, '/DeepCProject/common/images/Download/LayerDownload_over.png')" 
													 onmouseout="rollImage(this, '/DeepCProject/common/images/Download/LayerDownload.png')" 
													 onmousedown="rollImage(this, '/DeepCProject/common/images/Download/LayerDownload_over_click.png')" 
													 border="0" /> </A> 
										</span></p></li>
							<li class="opt_lay_title" id="optMenu2"			      onmouseover ="changeColor(this, 1);" onmouseout ="changeColor(this, 0);" 
								onmouseup ="changeColor(this, 1);" onmousedown ="changeColor(this, 2);" 
								onclick="toogleList('#optUl2')">TEST</li>
							<ul class='opt_lay_list' id='optUl2'>
								<li class='opt_lay_menu' id='menuOpt2'><p class='opt_lay_par'>
										<input id="checkBox2" type="checkbox" name="vectorLayersSelected" 
											   value="test,vectest" onclick="manageOptionalLayers(layer3, this.checked);
													   DisableTranspOptionalLayers(2, 'minusButtonOptional2', 'plusButtonOptional2', 'checkBox2');">
											Vector layer
											<span style='float: right'>
												<button id="minusButtonOptional2" class="minusButtonSmall" type="button" disabled="disabled" 
														onmouseover ="changeColor(this, 1);" onmouseout ="changeColor(this, 0);" 
														onmouseup ="changeColor(this, 1);" onmousedown ="changeColor(this, 2);" 
														onclick="changeTranspOptionalLayers(layer3, .20, 2, 'minusButtonOptional2', 'plusButtonOptional2', 'checkBox2');">-</button> <button id="plusButtonOptional2" class="plusButtonSmall" type="button" disabled="disabled" 
														onmouseover ="changeColor(this, 1);" onmouseout ="changeColor(this, 0);" 
														onmouseup ="changeColor(this, 1);" onmousedown ="changeColor(this, 2);" 
														onclick="changeTranspOptionalLayers(layer3, -.20, 2, 'minusButtonOptional2', 'plusButtonOptional2', 'checkBox2');">+</button>
												<A href="http://viewer.coaps.fsu.edu/geoserver/wms?layers=postgis:all_cruises&REQUEST=GetMap&VERSION=1.1.1&BBOX=-120.0,-59.983333333333,-10.0,50.0166666666666&WIDTH=512&HEIGHT=512&SRS=EPSG:4326&FORMAT=application/vnd.google-earth.kml+xml">
													<img class="optionalImg" src="/DeepCProject/common/images/kmz/kmz.png" 
														 onmouseover="rollImage(this, '/DeepCProject/common/images/kmz/kmz_over.png')" 
														 onmouseout="rollImage(this, '/DeepCProject/common/images/kmz/kmz.png')" 
														 onmousedown="rollImage(this, '/DeepCProject/common/images/kmz/kmz_over_click.png')" 
														 border="0" alt="Descargar KMZ" onload="CreateArraysOptional(2);
																 DisableTranspOptionalLayers(2, 'minusButtonOptional2', 'plusButtonOptional2', 'checkBox2');"></A> 
												<A href="http://viewer.coaps.fsu.edu/geoserver/wms?SERVICE=WFS&VERSION=1.0.0&REQUEST=GetFeature&typeName=postgis:all_cruises&outputFormat=SHAPE-ZIP&CRS=EPSG:4326">
													<img class="optionalImg" src="/DeepCProject/common/images/Download/LayerDownload.png" 
														 onmouseover="rollImage(this, '/DeepCProject/common/images/Download/LayerDownload_over.png')" 
														 onmouseout="rollImage(this, '/DeepCProject/common/images/Download/LayerDownload.png')" 
														 onmousedown="rollImage(this, '/DeepCProject/common/images/Download/LayerDownload_over_click.png')" 
														 border="0" /> </A> 
											</span></p></li>
								<li class='opt_lay_menu' id='menuOpt3'><p class='opt_lay_par'>
										<input id="checkBox3" type="checkbox" name="vectorLayersSelected" 
											   value="test,teststates" onclick="manageOptionalLayers(layer4, this.checked);
													   DisableTranspOptionalLayers(3, 'minusButtonOptional3', 'plusButtonOptional3', 'checkBox3');">
											US states
											<span style='float: right'>
												<button id="minusButtonOptional3" class="minusButtonSmall" type="button" disabled="disabled" 
														onmouseover ="changeColor(this, 1);" onmouseout ="changeColor(this, 0);" 
														onmouseup ="changeColor(this, 1);" onmousedown ="changeColor(this, 2);" 
														onclick="changeTranspOptionalLayers(layer4, .20, 3, 'minusButtonOptional3', 'plusButtonOptional3', 'checkBox3');">-</button> <button id="plusButtonOptional3" class="plusButtonSmall" type="button" disabled="disabled" 
														onmouseover ="changeColor(this, 1);" onmouseout ="changeColor(this, 0);" 
														onmouseup ="changeColor(this, 1);" onmousedown ="changeColor(this, 2);" 
														onclick="changeTranspOptionalLayers(layer4, -.20, 3, 'minusButtonOptional3', 'plusButtonOptional3', 'checkBox3');">+</button>
												<A href="http://viewer.coaps.fsu.edu/geoserver/wms?layers=comm:states&REQUEST=GetMap&VERSION=1.1.1&BBOX=-120.0,-59.983333333333,-10.0,50.0166666666666&WIDTH=512&HEIGHT=512&SRS=EPSG:4326&FORMAT=application/vnd.google-earth.kml+xml">
													<img class="optionalImg" src="/DeepCProject/common/images/kmz/kmz.png" 
														 onmouseover="rollImage(this, '/DeepCProject/common/images/kmz/kmz_over.png')" 
														 onmouseout="rollImage(this, '/DeepCProject/common/images/kmz/kmz.png')" 
														 onmousedown="rollImage(this, '/DeepCProject/common/images/kmz/kmz_over_click.png')" 
														 border="0" alt="Descargar KMZ" onload="CreateArraysOptional(3);
																 DisableTranspOptionalLayers(3, 'minusButtonOptional3', 'plusButtonOptional3', 'checkBox3');"></A> 
												<A href="http://viewer.coaps.fsu.edu/geoserver/wms?SERVICE=WFS&VERSION=1.0.0&REQUEST=GetFeature&typeName=comm:states&outputFormat=SHAPE-ZIP&CRS=EPSG:4326">
													<img class="optionalImg" src="/DeepCProject/common/images/Download/LayerDownload.png" 
														 onmouseover="rollImage(this, '/DeepCProject/common/images/Download/LayerDownload_over.png')" 
														 onmouseout="rollImage(this, '/DeepCProject/common/images/Download/LayerDownload.png')" 
														 onmousedown="rollImage(this, '/DeepCProject/common/images/Download/LayerDownload_over_click.png')" 
														 border="0" /> </A> 
											</span></p></li>
								<li class="opt_lay_title" id="optMenu5"				      onmouseover ="changeColor(this, 1);" onmouseout ="changeColor(this, 0);" 
									onmouseup ="changeColor(this, 1);" onmousedown ="changeColor(this, 2);" 
									onclick="toogleList('#optUl5')">TEST</li>
								<ul class='opt_lay_list' id='optUl5'>
									<li class='opt_lay_menu' id='menuOpt4'><p class='opt_lay_par'>
											<input id="checkBox4" type="checkbox" name="vectorLayersSelected" 
												   value="test,test,geotifftest" onclick="manageOptionalLayers(layer5, this.checked);
														   DisableTranspOptionalLayers(4, 'minusButtonOptional4', 'plusButtonOptional4', 'checkBox4');">
												Geotiff test
												<span style='float: right'>
													<button id="minusButtonOptional4" class="minusButtonSmall" type="button" disabled="disabled" 
															onmouseover ="changeColor(this, 1);" onmouseout ="changeColor(this, 0);" 
															onmouseup ="changeColor(this, 1);" onmousedown ="changeColor(this, 2);" 
															onclick="changeTranspOptionalLayers(layer5, .20, 4, 'minusButtonOptional4', 'plusButtonOptional4', 'checkBox4');">-</button> <button id="plusButtonOptional4" class="plusButtonSmall" type="button" disabled="disabled" 
															onmouseover ="changeColor(this, 1);" onmouseout ="changeColor(this, 0);" 
															onmouseup ="changeColor(this, 1);" onmousedown ="changeColor(this, 2);" 
															onclick="changeTranspOptionalLayers(layer5, -.20, 4, 'minusButtonOptional4', 'plusButtonOptional4', 'checkBox4');">+</button>
													<A href="http://viewer.coaps.fsu.edu/geoserver/wms?layers=se_clim:TotPrec2010Jan&REQUEST=GetMap&VERSION=1.1.1&BBOX=-120.0,-59.983333333333,-10.0,50.0166666666666&WIDTH=512&HEIGHT=512&SRS=EPSG:4326&FORMAT=application/vnd.google-earth.kml+xml">
														<img class="optionalImg" src="/DeepCProject/common/images/kmz/kmz.png" 
															 onmouseover="rollImage(this, '/DeepCProject/common/images/kmz/kmz_over.png')" 
															 onmouseout="rollImage(this, '/DeepCProject/common/images/kmz/kmz.png')" 
															 onmousedown="rollImage(this, '/DeepCProject/common/images/kmz/kmz_over_click.png')" 
															 border="0" alt="Descargar KMZ" onload="CreateArraysOptional(4);
																	 DisableTranspOptionalLayers(4, 'minusButtonOptional4', 'plusButtonOptional4', 'checkBox4');"></A> 
													<A href="http://viewer.coaps.fsu.edu/geoserver/wms?SERVICE=WMS&VERSION=1.1.0&REQUEST=GetMap&layers=se_clim:TotPrec2010Jan&FORMAT=image/geotiff&CRS=EPSG:4326&BBOX=-125.02083333333,24.062499999999996,-66.47916666198,49.937500002069996&WIDTH=764&HEIGHT=330">
														<img class="optionalImg" src="/DeepCProject/common/images/Download/LayerDownload.png" 
															 onmouseover="rollImage(this, '/DeepCProject/common/images/Download/LayerDownload_over.png')" 
															 onmouseout="rollImage(this, '/DeepCProject/common/images/Download/LayerDownload.png')" 
															 onmousedown="rollImage(this, '/DeepCProject/common/images/Download/LayerDownload_over_click.png')" 
															 border="0" /> </A> 
												</span></p></li>
								</ul>
							</ul>
						</ul>


					</div>
				</div>

				<span id="optionalLayersParentHover" class="commonHover">
					Click on the check box to enable an optional layer. The '+' and '-' buttons change the transparency, 
					<img src="/DeepCProject/common/images/kmz/kmz.png"/> 
					to download the layer as 'kmz' file (for Google Earth) and 
					<img src="/DeepCProject/common/images/Download/LayerDownload.png"/> 
					to download the layer data as .zip or geotiff file. 
				</span>
			</div>

            <!-- These are the dropdowns for the base layer-->
            <div class="transDraggableWindow" id="mainMenuParent" 
				 onmouseover="hoverInstructionsFixedPos('mainMenuParentHover', '1')" 
				 onmouseout="hoverInstructionsFixedPos('mainMenuParentHover', '2')" >
				<span id="mainMenuParentHover" class="commonHover">
					Select form these hierarchically organized base layers
				</span>
				<div class="row ">
					<div  class="col-xs-9 text-center invShadow title"> 
						Base Layers
					</div>
					<div class="col-xs-3 text-center">
						<a class="btn btn-default btn-xs" href="#" 
						   onclick="minimizeWindow('mainMenuMinimize', 'mainMenuParent')">
							<i class="glyphicon glyphicon-resize-small"></i>
						</a>
					</div>
				</div>
				<div class="row">
					<div class="col-xs-12 ">
						<table id='t_mainMenu'>
							<tr><td class='simpleSpace'>
									<select class='mainMenu' id='dropDownLevels1' name='dropDownLevels' onchange='MapViewersubmitForm();'>
										<option class='mainMenuOption' value='test' selected>TEST </option>
									</select></td></tr>

							<tr><td class='simpleSpace'>
									<select class='mainMenu' id='dropDownLevels2' name='dropDownLevels' onchange='MapViewersubmitForm();'>
										<option class='mainMenuOption' value='vectest' selected>Vector layer </option>
										<option class='mainMenuOption' value='veccqltest' >Vector CQL test </option>
										<option class='mainMenuOption' value='geotifftest' >Geotiff test </option>
										<option class='mainMenuOption' value='ncwmsonedate' >ncWMS with one date </option>
										<option class='mainMenuOption' value='ncwmsonedepth' >ncWMS with one zaxis </option>
										<option class='mainMenuOption' value='ncwmsall' >ncWMS with all </option>
										<option class='mainMenuOption' value='ncwmvelocity' >ncWMS velocity field </option>
									</select></td></tr>
						</table>
					</div>
				</div>

			</div>



            <!-- User Menu -->
            <!-- Menu for Users -->
			<div id="layersMenu" class="layersMenu">
				<!--
				
				
				
				-->
				<!-- Link to download kml files-->
				<div class="buttonStyle" id="kmlLinkParent" 
					 onmouseover="hoverInstructions('mainKmlParentHover', '1', this, 'below')" 
					 onmouseout="hoverInstructions('mainKmlParentHover', '2', this, 'below')"  > 





					<a  id="kmlLink" href="http://viewer.coaps.fsu.edu/geoserver/wms?layers=postgis:all_cruises&REQUEST=GetMap&VERSION=1.1.1&BBOX=-120.0,-59.983333333333,-10.0,50.0166666666666&WIDTH=512&HEIGHT=512&SRS=EPSG:4326&FORMAT=application/vnd.google-earth.kml+xml" style="text-align:center;" onclick="KMZDownAlert()">
						<img  border="0" src="/DeepCProject/common/images/kmz/google_earth_logo_topMenu.png" alt="Descargar en KML" />
						Google Earth
					</a>

				</div>
				<!-- Transparency -->
				<div class="buttonStyle" id="transParent" 
					 onmouseover="hoverInstructions('transParentHover', '1', this, 'below')" 
					 onmouseout="hoverInstructions('transParentHover', '2', this, 'below')" >



					<a class="btn btn-default btn-xs" href="#" id="minusButtonTrans" style="visibility:hidden"
					   onclick="changeTranspManager(.15, 'topMenu');">
						<span class="glyphicon glyphicon-minus "></span>
					</a>
					<span style="cursor: default;" id="transText" >Transparency</span>
					<a class="btn btn-default btn-xs" href="#" id="plusButtonTrans"
					   onclick="changeTranspManager(-.15, 'topMenu');">
						<span class="glyphicon glyphicon-plus"> </span>
					</a>

				</div>



				<!-- Download data-->
				<div class="buttonStyle" id="downloadDataParent" 
					 onmouseover="hoverInstructions('downloadDataParentHover', '1', this, 'below')"
					 onmouseout="hoverInstructions('downloadDataParentHover', '2', this, 'below')"
					 onclick="getWCSV1Ajax('/DeepCProject');"  >
					Download data
				</div>


				<!-- Map Instructions-->
				<div class="buttonStyle" id="helpParent" valign="middle">
					<span id="helpText"
						  onmouseover="hoverInstructions('mapInstrucParentHover', '1', this, 'below');"
						  onmouseout="hoverInstructions('mapInstrucParentHover', '2', this, 'below')"
						  onclick="displayHelp();" atl="Help" />
					Help
					</span>
				</div>
			</div>

			<div id="helpHoverSpan" >
				<img onmouseover="hoverInstructions('helpIconHover', '1', this, 'belowleft', 150, 50)" onmouseout="hoverInstructions('helpIconHover', '2', this, 'belowleft', 150, 0)"
					 onclick="displayHoverHelp(this, '/DeepCProject');" id="helpHoverImg" src="/DeepCProject/common/images/Help/Help1.png">
			</div>





            <!-- Foot page --> 
            <div id="pieDePaginaIzq" class="leftFoot">
                &nbsp;
                <a  href="http://www.deep-c.org/">
                    <a  href="http://www.fsu.edu/">
                        <img border="0" src="/DeepCProject/common/images/Logos/FSU.png" alt="FSU" width="30" height="30" /></a>
                    &nbsp;
                    <a  href="http://coaps.fsu.edu/">
                        <img border="0" src="/DeepCProject/common/images/Logos/COAPSoz.png" alt="COAPS" width="30" height="30" /></a>
                    &nbsp 
                    <a  href="http://www.deep-c.org/">
                        <img border="0" src="/DeepCProject/common/images/Logos/DeepC.png" alt="DeepC" width="51" height="30" /></a>
                    &nbsp 
                    <a  href="http://www.noaa.gov/">
                        <img border="0" src="/DeepCProject/common/images/Logos/NOAA.png" alt="NOAA" width="30" height="30" /></a>

                    <a  href="http://deep-c.org/copyright">
						<p class="footNote" align="left">
							&nbsp 
							&copy; <script language="javascript">document.write(getDate("%Y"));</script>.  Deep-C Consortium. All Rights Reserved &nbsp;
						</p></a>
                    <a id="emailText" href="mailto:osz09@fsu.edu, aahmed@coaps.fsu.edu"> Contact</a>
            </div>
        </form>

        <!-- minimizable windows file -->

		<div class="row" id="minimizedWindowsContainer">
			<div class="col-xs-11" >
				<span id="mainMenuMinimize" class="draggableWindow minimizedWindow">
					Base Layers
					<a class="btn btn-default btn-xs " href="#" 
					   onclick="minimizeWindow('mainMenuParent', 'mainMenuMinimize')"> 
						<i class="glyphicon glyphicon-resize-full "></i></a>

				</span>                
				<span id="calendarsMinimize" class="draggableWindow minimizedWindow">
					Calendars
					<a class="btn btn-default btn-xs " href="#" 
					   onclick="minimizeWindow('CalendarsAndStopContainer', 'calendarsMinimize')"> 
						<i class="glyphicon glyphicon-resize-full "></i></a>
				</span>                
				<span id="optionalsMinimize" class="draggableWindow minimizedWindow">
					Optional Layers
					<a class="btn btn-default btn-xs " href="#" 
					   onclick="minimizeWindow('optionalMenuParent', 'optionalsMinimize')" >
						<i class="glyphicon glyphicon-resize-full "></i></a>
				</span>                
			</div>
		</div>


        <!-- Help texts file -->

		<span id="mainKmlParentHover" class="commonHover">
			Open current animation <br>
				or base layer in Google Earth
		</span>
		<span id="transParentHover" class="commonHover">
			Change transparency of base layer. </span>
		<span id="elevationParentHover" class="commonHover">
			Change the elevation/pressure of base layer.<br>
				Press on the text to select a specific level or <br>
					Press the '-' and '+' signs <br>
						to select adjacent levels.</span>
						<span id="palettesHover" class="commonHover">
							Changes the color palette and <br>
								the color ranges.
						</span>
						<span id="transectParentHover" class="commonHover">
							Displays vertical transects of current base layer. <BR/><BR/> 
							1) Select tool.<br>
								2) Draw a line(s) by clicking on the map <br>
									on different points and then double click <br>
										to display the corresponding vertical transect.
										</span>
										<span id="mapInstrucParentHover" class="commonHover">
											Instructions on how to use <br>
												all the site features. 
										</span>
										<span id="downloadDataParentHover" class="commonHover">
											Downloads the base layer in GIS format <br> 
												(shape if it is a vector layer, <br> 
													geotiff if it is a raster layer).
													</span>

													<span id="helpIconHover" class="commonHover">
														Enables and disables the mouse over help texts.
													</span>
													</body>
													</html>

