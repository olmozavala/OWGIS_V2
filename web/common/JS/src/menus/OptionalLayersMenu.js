/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var widthContainer = 0;
/**
 * It shows or hides the submenus in the optional layers menu
 * @param {string} id Id of the object we want to show or hide
 */
function toogleList(id){
	var currWidth = $(id).parent().width();
	if( widthContainer < currWidth){
		widthContainer = currWidth;
		$(id).parent().css('min-width',widthContainer);
	}
	if( $(id).css('display') === 'none'){
		$(id).slideDown(200);
	}else{
		$(id).slideUp(200);
	}
}

/** Changes visibility of optional layers
 * 
 */
function manageOptionalLayers(selectedLayer,visibility){        
    showLayer(selectedLayer, visibility);
	closePopUp();
}