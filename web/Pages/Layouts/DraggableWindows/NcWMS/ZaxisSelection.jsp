<%-- 
    Document   : ZaxisSelection
    Created on : Sep 18, 2014, 5:50:32 PM
    Author     : Olmo Zavala Romero
--%>
<div class="draggableWindow " id="zaxis_selector_parent">
	<div class="row defRowSpace">
		<div class="col-xs-8 invShadow title" id="zaxis_title" > </div>
		
		<div class="col-xs-4 pull-right">
			<a class="btn btn-default btn-xs" href="#" 
			   onclick=" owgis.ncwms.zaxis.displayElevationSelector();">
				<span class="glyphicon glyphicon-remove"> </span> 
			</a>
		</div>
	</div>
		
	<%@include file="../../../Options/ZaxisSelection.jsp" %>  <%-- This page has all the calendars, the animaton divs  --%>
</div>