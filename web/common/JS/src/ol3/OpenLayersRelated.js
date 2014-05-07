//these variables are used to set the popup sizes for when the user clicks the map
//the reason it is global is becuase in ajax.js a function uses it to reduce the size
//of the map depending on the resulting output. 
var popUpwidth = 250; 
var popUpheight = 300;


/** Hides or shows one layer of openLayers */
function showLayer(layer, show){
    layer.setVisible(show);
}

/**this functions opens up the url passed in
 *@param url - url passed in
 *@param width - width size of popup screen in pixels
 *@param height - height size of popup screen in pixels
 **/
function popUp(url, width, height)
{
    var day = new Date();
    var id = day.getTime();
    
    //pass in the url to open, the rest of the parameters are just options on the new window that will open.
    window.open(url, id, 'toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=1,width='
        + width + ',height=' + height + ',left = 300,top = 300');
}

/**
 * This function replaces one parameter of the main layer and refresh the map
 */
function updateMainLayerParam(param,value){
	//Obtain the current parameters of the main layer
    layerParams= owgis.layers.getMainLayer().getSource().getParams();

    eval("layerParams."+param+"=\""+value+"\"");//Modify the desired parameter
	
    owgis.layers.getMainLayer().getSource().updateParams(layerParams);//Updates the layer
}

/**
 * Hides the current popup, if any
 */
function closePopUp(){
    $('#popup').fadeOut();
}
