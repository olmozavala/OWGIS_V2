<%-- 
This is the main jsp file that forms the html webpage. It contains the skeleton of the html application. 
--%>

<%@page pageEncoding="UTF-8"%>
<%@ taglib prefix="menuHelper" uri="/WEB-INF/TLD/htmlStaticFunctions.tld" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"  %>
<jsp:useBean id="names" class="com.mapviewer.model.PagesNames" scope="page"> </jsp:useBean>
<jsp:useBean id="globals" class="com.mapviewer.model.Globals" scope="page"> </jsp:useBean>
	
	<!--This part is used to change the texts depending on the language of the user browser-->
<fmt:setLocale value="${language}"/>
<fmt:setBundle basename="com.mapviewer.messages.text" />

<!DOCTYPE HTML>
<html xmlns="http://www.w3.org/1999/xhtml" lang="${language}">
    <head>
        <%@include file="Header/GlobalJavaScript.jsp" %> <%-- Sets all the javascript global variables that are initiated by the java application --%>
		<!--contains all the css links and javascript links--> 
        <%@include file="Header/HeaderDebug.jsp" %>  
        <%--<%@include file="Header/Header.jsp" %>--%>  
		<!--<meta name="apple-mobile-web-app-capable" content="yes">-->
		<title><fmt:message key="header.title"/></title>
    </head>
	
    <body id="bodyClass" class="loadingCursor" >
		
		<%@include file="RequiredDivs.jsp" %> <%-- Contains the title of the layer and the div that hold the whole map --%>
        <form id="baseForm" class="form-inline" name="baseForm" action=".${names.acdmServlet}" method="post">
			<!--Features menu-->
			<%@include file="Layouts/Tools/TopMenu/NavBar.jsp" %> <%-- Sets all the javascript global variables that are initiated by the java application --%>
			<%@include file="Layouts/DraggableWindows/Layers/MainLayers.jsp" %> <%-- Main layers as draggable windows --%>
			<%@include file="Layouts/DraggableWindows/Layers/OptionalLayers.jsp" %> <%-- Optional layers as draggable windows --%>
			<%@include file="Layouts/DraggableWindows/HelpTexts/MapInstructions.jsp" %>  <%-- This page has all the calendars, the animaton divs  --%>
			
			<c:if test='${ncwms}'>
				<!--Canvas that contains the animations-->
				<canvas id="animationCanvas"></canvas>
				<c:if test='${currents}'>
					<!--Canvas that contain the currents-->
					<canvas id="currentsCanvas" > </canvas>
					<!-- Window with the custom styling for the currents -->
					<%@include file="Layouts/DraggableWindows/NcWMS/StreamLines.jsp" %>  <%-- This page has all the calendars, the animaton divs  --%>
				</c:if>

				<%@include file="Layouts/DraggableWindows/NcWMS/NcWMSOptions.jsp" %>  <%-- This page has all the calendars, the animaton divs  --%>
				<!-- Elevation -->
				<%@include file="Layouts/DraggableWindows/NcWMS/ZaxisSelection.jsp" %>  <%-- This page has all the calendars, the animaton divs  --%>
				<!-- Current palette and color range -->
				<%@include file="Layouts/DraggableWindows/NcWMS/Palettes.jsp" %>  <%-- This page has all the calendars, the animaton divs  --%>
			</c:if>
			<c:if test='${cqlfilter}'>
				<!-- Floating CQL filter window -->
				<%@include file="Layouts/DraggableWindows/CQL/CQLFilter.jsp" %>  <%-- This page has all the calendars, the animaton divs  --%>
			</c:if>

			<input type="hidden" id="_locale" name="_locale" value="" />
			<input type="hidden" id="mobile" name="mobile" value="" />
			<input type="hidden" id="_locale" value="" />
				
			<%@include file="Footer/BottomFooter.jsp" %>
			<!-- minimizable windows file -->
			<%@include file="Options/MinimizeWindows.jsp" %>
			<%@include file="Error/ErrorPopup.jsp" %>
		</form>
			
		<script>
			${openLayerConfig}
				jQuery(document).ready(function() {
					owgisMain();
				});
		</script>
			
    </body>
</html>
