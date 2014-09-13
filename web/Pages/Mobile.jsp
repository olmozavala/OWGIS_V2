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
		<meta name="viewport"
			  content="width=device-width, initial-scale=1, user-scalable=no">
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
			<!-- <input type="hidden" id="device_source" value="mobile"> -->
			<div data-role="page" id="home" data-theme="a">
				
				<div data-role="panel" id="navpanelright" data-theme="b"
					 data-display="overlay" data-position="right">
					<div data-role="fieldcontain" id="ulBaseLayers">
						<div class="row " onClick="toogleList('#baseLayersData')">
							<div class="col-xs-9 text-center noShadow title">
								<fmt:message key="main.base" />
							</div>
							<div class="col-xs-3 text-center">
								<a class="btn btn-default btn-xs" href="#"
								   onclick="minimizeWindow('mainMenuMinimize', 'mainMenuParent')">
									<i class="glyphicon glyphicon-resize-small"></i>
								</a>
							</div>
						</div>
						<div class="row" id="baseLayersData">
							<div class="col-xs-12 " style="margin-left: 4px;">
								${menuHelper:createMainMenu(MenuDelUsuario,language)}</div>
						</div>
						<c:if test="${cqlfilter}">
							<div class="row">
								<div class="col-xs-12">
									<span id="ocqlMenuButtonParent">
										<button type="button" name="type" id="idOcqlMenuButton"
												class="buttonStyle" onclick="toggleCustomFilterTextBox();">
											<fmt:message key="cql.custom" />
										</button>
									</span>
								</div>
							</div>
						</c:if>
					</div>
					<div data-role="fieldcontain" id="optionalLayersWindow">
						<%@include file="Options/Mobile/MOptionalLayers.jsp"%>
					</div>
				</div>
				
				<div data-role="panel" id="navpanelleft" data-theme="a"
					 data-display="overlay" data-position="left">
					<ul data-role="listview" data-inset="true" data-shadow="false"
						id="leftList">
						<li><div id="kmlLinkParent"
								 title="<fmt:message key='help.tooltip.googleE'/>">
								<%@include file="Options/KmlLink.jsp"%>
							</div></li>
						<li>
							<div id="transParent"
								 title="<fmt:message key='help.tooltip.transparency'/>">
								<%@include file="Options/Transparency.jsp"%>
							</div>
						</li>
						<li><div id="elevationParent"
								 title="<fmt:message key='help.tooltip.depthElevation'/>">
								<%@include file="Options/Elevation.jsp"%>
							</div></li>
<!-- 						<li><div id="palettesMenuParent" -->
<%-- 								 title="<fmt:message key='help.tooltip.palettes'/>" --%>
<!-- 								 onclick="showPalettes()" > -->
<%-- 								<fmt:message key="ncwms.pal" /> --%>
<!-- 							</div></li> -->
						<li>
<!-- 							<div id="lineToggle" -->
<%-- 								 title="<fmt:message key='help.tooltip.transect'/>" name="type" --%>
<!-- 								 value="line" onclick="toggleControl(this,'below');"> -->
<%-- 								<fmt:message key="ncwms.transect" /> --%>
								
<!-- 							</div> -->
<div class="transect-slider">
							<select name="flip-1" id="lineToggle" data-role="slider" onChange="toggleControlMob();">
	<option value="off">Transect Off</option>
	<option value="on">Transect On</option>
</select> 
</div>
						</li>
						<li><div id="downloadDataParent"
								 title="<fmt:message key='help.tooltip.download'/>"
								 onclick="downloadData();">
								<fmt:message key="main.download" />
							</div></li>
						<!-- 					<li data-icon="gear" id="baseLayers"><a href="#navpanelright">Base -->
						<!-- 							Layers</a></li> -->
						<!-- 					<li data-icon="gear" id="optionalLayers"><a -->
						<!-- 						href="#navpanelright">Optional Layers</a></li> -->
						
					</ul>
				</div>
				<div id="header" data-role="header" data-theme="b"
					 data-fullscreen="true">
					<a id="bars-button_left" data-icon="bars" class="ui-btn-left"
					   data-inline="true" href="#navpanelleft">Tools</a>
