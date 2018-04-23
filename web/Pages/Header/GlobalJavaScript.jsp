<%-- 
    Document   : GlobalJavaScripls
    Created on : Aug 3, 2012, 5:48:28 PM
    Author     : Olmo Zavala-Romero
--%>
<script type="text/javascript"  >
	var layerDetails = ${layerDetails}; //layer details such as title, server, ect in a json object. 
	var mainLayer = '${mainLayer}'; //main layer title
	var mappalette = '${palette}'; // palette color
	var _paletteUrl = '${paletteUrl}'; //palette server url
	var basepath = "/"+window.location.pathname.split("/")[1]; //url base path
	var lay_style = '${style}'; //layer color style, part of the url to request the pallete.
	var map = 'empty map'; //map variable that contains the OpenLayers map
	var ol3view;//View that contains the map
	var _cesium; //Cesium container

    // This variables are used by JavaScript to control de interface. 
	var netcdf = ${ncwms}; //true if layer displayed is netcdf, false otherwise
	var mobile = ${mobile}; // check to see if we are in mobile version
    var _mainlayer_multipleDates = ${multipleDates};// Indicates if the main layer has multiple dates
    var _mainlayer_zaxisCoord = false;// Indicates if the main layer has a z-axis coordinate

	if(layerDetails.zaxis){//We first need to test this part (underscore not available yet) 
		if(layerDetails.zaxis.values.length){//Indicates we do have zaxis information
		_mainlayer_zaxisCoord = true;
		}
	}

    var _mainlayer_streamlines = layerDetails.overlayStreamlines;// Indicates if the main layer has 'currents' layer information

		//minPalVal = layerDetails.scaleRange[0];
		//maxPalVal = layerDetails.scaleRange[1];
	var max_time_range = '${max_time_range}'; //calendar time range
	var _id_first_main_layer = '${_id_first_main_layer}';// What is the index of the main layer (depending on the number of background layers)
	var mapConfig = ${mapConfig}; //configurations such as resolution, size, zoom levels, etc...
	var currentZoom = 0; //This variable is used to avoid removing the 'Loading' text after zooming into the map (When an animation is been loading)
	var cql_cols = '${cqlcols}'; // Set of columns that can be filtered by CQL
	var cqlFilter = ${cqlfilter}; //Indicates if the base layer uses CQL filtering
    var _map_projection = mapConfig.mapProjection;// This is the default map projection
    var _map_bk_layer = '${backgroundLayer}';// This is the background layer we are using
	var _curr_language = '${language}';

	// For popup
	var ol_popup = null;
	var popup_container;
	var pup_content;
	var popup_closer;
	
	//Possible text for zaxis
	var depthText = "<fmt:message key='ncwms.depth' />";
	var presText = "<fmt:message key='ncwms.pres' />";
	var hideCal = "<fmt:message key='ncwms.cal.hide'/>";
	var showCal = "<fmt:message key='ncwms.cal.show'/>";
	var unselectTransect = "<fmt:message key='ncwms.transect.hide'/>";
	var transect = "<fmt:message key='ncwms.transect'/>";
	
	//resolutions
	var resolutionGlob = "<fmt:message key='ncwms.resolution'/>";
	var resolutionHigh = "<fmt:message key='ncwms.resolutionHigh'/>";
	var resolutionMiddle = "<fmt:message key='ncwms.resolutionMiddle'/>";
	var resolutionLow = "<fmt:message key='ncwms.resolutionLow'/>";
	
	// Show exceptions that can be managed by OWGIS as warnings
	var warningText = '${warningText}';
	var warningInfo = '${warningInfo}';

	//calendar date format
	var dateFormat = "yy-mm-dd"; 
</script>
