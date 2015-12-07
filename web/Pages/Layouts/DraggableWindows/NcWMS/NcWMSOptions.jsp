<%-- 
    Document   : Calendars
    Created on : Aug 3, 2012, 5:53:19 PM
    Author     : Olmo Zavala-Romero
--%>
	
<!-- Divs that hold the start and end calendar plus the related texts -->
<div class="transDraggableWindow menuHidden toolTip container-fluid" id="CalendarsAndStopContainer"
	 title="<fmt:message key='help.tooltip.calender'/>" >
	<div class="row">
		<div class="col-xs-6 text-center title "  id="cal-start-title"> 
			<span class="invShadow"> <fmt:message key="ncwms.cal.start" /></span><br>
		</div>
		<div class="col-xs-4 text-center title " id="cal-end-title">
			<span class="invShadow"> <fmt:message key="ncwms.cal.end" /></span><br>
		</div>
		<div class="col-xs-2 text-right ">
			<a class="btn btn-default btn-xs " href="#" 
			   onclick="owgis.layouts.draggable.minimizeWindow('calendarsMinimize', 'CalendarsAndStopContainer')" >
				<span class="glyphicon glyphicon-resize-small"></span>
			</a>
		</div>
	</div>
	<div class="row">
		<div class="col-xs-6 " id="cal-start"> </div>
		<div class="col-xs-6 " id="cal-end"> </div>
	</div>
	<div class="row">
		<div class="col-xs-6 " style="text-align: center">
			<select class="form-control input-sm" id="startTimeCalendar" name="startTimeCalendar" 
					onchange="owgis.ncwms.calendars.updateStartHour()">
			</select>
		</div>
		<div class="col-xs-6 " style="text-align: center">
			<select class="form-control input-sm" id="endTimeCalendar" name="endTimeCalendar" 
					onchange="owgis.ncwms.calendars.updateEndHour()">
			</select>
		</div>
	</div>
	<div class="row " id="animRes">
		<div class="col-xs-6 col-xs-offset-3 invShadow text-center ">
			<fmt:message key='ncwms.resolution'/>:
		</div>
		<div class="col-xs-12 invShadow text-center ">
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
	<div class="row defRowSpace" id="animDisp">
		<div class="col-xs-6 text-center " id="p-animation">
			<div class="buttonStyle " onclick="owgis.ncwms.animation.dispAnimation();" > 
				<fmt:message key="ncwms.dispanim" />
			</div> 
		</div>
		<div class="col-xs-6 ">
			<select class="form-control input-sm" id="timeSelect" name="timeSelect">
			</select>
		</div>
	</div>
</div>

<!--Draggable window for the animation controls-->
<%@include file="Animations.jsp" %>  