<%-- 
    Document   : Palettes
    Created on : Sep 18, 2014, 5:51:16 PM
    Author     : Harshul Pandav
--%>


<%-- Left Panel for Main and Optional Layers --%>
<div data-role="panel" class="rightPanel" id="mobPanelLayers" data-theme="b"
	 data-display="overlay" data-position="right">
	<div data-role="fieldcontain" id="ulBaseLayers">
		<%@include file="../../../Options/Mobile/MBaseLayers.jsp"%>
	</div>
	<div data-role="fieldcontain" id="optionalLayersWindow">
		<%@include file="../../../Options/Mobile/MOptionalLayers.jsp"%>
	</div>
</div>

