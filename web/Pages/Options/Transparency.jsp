<%-- 
    Document   : Transparency
    Created on : Aug 3, 2012, 6:19:41 PM
    Author     : Olmo Zavala-Romero
--%>

<%--
This page controls the transparency of the layer being previewed. The transparency is not a call to the server itself
but a service offered by the OpenLayers Library.
	
--%>
<a class="btn btn-default btn-xs disabled" href="#" id="minusButtonTrans"
    onclick="owgis.transparency.changeTransp(.15);">
    <span class="glyphicon glyphicon-minus "></span>
</a>
<span style="cursor: default;" id="transText" ><fmt:message key="ncwms.trans" /></span>
<a class="btn btn-default btn-xs" href="#" id="plusButtonTrans"
    onclick="owgis.transparency.changeTransp(-.15);">
    <span class="glyphicon glyphicon-plus"> </span>
</a>
