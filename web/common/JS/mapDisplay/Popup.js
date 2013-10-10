
/*  -------------------- Popup.js -------------------------
 * This file contains all the functions related with the Ol3 popup
 */
	popup_container = document.getElementById('popup');
	popup_content = document.getElementById('popup-content');
	popup_closer = document.getElementById('popup-closer');

	/**
	 * Add a click handler to hide the popup.
	 * @return {boolean} Don't follow the href.
	 */
	popup_closer.onclick = function() {
		popup_container.style.display = 'none';
		popup_closer.blur();
		return false;
	};


	/**
	 * Create an ol_popup to anchor the popup to the map.
	 */
	ol_popup = new ol.Overlay({
		element: popup_container
	});

