<!-- This displays the current palette and the color range used on it -->

<%@taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<a href="#" id="trigger2" class="trigger left" style="display:none">Date Range</a>
				<div id="panel2" class="panel left">
					
					<div id="CalendarParent container-fluid">
						<div class="row" >
							<div class="col-xs-6 text-center title " id="hideOneDay">
								<span class="invShadow"> <fmt:message
										key="ncwms.cal.start" /></span><br>
							</div>
							<div class="col-xs-6 text-center title " id="hideOneDayEnd">
								<span class="invShadow"> <fmt:message key="ncwms.cal.end" /></span><br>
							</div>
							
						</div>
						<div class="row" style="margin-bottom: 10px">
							<div class="col-xs-5" id="hideOneDay">
								<input type="text" data-role="date" id="cal-start" readonly='true' style="width: 120px; color:black">
							</div>
							<div class="col-xs-2"></div>
							<div class="col-xs-5" id="hideOneDay">
								<input type="text" data-role="date" id="cal-end" readonly='true' style="width: 120px; color:black">							
							</div>
						</div>
						<div class="row "style="margin-bottom: 5px">
							<div class="col-xs-6 col-xs-offset-3 invShadow text-center">
								<fmt:message key='ncwms.resolution' />
								:
							</div>
						</div>
						<div class="row ">
							<div class="col-xs-4 invShadow text-center">
								<label class="radio-inline"> <input type="radio"
																	value="high" name="video_res"> <fmt:message
										key='ncwms.resolutionHigh' />
								</label> 
							</div>
							<div class="col-xs-4 invShadow text-center">
								
								<label class="radio-inline"> <input type="radio"
																	value="normal" name="video_res" checked> <fmt:message
										key='ncwms.resolutionMiddle' />
								</label> 
							</div>
							
							<div class="col-xs-4 invShadow text-center">
								
								<label class="radio-inline"> <input type="radio"
																	value="low" name="video_res"> <fmt:message
										key='ncwms.resolutionLow' />
								</label>
							</div>
						</div>
						<div class="row" style="margin-bottom: 20px">
							<div class="col-xs-6 col-xs-offset-3 text-center">
								<select class="form-control" id="timeSelect" name="timeSelect" style="color: black">
								</select>
							</div>
						</div>
						<div class="row">
							<div class="col-xs-8 col-xs-offset-2 text-center" id="p-animation">
								<div class="buttonStyle "
									 onclick="owgis.ncwms.animation.dispAnimation();">
									<fmt:message key="ncwms.dispanim" />
								</div>
							</div>
							
						</div>
						
						
					</div>
				</div>