<%-- 
    Document   : Palettes
    Created on : Sep 18, 2014, 5:51:16 PM
    Author     : Harshul Pandav
--%>

<%@taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<a href="#" id="trigger3" class="trigger right">Palettes</a>

<div id="panel3" class="panel right">
	<!--Title and close button-->
	<div class="row defRowSpace">
		<div class="col-xs-12 invShadow title" > <fmt:message key="ncwms.newpal" /></div>
	</div>
	<%@include file="../../Options/Palettes.jsp" %>  <%-- This page has all the calendars, the animaton divs  --%>

	<!--This is the draggable window with the current palette and color range options-->
	<div class="row"> 
		<div class="col-xs-12 invShadow title ">
			<fmt:message key="ncwms.colorrange" />
		</div>
	</div>
	<%@include file="../../Options/ColorRange.jsp" %>  <%-- This page has all the calendars, the animaton divs  --%>
</div>