<%-- 
    Document   : AnimationControls
    Created on : Sep 18, 2014, 12:42:14 PM
    Author     : Olmo Zavala Romero
--%>
	
<c:if test='${mobile}'>
	<!--Title and close button-->
		<span class="defShadow title label" >
			<fmt:message key="ncwms.animcontrol" /> </span><br>
	<!--Fast forward-->
	<a class="ui-btn ui-mini ui-btn-inline ui-icon-fast-forward ui-btn-icon-notext" href="#" 
	   onclick="animFirstFrame()" ></a> 
	<!--Decrease Step-->
	<a class="ui-btn ui-mini ui-btn-inline ui-icon-step-backward ui-btn-icon-notext" href="#" 
	   onclick="animDecreaseFrame()" ></a> 
	<!--Slower animation-->
	<a class="ui-btn ui-mini ui-btn-inline ui-icon-backward ui-btn-icon-notext" href="#" 
	   onclick="animSlower()" ></a> 
	<!--Stop animation-->
	<a class="ui-btn ui-mini ui-btn-inline ui-icon-stop ui-btn-icon-notext" href="#" 
	   onclick="updateAnimationStatus('none')" ></a> 
	<!--Play-->
	<a class="ui-btn ui-mini ui-btn-inline ui-icon-play ui-btn-icon-notext" href="#" 
	   onclick="updateAnimationStatus('playing')" ></a> 
	<!--Pause -->
	<a class="ui-btn ui-mini ui-btn-inline ui-icon-pause ui-btn-icon-notext" href="#" 
	   onclick="updateAnimationStatus('paused')" ></a> 
	<!--Faster animation -->
	<a class="ui-btn ui-mini ui-btn-inline ui-icon-forward ui-btn-icon-notext" href="#" 
	   onclick="animFaster()" ></a> 
	<!--Increase Step-->
	<a class="ui-btn ui-mini ui-btn-inline ui-icon-step-forward ui-btn-icon-notext" href="#" 
	   onclick="animIncreaseFrame()" ></a> 
	<!--Last Frame-->
	<a class="ui-btn ui-mini ui-btn-inline ui-icon-fast-forward ui-btn-icon-notext" href="#" 
	   onclick="animLastFrame()" ></a> 
	<!--Save -->
	<a class="ui-btn ui-mini ui-btn-inline ui-icon-save ui-btn-icon-notext" href="#" 
	   target="_blank" ></a> 
	<!--Display Google Earth-->
	<a class="ui-btn ui-mini ui-btn-inline ui-icon-globe ui-btn-icon-notext" href="#" 
	   target="_blank" id="animSaveAsKml" ></a> 
	<br>
	<span class="title defShadow"><fmt:message key="ncwms.anim.currdate" /> </span>	
	<span class="defShadow" id="animDate"></span> 
	<br>
	<span class="title defShadow"> <fmt:message key="ncwms.anim.currspeed" /></span>
	<span class="defShadow" id="animSpeed"></span>
</c:if>
<c:if test='${!mobile}'>
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
</c:if>