<%-- 
    Document   : Calendars
    Created on : Aug 3, 2012, 5:53:19 PM
    Author     : olmozavala
--%>
	
<!-- Divs that hold the start and end calendar plus the related texts -->
<div class="transDraggableWindow menuHidden toolTip container-fluid" id="CalendarsAndStopContainer"
	 title="<fmt:message key='help.tooltip.calender'/>" >
	<div class="row">
		<div class="col-xs-6 text-center title "> 
			<span class="invShadow"> <fmt:message key="ncwms.cal.start" /></span><br>
		</div>
		<div class="col-xs-4 text-center title ">
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
		<div class="col-xs-6 " id="cal-start"> </div>
		<div class="col-xs-6 " id="cal-end"> </div>
	</div>
	<div class="row ">
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
	<div class="row defRowSpace">
		<div class="col-xs-6 text-center " id="p-animation">
			<div class="buttonStyle " onclick="owgis.ncwms.animation.dispAnimation();" > 
				<fmt:message key="ncwms.dispanim" />
			</div> 
		</div>
		<div class="col-xs-6 ">
			<select class="form-control" id="timeSelect" name="timeSelect">
			</select>
		</div>
	</div>
</div>





<!--Canvas that contains the animations-->
<canvas id="animationCanvas"></canvas>
<img id="animContainer" src=""/>
	
<!--This div contains all the animation controls (play, stop, pause, etc.--> 
<div id="animControls" class="container-fluid transDraggableWindow menuHidden">
	<div class="row">
		<div class="col-xs-12 invShadow title "> 
			<fmt:message key="ncwms.animcontrol" />
		</div>
	</div>
	<div class="row  text-center ">
		<div class="col-xs-12 "> 
			<a class="btn btn-default btn-xs " href="#" onclick="animFirstFrame()"
			   title="<fmt:message key='ncwms.anim.help.fastback'/>" >
				<span class="glyphicon glyphicon-fast-backward"></span>
			</a>
			<a class="btn btn-default btn-xs " href="#" onclick="animDecreaseFrame()" 
			   title="<fmt:message key='ncwms.anim.help.stepback'/>" >
				<span class="glyphicon glyphicon-step-backward"></span>
			</a>
			<a class="btn btn-default btn-xs " href="#" onclick="animSlower()" 
			   title="<fmt:message key='ncwms.anim.help.slower'/>" >
				<span class="glyphicon glyphicon-backward"></span>
			</a>
			<span class="invShadow title menuHidden" id="stopAnimText"> 
				<fmt:message key="ncwms.anim.stop" />
			</span >
			<a class="btn btn-default btn-xs warning" href="#" onclick="updateAnimationStatus('none')" 
			   title="<fmt:message key='ncwms.anim.help.stop'/>" >
				<span class="glyphicon glyphicon-stop"></span>
			</a>
			<a class="btn btn-default btn-xs " href="#" onclick="updateAnimationStatus('playing')"
			   title="Play" >
				<span class="glyphicon glyphicon-play" ></span>
			</a>
			<a class="btn btn-default btn-xs " href="#" onclick="updateAnimationStatus('paused')"
			   title="<fmt:message key='ncwms.anim.help.pause'/>" >
				<span class="glyphicon glyphicon-pause"></span>
			</a>
			<a class="btn btn-default btn-xs " href="#" onclick="animFaster()" 
			   title="<fmt:message key='ncwms.anim.help.faster'/>" >
				<span class="glyphicon glyphicon-forward"></span>
			</a>
			<a class="btn btn-default btn-xs " href="#" onclick="animIncreaseFrame()" 
			   title="<fmt:message key='ncwms.anim.help.stepforw'/>" >
				<span class="glyphicon glyphicon-step-forward"></span>
			</a>	
				
			<a class="btn btn-default btn-xs " href="#" onclick="animLastFrame()" 
			   title="<fmt:message key='ncwms.anim.help.fastforw'/>" >
				<span class="glyphicon glyphicon-fast-forward"></span>
			</a>
				
			<a class="btn btn-default btn-xs " href="#" target="_blank"
			   title="<fmt:message key='ncwms.anim.help.save'/>" >
				<span class="glyphicon glyphicon-floppy-save"></span>
			</a>
				
			<a class="btn btn-default btn-xs " href="#" target="_blank" id="animSaveAsKml"
			   title="<fmt:message key='main.googleE'/>" >
				<span class="glyphicon glyphicon-globe"></span>
			</a>
		</div>
	</div>
	<div class="row">
		<div class="col-xs-12 defShadow title"> 
			<span>
				<fmt:message key="ncwms.anim.currdate" />
			</span>
			<span id="animDate"></span>
		</div>
	</div>
	<div class="row">
		<div class="col-xs-12 defShadow title"> 
			<span>
				<fmt:message key="ncwms.anim.currspeed" />
			</span>
			<span id="animSpeed"></span>
		</div>
	</div>
</div>