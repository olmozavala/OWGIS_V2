<%-- 
    Document   : Palettes
    Created on : Aug 3, 2012, 6:26:56 PM
    Author     : Olmo Zavala-Romero
--%>


<!-- Color Picker-->
<div class="row ">
	<div class="col-xs-4 col-xs-offset-1 invShadow " > Color </div>
	<div class="col-xs-5 invShadow " > 
		<input type='text' id='currentsColor' />
	</div>
</div><!-- Row -->
<!-- Number of particles -->
<div class="row defRowSpace">
	<div class="col-xs-12 invShadow " > # Of Particles 
		<span id="numParticles"></span>
	</div>
</div>
<div class="row defRowSpace">
	<div class="col-xs-10 col-xs-offset-1 " > 
		<div id="numParticlesSlider"></div>
	</div>
</div>
<!-- Particles speed -->
<div class="row defRowSpace">
	<div class="col-xs-12 invShadow " > Particles speed </div>
</div>
<div class="row defRowSpace">
	<div class="col-xs-10 col-xs-offset-1 " > 
		<div id="particleSpeedSlider"></div>
	</div>
</div>
<!-- Particles speed -->
<div class="row defRowSpace">
	<div class="col-xs-12 invShadow " > Particles life time</div>
</div>
<div class="row defRowSpace">
	<div class="col-xs-10 col-xs-offset-1 " > 
		<div id="particleLifeTimeSlider"></div>
	</div>
</div>
<div class="row defRowSpace">
	<div class="col-xs-3 col-xs-offset-1 " > 
		<a class="btn btn-default btn-xs " href="#" 
		   onclick="owgis.ncwms.currents.style.reset();"
		   title="" >
			Reset
		</a>
	</div>

	<div class="col-xs-1 col-xs-offset-1 " > 
		<a class="btn btn-default btn-xs " href="#" 
		   onclick="owgis.ncwms.currents.playPause()"
		   title="<fmt:message key='ncwms.anim.help.play'/>/<fmt:message key='ncwms.anim.help.pause'/>" >
			<span id="currentsPlayPauseButton" class="glyphicon glyphicon-pause"></span>
		</a>
	</div>
</div>