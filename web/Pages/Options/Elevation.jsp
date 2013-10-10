<%-- 
    Document   : Elevation
    Created on : Aug 3, 2012, 6:23:54 PM
    Author     : olmozavala
--%>
	
<%-- 
This page controls the elevation of the displayed layer, it can be height or precipitation as well. 
There is 3 options. Either '-' or '+' or click the button to choose the disired height or precipitation level. 
--%>
<a class="btn btn-default btn-xs" href="#" id="minusButtonElevation" 
    onclick="changeElevation('-', layer1);">
    <span class="glyphicon glyphicon-minus"></span> </a>

<span style="cursor: pointer;" id="elevationText"  onclick ="displayElevationSelector() " 
	  onmouseover="hoverInstructions('elevationParentHover', '1')" onmouseout="hoverInstructions('elevationParentHover', '2')" >
	<fmt:message key="ncwms.depth" /></span>

<a class="btn btn-default btn-xs " href="#" id="plusButtonElevation"
        onclick="changeElevation('+', layer1);">
    <span class="glyphicon glyphicon-plus "></span> </a>
