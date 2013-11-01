<!DOCTYPE HTML>
<html xmlns="http://www.w3.org/1999/xhtml" lang="EN">
    <head>
        
<script type="text/javascript"  >
    var layerDetails = {"name":"demo:world_cities","srs":"EPSG:4326","server":"http://owgis.servehttp.com:8080/geoserver/wms"}; //layer details such as title, server, ect in a json object. 
    var mainLayer = 'demo:world_cities'; //main layer title
    var mappalette = 'default'; // palette color
    var paletteUrl = ''; //palette server url
    var basepath = '/OWGISTemplate'; //url base path ex:/DeepCProject
    var lay_style = ''; //layer color style, part of the url to request the pallete.
    var map; //map variable that contains the OpenLayers map
    var ol3view;//View that contains the map

    // This variables are used by JavaScript to control de interface. 
    var netcdf = false; //true if layer displayed is netcdf, false otherwise
    var mobile = false; // check to see if we are in mobile version
    var _mainlayer_multipleDates = false;// Indicates if the main layer has multiple dates
    var _mainlayer_zaxisCoord = false;// Indicates if the main layer has a z-axis coordinate

        //minPalVal = layerDetails.scaleRange[0];
        //maxPalVal = layerDetails.scaleRange[1];
    var max_time_range = 'week'; //calendar time range
    var idx_main_layer = '1';// What is the index of the main layer (depending on the number of background layers)
    var mapConfig = {'mapProjection':'EPSG:4326','menuDesign':'topMenu','mapcenter':'lat=26.70,lon=-87.34','minResolution':0.0002,'basepath':'/OWGISTemplate','restrictedExtent':'-180,-90,180,90','maxResolution':0.15,'mapBounds':'-180,-90,180,90','tilesOrigin':'-180,-90','baseLayerMenuOrientation':'vertical','zoom':6,'backgroundLayer':'wms'}; //configurations such as resolution, size, zoom levels, etc...
    var transectOn = false; //boolean for transect tool if the netcdf has the option or not
    var currentZoom = 0; //This variable is used to avoid removing the 'Loading' text after zooming into the map (When an animation is been loading)
    var cql_cols = ''; // Set of columns that can be filtered by CQL
    var cqlFilter = false; //Indicates if the base layer uses CQL filtering
    var _map_projection = mapConfig.mapProjection;// This is the default map projection
    var _map_bk_layer = mapConfig.backgroundLayer;// This is the background layer we are using

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
        <link rel="icon" href="/OWGISTemplate/common/images/icon/PageIcon.ico" type="image/x-icon" />
        <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
        <meta name="Description" content="OWGIS Template" />
        <meta name="Keywords" content="OWGIS " />

        <!-- Jquery -->
        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
        <script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js"></script>
        <!-- End Jquery -->

        <!-- Bootstrap -->
        <link href="//netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap.min.css" rel="stylesheet" type="text/css"/>
        <script src="//netdna.bootstrapcdn.com/bootstrap/3.0.0/js/bootstrap.min.js"></script>
        <!-- End Bootstrap -->

        <link href="/OWGISTemplate/common/CSS/Calendars.css" rel="stylesheet" type="text/css"/>
        <link href="/OWGISTemplate/common/CSS/MapInstructions.css" rel="stylesheet" type="text/css"/>
        <link href="/OWGISTemplate/common/CSS/GeneralStyles.css" rel="stylesheet" type="text/css"/>
        <link href="/OWGISTemplate/common/CSS/Buttons.css" rel="stylesheet" type="text/css"/>
        <link href="/OWGISTemplate/common/CSS/Elevation.css" rel="stylesheet" type="text/css"/>
        <link href="/OWGISTemplate/common/CSS/BaseLayers.css" rel="stylesheet" type="text/css"/>
        <link href="/OWGISTemplate/common/CSS/Palettes.css" rel="stylesheet" type="text/css"/>
        <link href="/OWGISTemplate/common/CSS/Popup.css" rel="stylesheet" type="text/css"/>
        <link href="/OWGISTemplate/common/CSS/cqlFilter.css" rel="stylesheet" type="text/css"/>
        <link href="/OWGISTemplate/common/CSS/OptionalLayersMenu.css" rel="stylesheet" type="text/css"/>
        <link href="/OWGISTemplate/common/CSS/MenuOptions.css" rel="stylesheet" type="text/css"/>
        <link href="/OWGISTemplate/common/CSS/MinimizedWindows.css" rel="stylesheet" type="text/css"/>
              
        <link href="/OWGISTemplate/common/CSS/calendar/jscal2.css" rel="stylesheet" type="text/css"/>
        <link href="/OWGISTemplate/common/CSS/calendar/border-radius.css" rel="stylesheet" type="text/css"/>
        <link href="/OWGISTemplate/common/CSS/calendar/reduce-spacing.css" rel="stylesheet" type="text/css"/>
        <link href="/OWGISTemplate/common/CSS/calendar/steel/steel.css" rel="stylesheet" type="text/css"/>

        <!--Specific for OpenLayers3 -->
        <link rel="stylesheet" href="http://ol3js.org/en/master/build/ol.css"/>
        <script src="http://ol3js.org/en/master/build/ol.js"></script>
        <link href="/OWGISTemplate/common/CSS/Ol3.css" rel="stylesheet" type="text/css"/>
        <!--Specific for OpenLayers3 -->

        <script type="text/javascript" src="/OWGISTemplate/common/JS/utilities.js"> </script>
        <script type="text/javascript" src="/OWGISTemplate/common/JS/mapDisplay/InterfaceDependent.js"> </script>
        <script type="text/javascript" src="/OWGISTemplate/common/JS/mapDisplay/HelpInstructions.js"> </script>
        <script type="text/javascript" src="/OWGISTemplate/common/JS/mapDisplay/mapDisplay.js"> </script>
          
        <script type="text/javascript" src="/OWGISTemplate/common/JS/mapDisplay/Calendars.js"> </script>
        <script type="text/javascript" src="/OWGISTemplate/common/JS/mapDisplay/Elevation.js"> </script>
        <script type="text/javascript" src="/OWGISTemplate/common/JS/mapDisplay/OpenLayersRelated.js"> </script>
        <script type="text/javascript" src="/OWGISTemplate/common/JS/mapDisplay/MenuPositions.js"> </script>
        <script type="text/javascript" src="/OWGISTemplate/common/JS/mapDisplay/animation.js"> </script>
        <script type="text/javascript" src="/OWGISTemplate/common/JS/validation.js"> </script>
        <script type="text/javascript" src="/OWGISTemplate/common/JS/ajax/ajax.js"> </script>
        <script type="text/javascript" src="/OWGISTemplate/common/JS/mapDisplay/Palettes.js"> </script>
        <script type="text/javascript" src="/OWGISTemplate/common/JS/mapDisplay/CQL.js"> </script>
        <script type="text/javascript" src="/OWGISTemplate/common/JS/mapDisplay/OptionalLayersMenu.js"> </script>
        <script type="text/javascript" src="/OWGISTemplate/common/JS/mapDisplay/VisualizationTools.js"> </script>
        <script type="text/javascript" src="/OWGISTemplate/common/JS/mapDisplay/ExportPng.js"> </script>

        <script type="text/javascript" src="/OWGISTemplate/common/JS/calendar/jscal2.js"></script>
        <script type="text/javascript" src="/OWGISTemplate/common/JS/calendar/lang/en.js"></script>

        <title>OWGIS Template </title>
 
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

