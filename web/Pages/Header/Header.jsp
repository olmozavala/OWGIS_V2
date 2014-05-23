<%-- 
    Document   : Header
    Created on : Aug 3, 2012, 5:45:27 PM
    Author     : olmozavala
--%>

<%-- 
    This page contains all the links to the CSS, and the javascript 
--%>
		<link rel="icon" href="${basepath}/common/images/icon/PageIcon.ico" type="image/x-icon" />
        <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
        <meta name="Description" content="OWGIS Template" />
        <meta name="Keywords" content="OWGIS " />

        <!-- Jquery -->
		<!--<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>-->
		<!--<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js"></script>-->
		<script src="${basepath}/common/JS/vendor/jquery.min.js"></script>
		<script src="${basepath}/common/JS/vendor/jquery-ui.min.js"></script>
        <!-- End Jquery -->

        <!-- Bootstrap -->
		<!--<link href="//netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap.min.css" rel="stylesheet" type="text/css"/>-->
		<!--<script src="//netdna.bootstrapcdn.com/bootstrap/3.0.0/js/bootstrap.min.js"></script>-->
		<link href="${basepath}/common/CSS/vendor/bootstrap.min.css" rel="stylesheet" type="text/css"/>
		<script src="${basepath}/common/JS/vendor/bootstrap.min.js"></script>
        <!-- End Bootstrap -->

		<link href="${basepath}/common/CSS/Calendars.css" rel="stylesheet" type="text/css"/>
		<link href="${basepath}/common/CSS/MapInstructions.css" rel="stylesheet" type="text/css"/>
		<link href="${basepath}/common/CSS/GeneralStyles.css" rel="stylesheet" type="text/css"/>
        <link href="${basepath}/common/CSS/Buttons.css" rel="stylesheet" type="text/css"/>
        <link href="${basepath}/common/CSS/Elevation.css" rel="stylesheet" type="text/css"/>
        <link href="${basepath}/common/CSS/BaseLayers.css" rel="stylesheet" type="text/css"/>
        <link href="${basepath}/common/CSS/Palettes.css" rel="stylesheet" type="text/css"/>
		<link href="${basepath}/common/CSS/Popup.css" rel="stylesheet" type="text/css"/>
		<link href="${basepath}/common/CSS/cqlFilter.css" rel="stylesheet" type="text/css"/>
		<link href="${basepath}/common/CSS/OptionalLayersMenu.css" rel="stylesheet" type="text/css"/>
		<link href="${basepath}/common/CSS/MenuOptions.css" rel="stylesheet" type="text/css"/>
		<link href="${basepath}/common/CSS/MinimizedWindows.css" rel="stylesheet" type="text/css"/>
		<link href="${basepath}/common/CSS/Animations.css" rel="stylesheet" type="text/css"/>
              
        <link href="${basepath}/common/CSS/calendar/jscal2.css" rel="stylesheet" type="text/css"/>
        <link href="${basepath}/common/CSS/calendar/border-radius.css" rel="stylesheet" type="text/css"/>
        <link href="${basepath}/common/CSS/calendar/reduce-spacing.css" rel="stylesheet" type="text/css"/>
        <link href="${basepath}/common/CSS/calendar/steel/steel.css" rel="stylesheet" type="text/css"/>

		<!--Specific for OpenLayers3 -->
		<!--<link rel="stylesheet" href="http://ol3js.org/en/master/css/ol.css" />-->
		<link rel="stylesheet" href="./common/CSS/ol.css" />
		<link href="${basepath}/common/CSS/Ol3.css" rel="stylesheet" type="text/css"/>
		<!--Specific for OpenLayers3 -->

        <script type="text/javascript" src="${basepath}/common/JS/calendar/jscal2.js"></script>
        <script type="text/javascript" src="${basepath}/common/JS/calendar/lang/en.js"></script>

		<script type="text/javascript" src="${basepath}/common/JS/src/mapDisplay/InterfaceDependent.js"> </script>

		<!--OpenLayers 3 Management -->
		<script type="text/javascript" src="${basepath}/common/JS/src/ol3/OpenLayersRelated.js"> </script>
		<!--OpenLayers 3 Management -->

		<!--NcWMS related-->
		<script type="text/javascript" src="${basepath}/common/JS/src/ncwms/animations/Calendars.js"> </script>
		<script type="text/javascript" src="${basepath}/common/JS/src/ncwms/Elevation.js"> </script>
		<!--NcWMS related-->

		<!--Menus related-->
		<script src="${basepath}/common/JS/src/menus/MenuPositions.js"> </script>
		<script src="${basepath}/common/JS/src/menus/OptionalLayersMenu.js"> </script>
        <script src="${basepath}/common/JS/src/menus/HelpInstructions.js"> </script>
		<!--Menus related-->
		
        <script src="${basepath}/common/JS/src/utilities/validation.js"> </script>
        <script src="${basepath}/common/JS/src/ajax/ajax.js"> </script>
		<script src="${basepath}/common/JS/src/mapDisplay/CQL.js"> </script>
		<script src="${basepath}/common/JS/src/mapDisplay/VisualizationTools.js"> </script>
		<script src="${basepath}/common/JS/src/mapDisplay/ExportPng.js"> </script>

		<!--Debug mode-->
		<script src="http://resources.programmingclosure.com/closure-lite.js"></script>
		<script src="${basepath}/common/JS/vendor/closure/goog/base.js"> </script>
		<script src="${basepath}/common/JS/vendor/ol.js"></script>
		<script src="${basepath}/common/JS/src/ncwms/Transect.js"> </script>
		<script src="${basepath}/common/JS/src/utilities/utilities.js"> </script>
		<script src="${basepath}/common/JS/src/ncwms/animations/Animations.js"> </script>
		<script src="${basepath}/common/JS/src/ol3/mainLayers.js"> </script>
		<script src="${basepath}/common/JS/src/ol3/MainOl3.js"> </script>
		<script src="${basepath}/common/JS/src/main/mapDisplay.js"> </script>
		<script src="${basepath}/common/JS/src/ncwms/Palettes.js"> </script>
		<!--Debug mode-->

		<!-- Production mode -->
		<!--<script type="text/javascript" src="common/JS/compiled/script.js"></script>--> 
		<!-- Production mode -->
        <title><fmt:message key="header.title" /></title>
