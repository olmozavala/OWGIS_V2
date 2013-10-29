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
    <div class="buttonStyle" id="kmlLinkParent" 
        onmouseover="hoverInstructions('mainKmlParentHover', '1',this,'below')" 
        onmouseout="hoverInstructions('mainKmlParentHover', '2',this,'below')"  > 
        <%@include file="Options/KmlLink.jsp" %>
    </div>
    <!-- Transparency -->
    <div class="buttonLook" id="transParent" 
        onmouseover="hoverInstructions('transParentHover', '1',this,'below')" 
        onmouseout="hoverInstructions('transParentHover', '2',this,'below')" >
        <%@include file="Options/Transparency.jsp" %>
    </div>
    <!-- Depth or elevation-->
    <div class="buttonContainer menuHidden" id="elevationParent"
        onmouseover="hoverInstructions('elevationParentHover', '1',this,'below')" 
        onmouseout="hoverInstructions('elevationParentHover', '2',this,'below')"  >
        <%@include file="Options/Elevation.jsp" %>
    </div>
    <!-- Palettes -->
    <div class="buttonStyle menuHidden" id="palettesMenuParent" 
        onmouseover="hoverInstructions('palettesHover', '1',this,'below')"
        onmouseout="hoverInstructions('palettesHover', '2',this,'below')"
         onclick="showPalettes()" id="dynamicFont_color"  >
            <fmt:message key="ncwms.pal" />
    </div>
    <!-- Transect tool-->
    <div class="buttonStyle menuHidden" id="lineToggle" 
        onmouseover="hoverInstructions('transectParentHover', '1',this,'below')"
        onmouseout="hoverInstructions('transectParentHover', '2',this,'below')"
         name="type" value="line" onclick="toggleControl(this,'below');" >
            <fmt:message key="ncwms.transect" />
    </div>
    <!-- Download data-->
    <div class="buttonStyle menuHidden" id="downloadDataParent" 
        onmouseover="hoverInstructions('downloadDataParentHover', '1',this,'below')"
        onmouseout="hoverInstructions('downloadDataParentHover', '2',this,'below')"
        onclick="getWCSV1Ajax('${basepath}');"  >
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
    <div class="buttonStyle" id="helpParent" valign="middle">
        <span id="helpText"
            onmouseover="hoverInstructions('mapInstrucParentHover', '1',this,'below');"
            onmouseout="hoverInstructions('mapInstrucParentHover', '2',this,'below')"
            onclick="displayHelp();" atl="Help" />
            <fmt:message key="main.help" />
        </span>
    </div>
    <!-- Reset view -->
    <div class="buttonStyle" id="resetParent" valign="middle">
        <span id="resetText"
            onclick="resetView();" />
            <fmt:message key="main.resetView" />
        </span>
    </div>

</div>

<div id="helpHoverSpan" >
    <img onmouseover="hoverInstructions('helpIconHover', '1',this,'belowleft',150,50)" onmouseout="hoverInstructions('helpIconHover', '2',this,'belowleft',150,0)"
    onclick="displayHoverHelp();" id="helpHoverImg" src="${basepath}/common/images/Help/Help1.png">
</div>
