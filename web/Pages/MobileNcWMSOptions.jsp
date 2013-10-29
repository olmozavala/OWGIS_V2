<%-- 
    Document   : Calendars
    Created on : Aug 3, 2012, 5:53:19 PM
    Author     : olmozavala
--%>

<!-- Hold the gif of the animation, it is called by OpenLayers -->
<div id="mapOverlayDiv" ><img id="mapOverlay" alt="map overlay" onload="javascript:animationLoaded();" /></div>

<c:if test='${netcdf}' >


    <!-- Divs that hold the start and end calendar plus the related texts -->
    <div id="CalendarsAndStopContainer">
        <table id="CalendarParent" border="0">
            <tr>
                <td><span id="hideOneDay" class="calTitle "><fmt:message key="ncwms.cal.start" /></span></td>
                <td><span id="hideOneDayEnd" class="calTitle " style="padding-right:0px;"><fmt:message key="ncwms.cal.end" /></span></td>

            </tr>
            <tr>
                <td> <div  class="startDateCal" id="cal-start"> </div> </td>
                <td> <div class="endDateCal" id="cal-end"> </div> </td>
            </tr>
            <tr>
                <td  style="text-align: center">
                    <div class="dispAnimation" id="p-animation">
                        <button type="button" style="display:inline" 
                                class="mobileButton" onclick="dispAnimation();" > 
                             <fmt:message key="ncwms.dispanim" /> </button> 
                </td><td>
                    <!-- This select is filled in by javascript  -->
                    <select id="timeSelect" name="timeSelect" style="width:100%">
                    </select>
                    </div>
                </td>
            </tr>
        </table>

        <!-- The stop animation button appears when an animation is playing or loading -->

        <div id="s-animation" > 
            <button type="button" 
                    onclick="stopAnimation();" 
                    class="mobileButton" ><fmt:message key="ncwms.stopanim" /></button>
        </div> 
    </div>
</c:if>