<!-- 					<h1>OWGIS</h1> -->
					<div data-type="horizontal" data-role="controlgroup"
						 class="ui-btn-right">
						<%--      	  ${menuHelper:createLanguageComboBox(availableLanguages,defaultLanguage,language,basePath)} --%>
						<a id="bars-button_right" data-role="button" data-icon="bars"
						   href="#navpanelright">Layers</a>
					</div>
				</div>
				<div id="map"></div>
			</div>
			<c:if test='${netcdf}'>
				<a href="#" id="trigger3" class="trigger right">Palettes</a>
				<div id="panel3" class="panel right">
					
					<div class="row">
						<div class="col-xs-2">
							<img class="optPaletteImg" id="imgPalette" src="${paletteUrl}"
								 onclick="displayOptionalPalettes();"
								 onmouseover="this.style.cursor = 'pointer';"
								 onmouseout="this.style.cursor = 'crosshair';" />
						</div>
						<div class="col-xs-10">
							<div class="row">
								<div class="col-xs-12 invShadow title ">
									<fmt:message key="ncwms.colorrange" />
								</div>
							</div>
							<div class="row ">
								<div class="col-xs-12 defRowSpace">
									<span class="invShadow"> Max:</span> <input id="maxPal"
																				class="inputSizePalettes input-sm" name="maxPal" type="text"
																				size="5" onblur="UpdatePalette(mappalette);" style="color: black"
																				onkeydown="if (event.keyCode == 13) UpdatePalette(mappalette);" />
									<a class="btn btn-default btn-xs" href="#"
									   onclick="increaseMaxColorRange(1);"> <span
											class="glyphicon glyphicon-plus "> </span>
									</a> <a class="btn btn-default btn-xs" href="#"
											onclick="increaseMaxColorRange(-1);"> <span
											class="glyphicon glyphicon-minus "> </span>
									</a>
								</div>
							</div>
							<div class="row ">
								<div class="col-xs-12 defRowSpace">
									<span class="buttonStyle" id="updateColorRangeButton"
										  onclick="UpdatePalette(mappalette);"> <fmt:message
											key="ncwms.update" /></span> <span class="buttonStyle"
												  id="autoColorRangeButton" onclick="setColorRangeFromMinMax();">
										<fmt:message key="ncwms.auto" />
									</span>
								</div>
							</div>
							<div class="row">
								<div class="col-xs-12 defRowSpace ">
									<span class="invShadow"> Min:</span> <input
										class="inputSizePalettes input-sm" id="minPal" name="minPal"
										type="text" size="5" onblur="UpdatePalette(mappalette);"  style="color: black"
										onkeydown="if (event.keyCode == 13) UpdatePalette(mappalette);" />
									<a class="btn btn-default btn-xs" href="#"
									   onclick="decreaseMinColorRange(-1);"> <span
											class="glyphicon glyphicon-plus "> </span>
									</a> <a class="btn btn-default btn-xs" href="#"
											onclick="decreaseMinColorRange(1);"> <span
											class="glyphicon glyphicon-minus "> </span>
									</a>
									
								</div>
							</div>
							<!-- Row -->
						</div>
						<!-- col-xs-10 -->
					</div>
					<!-- Row -->
					<div class="row defRowSpace">
						<div class="col-xs-6 invShadow title">
							<fmt:message key="ncwms.newpal" />
						</div>
						<div class="col-xs-4">
							<span class="buttonStyle" id="defaultColorRangeButton"
								  onclick="DefaultPalette();"> Default</span>
						</div>
						
					</div>
					<div class="row defRowSpace">
						<div class="col-xs-12">
							<table id="palettesTable"></table>
						</div>
					</div>
				</div>
				<canvas id="animationCanvas"></canvas>
				<img id="animContainer" src="" class="menuHidden"></img>
				<a href="#" id="trigger2" class="trigger left" style="display:none">Date Range</a>
				<div id="panel2" class="panel left">
					
					<div id="CalendarParent container-fluid">
						<div class="row" >
							<div class="col-xs-6 text-center title " id="hideOneDay">
								<span class="invShadow"> <fmt:message
										key="ncwms.cal.start" /></span><br>
							</div>
							<div class="col-xs-6 text-center title " id="hideOneDayEnd">
								<span class="invShadow"> <fmt:message key="ncwms.cal.end" /></span><br>
							</div>
							
						</div>
						<div class="row" style="margin-bottom: 10px">
							<div class="col-xs-5" id="hideOneDay">
								<input type="text" data-role="date" id="cal-start" readonly='true' style="width: 120px; color:black">
							</div>
							<div class="col-xs-2"></div>
							<div class="col-xs-5" id="hideOneDay">
								<input type="text" data-role="date" id="cal-end" readonly='true' style="width: 120px; color:black">							
							</div>
						</div>
						<div class="row "style="margin-bottom: 5px">
							<div class="col-xs-6 col-xs-offset-3 invShadow text-center">
								<fmt:message key='ncwms.resolution' />
								:
							</div>
						</div>
						<div class="row ">
							<div class="col-xs-4 invShadow text-center">
								<label class="radio-inline"> <input type="radio"
																	value="high" name="video_res"> <fmt:message
										key='ncwms.resolutionHigh' />
								</label> 
							</div>
							<div class="col-xs-4 invShadow text-center">
								
								<label class="radio-inline"> <input type="radio"
																	value="normal" name="video_res" checked> <fmt:message
										key='ncwms.resolutionMiddle' />
								</label> 
							</div>
							
							<div class="col-xs-4 invShadow text-center">
								
								<label class="radio-inline"> <input type="radio"
																	value="low" name="video_res"> <fmt:message
										key='ncwms.resolutionLow' />
								</label>
							</div>
						</div>
						<div class="row" style="margin-bottom: 20px">
							<div class="col-xs-6 col-xs-offset-3 text-center">
								<select class="form-control" id="timeSelect" name="timeSelect" style="color: black">
								</select>
							</div>
						</div>
						<div class="row">
							<div class="col-xs-8 col-xs-offset-2 text-center" id="p-animation">
								<div class="buttonStyle "
									 onclick="owgis.ncwms.animation.dispAnimation();">
									<fmt:message key="ncwms.dispanim" />
								</div>
							</div>
							
						</div>
						
						
					</div>
				</div>
				<%-- <canvas id="animationCanvas"></canvas> --%>
				<!-- <img id="animContainer" src=""></img> -->
				
				<div id="drawer" style="display:none">
					<div id="drawer-pull" class=""></div>
					<div id="drawer-content">
						<div id="animControls">
							<div class="row">
								<div class="col-xs-12 invShadow title ">
									<fmt:message key="ncwms.animcontrol" />
								</div>
							</div>
							<div class="row  text-center ">
								<div class="col-xs-12 ">
									<a class="btn btn-default btn-xs " href="#"
									   onclick="animFirstFrame()"
									  > <span
											class="glyphicon glyphicon-fast-backward"></span>
									</a> <a class="btn btn-default btn-xs " href="#"
											onclick="animDecreaseFrame()"> <span
											class="glyphicon glyphicon-step-backward"></span>
									</a> <a class="btn btn-default btn-xs " href="#"
											onclick="animSlower()"> <span
											class="glyphicon glyphicon-backward"></span>
									</a> <span class="invShadow title menuHidden" id="stopAnimText">
										
									</span> <a class="btn btn-default btn-xs " href="#"
											   onclick="updateAnimationStatus('none')"> <span
											class="glyphicon glyphicon-stop"></span>
									</a> <a class="btn btn-default btn-xs " href="#"
											onclick="updateAnimationStatus('playing')" > <span
											class="glyphicon glyphicon-play"></span>
									</a> <a class="btn btn-default btn-xs " href="#"
											onclick="updateAnimationStatus('paused')"> <span
											class="glyphicon glyphicon-pause"></span>
									</a> <a class="btn btn-default btn-xs " href="#"
											onclick="animFaster()"> <span
											class="glyphicon glyphicon-forward"></span>
									</a> <a class="btn btn-default btn-xs " href="#"
											onclick="animIncreaseFrame()"> <span
											class="glyphicon glyphicon-step-forward"></span>
									</a> <a class="btn btn-default btn-xs " href="#"
											onclick="animLastFrame()"> <span
											class="glyphicon glyphicon-fast-forward"></span>
									</a> <a class="btn btn-default btn-xs " href="#" target="_blank"> <span
											class="glyphicon glyphicon-floppy-save"></span>
									</a>
								</div>
							</div>
							<div class="row">
								<div class="col-xs-12 defShadow title">
									<span> <fmt:message key="ncwms.anim.currdate" />
									</span> <span id="animDate"></span>
								</div>
							</div>
							<div class="row">
								<div class="col-xs-12 defShadow title">
									<span> <fmt:message key="ncwms.anim.currspeed" />
									</span> <span id="animSpeed"></span>
								</div>
							</div>
						</div>
					</div>
				</div>
				                <div id="l-animation" class="menuHidden">
                    <p class="invShadow"> <fmt:message key="ncwms.loading" /> 
						<span id="loadperc" class="invShadow">0</span> % <img src="./common/images/loading/load.gif" height="12" border="0" alt="loading" />	</p>
                </div>
			</c:if>
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
