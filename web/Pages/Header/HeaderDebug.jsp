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

	<!--External CSS -->
	<link href="./common/CSS/vendor/ol.css" rel="stylesheet"  type="text/css"/>
	<c:if test='${currents}'>
		<link href="./common/CSS/vendor/spectrum.css" rel="stylesheet" type="text/css"/>
	</c:if>

	<!--This is the mobile case-->
	<c:if test='${mobile}'>
		<link href="./common/CSS/vendor/jquery.mobile-1.4.5.min.css"  rel="stylesheet"/>
		<link href="./common/CSS/vendor/jqm-icon-pack-fa-modified.css"  rel="stylesheet"/>
		<link href="./common/CSS/vendor/jquery-ui.min.css" rel="stylesheet" type="text/css"/>
		<link href="./common/CSS/MobileSCSS/MobStyles.css" rel="stylesheet" type="text/css"/>
		<link href="./common/CSS/MobileSCSS/MAnimations.css" rel="stylesheet" type="text/css"/>
		<link href="./common/CSS/MobileSCSS/MBaseLayers.css" rel="stylesheet" type="text/css"/>
		<link href="./common/CSS/MobileSCSS/MControlDrawer.css" rel="stylesheet" type="text/css"/>
		<link href="./common/CSS/MobileSCSS/MOptionalLayers.css" rel="stylesheet" type="text/css"/>
		<link href="./common/CSS/MobileSCSS/MPanels.css" rel="stylesheet" type="text/css"/>
		<link href="./common/CSS/MobileSCSS/MElevation.css" rel="stylesheet" type="text/css"/>
		<link href="./common/CSS/vendor/dd.css" rel="stylesheet" type="text/css"/>
	</c:if>
	<!--this is the Desktop case-->
	<c:if test='${!mobile}'>
		<link href="./common/CSS/vendor/bootstrap.min.css" rel="stylesheet" type="text/css"/>
		<link href="./common/CSS/Calendars.css" rel="stylesheet" type="text/css"/>
		<link href="./common/CSS/OptionalLayersMenu.css" rel="stylesheet" type="text/css"/>
		<link href="./common/CSS/vendor/jquery-ui.min.css" rel="stylesheet" type="text/css"/>
		<link href="./common/CSS/Elevation.css" rel="stylesheet" type="text/css"/>
		<link href="./common/CSS/Animations.css" rel="stylesheet" type="text/css"/>
	</c:if>

	<!--Internal CSS -->
	<link href="./common/CSS/MapInstructions.css" rel="stylesheet" type="text/css"/>
	<link href="./common/CSS/GeneralStyles.css" rel="stylesheet" type="text/css"/>
	<link href="./common/CSS/Buttons.css" rel="stylesheet" type="text/css"/>
	<link href="./common/CSS/BaseLayers.css" rel="stylesheet" type="text/css"/>
	<link href="./common/CSS/Palettes.css" rel="stylesheet" type="text/css"/>
	<link href="./common/CSS/Popup.css" rel="stylesheet" type="text/css"/>
	<link href="./common/CSS/cqlFilter.css" rel="stylesheet" type="text/css"/>
	<link href="./common/CSS/MenuOptions.css" rel="stylesheet" type="text/css"/>
	<link href="./common/CSS/MinimizedWindows.css" rel="stylesheet" type="text/css"/>
	<link href="./common/CSS/Locale.css" rel="stylesheet" type="text/css"/>
	<link href="./common/CSS/HomePage.css" rel="stylesheet" type="text/css"/>
	<link href="./common/CSS/TopMenu.css" rel="stylesheet" type="text/css"/>
	<link href="./common/CSS/Ol3.css" rel="stylesheet" type="text/css"/>
	<link href="./common/CSS/Currents.css" rel="stylesheet" type="text/css"/>

	<!--External JS -->
	<!--Debug mode-->
	<script src="./common/JS/vendor/debug/closure-lite.js"></script>

	<script src="./common/JS/vendor/minimized/jquery-2.1.4.min.js"></script>
	<script src="./common/JS/vendor/minimized/underscore-min.js"></script>
	<script src="./common/JS/vendor/minimized/backbone-min.js"></script>
	<script src="./common/JS/vendor/minimized/d3.min.js"></script>
	<script src="./common/JS/vendor/minimized/ol.js"></script>
	<c:if test='${currents}'>
		<script src="./common/JS/vendor/minimized/spectrum.min.js"></script>
	</c:if>
	<!--Cesium and Ol3 TODO should be loaded on demand only-->

	<!--Internal JS-->
	<!--Missing Closure library-->
	<script src="./common/JS/src/utilities/validation.js"> </script>
	<script src="./common/JS/src/features/VisualizationTools.js"> </script>
	<script src="./common/JS/src/features/ExportPng.js"> </script>

	<!--this is the Mobile case-->
	<c:if test='${mobile}'>
		<script src="./common/JS/vendor/minimized/jquery.mobile.min.js"></script>
		<script src="./common/JS/vendor/minimized/jquery.slidePanel.js"></script>
		<script src="./common/JS/vendor/minimized/jquery_ui_datepicker/jquery-ui.min.js"></script>
		<script src="./common/JS/src/mobile/Mobile.js"> </script>
	</c:if>
	<!--this is the Desktop case-->
	<c:if test='${!mobile}'>
		<script src="./common/JS/vendor/minimized/jquery-ui.min.js"></script>
		<script> $.widget.bridge('uitooltip', $.ui.tooltip); </script>	
		<script src="./common/JS/vendor/minimized/bootstrap.min.js"></script>
	</c:if>

	<!--Using closure library-->
	<script src="./common/JS/src/ncwms/Elevation.js"> </script>
	<script src="./common/JS/src/ncwms/Transect.js"> </script>
	<script src="./common/JS/src/ncwms/animations/AnimationStatus.js"> </script>
	<script src="./common/JS/src/utilities/utilities.js"> </script>
	<script src="./common/JS/src/utilities/constants.js"> </script>
	<script src="./common/JS/src/ogcstandards/ogcstandards.js"> </script>
	<script src="./common/JS/src/ol3/mainLayers.js"> </script>
	<script src="./common/JS/src/ol3/MainOl3.js"> </script>
	<script src="./common/JS/src/ol3/PopUp.js"> </script>
	<script src="./common/JS/src/helpTexts/MainHelp.js"> </script>
	<script src="./common/JS/src/helpTexts/Tooltips.js"> </script>
	<script src="./common/JS/src/languages/Languages.js"> </script>
	<script src="./common/JS/src/dynamicVector/VectorStyles.js"> </script>
	<script src="./common/JS/src/features/OptionalLayers.js"> </script>
	<script src="./common/JS/src/features/InterfaceDependent.js"> </script>
	<script src="./common/JS/src/features/CQL.js"> </script>
	<script src="./common/JS/src/layouts/draggableWindows/WindowPositions.js"> </script>
	<script src="./common/JS/src/layouts/draggableWindows/NavBar.js"> </script>
	<script src="./common/JS/src/main/layer.js"> </script>
		
	<!--This require some libraries defined above-->
	<script src="./common/JS/src/ncwms/currents/particles.js"> </script>
	<script src="./common/JS/src/ncwms/currents/CurrentsStyle.js"> </script>
	<script src="./common/JS/src/ncwms/currents/AnimationCurrents.js"> </script>

	<!--This require some libraries defined above-->
	<script src="./common/JS/src/features/Transparency.js"> </script>
	<script src="./common/JS/src/ajax/ajax.js"> </script>
	<script src="./common/JS/src/ncwms/animations/Animations.js"> </script>
	<script src="./common/JS/src/features/KML.js"> </script>
	<script src="./common/JS/src/ncwms/animations/Calendars.js" > </script>
	<script src="./common/JS/src/ncwms/Palettes.js"> </script>
	<script src="./common/JS/src/dynamicVector/DynamicVectorLayers.js"> </script>
		
	<script src="./common/JS/src/main/mapDisplay.js"> </script>
		
	<title><fmt:message key="header.title" /></title>