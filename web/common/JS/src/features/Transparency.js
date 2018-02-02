goog.provide('owgis.transparency');

goog.require('owgis.layers');
goog.require('owgis.ncwms.animation.status');

var maxOpacity = 1;
var minOpacity = 0.1;
var opacity = (localStorage.transparency_layer !== "NaN" && typeof localStorage.transparency_layer !== 'undefined') ? parseFloat(localStorage.transparency_layer) : .95 ; //.95;//Default opacity
var incStep = .05;//Increment step of the transparency

/**
 * Returns the current transparency value
 */
owgis.transparency.getTransp = function() {
	return opacity;
}

/**
 * Manages the transparency of the main layer and the animation (if loading)
 * the version parameter is either topMenu or master
 * @param val - new value of transparency
 */
owgis.transparency.changeTransp = function(val) {
    layer = owgis.layers.getMainLayer();
    changeTransp(val, layer);
	
	//If we have an animation we also update the transparency of
	// that layer
	if(!_.isEmpty(animLayer)){
            changeTransp(val, animLayer);
    }
}

/**
 * Increases the transparency of the main and animation layers
 */
owgis.transparency.increaseTransp = function() {
	owgis.transparency.changeTransp(opacity + incStep);
}

/**
 * Decreases the transparency of the main and animation layers
 */
owgis.transparency.decreaseTransp = function() {
	owgis.transparency.changeTransp(opacity - incStep );
}

/**
 * Changes the transparencya of the inputed layer.
 * @param val - value of transparency
 * @param layer - currently viewing layer
 */
function changeTransp(val, layer) {
    opacity = val;
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