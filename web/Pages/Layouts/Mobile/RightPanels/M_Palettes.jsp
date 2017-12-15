<%-- 
    Document   : Palettes
    Created on : Sep 18, 2014, 5:51:16 PM
    Author     : Harshul Pandav
--%>
<c:if test='${ncwms}'>
	<div id="mobPanelPalettes" data-role="panel" data-display="overlay" data-position="right">
		<ul data-role="listview" data-inset="true" data-shadow="false" data-divider-theme="a">
			<!--Title and close button-->
		    <li data-role="list-divider"><fmt:message key="ncwms.newpal" /></li>

			<%@include file="../../../Options/Palettes.jsp" %>  <%-- This page has all the calendars, the animaton divs  --%>
			
			<!--This is the draggable window with the current palette and color range options-->
			<%@include file="../../../Options/ColorRange.jsp" %>  <%-- This page has all the calendars, the animaton divs  --%>
		</ul>
	</div>
        <!-- Div to show the color palette -->
        <div id="div-palette-horbar" >
            <canvas id="canvas-palette-horbar" ></canvas>
        </div>
        <script type="text/javascript">
            var divPaletteHorbar = document.getElementById("div-palette-horbar");
            var windHeight = $(window).height();
            divPaletteHorbar.style.top = (windHeight - 30) + "px";
        </script>
</c:if>
