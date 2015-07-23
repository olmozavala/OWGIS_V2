goog.provide('owgis.mobile');

var isDrawerOpen=false;

owgis.mobile.openDrawer = function openDrawer(){
	$("#drawer").animate({
		bottom: 0
	}, 200);

	$("#drawer-pull").attr('class', 'flipped');
	isDrawerOpen =true;
}

owgis.mobile.closeDrawer = function closeDrawer(){
	//TODO this 133 is hard coded remove it
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
	owgis.mobile.updateSize();
	
	$("#drawer").css("display","block");
}

/**
 * This function updates the size of the map when the screen size has changed. 
 * @returns {undefined}
 */
owgis.mobile.updateSize = function (){
	windowHeight = $(window).height();
	$("#map").height(windowHeight); //Resize the size of the map container
	if (map !== null) {
		map.updateSize();
	}
}

owgis.mobile.closePanels = function(){
	if(mobile){
		console.log("Closing panels...");
		$(".ui-panel").panel("close");
	}
}