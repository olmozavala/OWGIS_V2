<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<ul data-role="listview" data-inset="true" data-shadow="false"
	id="leftList">
	<li><div id="kmlLinkParent"
			title="<fmt:message key='help.tooltip.googleE'/>">
			<%@include file="../KmlLink.jsp"%>
		</div></li>
	<li>
		<div id="transParent"
			title="<fmt:message key='help.tooltip.transparency'/>">
			<%@include file="../Transparency.jsp"%>
		</div>
	</li>
	<li><div id="elevationParent"
			title="<fmt:message key='help.tooltip.depthElevation'/>">
			<%@include file="../Elevation.jsp"%>
		</div></li>
	<li>
		<div class="transect-slider">
			<select name="flip-1" id="lineToggle" data-role="slider"
				onChange="toggleControlMob();">
				<option value="off">Transect Off</option>
				<option value="on">Transect On</option>
			</select>
		</div>
	</li>
	<li><div id="downloadDataParent"
			title="<fmt:message key='help.tooltip.download'/>"
			onclick="downloadData();">
			<fmt:message key="main.download" />
		</div></li>
</ul>