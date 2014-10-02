goog.provide('owgis.transparency');

goog.require('owgis.layers');
goog.require('owgis.ncwms.animation.status');

/**
 * Manages the transparency of the main layer and the animation (if loading)
 * the version parameter is either topMenu or master
 * @param val - new value of transparency
 */
owgis.transparency.changeTransp = function(val) {
    layer = owgis.layers.getMainLayer();
    changeTransp(val, layer);
	
    if (netcdf) {
		if(owgis.ncwms.animation.status.current !== owgis.ncwms.animation.status.none ){
            changeTransp(val, animLayer);
		}
    }
}

/**
 * Changes the transparencya of the inputed layer.
 * @param val - value of transparency
 * @param layer - currently viewing layer
 */
function changeTransp(val, layer) {
    opacity = opacity + val;
    //Checks we are not in the limits of transparency
    //Disables the buttons.
    if (opacity <= maxOpacity) {
        $('#minusButtonTrans').removeClass('disabled');
    } else {
        $('#minusButtonTrans').addClass('disabled');
    }
	
    if (opacity >= minOpacity) {
        $('#plusButtonTrans').removeClass('disabled');
    } else {
        $('#plusButtonTrans').addClass('disabled');
    }
	
    layer.setOpacity(opacity);
}