goog.provide('owgis.tooltips');

owgis.tooltips.initHelpTexts = function initHelpTexts() {
	
	$('.toolTip').uitooltip({
		show: null, 
		hide: null, 
		tooltipClass: 'commonHover',
		
			});
	
	
	$('.toolTipWithImage').uitooltip({
		show: null, 
		hide: null, 
		tooltipClass: 'commonHover',
		
		content: function() {
		 var tooltip_div = "#" + $(this).attr('title');
		 return $(tooltip_div).html();
			}
		});
//		var tooltip_div;
//	 $('.toolTipWithImage').mouseover(function(e){
//		 		if($(this).attr('data-tip-source') == null) return false;
//		 		tooltip_div = "#" + $(this).attr('data-tip-source');
//		 		$(tooltip_div).css('display','block');
//	        }).mousemove(function(e){
//	        	if($(this).attr('data-tip-source') == null) return false;
//	        	tooltip_div = "#" + $(this).attr('data-tip-source');
//	            var toolTipWidth = $(tooltip_div).outerWidth();
////	            var toolTipHeight = $(tooltip_div).outerHeight();
//	            var pageWidth = $(document).width();
//	             if( e.pageX > pageWidth/2 ) {
//	            	 $(tooltip_div).css('left', (e.pageX-toolTipWidth+20)+'px');
//	             }
//	             else {
//	            	 $(tooltip_div).css('left', (e.pageX-20)+'px');
//	             }
//	               $(tooltip_div).css('top', (e.pageY+20)+'px');        
//	        }).mouseout(function(e){
//	        	if($(this).attr('data-tip-source') == null) return false;
//	        	tooltip_div = "#" + $(this).attr('data-tip-source');
//	        	$(tooltip_div).css('display','none');
//	        });
}