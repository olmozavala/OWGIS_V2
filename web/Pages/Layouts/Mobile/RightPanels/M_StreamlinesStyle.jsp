<%-- Right panel with current options--%>
<div data-role="panel" class="rightPanel" id="mobPanelCurrents" 
    data-display="overlay" data-position="right">
	<ul data-role="listview" data-inset="true" data-shadow="false">
		<li data-role="list-divider"> <fmt:message key='ncwms.streamlines.streamlines'/> </li>
		<%@include file="../../../Options/StreamLines.jsp"%>
	</ul>
</div>			
