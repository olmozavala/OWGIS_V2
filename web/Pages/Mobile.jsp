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
		<%-- Sets all the javascript global variables that are initiated by the java application --%>
		<%@include file="Header/GlobalJavaScript.jsp"%>
		<%-- contains all the css links and javascript links --%>
		<%@include file="Header/HeaderDebug.jsp"%>
		<%--<%@include file="Header/Header.jsp"%>--%>
		<title></title>
	</head>
	<body>
        <div class="loader"><!--<i class="fa fa-circle-o-notch fa-spin fa-3x fa-fw fa-6x"></i>--></div>
		<div id="popup" class="ol-popup">
                    <a href="#" id="popup-closer" class="ol-popup-closer">
                        <span class="glyphicon glyphicon-remove"> </span>
                    </a>
                        <div id="popup-content">
                            
                        </div>
                        <!-- These divs are required for highcharts -->
                        <!--<div id="containerChartsVP" style="display:none;"></div>
                        <div id="containerChartsTS" style="display:none;"></div>-->
		</div>
		
		<%-- Contains the title of the layer and the div that hold the whole map --%>
		<form id="baseForm" class="form-inline" name="baseForm" action=".${names.acdmServlet}" method="post">
			
			<div data-role="page" id="home" data-theme="a">
				<!--Left panels-->
				<%@include file="Layouts/Mobile/LeftPanels/M_MainTools.jsp" %> 
				<%@include file="Layouts/Mobile/LeftPanels/M_MainAndOptionalLayers.jsp" %> 
					
				<!-- Buttons on the navbar  -->
				<div id="header" data-role="header" data-theme="b">
					<a id="bars-button_left" class="ui-btn ui-btn-left ui-icon-gear ui-btn-icon-left" href="#mobPanelMainTools" ><fmt:message key="mobile.tools" /></a>
					<span class="ui-title"></span>
					<%--
					<div data-type="horizontal" data-role="controlgroup" class="ui-btn-right">					
						<button id="selectedLanguage" type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" style="margin-right: 5px; height: 25px">
							<!--It gets initialized by languages.js-->
						</button>
						<ul id="langDropDown" class="dropdown-menu" role="menu">
							<!--It gets initialized by languages.js-->
						</ul>
					</div>--%>
					<a id="bars-button_right" class="ui-btn ui-btn-right ui-icon-bars ui-btn-icon-right" href="#mobPanelLayers" ><fmt:message key="mobile.layers" /></a>
				</div>
					
				<div role="main" class="ui-content">
					<div id="map"></div>
					<c:if test="${cqlfilter}">
						<%-- CQL Custom filter buttons and text field. --%>
						<%@include file="Layouts/Mobile/RightPanels/M_CQLFilter.jsp" %> 
					</c:if>
						
					<!--Right panels -->
					<c:if test='${currents}'>
						<%@include file="Layouts/Mobile/RightPanels/M_StreamlinesStyle.jsp" %> 
					</c:if>
					<c:if test='${ncwms}'>
						<%@include file="Layouts/Mobile/RightPanels/M_Palettes.jsp" %> 
						<c:if test='${zaxis}'>
							<%@include file="Layouts/Mobile/RightPanels/M_ZAxisSelection.jsp" %> 
						</c:if>
						<c:if test='${multipleDates}'>
							<%@include file="Layouts/Mobile/RightPanels/M_DateSelection.jsp"%>
						</c:if>
					</c:if>
                                        <!--Adding extra canvas for animations and currents if necessary-->
					<c:if test='${currents}'> <canvas id="currentsCanvas"></canvas> </c:if>
						<c:if test='${ncwms}'> 
						<canvas id="animationCanvas"></canvas>
						<canvas id="testWebGLCanvas"></canvas>
						<img id="animContainer" src="" class="menuHidden"></img>
					</c:if>
				</div>
			</div><!-- Main page -->

			<c:if test='${ncwms}'>
				<%@include file="Layouts/Mobile/Drawer/M_Animations.jsp"%>
			</c:if>		
				
			<%-- Parameter set true in JS if accessed from mobile --%>
			<input type="hidden" id="_locale" name="_locale" value="" />
			<!--<input type="hidden" id="_locale" value="" /> -->
			<input type="hidden" id="mobile" name="mobile" value="" />
				
		</form>
		<script>
			${openLayerConfig}
				jQuery(document).ready(function() {
					owgisMain();
				});
				$(window).load(function() {
					owgis.interf.loadingallscreen(false);
				})
		</script>

		<div class="loadingMobile"></div>
                
                <!-- This button is used to plot in mobile custom code -->
                <button id="pltchrt_btn" class="button button-glow button-circle button-action" ><i class="fa fa-line-chart"></i></button>
                
                <!-- These divs are required for highcharts exclusively custom for this project --> 
                <div id="estaciones_charts_mobile" class="container">
                    
                    <a href="#" id="pltchrt-closer" class="ol-popup-closer">
                        <i class="fa fa-remove"></i>
                    </a>
                    
                    <div class="row">
                        <div id="est_list_container">
                              <ul class="nav flex-column nav-pills nav-stacked" id="v-pills-tab" aria-orientation="vertical" role="tablist">
                                
                              </ul>
                        </div>
                        <div id="est_graph_container">
                          <div class="tab-content" id="v-pills-tabContent">
                            <div class="tab-pane fade in active" id="v-pills-est" role="tabpanel" >
                                <div id="forecastvsreportHighcharts"></div>
                            </div>
                          </div>
                        </div>
                    </div>
                </div>
                
                <!-- These divs are required for highcharts -->
                <div class="modal fade" tabindex="-1" role="dialog" aria-hidden="true" id="showVertProf" style="display: none;">
                    <div class="modal-dialog">
                      <div class="modal-content">
                          <div class="modal-header">
                            <h5 class="modal-title" id="modalLabelVertProf"></h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                              <span aria-hidden="true">&times;</span>
                            </button>
                          </div>
                        <div id="containerChartsVP" ></div>
                      </div>
                    </div>
                </div>
                
                <div class="modal fade" tabindex="-1" role="dialog" aria-hidden="true" id="showTimeSeries" style="display: none;">
                    <div class="modal-dialog">
                      <div class="modal-content">
                          <div class="modal-header">
                            <h5 class="modal-title" id="modalLabelTimeSeries"></h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                              <span aria-hidden="true">&times;</span>
                            </button>
                          </div>
                        <div id="containerChartsTS" ></div>
                      </div>
                    </div>
                </div>
	</body>
</html>
