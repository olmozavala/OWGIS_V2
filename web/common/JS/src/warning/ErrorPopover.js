goog.provide('owgis.error.popover');

owgis.error.popover.create = function newWarningTooltip(text, url){
	console.log("opening popover");
	
	var popupText = text; 
	if(!_.isEmpty(url)){
		popupText+= "<br> Please visit: <br>" +
				"<a href='"+url+"'> "+url+"</a>"
	}

	$("#errorPopupText").html(popupText);
	$("#errorPopup").show();
}