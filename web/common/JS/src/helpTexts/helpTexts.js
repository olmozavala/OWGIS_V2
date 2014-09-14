goog.provide('owgis.tooltips');

owgis.tooltips.initHelpTexts = function initHelpTexts() {
	
	$('.toolTip, .toolTipWithImage').on("mousemove",function(){
//		if(!$(this).attr('title')){return true;}
//		alert($(this).html);
			var disabled = $('.toolTip').uitooltip( "option", "disabled" );
			if(!disabled){
				$(this).uitooltip('close'); 
				$(this).uitooltip('open');
			}
	});
	
	$('.toolTip').uitooltip({
		show: null, 
		hide: null, 
		tooltipClass: 'commonHover',
		position: { my: "left top+15", at: "left bottom" , collision: "flipfit"},
			});
	
	$('.toolTip.transDraggableWindow, .toolTip.draggableWindow' ).uitooltip({
		show: null, 
		hide: null, 
		tooltipClass: 'commonHover',
		position: { my: "left+15 center", at: "right center", collision: "flipfit" },
			});
//	
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
}




//function updateToolTipPos(){
//	alert('tooltip moved');
////	$('.toolTip').uitooltip('disable');
////	$('.toolTipWithImage').uitooltip('disable');
////	$('.toolTip').uitooltip('enable');
////	$('.toolTipWithImage').uitooltip('enable');
//}
