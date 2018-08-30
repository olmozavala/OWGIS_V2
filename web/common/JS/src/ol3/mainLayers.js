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
 * Makes a synchronous request and saves the dates into the "allFrames" array.
 */
owgis.layers.getTimesForDay = function(layer, time, allFrames){
	var mainLayer = layer;
	var mainSource = mainLayer.getSource();
	var mainParams = mainSource.getParams();
	var layerName = mainParams.LAYERS;
	
	if(mainSource.getUrls){
		owgis.ncwms.animation.currUrl = mainSource.getUrls()[0];//Get url for 
	}else{
		owgis.ncwms.animation.currUrl = mainSource.getUrl();//Get url for 
	}
	
	var animParams = { 
		REQUEST: "GetMetadata",
		item: "timesteps",
		layerName: layerName,
		day: time
	};
	
	var url = owgis.ncwms.animation.currUrl+"?"+owgis.utils.paramsToUrl(animParams);
	
	jQuery.ajax({
		url: url,
		success: function(timesAsJson) {
			for(var i = 0; i < timesAsJson.timesteps.length; i++){
				allFrames.push(time+"T"+timesAsJson.timesteps[i]);
			}
		},
		async:false
	});
	
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