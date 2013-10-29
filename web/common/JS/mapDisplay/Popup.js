
/*  -------------------- Popup.js -------------------------
 * This file contains all the functions related with the Ol3 popup
 */

/**
 * Add a click handler to hide the popup.
 * @return {boolean} Don't follow the href.
 */
$("#popup-closer").click(function() {
    $("#popup").hide();
    $("#popup-closer").blur();
});


/**
 * Create an ol_popup to anchor the popup to the map.
 */
ol_popup = new ol.Overlay({
    element: document.getElementById('popup'),
    stopEvent:true//Used to not show the popup again when closing it
});