/**
 * Add a click handler to hide the popup.
 * @return {boolean} Don't follow the href.
 */
$("#popup-closer").click(function() {
    $("#popup").hide();
    $("#popup-closer").blur();
});


/**
 * Create an ol_popup to anchor the popup to the map.
 */
ol_popup = new ol.Overlay({
    element: document.getElementById('popup'),
    stopEvent:true//Used to not show the popup again when closing it
});


            
        var bounds = mapConfig.mapBounds;
        var extent = mapConfig.restrictedExtent;
        var maxRes = mapConfig.maxResolution;
        var minRes = mapConfig.minResolution;
        
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

        var defCenter;

        if(_map_bk_layer === "wms"){
            //If the default projection is not 4326 then we need to transform 
            // the projections to the default map projection
            if(_map_projection !== 'EPSG:4326'){
                defCenter= ol.proj.transform([lon, lat], 'EPSG:4326', _map_projection);
            }else{
                defCenter= [lon,lat];
            }
        }else{
            if(_map_bk_layer === "osm"){
                _map_projection = 'EPSG:3857';//Force projection for osm background layer
                defCenter= ol.proj.transform([lon, lat], 'EPSG:4326', _map_projection);
            }
        }

        //This control is used to display Lat and Lon when the user is moving the mouse over the map
        var mousePositionControl = new ol.control.MousePosition({
          coordinateFormat: ol.coordinate.createStringXY(4),
          projection: 'EPSG:4326',
          // comment the following two lines to have the mouse position
          // be placed within the map.
          className: 'ol-lat-lon',
          target: document.getElementById('location'),
          undefinedHTML: '&nbsp;'
        });

        //This is the control for the scale line at the bottom of the map
        var scaleLineControl = new ol.control.ScaleLine();
        var fullScreen = new ol.control.FullScreen();

        ol3view = new ol.View2D({
                projection: _map_projection,
                center: defCenter,
                zoom: mapConfig.zoom,
                });
        


        //Adds a zoom slider on the map
        zoomslider = new ol.control.ZoomSlider();
        //map.addControl(zoomslider);//Adds the zoom slider to the map
        //map.addControl(fullScreen);// Adds the button to see the map full screen

        
        //This openLayerConfig is generated by the java file OpenLayersManager.java 
        //it loads all the layers that are needed for the map. 
    
    layer0 = new ol.layer.Tile({
         source: new ol.source.TileWMS({
         url: 'http://viewer.coaps.fsu.edu/geoserver/wms',
         params: {LAYERS: 'comm:pyrResult512', TILED: true, STYLES: '', SRS: '"+_map_projection+"'}
            })
        });
    layer1 = new ol.layer.Tile({
         source: new ol.source.TileWMS({
         url: 'http://owgis.servehttp.com:8080/geoserver/wms',
         params: {LAYERS: 'demo:world_cities', TILED: true, STYLES: '', SRS: '"+_map_projection+"'}
            })
        });
    layer2 = new ol.layer.Tile({
         source: new ol.source.TileWMS({
         url: 'http://owgis.servehttp.com:8080/geoserver/wms',
         params: {LAYERS: 'demo:world_countries', TILED: true, STYLES: '', SRS: '"+_map_projection+"'}
            })
        });
    layer2.setVisible(false);
    layer3 = new ol.layer.Tile({
        id:'layer3',
         source: new ol.source.TileWMS({
         url: 'http://owgis.servehttp.com:8080/geoserver/wms',
         params: {LAYERS: 'demo:us_states', TILED: true, STYLES: '', SRS: '"+_map_projection+"'}
            }),
         style: new ol.style.Style({
            rules: [
              new ol.style.Rule({
                filter: 'renderIntent("selected")',
                symbolizers: [
                  new ol.style.Fill({
                    color: '#ffffff',
                    opacity: 0.5
                  })
                ]
              })
            ],
            symbolizers: [
              new ol.style.Fill({
                color: '#ffffff',
                opacity: 0.25
              }),
              new ol.style.Stroke({
                color: '#6666ff'
              })
            ]
          })
        });

    var selectInteraction = new ol.interaction.Select({
      layerFilter: function(layer) { return layer.get('id') == 'layer3'; }
    });

    layer3.setVisible(false);

        /**
         * Create the map.
         */
        map = new ol.Map({
            interactions: ol.interaction.defaults().extend([selectInteraction]),
            controls:ol.control.defaults().extend([mousePositionControl, scaleLineControl]),
            overlays: [ol_popup], //Overlay used for popup
            target: 'map', // Define 'div' that contains the map
            renderers: [ol.RendererHint.CANVAS, ol.RendererHint.DOM],
            view: ol3view
        });

    map.addLayer(layer0);
    map.addLayer(layer1);
    map.addLayer(layer2);
    map.addLayer(layer3);

    map.on('singleclick', function (evt) {
         var coordinate = evt.getCoordinate();
         var currBBOX =  ol3view.calculateExtent(map.getSize());
         $('#popup').hide();
         currPopupText = '';
         ol_popup.setPosition(coordinate);
        if(layer0.getVisible()){
            var url0 ="/OWGISTemplate/redirect?server=http://viewer.coaps.fsu.edu/geoserver/wms&LAYERS=comm:gebco&STYLES=&WIDTH="+ map.getSize()[0] +"&HEIGHT="+ map.getSize()[1] +"&SRS="+ _map_projection+ "&FORMAT=image/jpeg&VERSION=1.1.1&REQUEST=GetFeatureInfo&EXCEPTIONS=application/vnd.ogc.se_xml&x="+ Math.floor(evt.getPixel()[0]) +"&y="+ Math.floor(evt.getPixel()[1]) +"&BBOX="+ currBBOX +"&SERVICE=WMS&INFO_FORMAT=text/html&NETCDF=false&QUERY_LAYERS=comm:gebco&FEATURE_COUNT=50";
             var asynchronous0 = new Asynchronous();
             asynchronous0.complete = AsyncPunctualData;
             asynchronous0.call(url0);
        }
        if(layer1.getVisible()){
            var url1 ="/OWGISTemplate/redirect?server=http://owgis.servehttp.com:8080/geoserver/wms&LAYERS=demo:world_cities&STYLES=&WIDTH="+ map.getSize()[0] +"&HEIGHT="+ map.getSize()[1] +"&SRS="+ _map_projection+ "&FORMAT=image/jpeg&VERSION=1.1.1&REQUEST=GetFeatureInfo&EXCEPTIONS=application/vnd.ogc.se_xml&x="+ Math.floor(evt.getPixel()[0]) +"&y="+ Math.floor(evt.getPixel()[1]) +"&BBOX="+ currBBOX +"&SERVICE=WMS&INFO_FORMAT=text/html&NETCDF=false&QUERY_LAYERS=demo:world_cities&FEATURE_COUNT=50";
             var asynchronous1 = new Asynchronous();
             asynchronous1.complete = AsyncPunctualData;
             asynchronous1.call(url1);
        }
        if(layer2.getVisible()){
            var url2 ="/OWGISTemplate/redirect?server=http://owgis.servehttp.com:8080/geoserver/wms&LAYERS=demo:world_countries&STYLES=&WIDTH="+ map.getSize()[0] +"&HEIGHT="+ map.getSize()[1] +"&SRS="+ _map_projection+ "&FORMAT=image/jpeg&VERSION=1.1.1&REQUEST=GetFeatureInfo&EXCEPTIONS=application/vnd.ogc.se_xml&x="+ Math.floor(evt.getPixel()[0]) +"&y="+ Math.floor(evt.getPixel()[1]) +"&BBOX="+ currBBOX +"&SERVICE=WMS&INFO_FORMAT=text/html&NETCDF=false&QUERY_LAYERS=demo:world_countries&FEATURE_COUNT=50";
             var asynchronous2 = new Asynchronous();
             asynchronous2.complete = AsyncPunctualData;
             asynchronous2.call(url2);
        }
        if(layer3.getVisible()){
            var url3 ="/OWGISTemplate/redirect?server=http://owgis.servehttp.com:8080/geoserver/wms&LAYERS=demo:us_states&STYLES=&WIDTH="+ map.getSize()[0] +"&HEIGHT="+ map.getSize()[1] +"&SRS="+ _map_projection+ "&FORMAT=image/jpeg&VERSION=1.1.1&REQUEST=GetFeatureInfo&EXCEPTIONS=application/vnd.ogc.se_xml&x="+ Math.floor(evt.getPixel()[0]) +"&y="+ Math.floor(evt.getPixel()[1]) +"&BBOX="+ currBBOX +"&SERVICE=WMS&INFO_FORMAT=text/html&NETCDF=false&QUERY_LAYERS=demo:us_states&FEATURE_COUNT=50";
             var asynchronous3 = new Asynchronous();
             asynchronous3.complete = AsyncPunctualData;
             asynchronous3.call(url3);
        }
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
<div class="mapTitle" id="layerTitle"> 
    <div class="row">
        <div class="col-sm-8 col-sm-offset-2 ">
            <p id="pTitleText"> Vector layer demo. World big cities.  </p> 
        </div>
    </div>
</div>

<!-- This div contains all the map --> 
<div id="map"> </div>      
<div class="layersLonLat">
    <!-- This div displays the specific data of the map -->
    Longitude:&nbsp;&nbsp;Latitude: &nbsp;</b>
    <div id="location" ></div>
</div>    
    
<div id="popup" class="ol-popup">
    <a href="#" id="popup-closer" class="ol-popup-closer"></a>
    <div id="popup-content"></div>
</div>

<!-- This div is only used to contain the movement of the
draggable windows -->
<div id="draggable-container"></div>
 

        
        <form id="baseForm" class="form-inline" name="baseForm" action="/OWGISTemplate/mapviewer" method="post">

            <!-- List of optional layers -->
            <div class="draggableWindow" id="optionalMenuParent" 
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
                     value="countries" onclick="manageOptionalLayers(layer2,this.checked); DisableTranspOptionalLayers(1,'minusButtonOptional1','plusButtonOptional1', 'checkBox1' ); ">
                Countries
                <span style='float: right'>
                    <button id="minusButtonOptional1" class="minusButtonSmall" type="button" disabled="disabled" 
                          onmouseover ="changeColor(this,1);" onmouseout ="changeColor(this,0);" 
                          onmouseup ="changeColor(this,1);" onmousedown ="changeColor(this,2);" 
                            onclick="changeTranspOptionalLayers(layer2, .20, 1,'minusButtonOptional1','plusButtonOptional1', 'checkBox1' ) ;">-</button> <button id="plusButtonOptional1" class="plusButtonSmall" type="button" disabled="disabled" 
                          onmouseover ="changeColor(this,1);" onmouseout ="changeColor(this,0);" 
                          onmouseup ="changeColor(this,1);" onmousedown ="changeColor(this,2);" 
                            onclick="changeTranspOptionalLayers(layer2, -.20, 1,'minusButtonOptional1','plusButtonOptional1', 'checkBox1' ) ;">+</button>
                    <A href="http://owgis.servehttp.com:8080/geoserver/wms?layers=demo:world_countries&REQUEST=GetMap&VERSION=1.1.1&BBOX=-171.79111060289117,18.916190000000142,-66.96465999999998,71.35776357694175&WIDTH=512&HEIGHT=512&SRS=EPSG:4326&FORMAT=application/vnd.google-earth.kml+xml">
                        <img class="optionalImg" src="/OWGISTemplate/common/images/kmz/kmz.png" 
                             onmouseover="rollImage(this,'/OWGISTemplate/common/images/kmz/kmz_over.png' )" 
                             onmouseout="rollImage(this,'/OWGISTemplate/common/images/kmz/kmz.png' )" 
                             onmousedown="rollImage(this,'/OWGISTemplate/common/images/kmz/kmz_over_click.png' )" 
                             border="0" alt="Descargar KMZ" onload="CreateArraysOptional(1); DisableTranspOptionalLayers(1,'minusButtonOptional1','plusButtonOptional1', 'checkBox1' ); "></A> 
                    <A href="http://owgis.servehttp.com:8080/geoserver/wms?SERVICE=WFS&VERSION=1.0.0&REQUEST=GetFeature&typeName=demo:world_countries&outputFormat=SHAPE-ZIP&CRS=EPSG:4326">
                        <img class="optionalImg" src="/OWGISTemplate/common/images/Download/LayerDownload.png" 
                             onmouseover="rollImage(this,'/OWGISTemplate/common/images/Download/LayerDownload_over.png' )" 
                             onmouseout="rollImage(this,'/OWGISTemplate/common/images/Download/LayerDownload.png' )" 
                             onmousedown="rollImage(this,'/OWGISTemplate/common/images/Download/LayerDownload_over_click.png' )" 
                             border="0" /> </A> 
            </span></p></li>
            <li class="opt_lay_title" id="optMenu2"               onmouseover ="changeColor(this,1);" onmouseout ="changeColor(this,0);" 
                  onmouseup ="changeColor(this,1);" onmousedown ="changeColor(this,2);" 
       onclick="toogleList('#optUl2')">Level 1</li>
            <ul class='opt_lay_list' id='optUl2'>
                <li class='opt_lay_menu' id='menuOpt2'><p class='opt_lay_par'>
                    <input id="checkBox2" type="checkbox" name="vectorLayersSelected" 
                         value="lev1,states" onclick="manageOptionalLayers(layer3,this.checked); DisableTranspOptionalLayers(2,'minusButtonOptional2','plusButtonOptional2', 'checkBox2' ); ">
                    US states
                    <span style='float: right'>
                        <button id="minusButtonOptional2" class="minusButtonSmall" type="button" disabled="disabled" 
                              onmouseover ="changeColor(this,1);" onmouseout ="changeColor(this,0);" 
                              onmouseup ="changeColor(this,1);" onmousedown ="changeColor(this,2);" 
                                onclick="changeTranspOptionalLayers(layer3, .20, 2,'minusButtonOptional2','plusButtonOptional2', 'checkBox2' ) ;">-</button> <button id="plusButtonOptional2" class="plusButtonSmall" type="button" disabled="disabled" 
                              onmouseover ="changeColor(this,1);" onmouseout ="changeColor(this,0);" 
                              onmouseup ="changeColor(this,1);" onmousedown ="changeColor(this,2);" 
                                onclick="changeTranspOptionalLayers(layer3, -.20, 2,'minusButtonOptional2','plusButtonOptional2', 'checkBox2' ) ;">+</button>
                        <A href="http://owgis.servehttp.com:8080/geoserver/wms?layers=demo:us_states&REQUEST=GetMap&VERSION=1.1.1&BBOX=-171.79111060289117,18.916190000000142,-66.96465999999998,71.35776357694175&WIDTH=512&HEIGHT=512&SRS=EPSG:4326&FORMAT=application/vnd.google-earth.kml+xml">
                            <img class="optionalImg" src="/OWGISTemplate/common/images/kmz/kmz.png" 
                                 onmouseover="rollImage(this,'/OWGISTemplate/common/images/kmz/kmz_over.png' )" 
                                 onmouseout="rollImage(this,'/OWGISTemplate/common/images/kmz/kmz.png' )" 
                                 onmousedown="rollImage(this,'/OWGISTemplate/common/images/kmz/kmz_over_click.png' )" 
                                 border="0" alt="Descargar KMZ" onload="CreateArraysOptional(2); DisableTranspOptionalLayers(2,'minusButtonOptional2','plusButtonOptional2', 'checkBox2' ); "></A> 
                        <A href="http://owgis.servehttp.com:8080/geoserver/wms?SERVICE=WFS&VERSION=1.0.0&REQUEST=GetFeature&typeName=demo:us_states&outputFormat=SHAPE-ZIP&CRS=EPSG:4326">
                            <img class="optionalImg" src="/OWGISTemplate/common/images/Download/LayerDownload.png" 
                                 onmouseover="rollImage(this,'/OWGISTemplate/common/images/Download/LayerDownload_over.png' )" 
                                 onmouseout="rollImage(this,'/OWGISTemplate/common/images/Download/LayerDownload.png' )" 
                                 onmousedown="rollImage(this,'/OWGISTemplate/common/images/Download/LayerDownload_over_click.png' )" 
                                 border="0" /> </A> 
                </span></p></li>
            </ul>
        </ul>


    </div>
</div>

                <span id="optionalLayersParentHover" class="commonHover">
                    Click on the check box to enable an optional layer. The '+' and '-' buttons change the transparency, 
                    <img src="/OWGISTemplate/common/images/kmz/kmz.png"/> 
                    to download the layer as 'kmz' file (for Google Earth) and 
                    <img src="/OWGISTemplate/common/images/Download/LayerDownload.png"/> 
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
                            <option class='mainMenuOption' value='lev1' selected>Level 1 </option>
                    </select></td></tr>

                    <tr><td class='simpleSpace'>
                        <select class='mainMenu' id='dropDownLevels2' name='dropDownLevels' onchange='MapViewersubmitForm();'>
                            <option class='mainMenuOption' value='vectest' selected>Vector layer </option>
                            <option class='mainMenuOption' value='veccqltest' >Vector CQL demo </option>
                            <option class='mainMenuOption' value='geotifftest' >Raster (GeoTIFF) </option>
                            <option class='mainMenuOption' value='ncwmsonedate' >ncWMS MultZ OneDate </option>
                            <option class='mainMenuOption' value='ncwmvelocity' >ncWMS velocity field </option>
                            <option class='mainMenuOption' value='ncwmsonedepth' >ncWMS OneZ OneDate  </option>
                            <option class='mainMenuOption' value='ncwmsall' >ncWMS MultZ MultDate </option>
                    </select></td></tr>
</table>
                        </div>
                    </div>
                    
                </div>

            


            <!-- OWGIS logo -->
            <div id="owgislogocont">
                <a href="http://owgis.org" target="_blank">
                    <img border="0" src="/OWGISTemplate/common/images/Logos/owgis.png" alt="OWGIS" height="20px"  />
                </a>
            </div>

            <!-- User Menu -->
            <!-- Menu for Users -->
<div id="layersMenu" class="layersMenu">

    <!--
    
    
    
    -->
    <!-- Link to download kml files-->
    <div class="buttonStyle" id="kmlLinkParent" 
        onmouseover="hoverInstructions('mainKmlParentHover', '1',this,'below')" 
        onmouseout="hoverInstructions('mainKmlParentHover', '2',this,'below')"  > 
        




<a class="maplink" id="kmlLink" href="http://owgis.servehttp.com:8080/geoserver/wms?layers=demo:world_cities&REQUEST=GetMap&VERSION=1.1.1&BBOX=-175.22056447761656,-41.29997393927641,179.21664709402887,64.15002361973922&WIDTH=512&HEIGHT=512&SRS=EPSG:4326&FORMAT=application/vnd.google-earth.kml+xml" style="text-align:center;" onclick="KMZDownAlert()">
    <img  border="0" src="/OWGISTemplate/common/images/kmz/google_earth_logo_topMenu.png" alt="Descargar en KML" />
    Google Earth
</a>

    </div>
    <!-- Transparency -->
    <div class="buttonLook" id="transParent" 
        onmouseover="hoverInstructions('transParentHover', '1',this,'below')" 
        onmouseout="hoverInstructions('transParentHover', '2',this,'below')" >
        


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
    <!-- Depth or elevation-->
    <div class="buttonContainer menuHidden" id="elevationParent"
        onmouseover="hoverInstructions('elevationParentHover', '1',this,'below')" 
        onmouseout="hoverInstructions('elevationParentHover', '2',this,'below')"  >
        
    

<a class="btn btn-default btn-xs" href="#" id="minusButtonElevation" 
    onclick="changeElevation('-', layer1);">
    <span class="glyphicon glyphicon-minus"></span> </a>

<span class="buttonStyle" id="elevationText"  onclick ="displayElevationSelector() " 
      onmouseover="hoverInstructions('elevationParentHover', '1')" onmouseout="hoverInstructions('elevationParentHover', '2')" >
    Depth</span>

<a class="btn btn-default btn-xs " href="#" id="plusButtonElevation"
        onclick="changeElevation('+', layer1);">
    <span class="glyphicon glyphicon-plus "></span> </a>

    </div>
    <!-- Palettes -->
    <div class="buttonStyle menuHidden" id="palettesMenuParent" 
        onmouseover="hoverInstructions('palettesHover', '1',this,'below')"
        onmouseout="hoverInstructions('palettesHover', '2',this,'below')"
         onclick="showPalettes()" id="dynamicFont_color"  >
            Color Palette
    </div>
    <!-- Transect tool-->
    <div class="buttonStyle menuHidden" id="lineToggle" 
        onmouseover="hoverInstructions('transectParentHover', '1',this,'below')"
        onmouseout="hoverInstructions('transectParentHover', '2',this,'below')"
         name="type" value="line" onclick="toggleControl(this,'below');" >
            Transect Tool
    </div>
    <!-- Download data-->
    <div class="buttonStyle menuHidden" id="downloadDataParent" 
        onmouseover="hoverInstructions('downloadDataParentHover', '1',this,'below')"
        onmouseout="hoverInstructions('downloadDataParentHover', '2',this,'below')"
        onclick="getWCSV1Ajax('/OWGISTemplate');"  >
        Download data
    </div>
    <!-- Export map as PNG image -->
    <!--
    <div class="buttonStyle" id="exportPNGParent" valign="middle">
        <span onmouseover="hoverInstructions('exportPngHover', '1',this,'below');"
            onmouseout="hoverInstructions('exportPngHover', '2',this,'below')" />
            <a class="maplink" id="exportMapLink" download="DeepCmap.png" 
                onclick="updateMapPngLink();" >
                 Export PNG</a>
        </span>
    </div>-->
    <!-- Map Instructions-->
    <div class="buttonStyle" id="helpParent" valign="middle">
        <span id="helpText"
            onmouseover="hoverInstructions('mapInstrucParentHover', '1',this,'below');"
            onmouseout="hoverInstructions('mapInstrucParentHover', '2',this,'below')"
            onclick="displayHelp();" atl="Help" />
            Help
        </span>
    </div>
    <!-- Reset view -->
    <div class="buttonStyle" id="resetParent" valign="middle">
        <span id="resetText"
            onclick="resetView();" />
            Reset View
        </span>
    </div>

</div>

<div id="helpHoverSpan" >
    <img onmouseover="hoverInstructions('helpIconHover', '1',this,'belowleft',150,50)" onmouseout="hoverInstructions('helpIconHover', '2',this,'belowleft',150,0)"
    onclick="displayHoverHelp();" id="helpHoverImg" src="/OWGISTemplate/common/images/Help/Help1.png">
</div>
 
            
                
                <!-- Foot page --> 
                <div id="pieDePaginaIzq" class="leftFoot">
                    &nbsp;
                    <a  href="#">
                        <img border="0" src="/OWGISTemplate/common/images/Logos/Logo.png" alt="Logo" width="30" height="30" /></a>
                    &nbsp;
                    <a  href="#">
                        <img border="0" src="/OWGISTemplate/common/images/Logos/Logo.png" alt="Logo" width="30" height="30" /></a>
                    &nbsp 
                    <a  href="#">
                        <img border="0" src="/OWGISTemplate/common/images/Logos/Logo.png" alt="Logo" width="30" height="30" /></a>
                    &nbsp 
                    <a  href="#">
                        <img border="0" src="/OWGISTemplate/common/images/Logos/Logo.png" alt="Logo" width="30" height="30" /></a>
                            
                    <a  href="#">
                        <p class="footNote" align="left">
                            &nbsp 
                            &copy; <script language="javascript">document.write(getDate("%Y"));</script>.  Your own Copyright. All Rights Reserved &nbsp;
                        </p></a>
                    <a id="emailText" href="#"> Contact</a>
                </div>
        </form>
            
        <!-- minimizable windows file -->
        
<div class="row" id="minimizedWindowsContainer">
    <div class="col-xs-11" >
        <span id="mainMenuMinimize" class="draggableWindow minimizedWindow">
            Base Layers
            <a class="btn btn-default btn-xs " href="#" 
               onclick="minimizeWindow('mainMenuParent','mainMenuMinimize')"> 
                <i class="glyphicon glyphicon-resize-full "></i></a>

        </span>                
        <span id="calendarsMinimize" class="draggableWindow minimizedWindow">
            Calendars
            <a class="btn btn-default btn-xs " href="#" 
                onclick="minimizeWindow('CalendarsAndStopContainer','calendarsMinimize')"> 
                <i class="glyphicon glyphicon-resize-full "></i></a>
        </span>                
        <span id="optionalsMinimize" class="draggableWindow minimizedWindow">
            Optional Layers
            <a class="btn btn-default btn-xs " href="#" 
                onclick="minimizeWindow('optionalMenuParent','optionalsMinimize')" >
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

        <span id="exportPngHover" class="commonHover">
            TODO BUILD PNG lang text
        </span>

    </body>
</html>


