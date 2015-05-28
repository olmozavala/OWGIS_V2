
<%-- 
This page controls the elevation of the displayed layer, it can be height or precipitation as well. 
There is 3 options. Either '-' or '+' or click the button to choose the disired height or precipitation level. 
--%>



<span  style="cursor: pointer;"> 
    <table cellpadding="5" border="0">
        <tr>
            <td><button type="button" id="minusButtonElevation" style="cursor: pointer;"  class="mobileButton" onclick="changeElevationMobile('-', layer1);">
                    -
                </button></td>

            <td>	
                <span  id="elevationText"  class ="mobileButton middleText"><fmt:message key="ncwms.depth" /></span>
            </td>
            <td>
                <button class="mobileButton" id="plusButtonElevation" style="cursor: pointer;" type="button"  onclick="changeElevationMobile('+', layer1);">
                    +
                </button>
            </td>
        </tr>	
       

        <tr>

            
                <td class="zaxis_selector" id="zaxis_selector"> </td>
            

        </tr>

    </table>




</span>

