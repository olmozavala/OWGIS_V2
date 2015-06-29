<%-- 
    Document   : Palettes
    Created on : Sep 18, 2014, 5:51:16 PM
    Author     : Harshul Pandav
--%>

<%@taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<div id="panelRightPalettes" data-role="panel" data-display="overlay" data-position="right">
	<!--Title and close button-->
	<h4><fmt:message key="ncwms.newpal" /></h4>
	<%@include file="../../Options/Palettes.jsp" %>  <%-- This page has all the calendars, the animaton divs  --%>

	<!--This is the draggable window with the current palette and color range options-->
	<h4> <fmt:message key="ncwms.colorrange" /></h4>
	<%@include file="../../Options/ColorRange.jsp" %>  <%-- This page has all the calendars, the animaton divs  --%>
</div>