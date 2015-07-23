<%@ page pageEncoding="UTF-8"%>
<%@page errorPage="Error/ErrorPage.jsp"%>
<%@ taglib prefix="menuHelper" uri="/WEB-INF/TLD/htmlStaticFunctions.tld"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<jsp:useBean id="names" class="com.mapviewer.model.PagesNames" scope="page"> </jsp:useBean>
<jsp:useBean id="globals" class="com.mapviewer.model.Globals" scope="page"> </jsp:useBean>

<!--This part is used to change the texts depending on the language of the user browser-->
<fmt:setLocale value="${language}" />
<fmt:setBundle basename="com.mapviewer.messages.text" />
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
		<%@include file="Header/GlobalJavaScript.jsp"%>
		<%-- Sets all the javascript global variables that are initiated by the java application --%>
		<%@include file="Header/MHeader.jsp"%>
		<%-- contains all the css links and javascript links --%>
		<%@include file="Header/InitJSVariables.jsp"%>
		<%-- Sets all the javascript global variables that are initiated by the java application --%>
		<title></title>
	</head>
	<body>
		<div class="loader"></div>
		<div id="popup" class="ol-popup">
			<a href="#" id="popup-closer" class="ol-popup-closer"></a>
			<div id="popup-content"></div>
		</div>
		<%-- Contains the title of the layer and the div that hold the whole map --%>
		<form id="baseForm" class="form-inline" name="baseForm" action=".${names.acdmServlet}" method="post">

			<div data-role="page" id="home" data-theme="a">
				
				<%-- Left Panel for Map Tools --%>
				<div data-role="panel" id="navpanelleft" data-theme="a"	 data-display="overlay" data-position="left">
						<%@include file="Options/Mobile/MTools.jsp"%>
				</div>
				
				<%-- Right Panel for Main and Optional Layers --%>
				<div data-role="panel" id="navpanelright" data-theme="b"
					 data-display="overlay" data-position="right">
					<div data-role="fieldcontain" id="ulBaseLayers">
						<%@include file="Options/Mobile/MBaseLayers.jsp"%>
					</div>
					<div data-role="fieldcontain" id="optionalLayersWindow">
						<%@include file="Options/Mobile/MOptionalLayers.jsp"%>
					</div>
				</div>
				
				<!-- Buttons on the navbar  -->
				<div id="header" data-role="header" data-theme="b" data-fullscreen="true">
					<a id="bars-button_left" data-icon="bars" class="ui-btn-left" data-inline="true" href="#navpanelleft" style="line-height: 0.7em; height: 27px">Tools</a>
					<div data-type="horizontal" data-role="controlgroup" class="ui-btn-right">					
						<button id="selectedLanguage" type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" style="margin-right: 5px; height: 25px">
							<!--It gets initialized by languages.js-->
							</button>
							<ul id="langDropDown" class="dropdown-menu" role="menu">
							<!--It gets initialized by languages.js-->
							</ul>
						<a id="bars-button_right" data-role="button" data-icon="bars" href="#navpanelright" style="line-height: 0.7em; height: 27px">Layers</a>
					</div>
				</div>
				
				<div id="map"></div>
				<c:if test="${cqlfilter}">
					<%-- CQL Custom filter buttons and text field. --%>
					<%@include file="Options/Mobile/MCQLFilter.jsp" %> 
				</c:if>
				
				<c:if test='${netcdf}'>
				<%-- Color Palettes --%>
				<%@include file="Layouts/Mobile/MPalettes.jsp"%>
				
				<%-- Date Selection --%>
					<%@include file="Options/Mobile/MDateSelection.jsp"%>
				</c:if>
			</div><!-- Main page -->
			
			<c:if test='${netcdf}'>
			<%-- Animations --%>
				<%@include file="Options/Mobile/MAnimations.jsp"%>
			</c:if>
			<%-- Parameter set true in JS if accessed from mobile --%>
			<input type="hidden" id="_locale" name="_locale" value="" />
			<input type="hidden" id="_locale" value="" />
			<input type="hidden" id="mobile" name="mobile" value="" />
			
		</form>
		<script>
			${openLayerConfig}
				jQuery(document).ready(function() {
					owgisMain();
				});
				$(window).load(function() {
					$(".loader").fadeOut("slow");
					
				})
		</script>
	</body>
</html>
