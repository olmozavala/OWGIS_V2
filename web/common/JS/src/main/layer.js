goog.provide('owgis.layer')

owgis.layer.model = Backbone.Model.extend({
	initialize: function(){
//		console.log("ncWMS object initialized");
	},
	defaults:{
		server : "",
		origbbox : "",
		layers : "",
		elevation : 0,
		styles : "",
		time : "",
		service : "WMS",
		version : "1.1.1",
		request : "GetMap",
		exceptions : "application",
		format : "application/json",
		srs :"EPSG:4326",
		bbox : "",
		width : 0,
		height : 0
	},
	getURL: function (){
		var urlString = this.get("server")+"?";
		_.pairs(this.attributes).forEach(function(attrib, i){
			//We avoid adding 'server' and 'origbbox' attribute
			if(_.intersection(attrib,["server","origbbox"]).length === 0){
				if(attrib[1] !== null){
					urlString += attrib[0].toUpperCase()+"="+attrib[1]+"&";
				}
			}
		});

//		console.log(urlString);
		return urlString;
	}
});

/*
var ncwmsoceancurrents = new NcWMSProduct({
	server: "http://146.201.212.175:8080/ncWMS/wms",
	layers: "hycomnew/sea_water_velocity",
	elevation: "-5",
	time: "2012-01-01T00:00:00.000Z",
	bbox: "-98,16.588657379151,-76.400024414064,33.463638305665",
	origbbox: "-98,16.588657379151,-76.400024414064,33.463638305665",
	width: 100,
	height: 100
}); */
