<%-- 
    Document   : Header
    Created on : Aug 3, 2012, 5:45:27 PM
    Author     : Olmo Zavala-Romero
--%>

<%-- 
    This page contains all the links to the CSS, and the javascript 
--%>
		<link rel="icon" href="./common/images/icon/PageIcon.ico" type="image/x-icon" />
        <meta charset="utf-8"  />
        <meta name="Description" content="OWGIS Template" />
        <meta name="Keywords" content="OWGIS " />

        <!-- Jquery -->
		<script src="./common/JS/vendor/jquery-2.1.1.min.js"></script>
		<script src="./common/JS/vendor/jquery-ui-1.11.1/jquery-ui.min.js"></script>
		<link href="./common/JS/vendor/jquery-ui-1.11.1/jquery-ui.min.css" rel="stylesheet" type="text/css"/>
		
        <!-- End Jquery -->
        <script>
//			It is used to avoid conflicts with Bootstrap Tooltip
			$.widget.bridge('uitooltip', $.ui.tooltip);
		</script>
        <!-- Bootstrap -->
		<!--<link href="//netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap.min.css" rel="stylesheet" type="text/css"/>-->
		<!--<script src="//netdna.bootstrapcdn.com/bootstrap/3.0.0/js/bootstrap.min.js"></script>-->
		<link href="./common/CSS/vendor/bootstrap.min.css" rel="stylesheet" type="text/css"/>
		<script src="./common/JS/vendor/bootstrap.min.js"></script>
        <!-- End Bootstrap -->

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
		<link href="./common/CSS/HomePage.css" rel="stylesheet" type="text/css"/>
		<link href="./common/CSS/TopMenu.css" rel="stylesheet" type="text/css"/>

		<!--Specific for Images in Dropdown for locale-->
		<link href="./common/CSS/vendor/dd.css" rel="stylesheet" type="text/css"/>


		<!--Specific for OpenLayers3 -->
		<!--<link rel="stylesheet" href="http://ol3js.org/en/master/css/ol.css" />-->
		<link rel="stylesheet" href="./common/CSS/ol.css" />
		<link href="./common/CSS/Ol3.css" rel="stylesheet" type="text/css"/>
		<!--Specific for OpenLayers3 -->

		<!--NcWMS related-->
		<script type="text/javascript" src="./common/JS/src/ncwms/Elevation.js"> </script>
		<!--NcWMS related-->

        <script src="./common/JS/src/utilities/validation.js"> </script>
        <script src="./common/JS/src/features/VisualizationTools.js"> </script>
        <script src="./common/JS/src/global/Globals.js"> </script>

		<!-- Production mode -->
		<script type="text/javascript" src="common/JS/compiled/compiled.js"></script> 
		<!-- Production mode -->
        <title><fmt:message key="header.title" /></title>
