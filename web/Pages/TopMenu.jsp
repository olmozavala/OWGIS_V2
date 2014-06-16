<!-- Menu for Users -->
<div id="layersMenu" class="layersMenu">

    <!--
    <c:choose>
    <c:when test='${netcdf}'>
    <div id="hideCalendarButtonParent" class="buttonStyle"
        id="hideCalendar" onclick="hideCalendarFunc();"  >
        Hide Calendar
    </div>
    </c:when>
    </c:choose>
    -->
    <!-- Link to download kml files-->
    <div class="buttonStyle toolTip" id="kmlLinkParent" 
    title="<fmt:message key='help.tooltip.googleE'/>"> 
        <%@include file="Options/KmlLink.jsp" %>
    </div>
    <!-- Transparency -->
    <div class="buttonLook toolTip" id="transParent" 
    title="<fmt:message key='help.tooltip.transparency'/>">
        <%@include file="Options/Transparency.jsp" %>
    </div>
    <!-- Depth or elevation-->
    <div class="buttonContainer menuHidden toolTip" id="elevationParent" 
    title="<fmt:message key='help.tooltip.depthElevation'/>" >
        <%@include file="Options/Elevation.jsp" %>
    </div>
    <!-- Palettes -->
    <div class="buttonStyle menuHidden toolTip" id="palettesMenuParent" 
    title="<fmt:message key='help.tooltip.palettes'/>"
         onclick="showPalettes()" id="dynamicFont_color"  >
            <fmt:message key="ncwms.pal" />
    </div>
    <!-- Transect tool-->
    <div class="buttonStyle menuHidden toolTip" id="lineToggle" 
         title="<fmt:message key='help.tooltip.transect'/>"
         name="type" value="line" onclick="toggleControl(this,'below');" >
            <fmt:message key="ncwms.transect" />
    </div>
    <!-- Download data-->
    <div class="buttonStyle menuHidden toolTip" id="downloadDataParent" 
        title="<fmt:message key='help.tooltip.download'/>"
        onclick="downloadData('${basepath}');"  >
        <fmt:message key="main.download" />
    </div>
    <!-- Export map as PNG image -->
    <!--
    <div class="buttonStyle" id="exportPNGParent" valign="middle">
        <span onmouseover="hoverInstructions('exportPngHover', '1',this,'below');"
            onmouseout="hoverInstructions('exportPngHover', '2',this,'below')" />
            <a class="maplink" id="exportMapLink" download="DeepCmap.png" 
                onclick="updateMapPngLink();" >
                 Export PNG</a>
        </span>
    </div>-->
    <!-- Map Instructions-->
    <div class="buttonStyle toolTip" id="helpParent" valign="middle"  
    title="<fmt:message key='help.tooltip.help'/>">
        <span id="helpText"  onclick="displayHelp();" atl="Help" />
            <fmt:message key="main.help" />
        </span>
    </div>
    <!-- Reset view -->
    <div class="buttonStyle toolTip" id="resetParent" 
     title="<fmt:message key='help.tooltip.resetview'/>"
     valign="middle">
        <span id="resetText"
            onclick="resetView();" />
            <fmt:message key="main.resetView" />
        </span>
    </div>

</div>

<div id="helpHoverSpan" >
    <img title="<fmt:message key='help.helpicon'/>" class="toolTip"
    onclick="displayHoverHelp();" id="helpHoverImg" src="${basepath}/common/images/Help/Help1.png">
</div>
