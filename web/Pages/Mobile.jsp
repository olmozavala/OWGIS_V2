<%-- 
This is the main jsp file that forms the html webpage. It contains the skeleton of the html application. 
--%>

<%@page pageEncoding="iso-8859-1"%>
<%@page errorPage="Error/ErrorPage.jsp" %>
<%@ taglib prefix="menuHelper" uri="/WEB-INF/TLD/htmlStaticFunctions.tld" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"  %>
<jsp:useBean id="names" class="com.mapviewer.model.PagesNames" scope="page"> </jsp:useBean>
<jsp:useBean id="globals" class="com.mapviewer.model.Globals" scope="page"> </jsp:useBean>

    <!--This part is used to change the texts depending on the language of the user browser-->
<fmt:setLocale value="${language}" />
<fmt:setBundle basename="com.mapviewer.messages.text" />


<!DOCTYPE HTML PUBLIC "-//W3C//Dtd HTML 4.01 Transitional//EN"
    "http://www.w3.org/tr/html4/loose.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

    <head>
        <%@include file="Header/GlobalJavaScript.jsp" %> <%-- Sets all the javascript global variables that are initiated by the java application --%>

        <%@include file="Header/MobileHeader.jsp" %> <%-- contains all the css links and javascript links --%>
        <%@include file="OpenLayersConfig.jsp" %> <%-- this is a javascript file that initiazlies the OpenLayers map --%>
    </head>


    <body id="bodyClass" onresize="resizeMap();"  onload="resizeMap();
            mobileInit();">
        <%-- Main form of the application (main menu), it executes a new page everytime a new menu item is chosen --%>

        <form id="baseForm" name="baseForm" action="${basepath}${names.acdmServlet}" method="post">



            <!-- These are the dropdowns for the base layer-->



            <%@include file="RequiredDivs.jsp" %> <%-- Contains the title of the layer and the div that hold the whole map --%>

            <c:if test='${netcdf}'>




                <!--<span id="loadingAnimContainer" class="loadingAnimContainer" style="display:block;visibility:visible">-->

                <div id="l-animation">
                    <p class="bigFontSize"> <fmt:message key="ncwms.loading" /> <span id="loadperc">0</span> % <img src="${basepath}/common/images/load.gif" height="12" border="0" alt="loading" />	</p>
                </div>
            </c:if>


            <table id="mobileLevel1" cellpadding="5px"  border="0">
                <tr >                        
                    <td id="mobileLev1optClose"><span  style="font-size:45px;" class="mobileButton"  onclick="hideMobileMenuLevel1(1)"><fmt:message key="mobile.open" /></span></td>
                    <td id="mobileLev1Hide"><span  style="font-size:45px;padding-left:2px;padding-right:2px;" class="mobileButton" onclick="hideMobileMenuLevel1(0)"><fmt:message key="mobile.close" /></span></td>

                    <td id="mobileLev1Tools"><span style="font-size:45px;" class="mobileButton" onclick="hideMobileMenuLevel1(2)"><fmt:message key="mobile.tools" /></span></td>
                    <td id="mobileLev1Resize"><span style="font-size:45px;" class="mobileButton" onclick="hideMobileMenuLevel1('ResizeMap')"><fmt:message key="mobile.resizeMap" /></span></td>

                    <td id="mobileLev1HideTitleOn"><span  style="font-size:45px;" class="mobileButton" onclick="showMobileTitle(1)" id="titleOnText"><fmt:message key="mobile.title.on" /></span></td>
                    <td id="mobileLev1HideTitleOff"><span  style="font-size:45px;" class="mobileButton" onclick="showMobileTitle(2)" id="titleOnText"><fmt:message key="mobile.title.off" /></span></td>
                </tr>

            </table>

            <span id="transectParent">
                <button type="button" name="type" value="line" id="lineToggle" class="mobileButton" 
                        onclick="hideMobileMenuLevel1('mobileLev3Back');
            toggleControlMobile(this);" ><fmt:message key="ncwms.transect" /></button>
            </span>

            <table id="mobileLevel2" border="3" width="100%" height="100%">

                <tr>
                    <td id="mobileLev2MainLayers" class="mobileButton level2button" onclick="hideMobileMenuLevel1('mainLayers');
            UserChoice('level3MainLayers', 'undefined', 'undefined')"><fmt:message key="main.base" /></td>

                    <td id="mobileLev2OptionalLayers" class="mobileButton level2button" onclick="hideMobileMenuLevel1('optionalLayers');
            UserChoice('level3OptionalLayers', 'undefined', 'undefined');"><fmt:message key="main.optional" /></td>

                </tr>

                <tr>
                    <td id="mobileLev2Help"  class="mobileButton" onclick="hideMobileMenuLevel1('helpInst');
            UserChoice('level3helpInst', 'undefined', 'undefined');" ><fmt:message key="mobile.help" />?</td>
                    <c:if test="${cqlfilter}">
                        <td id="idOcqlMenuButton"  class="mobileButton" onclick="hideMobileMenuLevel1('cqlFilter');
            UserChoice('level3cqlFilter', 'undefined', 'undefined');" ><fmt:message key="cql.custom" /> </td>
                    </c:if>
                    <c:if test="${!cqlfilter}">
                        <td id="idOcqlMenuButton" class="mobileButtonDisabled" onclick="notAvailableOption();" ><fmt:message key="cql.custom" /> </td>
                    </c:if>   



                </tr>



                <tr>
                    <c:if test='${netcdf}'>
                        <td id="mobileLev2Calendars" class="level2button mobileButton" onclick="hideMobileMenuLevel1('calendars');
            UserChoice('level3Calendars', 'CalendarsAndStopContainer', 'undefined');"><fmt:message key="ncwms.cal.title" /></td>
                    </c:if>

                    <c:if test='${!netcdf}'>
                        <td  id="mobileLev2Calendars" class="level2button mobileButtonDisabled" onclick="notAvailableOption();"><fmt:message key="ncwms.cal.title" /></td>
                    </c:if>


                    <td id="mobileLev2GoogleEarth" class="level2button mobileButton"><a  id="kmlLink" href="${linkKML}" onclick="KMZDownAlert()">


                            <img  border="0" src="${basepath}/common/images/kmz/google_earth_logo_topMenu.png" alt="Descargar en KML" width="25" height="25" />
                            <font color="white">Google Earth</font>
                        </a></td>

                </tr>

                <tr>
                    <td id="mobileLev2Transparency" class="level2button mobileButton"  onclick="hideMobileMenuLevel1('transparency');
            UserChoice('level3Transparency', 'undefined', 'undefined');"><fmt:message key="ncwms.trans" /></td>

                    <c:if test='${netcdf}'>
                        <script>
        if (layerDetails.zaxis === undefined) {

            document.write('<td id="mobileLev2Depth" class="level2button mobileButtonDisabled"  onclick="notAvailableOption();" ><fmt:message key="ncwms.depth" /> </td>');

        }
        else {

            document.write('<td id="mobileLev2Depth" class="level2button mobileButton"  onclick="hideMobileMenuLevel1(\'depth\');UserChoice(\'level3Depth\',\'undefined\', \'undefined\');" ><fmt:message key="ncwms.depth" /> </td>');
        }


                        </script>

                    </c:if>

                    <c:if test='${!netcdf}'>
                        <td id="mobileLev2Depth" class="level2button mobileButtonDisabled"  onclick="notAvailableOption()" ><fmt:message key="ncwms.depth" /></td> 
                    </c:if>



                </tr>

                <c:if test='${netcdf}'>
                    <tr>

                        <td id="mobileLev2ColorPalette"  class="level2button mobileButton " onclick="hideMobileMenuLevel1('colorPalette');
            UserChoice('level3ColorPalette', 'palette', 'palettes-div');"><fmt:message key="ncwms.pal" /></td>

                        <td id="mobileLev2TransectTool" class="level2button mobileButton" onclick="toggleControlMobile(this);
            hideMobileMenuLevel1('transect');
            UserChoice('transect', 'undefined', 'undefined');"><fmt:message key="ncwms.transect" /></td>

                    </tr>
                </c:if>

                <c:if test='${!netcdf}'>
                    <tr>

                        <td id="mobileLev2ColorPalette" class="level2button mobileButtonDisabled " onclick="notAvailableOption()"><fmt:message key="ncwms.pal" /></td>

                        <td id="mobileLev2TransectTool" class="level2button mobileButtonDisabled" onclick="notAvailableOption()">Transect Tool</td>

                    </tr>
                </c:if>            



                <tr>
                    <td id="mobileLev2ZoomOptions" class="level2button mobileButton" onclick="hideMobileMenuLevel1('zoom');
            UserChoice('zoomOptions', 'div.olControlPanPanel', 'div.olControlZoomPanel');">Zoom Options</td>


                    <td id="mobileLev2CloseMenu"  class="level2button mobileButton" onclick="hideMobileMenuLevel1(3);
            UserChoice('undefined', 'undefined', 'undefined');"><fmt:message key="mobile.close" /></td>



                </tr>
            </table>

            <table id="mobileLevel3" border="0" >



                <tr>

                    <td id="mobileLev3Back">

                        <div  id="showAllButton" class="mobileButton"  onclick="hideMobileMenuLevel1('ShowAll')"><fmt:message key="mobile.showAll" /></div>
                        <BR/>
                        <div id="mobileLev3BackBotton"  class="mobileButton"  onclick="hideMobileMenuLevel1('mobileLev3Back')"><fmt:message key="mobile.back" /></div>
                        <br/>
                        <div  class="mobileButton" id="mobileLev3resizeMap"  onclick="hideMobileMenuLevel1('ResizeMap')"><fmt:message key="mobile.resizeMap" /></div>
                        <BR/>


                        <div  class="mobileButton" id="hideAllButton" onclick="hideMobileMenuLevel1('HideAll')"><fmt:message key="mobile.hideAll" /></div>


                    </td>





                    <td  id="level3MainLayers"><span class="WindowMobile" id="mainMenuParent">
                            <div class="ie_shadow" id="mainMenuTitle"><fmt:message key="main.base" /></div>
                            ${menuHelper:createMainMenu(MenuDelUsuario,language)}                        


                        </span>




                    </td>




                    <td id="level3OptionalLayers">
                        <span class="WindowMobile" id="optionalMenuParent" >
                            <%@include file="Options/OptionalLayers.jsp" %>
                            <span id="optionalLayersParentHover" class="commonHover">
                                <fmt:message key="help.optional.layers1" />
                                <img src="${basepath}/common/images/kmz/kmz.png"> 
                                    <fmt:message key="help.optional.layers2" />
                            </span>
                        </span>


                    </td>

                    <td id="level3cqlFilter">
                        <c:if test="${cqlfilter}">
                            <%-- CQL Custom filter buttons and text field. --%>
                            <%@include file="Options/CQLFilter.jsp" %> 

                            <div id="cqlhelptext"><b style="font-size:25px;">Instructions:</b> <BR/>This is a
                                <a href="http://en.wikipedia.org/wiki/Contextual_Query_Language"> CQL </a>
                                filter text box. Possible options: <br> <br>
                                        <table class="cqlFilterExampleTable">
                                            <tr>
                                                <th>Boolean</th> <th>Comparison</th> <th>Chars</th> <th>Reg. Exp.</th>
                                            </tr>
                                            <tr>
                                                <td>or<br>and</td>
                                                <td>=,<>, <,<br><=,>=</td>
                                                <td>LIKE<br> IN</td>
                                                <td>% (any) </td>
                                            </tr>
                                        </table>
                                        <br> <b>Examples (review available filters)</b>:
                                            <br> &nbsp;&nbsp;&nbsp;&nbsp; time <b>></b> '2013-01-01'
                                                <br> &nbsp;&nbsp;&nbsp;&nbsp; year <b>></b> 2008 <b>AND </b>year <b><</b> 2011
                                                    <br> &nbsp;&nbsp;&nbsp;&nbsp; temperature <b>></b> 10 <b>OR</b> salinity <b>>=</b> 1
                                                        <br> &nbsp;&nbsp;&nbsp;&nbsp; year <b>IN</b> (2012,2013) <b>AND</b> date < '8/10/2013'
                                                            <br> &nbsp;&nbsp;&nbsp;&nbsp; name <b>LIKE</b> 'John<b>%</b>' <b>AND</b> year <b><</b> 2013</div>
                                                            </c:if>



                                                            </td>                  


                                                            <td id="level3Calendars">

                                                                <c:if test='${netcdf}'>
                                                                    <%@include file="NcWMSOptions.jsp" %>  <%-- This page has all the calendars, the animaton divs  --%>
                                                                </c:if>
                                                            </td>





                                                            <td id="level3Transparency" ><%@include file="Options/Transparency.jsp" %>
                                                            </td>







                                                            <td id="level3Depth"> <%@include file="Options/Mobile/Elevation.jsp" %>

                                                            </td>







                                                            <td id="level3ColorPalette">
                                                                <!-- Current palette and color range -->
                                                                <!--<div id="palettesParent">-->
                                                                <%@include file="Options/Palettes.jsp" %> 
                                                                <!--</div>-->

                                                            </td>

                                                            <td id="level3helpInst">
                                                                <!-- Current palette and color range -->
                                                                <!--<div id="palettesParent">-->

                                                                <%@include file="Options/MapInstructionsLatest.jsp" %>

                                                                <!--</div>-->

                                                            </td>













                                                            </tr>

                                                            </table>


                                                            </form>


                                                            </body>
                                                            </html>
