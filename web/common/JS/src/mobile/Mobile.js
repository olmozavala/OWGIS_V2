goog.provide('owgis.mobile');

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
	var isDrawerOpen=false;
	$("div#drawer-pull").bind('click', function(e){
		if (!isDrawerOpen){
			$("#drawer").animate({
	            bottom: 0
	        }, 200);
	    $("#drawer-pull").attr('class', 'flipped');
	    isDrawerOpen =true;
		}
		else{
			$("#drawer").animate({
	            bottom: -133
	        }, 200);
		    $("#drawer-pull").attr('class', '');
		    isDrawerOpen =false;

		}
	});

	/**
	 * Forcing the Main and Optional Layers to be collapsed on load
	 */
	owgis.optionalLayers.toggleList('#baseLayersData');
	owgis.optionalLayers.toggleList('#optionalLayersData');
	owgis.mobile.updateSize();
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
		$(".rightPanel").panel("close");
	}
}