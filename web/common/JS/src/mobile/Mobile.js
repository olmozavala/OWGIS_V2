goog.provide('owgis.mobile');

owgis.mobile.initMobile = function initMobile(){
	
	$('html, body').css({
	    'overflow': 'hidden',
	    'height': '100%'
	});
	
	$(function() {
	    $( "#radio" ).buttonset();
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
	$('.ui-panel').css({
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
	 * Inserting the sticker panel for Color Panel
	 */
	$('#panel3').slidePanel({
		triggerName: '#trigger3',
		triggerTopPos: '55px',
		panelTopPos: '50px',
		clickOutsideToClose: false
	});

	/**
	 * Inserting the sticker panel for Date Range
	 */
	$('#panel2').slidePanel({
		triggerName: '#trigger2',
		triggerBottomPosFl: true,
		panelTopPos: '120px',
		clickOutsideToClose: false
	});
	
	/**
	 * Inserting the sticker panel for CQL Filter
	 */
	$('#panel4').slidePanel({
		triggerName: '#trigger4',
		triggerTopPos: '250px',
		panelTopPos: '120px',
		clickOutsideToClose: false
	});
	/**
	 * Forcing the Main and Optional Layers to be collapsed on load
	 */
	owgis.optionalLayers.toogleList('#baseLayersData');
	owgis.optionalLayers.toogleList('#optionalLayersData');
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