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
	<link href="./common/CSS/vendor/jquery-ui.min.css" rel="stylesheet" type="text/css"/>
	<link href="./common/CSS/vendor/bootstrap.min.css" rel="stylesheet" type="text/css"/>
	<link href="./common/CSS/vendor/ol.css" rel="stylesheet"  type="text/css"/>
	<!--<link href="./common/CSS/vendor/minimized/dd.css" rel="stylesheet" type="text/css"/>-->
	<c:if test='${currents}'>
		<link href="./common/CSS/vendor/bootstrap-colorpicker.min.css" rel="stylesheet" type="text/css"/>
	</c:if>

	<!--Internal CSS -->
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
	<link href="./common/CSS/Ol3.css" rel="stylesheet" type="text/css"/>

	<!--External JS -->
	<script src="./common/JS/vendor/minimized/jquery-2.1.4.min.js"></script>
	<script src="./common/JS/vendor/minimized/jquery-ui.min.js"></script>
	<script src="./common/JS/vendor/minimized/underscore-min.js"></script>
	<script src="./common/JS/vendor/minimized/backbone-min.js"></script>
	<script src="./common/JS/vendor/minimized/d3.min.js"></script>
	<script src="./common/JS/vendor/minimized/ol.js"></script>
	<c:if test='${currents}'>
		<script src="./common/JS/vendor/minimized/bootstrap-colorpicker.min.js"></script>
	</c:if>
	<script>
		//			It is used to avoid conflicts with Bootstrap Tooltip
		$.widget.bridge('uitooltip', $.ui.tooltip);
	</script>
	<script src="./common/JS/vendor/minimized/bootstrap.min.js"></script>

	<!--Missing closure compiler-->
	<script src="./common/JS/src/ncwms/Elevation.js"> </script>
	<script src="./common/JS/src/utilities/validation.js"> </script>
	<script src="./common/JS/src/features/VisualizationTools.js"> </script>
	<script src="./common/JS/src/features/ExportPng.js"> </script>

	<!-- Production mode -->
	<script type="text/javascript" src="common/JS/compiled/compiled.js"></script> 
	<!-- Production mode -->
	<title><fmt:message key="header.title" /></title>