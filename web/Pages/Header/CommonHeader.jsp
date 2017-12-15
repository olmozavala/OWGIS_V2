<%-- 
    Document   : Header
    Created on : Sept 17, 2015, 5:45:27 PM
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
                <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" type="text/css">
	</c:if>
	<!--this is the Desktop case-->
	<c:if test='${!mobile}'>
		<link href="./common/CSS/vendor/bootstrap.min.css" rel="stylesheet" type="text/css"/>
		<link href="./common/CSS/vendor/jquery-ui.min.css" rel="stylesheet" type="text/css"/>
		<link href="./common/CSS/Calendars.css" rel="stylesheet" type="text/css"/>
		<link href="./common/CSS/OptionalLayersMenu.css" rel="stylesheet" type="text/css"/>
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
	<link href="./common/CSS/Error.css" rel="stylesheet" type="text/css"/>

