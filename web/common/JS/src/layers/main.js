goog.provide('owgis.layers.main');

var layer = undefined;// It will have the Ol3 object storing the main layer

/**
 * Defines which one is the main layer
 */
owgis.layers.main.initLayer = function(lay){
    layer = lay;
}


/**
 * Returns the current main layer
 */
owgis.layers.main.getLayer = function(){
    return layer;
}
