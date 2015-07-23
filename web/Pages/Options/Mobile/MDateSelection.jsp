<!-- This displays the current palette and the color range used on it -->

<%@taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<a href="#" id="trigger2" class="trigger left" style="display:none">Date Range</a>
				<div id="panel2" class="panel left" style="width: 240px">
					
					<div id="CalendarParent container-fluid">
						<div>
							<div id="hideOneDay">
								<span class="invShadow"> <fmt:message
										key="ncwms.cal.start" /></span><br>
							</div>
							<div id="hideOneDay">
								<input type="text" data-role="date" id="cal-start" readonly='true' data-mini="true">
							</div>
							
							
						</div>
						<div  style="margin-bottom: 10px">
							<div  id="hideOneDayEnd">
								<span class="invShadow"> <fmt:message key="ncwms.cal.end" /></span><br>
							</div>
							<div id="hideOneDay">
								<input type="text" data-role="date" id="cal-end" readonly='true' data-mini="true">							
							</div>
						</div>
						<div style="margin-bottom: 5px">
							<div >
								<fmt:message key='ncwms.resolution' />:
							</div>
						</div>
						<div data-role="controlgroup" data-type="horizontal">
    <input type="radio" value="high" name="video_res"" id="video_res_hi" data-mini="true" class="custom" >
    <label for="video_res_hi">High</label>
 
    <input type="radio" value="normal" name="video_res" id="video_res_normal" data-mini="true" class="custom" >
    <label for="video_res_normal">Mid</label>
 
    <input type="radio" value="low" name="video_res" id="video_res_low" data-mini="true" class="custom">
    <label for="video_res_low">Low</label>
    
							
						</div>
						<div  style="margin-bottom: 20px">
							<div >
								<select id="timeSelect" name="timeSelect" style="color: black">
								</select>
							</div>
						</div>
						<div >
							<div  id="p-animation">
								<div class="buttonStyle "
									 onclick="owgis.ncwms.animation.dispAnimation();">
									<fmt:message key="ncwms.dispanim" />
								</div>
							</div>
							
						</div>
						
						
					</div>
				</div>