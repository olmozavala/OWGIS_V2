goog.provide('owgis.help.tooltips');

/**
 * This function initializes the tooltips that are displayed on the interface 
 */
owgis.help.tooltips.initHelpTexts = function () {
	
	//We only use tooltips in the destkop version
	if(!mobile){
		// When any of the windows move, it repositions the tooltip by reloading it.
		// "toolTipWithImage are used when the text of the tooltip requires images
		$('.toolTip, .toolTipWithImage').on("mousemove",function(){
				var disabled = $('.toolTip').uitooltip( "option", "disabled" );
				if(!disabled){
					$(this).uitooltip('close'); 
					$(this).uitooltip('open');
				}
		});
		
		//Initializes all the tooltips. By default they appear at the left bottom
		$('.toolTip').uitooltip({
			show: null, 
			hide: null, 
			tooltipClass: 'commonHover',
			position: { my: "left top+15", at: "left bottom" , collision: "flipfit"}
				});
		
		// Updates the tooltips for the dragabble windows, the tooltip appears at
		// the center in the right.
		$('.toolTip.transDraggableWindow, .toolTip.draggableWindow' ).uitooltip({
			show: null, 
			hide: null, 
			tooltipClass: 'commonHover',
			position: { my: "left+15 center", at: "right center", collision: "flipfit" }
				});


		//For the tooltips that require images inside, we assign the contents
		// of the the object with the id of title='id' and use that as a conent
		$('.toolTipWithImage.transDraggableWindow, .toolTipWithImage.draggableWindow').uitooltip({
			show: null, 
			hide: null, 
			tooltipClass: 'commonHover',
			position: { my: "left+15 center", at: "right center", collision: "flipfit" },
			content: function() {
			 var tooltip_div = "#" + $(this).attr('title');
			 return $(tooltip_div).html();
				}
			});

		// Remove all attributes 'title' from the childrens of the calendar containers
		// If we don't do it, there are problems with the tooltips inside the datepickers
		$("#CalendarsAndStopContainer [title]").removeAttr("title")
	}
}

/**
 * This function enables or disables displaying the hover txts 
 */
owgis.help.tooltips.toggleTooltips = function() {

    hoverDisabled = !hoverDisabled;
    if (hoverDisabled) {
    	try{
    	$('.toolTip').uitooltip( "option", "disabled", true );
    	$('.toolTipWithImage').uitooltip( "option", "disabled", true );
    }
    catch(e){
       	$('.toolTip').uitooltip();
    	$('.toolTipWithImage').uitooltip();
    	$('.toolTip').uitooltip( "option", "disabled", true );
    	$('.toolTipWithImage').uitooltip( "option", "disabled", true );
    }
finally {
        $("#helpHoverImg").attr("src","./common/images/Help/Help1Disabled.png");
}
    } else {
     	$('.toolTip').uitooltip('enable');
    	$('.toolTipWithImage').uitooltip('enable');
        $("#helpHoverImg").attr("src","./common/images/Help/Help1.png");
    }
}
