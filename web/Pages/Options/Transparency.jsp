<%-- 
    Document   : Transparency
Created on : Aug 3, 2012, 6:19:41 PM
    Author     : Olmo Zavala-Romero
--%>
	
<%--
This page controls the transparency of the layer being previewed. The transparency is not a call to the server itself
but a service offered by the OpenLayers Library.
	
--%>
<c:if test='${mobile}'>
	<label for="transparency" ><fmt:message key="ncwms.trans" /></label>
	<input type="range" name="transparency" value="50" min="0" max="100"
		   data-show-value="true" data-mini="true"
		   class="ui-hidden-accessible"
		   onchange="owgis.transparency.changeTransp(this.value/100)"/>
</c:if>
	
<c:if test='${!mobile}'>
	<a class="btn btn-default btn-xs disabled" href="#" id="minusButtonTrans"
	   onclick="owgis.transparency.increaseTransp();">
		<span class="glyphicon glyphicon-minus "></span>
	</a>
	<span style="cursor: default;" id="transText" ><fmt:message key="ncwms.trans" /></span>
	<a class="btn btn-default btn-xs" href="#" id="plusButtonTrans"
	   onclick="owgis.transparency.decreaseTransp();">
		<span class="glyphicon glyphicon-plus"> </span>
	</a>
</c:if>