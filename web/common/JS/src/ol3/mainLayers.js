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
