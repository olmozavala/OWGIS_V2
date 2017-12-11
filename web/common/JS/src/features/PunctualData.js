/* 
 */
goog.provide('owgis.features.punctual');

goog.require('owgis.calendars');
goog.require('ol.Map');
goog.require('ol.View');
goog.require('ol.source.Vector');
goog.require('owgis.utils');

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
			url += "&INFO_FORMAT=text/csv";
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
                
                if(currLayer.getSource().getParams().ncwmstwo){
                    var ajaxCan;
                    var latlon;
                    $.ajax({
                        url: url,
                        async: false,
                        cache: false,
                        success: function(data) {

                          ajaxCan = true;
                          var templat = data.split('\n').slice(0,1)[0];
                          var templon = data.split('\n').slice(0,2)[1];
                          latlon = templat.substring(templat.indexOf("#") + 1, 17)+' '+templon.substring(templon.indexOf("#") + 1, 18);
                                  
                          data = data.replace(/^.*null.*$/mg, "");
                          data = data.replace(/^\s*\n/gm, "");
                          
                          ajaxCan = !owgis.utils.check_empty_array(data.split('\n').slice(3,-1));
                          
                          if(mobile){
                            document.getElementById("containerChartsVP").style.width = screen.width+"px";
                          }                        
                          Highcharts.chart('containerChartsVP', {
                            title: {
                              text: 'Vertical Profile of '+data.split('\n')[2].split(',')[1]
                            },
                            data: {
                              csv: data
                            },
                            chart: {
                                type: 'spline',
                                inverted: true
                            },
                            yAxis: {
                              lineWidth: 1
                            },
                            xAxis: {
                              title: {
                                text: data.split('\n')[2].split(',')[0]
                              },
                              lineWidth: 1
                            },
                            tooltip: {
                                pointFormat: "{point.y:.2f} "+ layerDetails.units
                            },
                            plotOptions: {
                              series: {
                                marker: {
                                  enabled: false
                                }
                              }
                            },
                            series: [{
                              lineWidth: 1,
                              //color: '#c4392d'
                            }]
                          }
                        );

                        },
                        error: function(ex) {
                          console.log(ex);
                          console.log('NOT!');
                          ajaxCan = false; 
                        }
                      });
                      
                    $('#modalVertProf').resizable({
                                //alsoResize: ".modal-dialog",
                                minHeight: 500,
                                minWidth: 600,
                                resize: function( event, ui ) {
                                    if (typeof $("#containerChartsVP").highcharts() != 'undefined'){
                                        $("#containerChartsVP").highcharts().setSize(document.getElementById('modalVertProf').offsetWidth-30, document.getElementById('modalVertProf').offsetHeight-60-30, doAnimation = true);
                                    }
                                }
                    });
                        
                    $('.modal-dialog').draggable();
                        
                    $('#showVertProf').on('show.bs.modal', function () {
                       $(this).find('.modal-body').css({
                            'max-height':'100%'
                        });
                    });

                      if(ajaxCan){
                        document.getElementById("modalLabelVertProf").innerHTML = latlon;
                        var dataLink = "<b>Vertical profile: </b> <button type=\"button\" class=\"btn btn-default btn-xs\" onclick=\"$('#showVertProf').modal('toggle');\">Show</button><br>";
                        if(mobile){
                            document.getElementById("containerChartsVP").style.display = 'block';
                        }
                      } else {
                          var dataLink = "";
                      }
                }
                else if(!layerDetails['ncwmstwo']){
                    if(mobile){
                                showImgVP = function(url){
                                    document.getElementById("containerChartsVP").innerHTML = "";
                                    img1 = document.createElement('img');
                                    img1.src= url;
                                    img1.style.width = "100%";
                                    document.getElementById("containerChartsVP").appendChild(img1);
                                    document.getElementById("containerChartsVP").style.display = 'block';
                                    $('#showVertProf').modal('toggle');
                                };
                                var dataLink = "<b>Vertical profile: </b> <a href='#' onclick=\"showImgVP('" + url + "')\" > show </a><br>";
                    } else {
                                //var dataLink = "<b>Vertical profile: </b> <a href='#' onclick=\"owgis.utils.popUp('" + url + "',520,420)\" > show </a><br>";
                                document.getElementById("containerChartsVP").innerHTML = "";
                                img1 = document.createElement('img');
                                img1.src= url;
                                img1.style.width = "100%";
                                document.getElementById("containerChartsVP").appendChild(img1);
                                //document.getElementById("showVertProf").firstChild.style.width = "520px";
                                var dataLink = "<b>Vertical profile: </b> <button type=\"button\" class=\"btn btn-default btn-xs\" onclick=\"$('#showVertProf').modal('toggle');\">Show</button><br>";
                    }
                }else {
                    var dataLink = "";
                }
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
				url += "&FORMAT=text/csv";
                                url += "&INFO_FORMAT=text/csv";
			}else{
				url += "?REQUEST=GetFeatureInfo";
				url += "&FORMAT=image/png";
				var coords = event.coordinate;
				url += "&POINT="+coords[0]+" "+coords[1];
				url += "&TIME=" + time;
                                url += "&INFO_FORMAT=image/png";
			}
			
			url += "&VERSION="+owgis.ogc.wmsversionncwms2;
			url += "&LAYERS="+currSource.getParams().LAYERS;
			url += "&QUERY_LAYERS="+currSource.getParams().LAYERS;
			url += "&SRS=" + _map_projection;
                        url += "&WIDTH="+ map.getSize()[0] +"&HEIGHT="+ map.getSize()[1];
			url += "&X="+x+"&Y="+y;
			url += "&BBOX="+currBBOX;
                        

			if( _mainlayer_zaxisCoord){
                            if(layerDetails.zaxis.values[owgis.ncwms.zaxis.globcounter] != null &&  layerDetails.zaxis.values[owgis.ncwms.zaxis.globcounter] != "null"){
				url += "&ELEVATION="+layerDetails.zaxis.values[owgis.ncwms.zaxis.globcounter];
                            }
			}
			if(currLayer.getSource().getParams().ncwmstwo){
                            var ajaxCan;
                            var latlon;
                            $.ajax({
                                url: url,
                                async: false,
                                cache: false,
                                success: function(data) {
                                  
                                  var templat = data.split('\n').slice(0,1)[0];
                                  var templon = data.split('\n').slice(0,2)[1];
                                  latlon = templat.substring(templat.indexOf("#") + 1, 17)+' '+templon.substring(templon.indexOf("#") + 1,18);

                                  data = data.replace(/^.*null.*$/mg, "");
                                  data = data.replace(/^\s*\n/gm, "");
                                  ajaxCan = true;
                                  ajaxCan = !owgis.utils.check_empty_array(data.split('\n').slice(3,-1));
                                  
                                  if(typeof layerTitle != "undefined"){
                                      titulo=layerTitle.innerText.split('\n')[0];
                                  } else{
                                      titulo = data.split('\n')[2].split(',')[1];
                                  }
                                  
                                  if(mobile){
                                      document.getElementById("containerChartsTS").style.width = screen.width+"px";
                                  }                  
                                  Highcharts.chart('containerChartsTS', {
                                    title: {
                                      text: 'Time Series'
                                    },
                                    yAxis: {
                                      title: {
                                        text:  data.split('\n')[2].split(',')[1]
                                      },
                                      lineWidth: 1
                                    },
                                    xAxis: {
                                      title: {
                                        text: data.split('\n')[2].split(',')[0]
                                      },
                                      lineWidth: 1
                                    },
                                    data: {
                                      csv: data
                                    },
                                    tooltip: {
                                        pointFormat: "{point.y:.2f} " + layerDetails.units
                                    },
                                    plotOptions: {
                                      series: {
                                        marker: {
                                          enabled: false
                                        }
                                      }
                                    },
                                    series: [{
                                      lineWidth: 1,
                                      //color: '#c4392d'
                                    }]
                                  }
                                );

                                },
                                error: function(ex) {
                                  ajaxCan = false;
                                  console.log(ex);
                                  console.log('NOT!');
                                }
                            });
                            
                            $('#modalTimeSeries').resizable({
                                //alsoResize: ".modal-dialog",
                                minHeight: 500,
                                minWidth: 600,
                                resize: function( event, ui ) {
                                    if (typeof $("#containerChartsTS").highcharts() != 'undefined'){
                                        $("#containerChartsTS").highcharts().setSize(document.getElementById('modalTimeSeries').offsetWidth-30, document.getElementById('modalTimeSeries').offsetHeight-60-30, doAnimation = true);
                                    }
                                }
                            });

                            $('.modal-dialog').draggable();

                            $('#showTimeSeries').on('show.bs.modal', function () {
                               $(this).find('.modal-body').css({
                                    'max-height':'100%'
                                });
                            });
                            
                            if( ajaxCan ){
                                document.getElementById("modalLabelTimeSeries").innerHTML = latlon;
                                var dataLink = "<b>Time series plot: </b> <button type=\"button\" class=\"btn btn-default btn-xs\" onclick=\"$('#showTimeSeries').modal('toggle');\">Show</button><br>";
                                if(mobile){
                                    document.getElementById("containerChartsTS").style.display = 'block';
                                }
                            } else {
                                var dataLink = '';
                            }
                            
                        } else if(!currLayer.getSource().getParams().ncwmstwo) {
                            if(mobile){
                                showImgTS = function(url){
                                    document.getElementById("containerChartsTS").innerHTML = "";
                                    img1 = document.createElement('img');
                                    img1.src= url;
                                    img1.style.width = "100%";
                                    document.getElementById("containerChartsTS").appendChild(img1);
                                    document.getElementById("containerChartsTS").style.display = 'block';
                                    $('#showTimeSeries').modal('toggle');
                                };
                                var dataLink = "<b>Time series plot: </b> <a href='#' onclick=\"showImgTS('" + url + "')\" > show </a><br>";
                            } else {
                                //var dataLink = "<b>Time series plot: </b> <a href='#' onclick=\"owgis.utils.popUp('" + url + "',520,420)\" > show </a><br>";
                                document.getElementById("containerChartsTS").innerHTML="";
                                img1 = document.createElement('img');
                                img1.src= url;
                                img1.style.width = "100%";
                                document.getElementById("containerChartsTS").appendChild(img1);
                                //document.getElementById("showTimeSeries").firstChild.style.width = "520px";
                                var dataLink = "<b>Time series plot: </b> <button type=\"button\" class=\"btn btn-default btn-xs\" onclick=\"$('#showTimeSeries').modal('toggle');\">Show</button><br>";
                            }
                        } else {
                            var dataLink = "";
                        }
			currPopupText += dataLink;
			$("#popup-content").html(currPopupText);
		}//Only for ncwms layers
	}
}