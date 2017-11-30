goog.provide('owgis.mobile');

goog.require('owgis.ol3.popup');

var isDrawerOpen=false;

var reduceNumberStreamLinesBy = 2;// n times less particles than non cesium

owgis.mobile.openDrawer = function openDrawer(){
	console.log("Opening Drawer");
	$("#drawer").animate({
		bottom: 0
	}, 200);

	$("#drawer-pull").attr('class', 'flipped');
	isDrawerOpen =true;
}

/**
 * This function is used to bind the events of opening and closing panels
 * so that the punctual data popup is closed with any of those events. 
 * @returns {undefined}
 */
function onTooglePanelEvents(){
	console.log("Toogle Panels...");
	$("[data-role=panel]").on("panelbeforeopen", owgis.ol3.popup.closePopUp);
	$("[data-role=panel]").on("panelbeforeclose", owgis.ol3.popup.closePopUp);
}

owgis.mobile.closeDrawer = function closeDrawer(){
	console.log("Closing Drawer");
	$("#drawer").animate({
				bottom: -92
			}, 200);
	$("#drawer-pull").attr('class', '');
	isDrawerOpen =false;
}

owgis.mobile.initMobile = function initMobile(){
	
	$('html, body').css({
	    'height': '100%'
	});
	
	/**
	 * Hides the tools which are not applicable for the selected Main layer
	 */
	$("#leftList > li").each(function(){
		if(!$(this).children().is(':visible')){
			$(this).remove();
		}
	});
	
	/**
	 *  Styling and modifying the height of the Side panels for Tools and Layers
	 */
	var header = $('[data-role=header]').outerHeight();
	$('#mobPanelLayers, #mobPanelPalettes, #mobPanelCalendars, #mobPanelCurrents, #mobPanelCQL').css({
	    'top': header,
	    'min-height': '20px',
		'border-radius': '10px',
		'opacity':'0.9'
	});
	
	/**
	 * Bottom drawer for Animation controls
	 */
	$("div#drawer-pull").bind('click', function(e){
		if (!isDrawerOpen){ 
			owgis.mobile.openDrawer(); 
		} else{ 
			owgis.mobile.closeDrawer(); 
		}
	});
	
	/**
	 * Forcing the Main and Optional Layers to be collapsed on load
	 */
	owgis.optionalLayers.toggleList('#baseLayersData');
	owgis.optionalLayers.toggleList('#optionalLayersData');
	owgis.mobile.update();
	
	$("#drawer").css("display","block");

	//Binds opening and closing events to the panels
	onTooglePanelEvents();
}

/**
 * This function updates the size of the map when the screen size has changed. 
 * @returns {undefined}
 */
owgis.mobile.update = function (){
	windowHeight = $(window).height();
	$("#map").height(windowHeight); //Resize the size of the map container
	if (map !== null) {
		map.updateSize();
	}
	if(_mainlayer_streamlines){
		var totParticles = Math.ceil(owgis.ncwms.currents.particles.getDefaultNumParticles()/reduceNumberStreamLinesBy);
		owgis.ncwms.currents.style.updateNumberOfParticlesSliders(totParticles);
		owgis.ncwms.currents.particles.setNumParticles(totParticles);
	}
}

owgis.mobile.closePanels = function(){
	if(mobile){
		console.log("Closing panels...");
		$(".ui-panel").panel("close");
	
                document.getElementById("containerChartsTS").innerHTML = "";
                document.getElementById("containerChartsVP").innerHTML = "";
                document.getElementById("containerChartsTS").style.display = 'none';
                document.getElementById("containerChartsVP").style.display = 'none';
                
                document.getElementById("popup").style.width = "200px";
        }
}