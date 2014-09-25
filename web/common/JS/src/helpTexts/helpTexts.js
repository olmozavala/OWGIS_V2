goog.provide('owgis.tooltips');

owgis.tooltips.initHelpTexts = function initHelpTexts() {
	
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
		position: { my: "left top+15", at: "left bottom" , collision: "flipfit"},
			});
	
	// Updates the tooltips for the dragabble windows, the tooltip appears at
	// the center in the right.
	$('.toolTip.transDraggableWindow, .toolTip.draggableWindow' ).uitooltip({
		show: null, 
		hide: null, 
		tooltipClass: 'commonHover',
		position: { my: "left+15 center", at: "right center", collision: "flipfit" },
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