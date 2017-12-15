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
					onChange="owgis.mobile.closePanels();toggleControlMob();">
				<option value="off"><fmt:message key='mobile.transoff'/></option>
				<option value="on"><fmt:message key='mobile.transon'/></option>
			</select>
		</div>
	</li>
	<li>
		<!--Depth selection-->
	<c:if test='${zaxis}'>
		<li>
			<a class="ui-btn ui-icon-align-center ui-btn-icon-left " 
			   href="#zaxis_selector_parent" >
				<fmt:message key="ncwms.depth" />
			</a>
		</li>
	</c:if>
</li>
<c:if test='${!ncwms}'>
	<li>
		<!--Download data-->
		<a onclick="downloadData();" class="ui-btn ui-icon-download ui-btn-icon-left currentsParent " 
		   data-theme="b">
			<fmt:message key="main.download" />
		</a>
	</li>
</c:if>
<c:if test='${currents}'>
	<li>
		<a class="ui-btn ui-icon-random ui-btn-icon-left currentsParent " 
		   href="#mobPanelCurrents">
			<fmt:message key='ncwms.streamlines.streamlines'/>
		</a>
	</li>
</c:if>

<c:if test='${ncwms}'>
	<%-- Color Palettes --%>
	<li>
		<a class="ui-btn ui-icon-tint-o ui-btn-icon-left " href="#mobPanelPalettes" > 
                        <fmt:message key='mobile.palettes'/>
		</a>
	</li>
	<%-- Calendars --%>
	<c:if test='${multipleDates}'>
		<li>
			<a class="ui-btn ui-icon-calendar ui-btn-icon-left " href="#mobPanelCalendars" >
				<fmt:message key='mobile.animations'/>
			</a>
		</li>
	</c:if>
</c:if>

<%-- Toogle Cesium --%>
<li>
	<a class="ui-btn ui-icon-globe ui-btn-icon-left currentsParent " 
		onclick="owgis.mobile.closePanels();owgis.cesium.toogleCesium();owgis.layouts.draggable.topmenu.toogleUse('.cesiumSpan');" 
	   href="#">
		<fmt:message key='mobile.3d'/>
	</a>
</li>

<!-- Download minimized -->
<li><a class="ui-btn downloadDataParent" 
	   onclick="downloadData();"  >
		<span class="glyphicon glyphicon-download-alt"> </span>
	</a>
</li>

</ul>
<!-- languages Mobil -->
<div data-type="horizontal" data-role="controlgroup" class="">					
    <button id="selectedLanguage" type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false" style="margin-right: 5px; height: 25px">
    <!--It gets initialized by languages.js-->
    </button>
    <ul id="langDropDown" class="dropdown-menu" role="menu">
    <!--It gets initialized by languages.js-->
    </ul>
</div>
