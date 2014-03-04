/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var layerDetails = ${layerDetails}; //layer details such as title, server, ect in a json object. 
var mainLayer = '${mainLayer}'; //main layer title
var mappalette = '${palette}'; // palette color
var paletteUrl = '${paletteUrl}'; //palette server url
var basepath = '${basepath}'; //url base path ex:/DeepCProject
var lay_style = '${style}'; //layer color style, part of the url to request the pallete.
var map; //map variable that contains the OpenLayers map
var ol3view;//View that contains the map

// This variables are used by JavaScript to control de interface. 
var netcdf = ${netcdf}; //true if layer displayed is netcdf, false otherwise
var mobile = ${mobile}; // check to see if we are in mobile version
var _mainlayer_multipleDates = false;// Indicates if the main layer has multiple dates
var _mainlayer_zaxisCoord = false;// Indicates if the main layer has a z-axis coordinate

//minPalVal = layerDetails.scaleRange[0];
//maxPalVal = layerDetails.scaleRange[1];
var max_time_range = '${max_time_range}'; //calendar time range
var idx_main_layer = '${idx_main_layer}';// What is the index of the main layer (depending on the number of background layers)
var mapConfig = ${mapConfig}; //configurations such as resolution, size, zoom levels, etc...
var transectOn = false; //boolean for transect tool if the netcdf has the option or not
var currentZoom = 0; //This variable is used to avoid removing the 'Loading' text after zooming into the map (When an animation is been loading)
var cql_cols = '${cqlcols}'; // Set of columns that can be filtered by CQL
var cqlFilter = ${cqlfilter}; //Indicates if the base layer uses CQL filtering
var _map_projection = mapConfig.mapProjection;// This is the default map projection
var _map_bk_layer = mapConfig.backgroundLayer;// This is the background layer we are using

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
