<%-- 
    Document   : Palettes
    Created on : Aug 3, 2012, 6:26:56 PM
    Author     : olmozavala
--%>
<!-- This tables displayes the current palette and the color range used on it -->
<c:if test='${netcdf}'>
    <table>
        <tr><td>
    <!-- This tables displayes the current palette and the color range used on it -->
    <table border="0" id="palette" class="draggableWindow" cellpadding="5" >
        <tr>
            <td rowspan="3"> 
                <img id="imgPalette" src="${paletteUrl}"   onload="getDefault();"/>
            </td>
            <td >
                <p class="palMinMax">
                    Max:<input onblur="UpdatePalette(mappalette);" onfocus="keyboardnav.deactivate();" 
                               onkeydown="if (event.keyCode == 13)
                            UpdatePalette(mappalette);"
                               id="maxPal" name="maxPal" type="text" size="4" style="padding-bottom: 5px" />

                    <BR/>
                    <span class="mobileButton" id="plusButtonElevation" onclick="increaseMaxColorRange(1);">+</span>

                    <span class="mobileButton" id="minusButtonElevation" onclick="increaseMaxColorRange(-1);"  style="padding-left:6px;padding-right:6px;">-</span>
                    <BR/>
                </p>
            </td>
        </tr>

        <tr >
            <td >
                <span class="mobileButton" id="updateColorRangeButton" onclick="UpdatePalette(mappalette);" ><fmt:message key="ncwms.update" /></span><BR/><BR/>
                <span class="mobileButton" id="autoColorRangeButton"  onclick="setColorRangeFromMinMax();" > <fmt:message key="ncwms.auto" /></span>	<BR/>
            </td>
        </tr>

        <tr>
            <td valign="top" >
                <p class="palMinMax">
                    <span class="mobileButton" id="plusButtonElevation" onclick="decreaseMinColorRange(-1);" >+</span>

                    <span class="mobileButton" id="minusButtonElevation" onclick="decreaseMinColorRange(1);" style="padding-left:6px;padding-right:6px;">-</span>
                    <BR/>
                    Min: <input onblur="UpdatePalette(mappalette);" onfocus="keyboardnav.deactivate();" 
                                onkeydown="if (event.keyCode == 13)
                            UpdatePalette(mappalette);"
                                id="minPal" name="minPal" type="text" size="4" />
                </p>
            </td>
        </tr>
    </table></td>
    <td>
    <!-- Holds the optional palettes -->
    <div class="draggableWindow" id="palettes-div">
        <table id="optionalPalettesHeader">
            <tr>
                <td> <p class="defShadow"><fmt:message key="ncwms.newpal"/> </p> </td>
                <td>
                    <p class="mobileButton" 
                       id="defaultColorRangeButton" onclick="DefaultPalette();"><fmt:message key="ncwms.default"/> </p>	
                </td>
               
            </tr>
        </table>
        <table id="palettesTable"></table>
    </div>
    
    </td> </tr></table>
</c:if>