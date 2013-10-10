<%-- 
    Document   : Palettes
    Created on : Aug 3, 2012, 6:26:56 PM
    Author     : olmozavala
--%>
<!-- This tables displayes the current palette and the color range used on it -->
<c:if test='${netcdf}'>
    <!-- This tables displays the current palette and the color range used on it -->
    <div id="paletteWindowColorRange" class="transDraggableWindow" >
        <div class="row">
            <div class="invShadow title col-xs-10">
                <!-- TODO put language text -->
                Color range
            </div>
            <div class="col-xs-2">
                <div class="pull-right">
                    <a class="btn btn-default btn-xs" href="#" onclick="showPalettes();">
                        <span class="glyphicon glyphicon-remove"> </span> </a>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-xs-2">
                <img id="imgPalette" src="${paletteUrl}" onclick="displayOptionalPalettes();" 
                     onmouseover="this.style.cursor = 'pointer';"
                     onmouseout="this.style.cursor = 'crosshair';" onload="getDefault();"/>
            </div>
            <div class="col-xs-10">
                <div class="row ">
                    <div class="col-xs-12 defRowSpace">
                        <span class="invShadow"> Max:</span>
                        <input id="maxPal" class="inputSizePalettes input-sm" 
                            name="maxPal" type="text" size="4"
                                onblur="UpdatePalette(mappalette);" onfocus="keyboardnav.deactivate();" 
                                   onkeydown="if (event.keyCode == 13) UpdatePalette(mappalette);" />
                        <a class="btn btn-default btn-xs" href="#" onclick="increaseMaxColorRange(1);">
                            <span class="glyphicon glyphicon-plus "> </span> </a>
                        <a class="btn btn-default btn-xs" href="#" onclick="increaseMaxColorRange(-1);">
                            <span class="glyphicon glyphicon-minus "> </span> </a>
                    </div>
                </div>
                <div class="row ">
                    <div class="col-xs-12 defRowSpace">
                        <span class="buttonStyle" id="updateColorRangeButton" onclick="UpdatePalette(mappalette);" > 
                            <fmt:message key="ncwms.update" /></span> 
                        <span class="buttonStyle" id="autoColorRangeButton"  onclick="setColorRangeFromMinMax();" >
                            <fmt:message key="ncwms.auto" /></span>	
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-12 defRowSpace ">
                        <span class="invShadow"> Min:</span>
                        <input  class="inputSizePalettes input-sm" id="minPal" 
                        name="minPal" type="text" size="4" 
                                onblur="UpdatePalette(mappalette);" onfocus="keyboardnav.deactivate();" 
                                    onkeydown="if (event.keyCode == 13) UpdatePalette(mappalette);" />
                        <a class="btn btn-default btn-xs" href="#" onclick="decreaseMinColorRange(-1);">
                            <span class="glyphicon glyphicon-plus "> </span> </a>
                        <a class="btn btn-default btn-xs" href="#" onclick="decreaseMinColorRange(1);">
                            <span class="glyphicon glyphicon-minus "> </span> </a>

                    </div>
                </div><!-- Row -->
            </div><!-- col-xs-10 -->
        </div><!-- Row -->
    </div><!-- paletteWindowColorRange -->

    <!-- Holds the optional palettes -->
    <div class="transDraggableWindow" id="palettes-div">
        <div class="row  defRowSpace" id="optionalPalettesHeader">
            <div class="col-xs-12 ">
                <span class="invShadow"> <fmt:message key="ncwms.newpal" /></span>
                <span class="buttonStyle" id="defaultColorRangeButton" 
                    onclick="DefaultPalette();"> Default</span>	
                <div class="pull-right">
                    <a class="btn btn-default btn-xs" href="#" onclick="displayOptionalPalettes();">
                        <span class="glyphicon glyphicon-remove"> </span> </a>
                </div>
            </div>
        </div>
        <div class="row defRowSpace">
            <div class="col-xs-12">
                <table id="palettesTable"></table>
            </div>
        </div>
    </div>
    </c:if>
