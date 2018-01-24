<%-- 
    Document   : RequiredDivs
    Created on : Aug 3, 2012, 5:58:26 PM
    Author     : Olmo Zavala-Romero
--%>
<!-- Map title -->
<div class="mapTitle defShadow" id="layerTitle"> 
    <div class="row">
        <div class="col-sm-8 col-sm-offset-2 ">
            <p id="pTitleText"> ${layerTitle} </p> 
            <p id="pTitleSubText"> </p> 
        </div>
    </div>
</div>

<!-- This div contains all the map --> 
<div id="map"> </div>      
<div class="layersLonLat">
	<fmt:message key="main.lon" />:&nbsp;&nbsp;<fmt:message key="main.lat" />: &nbsp;
	<div id="location" ></div>
</div>    
	
<!--It is used as the popup of the punctual data feature-->
<div id="popup" class="ol-popup" style="display:none;" >
	<a href="#" id="popup-closer" class="ol-popup-closer"><span class="glyphicon glyphicon-remove"> </span></a>
	<div id="popup-content"></div>
</div>

<!-- This div is only used to contain the movement of the
draggable windows -->
<div id="draggable-container"></div>

<!-- This div displays the specific data of the dynamic maps-->
<div id="jsonpdata" ></div>
<canvas id="testWebGLCanvas"></canvas>
	
<!--Loading gif to display on the map -->
<div id="l-animation" class="menuHidden">
	<p > 
		<span id="loadperc" class="invShadow"></span> 
		<img src="./common/images/loading/009.gif" height="40" border="0" alt="loading" />	
	</p>
</div>