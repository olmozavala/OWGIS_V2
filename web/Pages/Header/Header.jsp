<%@include file="CommonHeader.jsp" %>  
<!--External JS -->
<%@include file="ExternalJS.jsp" %>  

	<!--Internal JS-->
	<!--Missing Closure library-->
	<script src="./common/JS/src/utilities/validation.js"> </script>
	<script src="./common/JS/src/features/VisualizationTools.js"> </script>
	<script src="./common/JS/src/features/ExportPng.js"> </script>

	<!-- Production mode -->
	<script type="text/javascript" src="common/JS/compiled/compiled.js"></script> 
        <script src="./common/JS/src/features/PunctualData.js"> </script>
	<!-- Production mode -->
	<title><fmt:message key="header.title" /></title>