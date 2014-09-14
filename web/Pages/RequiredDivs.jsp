<%-- 
    Document   : RequiredDivs
    Created on : Aug 3, 2012, 5:58:26 PM
    Author     : olmozavala
--%>
<!-- Map title -->
<div class="mapTitle defShadow" id="layerTitle"> 
    <div class="row">
        <div class="col-sm-8 col-sm-offset-2 ">
            <p id="pTitleText"> ${layerTitle} </p> 
        </div>
    </div>
</div>

<!-- This div contains all the map --> 
<div id="map"> </div>      
<div class="layersLonLat">
	<span>
		<fmt:message key="main.lon" />:&nbsp;&nbsp;<fmt:message key="main.lat" />: &nbsp;
	</span>
	<div id="location" ></div>
</div>    
	
<div id="popup" class="ol-popup">
	<a href="#" id="popup-closer" class="ol-popup-closer"></a>
	<div id="popup-content"></div>
</div>

<!-- This div is only used to contain the movement of the
draggable windows -->
<div id="draggable-container"></div>

<!-- This div displays the specific data of the map -->
<div id="jsonpdata" ></div>