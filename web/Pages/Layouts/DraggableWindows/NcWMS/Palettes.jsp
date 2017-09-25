<%-- 
    Document   : Palettes
    Created on : Sep 18, 2014, 5:51:16 PM
    Author     : Olmo Zavala Romero
--%>

<!--This is the draggable window with all the palettes-->
<div class="transDraggableWindow container-fluid" id="palettes-div">
	<!--Title and close button-->
	<div class="row defRowSpace">
		<div class="col-xs-10 invShadow title" > <fmt:message key="ncwms.newpal" /></div>
			
		<div class="col-xs-2 pull-right">
			<a class="btn btn-default btn-xs" href="#" 
			   onclick="displayOptionalPalettes();">
				<span class="glyphicon glyphicon-remove"> </span> 
			</a>
		</div>
	</div>
	<!--Adds Palette options-->
	<%@include file="../../../Options/Palettes.jsp" %>  <%-- This page has all the calendars, the animaton divs  --%>
</div>

<!--This is the draggable window with the current palette and color range options-->
<div class="transDraggableWindow  container-fluid" id="paletteWindowColorRange" >
		<!--First row is the title and the close button-->
	<div class="row"> 
		<div class="col-xs-8 invShadow title ">
			<fmt:message key="ncwms.colorrange" />
		</div>
		<div class="col-xs-4">
			<div class="pull-right">
				<a class="btn btn-default btn-xs" href="#" onclick="showPalettes();">
					<span class="glyphicon glyphicon-remove"> </span> </a>
			</div>
		</div>
	</div>
	<%@include file="../../../Options/ColorRange.jsp" %>  <%-- This page has all the calendars, the animaton divs  --%>
</div>

<!-- Div to show the color palette -->
<div id="div-palette-horbar" >
	<canvas id="canvas-palette-horbar" ></canvas>
</div>