<%-- 
    Document   : Currents
    Created on : May 21, 2015, 2:14:42 PM
    Author     :  Olmo Zavala Romero
--%>

<!--This div contains all the animation controls (play, stop, pause, etc.--> 
<div id="currentsControlsContainer" class="container-fluid transDraggableWindow menuHidden">
		<!-- Title -->
		<div class="row defRowSpace">
			<!--Contains the applied pallete on the left of the window-->
			<div class="col-xs-8 invShadow title" > <fmt:message key='ncwms.streamlines.streamlines'/> </div>
			<div class="col-xs-3 pull-right">
				<a class="btn btn-default btn-xs" href="#" onclick="owgis.ncwms.currents.style.togglestyling();">
					<span class="glyphicon glyphicon-remove"> </span> 
				</a>
			</div>

		</div><!-- Row -->
		
	<%@include file="../../../Options/StreamLines.jsp" %> 
</div>