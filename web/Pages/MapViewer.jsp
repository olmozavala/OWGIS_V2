<%-- 
This is the main jsp file that forms the html webpage. It contains the skeleton of the html application. 
--%>

<%-- <%@page pageEncoding="iso-8859-1"%> --%>
<%@page pageEncoding="UTF-8"%>
<%@page errorPage="Error/ErrorPage.jsp" %>
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
        <%@include file="Header/Header.jsp" %> <%-- contains all the css links and javascript links --%>
        <%@include file="Header/InitJSVariables.jsp" %> <%-- Sets all the javascript global variables that are initiated by the java application --%>
		<!--<meta name="apple-mobile-web-app-capable" content="yes">-->
    </head>

    <body id="bodyClass" >
		<span id="helpInstrContainer" class="draggableWindow" >
			<%@include file="Options/MapInstructionsLatest.jsp" %>
		</span> 

		<%@include file="RequiredDivs.jsp" %> <%-- Contains the title of the layer and the div that hold the whole map --%>

        <%-- Main form of the application (main menu), it executes a new page everytime a new menu item is chosen --%>
        <form id="baseForm" class="form-inline" name="baseForm" action="${basepath}${names.acdmServlet}" method="post">

            <!-- List of optional layers -->
            <div class="draggableWindow toolTipWithImage" id="optionalMenuParent" title="optionalLayersParentHover">
                <%@include file="Options/OptionalLayers.jsp" %>
			</div>

            <!-- These are the dropdowns for the base layer-->
            <div class="transDraggableWindow toolTip" id="mainMenuParent" 
                title = "<fmt:message key="help.tooltip.mainlayers" />"   >
                    <div class="row ">
                        <div  class="col-xs-9 text-center invShadow title"> 
                            <fmt:message key="main.base" />
                        </div>
                        <div class="col-xs-3 text-center">
                            <a class="btn btn-default btn-xs" href="#" 
                                onclick="minimizeWindow('mainMenuMinimize', 'mainMenuParent')">
                                <i class="glyphicon glyphicon-resize-small"></i>
                            </a>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-12 ">
                            ${menuHelper:createMainMenu(MenuDelUsuario,language)}
                        </div>
                    </div>
                    <c:if test="${cqlfilter}">
                        <div class="row">
                            <div class="col-xs-12">
                                <span id="ocqlMenuButtonParent">
                                    <button type="button" name="type" id="idOcqlMenuButton" class="buttonStyle" 
                                            onclick="toggleCustomFilterTextBox();" ><fmt:message key="cql.custom" /></button>
                                </span>
                            </div>
                        </div>
                    </c:if>
                </div>

            <c:if test="${cqlfilter}">
                <%-- CQL Custom filter buttons and text field. --%>
                <%@include file="Options/CQLFilter.jsp" %> 
            </c:if>


            <!-- OWGIS logo -->
            <div id="owgislogocont">
                <a href="http://owgis.org" target="_blank">
                    <img border="0" src="${basepath}/common/images/Logos/owgis.png" alt="OWGIS" height="20px"  />
                </a>
            </div>

            <!-- User Menu -->
            <%@include file="TopMenu.jsp" %> <%-- Upper menu with user options --%>
            <c:if test='${netcdf}'>
                <%@include file="NcWMSOptions.jsp" %>  <%-- This page has all the calendars, the animaton divs  --%>

                <!-- Elevation -->
                <div class="draggableWindow menuHidden" id="zaxis_selector"></div>

                <!-- Current palette and color range -->
                <%@include file="Options/Palettes.jsp" %> 

                <div id="l-animation" class="menuHidden">
                    <p class="bigFontSize invShadow"> <fmt:message key="ncwms.loading" /> 
						<span id="loadperc" class="invShadow">0</span> % <img src="${basepath}/common/images/loading/load.gif" height="12" border="0" alt="loading" />	</p>
                </div>
            </c:if>
				
				<!-- Foot page --> 
				<div id="pieDePaginaIzq" class="leftFoot">
					testing
					&nbsp;
                    <a  href="#">
                        <img border="0" src="${basepath}/common/images/Logos/Logo.png" alt="Logo" width="30" height="30" /></a>
                    &nbsp;
                    <a  href="#">
                        <img border="0" src="${basepath}/common/images/Logos/Logo.png" alt="Logo" width="30" height="30" /></a>
                    &nbsp 
                    <a  href="#">
                        <img border="0" src="${basepath}/common/images/Logos/Logo.png" alt="Logo" width="30" height="30" /></a>
                    &nbsp 
                    <a  href="#">
                        <img border="0" src="${basepath}/common/images/Logos/Logo.png" alt="Logo" width="30" height="30" /></a>
							
                    <a  href="#">
						<p class="footNote" align="left">
							&nbsp 
							&copy; <script language="javascript">document.write(owgis.utils.getDate("%Y"));</script>.  <fmt:message key="main.copyr" /> &nbsp;
						</p></a>
                    <a id="emailText" href="#"> <fmt:message key="main.contact" /></a>
				</div>
					<input type="hidden" id="_locale" name="_locale" value="" />
				
        </form>
			
        <!-- minimizable windows file -->
        <%@include file="Options/MinimizeWindows.jsp" %>
			
<!--         Help texts file -->
<%--         <%@include file="Help/HelpTexts.jsp" %> --%>

		<script>
			${openLayerConfig}
			jQuery(document).ready(function() {
				owgisMain();
			});
		</script>
		<div id="optionalLayersParentHover" class="commonHover" >
					<fmt:message key="help.optional.layers1" />
					<img src="${basepath}/common/images/kmz/kmz.png"/> 
					<fmt:message key="help.optional.layers2" />
					<img src="${basepath}/common/images/Download/LayerDownload.png"/> 
					<fmt:message key="help.optional.layers3" />
				</div> 
	<input type="hidden" id="_locale" value="" />
	
	
    </body>
</html>
