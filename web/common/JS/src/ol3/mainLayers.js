goog.provide('owgis.layers');

var layer = undefined;// It will have the Ol3 object storing the main layer

/**
 * Defines which one is the main layer
 */
owgis.layers.initMainLayer = function(lay){
    layer = lay;
}

/**
 * Returns the current main layer
 */
owgis.layers.getMainLayer = function(){
    return layer;
}

/**
 * Returns the current CQL_FILTER or undefinded
 */
owgis.layers.getCQLFilter= function(){
    return owgis.layers.getMainLayer().getSource().getParams().CQL_FILTER;
}

/**
 * This function obtains the server path of the main layer. 
 * @returns {unresolved}
 */
owgis.layers.getMainLayerServer = function(){
	var mainLayer = owgis.layers.getMainLayer();
	var mainSource = mainLayer.getSource();

	var mainLayerServer = mainSource.getUrls()[0];
	return mainLayerServer;
}

/** Hides or shows one layer of openLayers */
owgis.layers.showLayer = function(layer,show){
    layer.setVisible(show);
}


/**
 * This function replaces one parameter of the main layer and refresh the map
 */
owgis.layers.updateMainLayerParam= function(param,value){
	//Obtain the current parameters of the main layer
    layerParams= owgis.layers.getMainLayer().getSource().getParams();

    eval("layerParams."+param+"=\""+value+"\"");//Modify the desired parameter
	
    owgis.layers.getMainLayer().getSource().updateParams(layerParams);//Updates the layer
}