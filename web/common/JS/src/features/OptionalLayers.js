goog.provide('owgis.optionalLayers');

var currTransp = [];//this is the array to control the opacity of the different optional layers. 

var widthContainer = 0;
/**
 * It shows or hides the submenus in the optional layers menu
 * @param {string} id Id of the object we want to show or hide
 */
owgis.optionalLayers.toggleList = function(id){
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
owgis.optionalLayers.showOptionalLayer = function(selectedLayer,visibility, zoom, center){
    owgis.layers.showLayer(selectedLayer, visibility);
    if(zoom !== null && center[0] !== null && center[1] !== null) {
        animatePositionMap(zoom, center);
    }
    owgis.ol3.popup.closePopUp();
}

/**
 *this function changes the transparency of the optional layers if the layer is selected, otherwise ignore
 *@param selectedLayer - currently displayed layer
 *@param val - transparency value
 *@param {type} index Index of the optional layer
 *@param id_minus - css id of minus button 
 *@param id_plus - css id of plus button 
 *@param checkboxId - option checkbox id
 */
owgis.optionalLayers.changeTransparency = 
		function(selectedLayer, val, index, id_minus, id_plus, checkboxId){
    var checkid = getElementById(checkboxId);
	
    if (checkid.checked === true)//check if the layer is selected
    {
        currTransp[index] = currTransp[index] + val;
		
        var optionOpacity = currTransp[index];//locate which global opacity layer it is
		
        //Disables the buttons.
        if (optionOpacity < maxOpacity) {
            getElementById(id_minus).disabled = false;
            $("#"+id_minus).attr('disabled', false);
            if(!mobile)
            	changeColor(getElementById(id_minus), 0);//Change color to enabled
        } else {
            getElementById(id_minus).disabled = true;
            $("#"+id_minus).attr('disabled', true);
            if(!mobile)
            	changeColor(getElementById(id_minus), 3);//Change color to disabled 
        }
		
        if (optionOpacity > minOpacity) {
            getElementById(id_plus).disabled = false;
            $("#"+id_plus).attr('disabled', false);
            if(!mobile)
            	changeColor(getElementById(id_plus), 0);//Change color to enabled
        } else {
            getElementById(id_plus).disabled = true;
            $("#"+id_plus).attr('disabled', true);
            if(!mobile)
            	changeColor(getElementById(id_plus), 3);//Change color to disabled 
        }
		
        if (optionOpacity < .00001) {
            optionOpacity = 0;
        }
        selectedLayer.setOpacity(optionOpacity);
    }
}

/**this function initializes the gloabl currTransp
 *@param checkboxNum - 0 for us states, 1 for all cruises , and 2 for all sites. 
 */
owgis.optionalLayers.initTransp = function(checkboxNum){
    currTransp[checkboxNum] = 1;
}

/**
 *Disables the + or - buttons if the layer is not selected
 *@param index - index of select object
 *@param id_minus - css id of minus button of index object
 *@param id_plus - css id of plus button of index object
 *@param checkboxId - css id of checkbox
 */
owgis.optionalLayers.disableTranspButton = function(index, id_minus, id_plus, checkboxId)
{
	
    var checkid = getElementById(checkboxId);
	
	
    if (checkid.checked === true)//check if the layer is selected
    {
        var optionOpacity = currTransp[index];//localte which global opacity layer it is
		
        //Disables the buttons.
        if (optionOpacity < maxOpacity) {
            getElementById(id_minus).disabled = false;
            $("#"+id_minus).attr('disabled', false);
            if(!mobile)
            	changeColor(getElementById(id_minus), 0);//Change color to enabled
        } else {
            getElementById(id_minus).disabled = true;
            $("#"+id_minus).attr('disabled', true);
            if(!mobile)
            	changeColor(getElementById(id_minus), 3);//Change color to disabled 
        }
		
        if (optionOpacity > minOpacity) {
            getElementById(id_plus).disabled = false;
            $("#"+id_plus).attr('disabled', false);
            if(!mobile)
            	changeColor(getElementById(id_plus), 0);//Change color to enabled
        } else {
            getElementById(id_plus).disabled = true;
            $("#"+id_plus).attr('disabled', true);
            if(!mobile)
            	changeColor(getElementById(id_plus), 3);//Change color to disabled 
        }
    }
    else
    {
        //Disables the buttons.
        getElementById(id_minus).disabled = true;
        $("#"+id_minus).attr('disabled', true);
        if(!mobile)
        	changeColor(getElementById(id_minus), 3);//Change color to disabled 
		
        getElementById(id_plus).disabled = true;
        $("#"+id_plus).attr('disabled', true);
        if(!mobile)
        	changeColor(getElementById(id_plus), 3);//Change color to disabled 
		
    }
	
}