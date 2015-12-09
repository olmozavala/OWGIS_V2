<!-- This displays the current palette and the color range used on it -->

<%@taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<canvas id="animationCanvas"></canvas>
				<img id="animContainer" src="" class="menuHidden"></img>
				
				<%-- <canvas id="animationCanvas"></canvas> --%>
				<!-- <img id="animContainer" src=""></img> -->
				
				<div id="drawer" style="display:none">
					<div id="drawer-pull" class=""></div>
					<div id="drawer-content">
						<div id="animControls">
							<%@include file="../AnimationControls.jsp" %>
						</div>
					</div>
				</div>
				<div id="l-animation" class="menuHidden">
                    <p class="invShadow"> <fmt:message key="ncwms.loading" /> 
						<span id="loadperc" class="invShadow">0</span> % <img src="./common/images/loading/load.gif" height="12" border="0" alt="loading" />	</p>
                </div>