<!-- This displays the current palette and the color range used on it -->
<div id="mobPanelCalendars" data-role="panel" data-display="overlay" data-position="right">
	<ul data-role="listview" data-inset="true" data-shadow="false">
		<li>
			<div id="hideOneDay">
				<label for="cal-start"><fmt:message key="ncwms.cal.start" /></label>
				<input type="text" data-role="date" id="cal-start" readonly='true' data-mini="true">
			</div>
		</li>

		<li>
			<div id="hideOneDayEnd">
				<label for="cal-end"><fmt:message key="ncwms.cal.end" /></label>
				<input type="text" data-role="date" id="cal-end" readonly='true' data-mini="true">
			</div>
		</li>
		<li>
			<label>
				<fmt:message key='ncwms.resolution' />:
			</label>
		</li>
		<li>
			<div data-role="controlgroup" data-type="horizontal">
				<input type="radio" value="high" name="video_res" id="video_res_hi" data-mini="true" class="custom" >
				<label for="video_res_hi">High</label>
					
				<input type="radio" value="normal" name="video_res" id="video_res_normal" data-mini="true" class="custom" checked="checked">
				<label for="video_res_normal">Mid</label>
					
				<input type="radio" value="low" name="video_res" id="video_res_low" data-mini="true" class="custom">
				<label for="video_res_low">Low</label>
			</div>
		</li>
		<li>
			<div class="ui-field-contain"> 
				<select id="timeSelect" name="timeSelect" style="color:black">
					<option value="delete"> Select time range</option>
				</select>
			</div>
		</li>
		<li>
			<div  id="p-animation">
				<a href="#" class="ui-btn ui-mini " 
				   onclick="owgis.ncwms.animation.dispAnimation();" > 
					<fmt:message key="ncwms.dispanim" />
				</a>
			</div>
		</li>
	</ul>
</div>