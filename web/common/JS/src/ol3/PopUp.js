
goog.provide('owgis.ol3.popup');

/**
 * Hides the current popup, if any
 */
owgis.ol3.popup.closePopUp = function (){
	console.log("Closing popup punctual data");
    $('#popup').fadeOut();
}
