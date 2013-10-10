/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


/**
 * It shows or hides the submenus in the optional layers menu
 * @param {string} id Id of the object we want to show or hide
 */
function toogleList(id){
	if( $(id).css('display') == 'none'){
		$(id).fadeIn();
	}else{
		$(id).fadeOut();
	}
}

/** Changes visibility of optional layers
 * 
 */
function manageOptionalLayers(selectedLayer,visibility){        
    showLayer(selectedLayer, visibility);
	closePopUp();
}