/**
 * 
 */
//$( document ).ready(function() {
//	var qrcode = new QRCode("qrcode");
//	qrcode.makeCode("test");
//});

function getGesdsoServerLayers(){
	
	$.ajax('http://map1.vis.earthdata.nasa.gov/wmts-geo/wmts.cgi?SERVICE=WMTS&request=GetCapabilities').then(function(response) {
		var url = $($(response).find('[name=GetTile] HTTP').children()[1]).attr("xlink:href");
		
		$(response).find('Layer').each(function (idx,layer){
			var name = $(layer).find('Title').text();
			
			//TODO I do not know if this will always work (removing 'default')
			name = name.replace('default','');
			
			var matrixSet = $.trim($(layer).find('TileMatrixSetLink').text());
			var zoomLevels = obtainZoomLevels(matrixSet);
			var format = $.trim($(layer).find('Format').text());
			
			var extent =  [$(layer).find('LowerCorner').text(), $(layer).find('UpperCorner').text()];
			
			var times = $($(layer).find('Dimension')).find('Value').text().split('/');
			
			//All layers have the same max resolution
			nasa_layers[idx] = new NasaLayer(name,extent,"",matrixSet,0.5625,"",zoomLevels,format,times[0],times[1]);
			
		});
		
		fillDropdown(nasa_layers,currentLayer,url);
		
		initMaps();
	});
}

function getGeoServerLayers(){
	
	$.ajax({
		type: "GET",
//		url: 'xml/getcapabilities_1.3.0.xml',
		url:  'http://132.248.8.238:8080/geoserver/wms?SERVICE=WMS&request=GetCapabilities',
		dataType: "xml",
			xhrFields: {
			    // The 'xhrFields' property sets additional fields on the XMLHttpRequest.
			    // This can be used to set the 'withCredentials' property.
			    // Set the value to 'true' if you'd like to pass cookies to the server.
			    // If this is enabled, your server must respond with the header
			    // 'Access-Control-Allow-Credentials: true'.
			    withCredentials: false
			  }
	}).then(function(response) {
		var layers = $(response).find('Layer > Layer');
		
		for(var i=0; i<layers.size(); i++){
			var title = $(layers[i]).children('Title').text();
//		alert($(layers[i]).children('Title').text());
		
		$(".geoServerContent").append('<div class="row-fluid sortable"><div class="box span12"><div class="box-header" data-original-title><h2><i class="halflings-icon edit"></i><span class="break"></span>Layer: '+title+'</h2><div class="box-icon"><a href="#" class="btn-setting"><i class="halflings-icon wrench"></i></a><a href="#" class="btn-minimize"><i class="halflings-icon chevron-up"></i></a><a href="#" class="btn-close"><i class="halflings-icon remove"></i></a></div></div><div class="box-content"><form class="form-horizontal">  <fieldset><div class="control-group">  <label class="control-label" for="typeahead">Layer Name </label>  <div class="controls">  <input type="text" class="span6 typeahead" id="typeahead">  </div></div><div class="control-group">  <label class="control-label" for="typeahead">Layer Title </label>  <div class="controls">  <input type="text" class="span6 typeahead" id="typeahead">  </div></div><div class="control-group" >  <label class="control-label" for="typeahead">Keywords </label>  <div class="controls">  <input type="text" class="span6 typeahead" id="typeahead">  </div></div><div class="control-group">  <label class="control-label" for="typeahead">West Bound Longitude </label>  <div class="controls">  <input type="text" class="span6 typeahead" id="typeahead">  </div></div><div class="control-group">  <label class="control-label" for="typeahead">East Bound Longitude </label>  <div class="controls">  <input type="text" class="span6 typeahead" id="typeahead">  </div></div><div class="control-group">  <label class="control-label" for="typeahead">South Bound Latitude </label>  <div class="controls">  <input type="text" class="span6 typeahead" id="typeahead">  </div></div><div class="control-group">  <label class="control-label" for="typeahead">North Bound Latitude </label>  <div class="controls">  <input type="text" class="span6 typeahead" id="typeahead">  </div></div><div class="form-actions">  <button type="submit" class="btn btn-primary">Add to XML</button>  <button type="reset" class="btn">Cancel</button></div>  </fieldset></form>   </div></div></div>');
		
		
		
		
		}
//		$(response).find('Layer > Layer').each(function (index){
//			
//			var name = $(this).text();
//			
//			//TODO I do not know if this will always work (removing 'default')
////			name = name.replace('default','');
////			
////			var matrixSet = $.trim($(layer).find('TileMatrixSetLink').text());
////			var zoomLevels = obtainZoomLevels(matrixSet);
////			var format = $.trim($(layer).find('Format').text());
////			
////			var extent =  [$(layer).find('LowerCorner').text(), $(layer).find('UpperCorner').text()];
////			
////			var times = $($(layer).find('Dimension')).find('Value').text().split('/');
////			
////			//All layers have the same max resolution
////			nasa_layers[idx] = new NasaLayer(name,extent,"",matrixSet,0.5625,"",zoomLevels,format,times[0],times[1]);
//			
//		});
//		alert($(response).find('Layer > Layer')[0]);
	});
}


function downloadMobileApp(){
	$(".loader").fadeIn("fast");
	var url = $("#mobileSiteUrl").val();
	
	$.ajax({
		type : "POST",
		url : "../MobileServlet",
		data : "url=" + url,
		success: function(data){
			$(".loader").fadeOut("slow");
			var qrcode = new QRCode("qrcode");
			qrcode.makeCode(data);
			$('#qrcode-control').css('display','block');
			window.open(data,'_self');

		}
		});	
}
