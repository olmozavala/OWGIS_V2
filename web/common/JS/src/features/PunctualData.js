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
                    $.ajax({
                        url: url,
                        async: false,
                        cache: false,
                        success: function(data) {

                          ajaxCan = true;
                          
                          data = data.replace(/^.*null.*$/mg, "");

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
                                pointFormat: data.split('\n')[2].split(',')[1]+": {point.y:.2f}"
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
                          }, function(chart) {

                            showVertProf = function(){
                            //open a new window with the highchart
                            var options = chart.userOptions,
                                container = chart.renderTo,
                                w,
                                html = '<div class="loader" id="loader" style="display: block;"></div> <div id="' + container.id + '" style="display:none;min-width: 310px; height: 400px; margin: 0 auto"></div>',
                                s1 = document.createElement('script'),
                                s2 = document.createElement('script'),
                                s3 = document.createElement('script'),
                                s4 = document.createElement('script');
                                s5 = document.createElement('link');
                              t = document.createTextNode('Highcharts.chart("containerChartsVP", ' + JSON.stringify(options) + ');');
                              s3.setAttribute('type', 'text/javascript');
                              s3.appendChild(t);
                              s5.setAttribute('href', window.location.origin+window.location.pathname+'/../common/CSS/highcharts.css');
                              s5.setAttribute('rel',"stylesheet");
                              s4.setAttribute('src', 'http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js');
                              s1.setAttribute('src', 'https://code.highcharts.com/highcharts.js');
                              s2.setAttribute('src', 'https://code.highcharts.com/modules/exporting.js');
                              w = window.open('', '_blank', "height=420,width=520");

                              w.document.getElementsByTagName('head')[0].appendChild(s5);
                              w.document.getElementsByTagName('head')[0].appendChild(s4);
                              setTimeout(function() {
                                w.document.getElementsByTagName('head')[0].appendChild(s1);
                                w.document.body.innerHTML=html;
                                setTimeout(function() {
                                  w.document.getElementsByTagName('head')[0].appendChild(s2);
                                  w.document.getElementsByTagName('body')[0].appendChild(s3);
                                  w.document.getElementById('loader').style.display = 'none';
                                  w.document.getElementById('containerChartsVP').style.display = "block";
                                }, 3000)
                              }, 300);
                            }
                          });

                        },
                        error: function(ex) {
                          console.log(ex);
                          console.log('NOT!');
                          ajaxCan = false; 
                        }
                      });
                      
                      if(!mobile && ajaxCan){
                        var dataLink = "<b>Vertical profile: </b> <button id='newVerticalProfile' onclick='showVertProf()' class='btn btn-default btn-xs' > show </button><br>";
                      } else {
                          var dataLink = "";
                      }
                }
                else if(!layerDetails['ncwmstwo']){
                    var dataLink = "<b>Vertical profile: </b> <a href='#' onclick=\"owgis.utils.popUp('" + url + "',520,420)\" > show </a><br>";
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
                            $.ajax({
                                url: url,
                                async: false,
                                cache: false,
                                success: function(data) {
                                    
                                  data = data.replace(/^.*null.*$/mg, "");
                                  ajaxCan = true;

                                  Highcharts.chart('containerChartsTS', {
                                    title: {
                                      text: 'Time Series'
                                    },
                                    yAxis: {
                                      title: {
                                        text: data.split('\n')[2].split(',')[1]
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
                                        pointFormat: data.split('\n')[2].split(',')[1]+": {point.y:.2f}"
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
                                  }, function(chart) {

                                    showTimeSeries = function(){
                                    //open a new window with the highchart
                                    var options = chart.userOptions,
                                        container = chart.renderTo,
                                        w,
                                        html = '<div class="loader" id="loader" style="display: block;"></div> <div id="' + container.id + '" style="min-width: 310px; height: 400px; margin: 0 auto"></div>',
                                        s1 = document.createElement('script'),
                                        s2 = document.createElement('script'),
                                        s3 = document.createElement('script'),
                                        s4 = document.createElement('script');
                                        s5 = document.createElement('link');
                                      t = document.createTextNode('Highcharts.chart("containerChartsTS", ' + JSON.stringify(options) + ');');
                                      s3.setAttribute('type', 'text/javascript');
                                      s3.appendChild(t);
                                      s5.setAttribute('href', window.location.origin+window.location.pathname+'/../common/CSS/highcharts.css');
                                      s5.setAttribute('rel',"stylesheet");
                                      s4.setAttribute('src', 'http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js');
                                      s1.setAttribute('src', 'https://code.highcharts.com/highcharts.js');
                                      s2.setAttribute('src', 'https://code.highcharts.com/modules/exporting.js');
                                      w = window.open('', '_blank', "height=420,width=520");

                                      w.document.getElementsByTagName('head')[0].appendChild(s5);
                                      w.document.getElementsByTagName('head')[0].appendChild(s4);
                                      setTimeout(function() {
                                        w.document.getElementsByTagName('head')[0].appendChild(s1);
                                        w.document.body.innerHTML=html;
                                        setTimeout(function() {
                                          w.document.getElementsByTagName('head')[0].appendChild(s2);
                                          w.document.getElementsByTagName('body')[0].appendChild(s3);
                                          w.document.getElementById('loader').style.display = 'none';
                                          w.document.getElementById('containerChartsTS').style.display = "block";

                                        }, 1500)
                                      }, 300);
                                    }
                                  });

                                },
                                error: function(ex) {
                                  ajaxCan = false;
                                  console.log(ex);
                                  console.log('NOT!');
                                }
                            });
                            if( ajaxCan ){
                                var dataLink = "<b>Time series plot: </b> <button id='newTimeSeries' onclick='showTimeSeries()' class='btn btn-default btn-xs' > show </button><br>";
                            } else {
                                var dataLink = '';
                            }
                            
                        } else if(!currLayer.getSource().getParams().ncwmstwo && !mobile) {
                            var dataLink = "<b>Time series plot: </b> <a href='#' onclick=\"owgis.utils.popUp('" + url + "',520,420)\" > show </a><br>";
                        } else {
                            var dataLink = "";
                        }
			currPopupText += dataLink;
			$("#popup-content").html(currPopupText);
		}//Only for ncwms layers
	}
}