<%-- 
    Document   : Header
    Created on : Aug 3, 2012, 5:45:27 PM
    Author     : Olmo Zavala-Romero
--%>

	
<%@include file="CommonHeader.jsp" %>  

<!--External JS Debug -->
<script src="./common/JS/vendor/debug/closure-lite.js"></script>
<script src="./common/JS/vendor/minimized/ol3cesium.js"></script>

<%@include file="ExternalJS.jsp" %>  

<!--Internal JS-->
<!--Missing Closure library-->
<script src="./common/JS/src/utilities/validation.js"> </script>
<script src="./common/JS/src/features/VisualizationTools.js"> </script>
<script src="./common/JS/src/features/ExportPng.js"> </script>
		
<!--Using closure library-->
<script src="./common/JS/src/warning/ErrorTexts.js"> </script>
<script src="./common/JS/src/warning/ErrorPopover.js"> </script>
<script src="./common/JS/src/utilities/MathAndGeo.js"> </script>
<script src="./common/JS/src/cesium/CesiumOwgis.js"> </script>
<script src="./common/JS/src/ncwms/Elevation.js"> </script>
<script src="./common/JS/src/ncwms/Transect.js"> </script>
<script src="./common/JS/src/ncwms/animations/AnimationStatus.js"> </script>
<script src="./common/JS/src/utilities/utilities.js"> </script>
<script src="./common/JS/src/utilities/constants.js"> </script>
<script src="./common/JS/src/ogcstandards/ogcstandards.js"> </script>
<script src="./common/JS/src/ol3/mainLayers.js"> </script>
<script src="./common/JS/src/ol3/backgroundLayers.js"> </script>
<script src="./common/JS/src/ol3/MainOl3.js"> </script>
<script src="./common/JS/src/ol3/PopUp.js"> </script>
<script src="./common/JS/src/helpTexts/MainHelp.js"> </script>
<script src="./common/JS/src/helpTexts/Tooltips.js"> </script>
<script src="./common/JS/src/languages/Languages.js"> </script>
<script src="./common/JS/src/dynamicVector/VectorStyles.js"> </script>
<script src="./common/JS/src/features/OptionalLayers.js"> </script>
<script src="./common/JS/src/features/InterfaceDependent.js"> </script>
<script src="./common/JS/src/features/CQL.js"> </script>
<script src="./common/JS/src/features/PunctualData.js"> </script>
<script src="./common/JS/src/layouts/draggableWindows/WindowPositions.js"> </script>
<script src="./common/JS/src/layouts/draggableWindows/NavBar.js"> </script>
<script src="./common/JS/src/main/layer.js"> </script>
<script src="./common/JS/src/ncwms/streamlines/NcWMSTwo.js"> </script>

<!--This require some libraries defined above-->
<script src="./common/JS/src/ncwms/streamlines/particles.js"> </script>
<script src="./common/JS/src/ncwms/streamlines/StreamlinesStyle.js"> </script>
<script src="./common/JS/src/ncwms/streamlines/AnimationStreamlines.js"> </script>

<!--this is the Desktop case-->
<c:if test='${mobile}'>
	<script src="./common/JS/src/mobile/Mobile.js"></script>
</c:if>
		
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