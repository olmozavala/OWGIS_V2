<%-- 
    Document   : Calendars
    Created on : Aug 3, 2012, 5:53:19 PM
    Author     : olmozavala
--%>
	
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
				<div class="buttonStyle " onclick="owgis.ncwms.animation.dispAnimation();" > 
					<fmt:message key="ncwms.dispanim" />
				</div> 
			</div>
		</div>
	</div>
</div>
<canvas id="animationCanvas"></canvas>
<img id="animContainer" src=""></img>

<!--This div contains all the animation controls (play, stop, pause, etc.--> 
<div id="animControls" class="transDraggableWindow menuHidden">
	<div class="row defRowSpace">
		<div class="col-xs-12 invShadow title "> 
			<fmt:message key="ncwms.animcontrol" />
		</div>

	</div>
	<div class="row defRowSpace">
		<div class="col-xs-12 centered"> 
			<a class="btn btn-default btn-xs " href="#" onclick="animFirstFrame()" >
				<span class="glyphicon glyphicon-fast-backward"></span>
			</a>
			<a class="btn btn-default btn-xs " href="#" onclick="animDecreaseFrame()" >
				<span class="glyphicon glyphicon-step-backward"></span>
			</a>
			<a class="btn btn-default btn-xs " href="#" onclick="animSlower()" >
				<span class="glyphicon glyphicon-backward"></span>
			</a>
			<a class="btn btn-default btn-xs " href="#" onclick="updateAnimationStatus('none')" >
				<span class="glyphicon glyphicon-stop"></span>
			</a>
			<a class="btn btn-default btn-xs " href="#" onclick="updateAnimationStatus('playing')">
				<span class="glyphicon glyphicon-play" ></span>
			</a>
			<a class="btn btn-default btn-xs " href="#" onclick="updateAnimationStatus('pause')">
				<span class="glyphicon glyphicon-pause"></span>
			</a>
			<a class="btn btn-default btn-xs " href="#" onclick="animFaster()" >
				<span class="glyphicon glyphicon-forward"></span>
			</a>
			<a class="btn btn-default btn-xs " href="#" onclick="animIncreaseFrame()" >
				<span class="glyphicon glyphicon-step-forward"></span>
			</a>	

			<a class="btn btn-default btn-xs " href="#" onclick="animLastFrame()" >
				<span class="glyphicon glyphicon-fast-forward"></span>
			</a>
		</div>
	</div>
</div>