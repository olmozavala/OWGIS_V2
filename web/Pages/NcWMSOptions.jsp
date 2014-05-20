<%-- 
    Document   : Calendars
    Created on : Aug 3, 2012, 5:53:19 PM
    Author     : olmozavala
--%>
<!-- Hold the gif of the animation, it is called by OpenLayers -->
<div id="mapOverlayDiv" ><img id="mapOverlay" alt="map overlay" onload="javascript:animationLoaded();" /></div>

<c:if test='${netcdf}' >
    <!-- Divs that hold the start and end calendar plus the related texts -->
    <div class="transDraggableWindow menuHidden" id="CalendarsAndStopContainer">
        <div id="CalendarParent" >
            <div class="row">
                <div class="col-xs-6 text-center title " id="hideOneDay"> 
                    <span class="invShadow"> <fmt:message key="ncwms.cal.start" /></span><br>
                </div>
                <div class="col-xs-4 text-center title " id="hideOneDayEnd">
                    <span class="invShadow"> <fmt:message key="ncwms.cal.end" /></span><br>
                </div>
                <div class="col-xs-2 text-right ">
                    <a class="btn btn-default btn-xs " href="#" 
                        onclick="minimizeWindow('calendarsMinimize', 'CalendarsAndStopContainer')" >
                        <span class="glyphicon glyphicon-resize-small"></span>
                    </a>
                </div>
            </div>
            <div class="row">
                <div class="col-xs-6" id="hideOneDay"> 
                    <div id="cal-start"> </div>
                </div>
                <div class="col-xs-6" id="hideOneDay"> 
                    <div  id="cal-end"> </div>
                </div>
            </div>
            <div class="row defRowSpace">
                <div class="col-xs-12 invShadow text-center">
                      <fmt:message key='ncwms.resolution'/>:
                      <label class="radio-inline">
                          <input type="radio" value="high" name="video_res" ><fmt:message key='ncwms.resolutionHigh'/>
                      </label>
                      <label class="radio-inline">
                          <input type="radio" value="normal" name="video_res" checked><fmt:message key='ncwms.resolutionMiddle'/>
                      </label>
                      <label class="radio-inline">
                      <input type="radio" value="low" name="video_res" ><fmt:message key='ncwms.resolutionLow'/>
                      </label>
                 </div>
            </div>
            <div class="row defRowSpace">
                <div class="col-xs-6 text-center" id="p-animation">
                    <!--<div class="buttonStyle " onclick="animationLoaded();" >--> 
                    <div class="buttonStyle " onclick="dispAnimation();" > 
                       <fmt:message key="ncwms.dispanim" />
                    </div> 
                </div>
                <div class="col-xs-6">
                    <select class="form-control" id="timeSelect" name="timeSelect">
                    </select>
                </div>
            </div>
        </div>
        <!-- Stop animation button --> 
        <div class="row" id="s-animation" > 
            <div class="col-xs-2">
                <button  class="buttonStyle" onclick="stopAnimation();" >
                    <fmt:message key="ncwms.stopanim" /></button>
            </div>
        </div> 
    </div>
	<canvas id="animationCanvas"></canvas>
</c:if>
