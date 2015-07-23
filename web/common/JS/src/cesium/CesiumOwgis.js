goog.provide('owgis.cesium');

var CESIUM_BASE_URL="./common/JS/vendor/minimized/";

owgis.cesium.toogleCesium= function toogleCesium(){
	if(_.isEmpty(_cesium)){
		$.getScript( CESIUM_BASE_URL+"Cesium.js")
				.done(function( data, textStatus) {
						$.getScript("./common/JS/vendor/minimized/ol3cesium.js")
							.done(function( data, textStatus) {

									_cesium = new olcs.OLCesium({map: map});
									_cesium.setEnabled(!_cesium.getEnabled());
									//Start the currents animation of 'static' day.
									if(_mainlayer_currents){
										owgis.ncwms.currents.startSingleDateAnimation();
									}

									})//done
						.fail(function( jqxhr, settings, exception){
							console.log("Fail to load ol3cesium.js: "+exception);
								});
					})
				.fail(function( jqxhr, settings, exception){
					console.log("Fail to load Cesium.js: "+exception);
						});
	}else{
		_cesium.setEnabled(!_cesium.getEnabled());
		//Start the currents animation of 'static' day.
		if(_mainlayer_currents){
			owgis.ncwms.currents.startSingleDateAnimation();
		}
	}
}