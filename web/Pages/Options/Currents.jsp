<%-- 
    Document   : Palettes
    Created on : Aug 3, 2012, 6:26:56 PM
    Author     : Olmo Zavala-Romero
--%>

<!-- Title -->
<div class="row ">
	<!--Contains the applied pallete on the left of the window-->
	<div class="col-xs-12 invShadow title" > Customize currents</div>
</div><!-- Row -->
<!-- Color Picker-->
<div class="row ">
	<div class="col-xs-4 col-xs-offset-1 invShadow " > Color </div>
	<div class="col-xs-5 invShadow " > 
		<input type='text' id='customizeCurrents' />
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
	<div class="col-xs-6 col-xs-offset-3 " > 
		<a class="btn btn-default btn-xs " href="#" 
		   onclick="owgis.ncwms.currents.play()"
		   title="Play" >
			<span class="glyphicon glyphicon-play" ></span>
		</a>
		<a class="btn btn-default btn-xs " href="#" 
		   onclick="owgis.ncwms.currents.pause()"
		   title="<fmt:message key='ncwms.anim.help.pause'/>" >
			<span class="glyphicon glyphicon-pause"></span>
		</a>
	</div>
</div>