<%-- 
    Document   : Header
    Created on : Aug 3, 2012, 5:45:27 PM
    Author     : olmozavala
--%>

<%-- 
    This page contains all the links to the CSS, and the javascript 
--%>
		<link rel="icon" href="./common/images/icon/PageIcon.ico" type="image/x-icon" />
        <meta charset="utf-8"  />
        <meta name="Description" content="OWGIS Template" />
        <meta name="Keywords" content="OWGIS " />

        <!-- jQuery -->
		<script src="./common/JS/vendor/jquery-2.1.1.min.js"></script>
		<script src="./common/JS/vendor/jquery-ui-1.11.1/jquery-ui.min.js"></script>
		<link href="./common/JS/vendor/jquery-ui-1.11.1/jquery-ui.min.css" rel="stylesheet" type="text/css"/>
        <!-- End jQuery -->

		<!-- Leaflet -->
		<link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.5.1/leaflet.css">
		<script src="http://cdn.leafletjs.com/leaflet-0.5.1/leaflet.js"></script>
		<!-- End Leaflet -->

        <!-- jQuery Mobile -->
        <link rel="stylesheet" href="http://code.jquery.com/mobile/1.4.2/jquery.mobile-1.4.2.min.css" />
		<script	src="http://code.jquery.com/mobile/1.4.2/jquery.mobile-1.4.2.min.js"></script>
        <!-- End jQuery Mobile -->
				
		<!--Specific for Images in Dropdown for locale-->		
		<script src="./common/JS/vendor/jquery.dd.min.js"></script>
		<script src="./common/JS/vendor/jquery.slidePanel.js"></script>

        <script>
		$.widget.bridge('uitooltip', $.ui.tooltip);
		</script>
        <!-- Bootstrap -->
		<!--<link href="//netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap.min.css" rel="stylesheet" type="text/css"/>-->
		<!--<script src="//netdna.bootstrapcdn.com/bootstrap/3.0.0/js/bootstrap.min.js"></script>-->
		<link href="./common/CSS/vendor/bootstrap.min.css" rel="stylesheet" type="text/css"/>
		<script src="./common/JS/vendor/bootstrap.min.js"></script>
        <!-- End Bootstrap -->

		<link href="./common/CSS/MobileCSS/MStyles.css" rel="stylesheet" type="text/css"/>

		<link href="./common/CSS/MobileCSS/MBaseLayers.css" rel="stylesheet" type="text/css"/>
		<link href="./common/CSS/MobileCSS/MControlDrawer.css" rel="stylesheet" type="text/css"/>
		<link href="./common/CSS/MobileCSS/MOptionalLayers.css" rel="stylesheet" type="text/css"/>
		<link href="./common/CSS/MobileCSS/MPanels.css" rel="stylesheet" type="text/css"/>
		<link href="./common/CSS/Calendars.css" rel="stylesheet" type="text/css"/>		
		<link href="./common/CSS/MapInstructions.css" rel="stylesheet" type="text/css"/>
		<link href="./common/CSS/GeneralStyles.css" rel="stylesheet" type="text/css"/>
        <link href="./common/CSS/Buttons.css" rel="stylesheet" type="text/css"/>
        <link href="./common/CSS/Elevation.css" rel="stylesheet" type="text/css"/>
        <link href="./common/CSS/BaseLayers.css" rel="stylesheet" type="text/css"/>
        <link href="./common/CSS/Palettes.css" rel="stylesheet" type="text/css"/>
		<link href="./common/CSS/Popup.css" rel="stylesheet" type="text/css"/>
		<link href="./common/CSS/cqlFilter.css" rel="stylesheet" type="text/css"/>
		<link href="./common/CSS/OptionalLayersMenu.css" rel="stylesheet" type="text/css"/>
		<link href="./common/CSS/MenuOptions.css" rel="stylesheet" type="text/css"/>
		<link href="./common/CSS/MinimizedWindows.css" rel="stylesheet" type="text/css"/>
		<link href="./common/CSS/Animations.css" rel="stylesheet" type="text/css"/>
		<link href="./common/CSS/Locale.css" rel="stylesheet" type="text/css"/>

		<!--Specific for Images in Dropdown for locale-->
		<link href="./common/CSS/vendor/dd.css" rel="stylesheet" type="text/css"/>


		<!--Specific for OpenLayers3 -->
		<!--<link rel="stylesheet" href="http://ol3js.org/en/master/css/ol.css" />-->
		<link rel="stylesheet" href="./common/CSS/ol.css" />
		<link href="./common/CSS/Ol3.css" rel="stylesheet" type="text/css"/>
		<!--Specific for OpenLayers3 -->

		<script type="text/javascript" src="./common/JS/src/mapDisplay/InterfaceDependent.js"> </script>

		<!--OpenLayers 3 Management -->
		<script type="text/javascript" src="./common/JS/src/ol3/OpenLayersRelated.js"> </script>
		<!--OpenLayers 3 Management -->

		<!--NcWMS related-->
		<script type="text/javascript" src="./common/JS/src/ncwms/animations/Calendars.js"> </script>
		<script type="text/javascript" src="./common/JS/src/ncwms/Elevation.js"> </script>
		<!--NcWMS related-->

		<!--Menus related-->
		<script src="./common/JS/src/menus/MenuPositions.js"> </script>
		<script src="./common/JS/src/menus/OptionalLayersMenu.js"> </script>
        <script src="./common/JS/src/menus/HelpInstructions.js"> </script>
		<!--Menus related-->
		
        <script src="./common/JS/src/utilities/validation.js"> </script>
		<script src="./common/JS/src/mapDisplay/CQL.js"> </script>
		<script src="./common/JS/src/mapDisplay/VisualizationTools.js"> </script>
		<script src="./common/JS/src/mapDisplay/ExportPng.js"> </script>

		<!--Debug mode-->
		<script src="http://resources.programmingclosure.com/closure-lite.js"></script>
		<!--<script src="./common/JS/vendor/closure/goog/base.js"> </script>-->
		<script src="./common/JS/vendor/ol.js"></script>
		<script src="./common/JS/src/ncwms/Transect.js"> </script>
		<script src="./common/JS/src/utilities/utilities.js"> </script>
		<script src="./common/JS/src/ncwms/animations/Animations.js"> </script>
		<script src="./common/JS/src/ol3/mainLayers.js"> </script>
		<script src="./common/JS/src/ol3/MainOl3.js"> </script>
		<script src="./common/JS/src/main/mapDisplay.js"> </script>
		<script src="./common/JS/src/helpTexts/helpTexts.js"> </script>
		<script src="./common/JS/src/ncwms/Palettes.js"> </script>
		<script src="./common/JS/src/ogcstandards/ogcstandards.js"> </script>
        <script src="./common/JS/src/ajax/ajax.js"> </script>
		<script src="./common/JS/src/dynamicVector/VectorStyles.js"> </script>
		<script src="./common/JS/src/dynamicVector/DynamicVectorLayers.js"> </script>
		<!--Debug mode-->

<!-- Testing putpose .. to be removed later -->
<%-- 		<script src="./common/JS/script.js"></script> --%>
<!-- Testing putpose .. to be removed later -->
		

		
		<!-- Production mode -->
        <title><fmt:message key="header.title" /></title>
