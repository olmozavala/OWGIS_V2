<ul data-role="listview" data-inset="true" data-shadow="false" id="leftList">
	<li>
		<%@include file="../KmlLink.jsp"%>
	</li>
	<li>
		<!--Transparency selection-->
		<div id="transParent"
			 title="<fmt:message key='help.tooltip.transparency'/>">
			<%@include file="../Transparency.jsp"%>
		</div>
	</li>
	<li>
		<!--Transect Tool-->
		<div class="transect-slider">
			<select name="flip-1" id="lineToggle" data-role="slider"
					onChange="toggleControlMob();">
				<option value="off"><fmt:message key='mobile.transoff'/></option>
				<option value="on"><fmt:message key='mobile.transon'/></option>
			</select>
		</div>
	</li>
	<li>
		<!--Depth selection-->
	<c:if test='${netcdf}'>
		<li>
			<a class="ui-btn ui-icon-align-center ui-btn-icon-left " 
			   href="#zaxis_selector_parent" >
				<fmt:message key="ncwms.depth" />
			</a>
		</li>
	</c:if>
</li>
<li>
	<!--Download data-->
	<a onclick="downloadData();" class="ui-btn ui-icon-download ui-btn-icon-left currentsParent " 
	   data-theme="b">
		<fmt:message key="main.download" />
	</a>
</li>
<c:if test='${currents}'>
	<li>
		<a class="ui-btn ui-icon-random ui-btn-icon-left currentsParent " 
		   href="#mobPanelCurrents">
			Currents
		</a>
	</li>
</c:if>

<c:if test='${netcdf}'>
	<%-- Color Palettes --%>
	<li>
		<a class="ui-btn ui-icon-picture-o ui-btn-icon-left " href="#mobPanelPalettes" > Palettes
		</a>
	</li>
	<%-- Calendars --%>
	<li>
		<a class="ui-btn ui-icon-calendar ui-btn-icon-left " href="#mobPanelCalendars" >
			Calendars
		</a>
	</li>
</c:if>

<!-- Download minimized -->
<li><a class="ui-btn downloadDataParent" 
	   onclick="downloadData();"  >
		<span class="glyphicon glyphicon-download-alt"> </span>
	</a>
</li>

</ul>
