/* 
 */
goog.provide('owgis.features.punctual');

goog.require('owgis.calendars');
goog.require('ol.Map');
goog.require('ol.View');
goog.require('ol.source.Vector');

owgis.features.punctual.getVerticalProfile = function getVerticalProfile(event,layerNumber) {
	var currLayer = eval('layer'+layerNumber);
	var currSource = currLayer.getSource();
	
	// Verifies that this layer has zaxis data and that comes from an ncWMS server
	if(currLayer.getSource().getParams().ncwms && _mainlayer_zaxisCoord){
		var x = Math.floor(event.pixel[0]);
		var y = Math.floor(event.pixel[1]);
		
		var time;
		try{
			var gmtVal = true;
			var asStr = true;
			time = owgis.ncwms.calendars.getCurrentDate( asStr, owgis.constants.startcal, gmtVal);
		}
		catch(err) {
			time = layerDetails['nearestTimeIso'];
		}        
		
		var currBBOX = ol3view.calculateExtent(map.getSize());
		//TODO not if this function can returnmore than one result
		var url;
		if(currSource.getUrls !== undefined){
			url = currSource.getUrls().toString();
		}else{
			url = currSource.getUrl().toString();
		}
		if(currLayer.getSource().getParams().ncwmstwo){
			url += "?REQUEST=GetVerticalProfile&STYLES=default/default"
			url += "&VERSION="+owgis.ogc.wmsversionncwms2;
			url += "&SRS=" + _map_projection;
			url += "&INFO_FORMAT=image/png";
			url += "&QUERY_LAYERS="+currSource.getParams().LAYERS+"";
			url += "&LAYERS="+currSource.getParams().LAYERS;
			url += "&BBOX="+currBBOX;
			url += "&X="+x+"&Y="+y;
			url += "&WIDTH="+ map.getSize()[0] +"&HEIGHT="+ map.getSize()[1];
		}else{
			url += "?REQUEST=GetVerticalProfile";
			url += "&CRS=CRS:84";
			url += "&FORMAT=image/png";
			url += "&LAYER="+currSource.getParams().LAYERS;
			var coords = event.coordinate;
			url += "&POINT="+coords[0]+" "+coords[1];
		}
		
		url += "&TIME=" + time;
		
		var dataLink = "<b>Vertical profile: </b> <a href='#' onclick=\"owgis.utils.popUp('" + url + "',520,420)\" > show </a><br>";
		currPopupText += dataLink;
		$("#popup-content").html(currPopupText);
	}//Only for ncwms layers
}

owgis.features.punctual.getTimeSeries= function getVerticalProfile(event,layerNumber) {
	var currLayer = eval('layer'+layerNumber);
	var currSource = currLayer.getSource();
	
	if(currLayer.getSource().getParams().ncwms){
		var x = Math.floor(event.pixel[0]);
		var y = Math.floor(event.pixel[1]);
		
		var time = owgis.ncwms.calendars.getUserSelectedTimeFrame();
		if(time !== undefined){
			
			var currBBOX = ol3view.calculateExtent(map.getSize());
			//TODO not if this function can returnmore than one result
			var url;
			if(currSource.getUrls !== undefined){
				url = currSource.getUrls().toString();
			}else{
				url = currSource.getUrl().toString();
			}
			if(currLayer.getSource().getParams().ncwmstwo){
				url += "?REQUEST=GetTimeseries&STYLES=default/default"
				url += "&TIME=" + time;
				url += "&FORMAT=image/png";
			}else{
				url += "?REQUEST=GetFeatureInfo";
				url += "&FORMAT=image/png";
				var coords = event.coordinate;
				url += "&POINT="+coords[0]+" "+coords[1];
				url += "&TIME=" + time;
			}
			
			url += "&VERSION="+owgis.ogc.wmsversionncwms2;
			url += "&LAYERS="+currSource.getParams().LAYERS;
			url += "&QUERY_LAYERS="+currSource.getParams().LAYERS;
			url += "&SRS=" + _map_projection;
			url += "&X="+x+"&Y="+y;
			url += "&BBOX="+currBBOX;
			url += "&WIDTH="+ map.getSize()[0] +"&HEIGHT="+ map.getSize()[1];
			url += "&INFO_FORMAT=image/png";

			if( _mainlayer_zaxisCoord){
                            if(layerDetails.zaxis.values[owgis.ncwms.zaxis.globcounter] != null &&  layerDetails.zaxis.values[owgis.ncwms.zaxis.globcounter] != "null"){
				url += "&ELEVATION="+layerDetails.zaxis.values[owgis.ncwms.zaxis.globcounter];
                            }
			}
			
			var dataLink = "<b>Time series plot: </b> <a href='#' onclick=\"owgis.utils.popUp('" + url + "',520,420)\" > show </a><br>";
			currPopupText += dataLink;
			$("#popup-content").html(currPopupText);
		}//Only for ncwms layers
	}
}