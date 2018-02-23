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
                        if( typeof layerDetails.featureInfo !== 'undefined' ){
                            url += "&QUERY_LAYERS="+layerDetails.featureInfo+"";
                            url += "&LAYERS="+layerDetails.featureInfo;
                        } else {
                            url += "&QUERY_LAYERS="+currSource.getParams().LAYERS+"";
                            url += "&LAYERS="+currSource.getParams().LAYERS;
                        }
			url += "&BBOX="+currBBOX;
			url += "&X="+x+"&Y="+y;
			url += "&WIDTH="+ map.getSize()[0] +"&HEIGHT="+ map.getSize()[1];
		}else{
			url += "?REQUEST=GetVerticalProfile";
			url += "&CRS=CRS:84";
			url += "&FORMAT=image/png";
                        if( typeof layerDetails.featureInfo !== 'undefined' ){
                            url += "&LAYER="+layerDetails.featureInfo;
                        } else {
                            url += "&LAYER="+currSource.getParams().LAYERS;
                        }
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
                              
                              if( screen.width > screen.height){
                                    el_width = screen.width-50;
                                    el_height = screen.height-$("#showVertProf > .modal-dialog > .modal-content > .modal-header").outerHeight()-30;
                                } else{
                                    el_width = screen.width-20;
                                    el_height = screen.height-$("#showVertProf > .modal-dialog > .modal-content > .modal-header").outerHeight()-100;
                                }
                                                                                        
                          }else{
                                    el_width = null;
                                    el_height = 400;
                          }
			console.log(el_width, el_height);			
                        //Create the plot
                          Highcharts.chart('containerChartsVP', {
                            chart: {
                                width: el_width,
				height: el_height
                            },
                            title: {
                              text: 'Vertical Profile of '+data.split('\n')[2].split(',')[1]
                            },
                            subtitle: {
                              text: latlon
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
                              lineWidth: 1
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
                          }
                        );

                        },
                        error: function(ex) {
                          console.log(ex);
                          console.log('NOT!');
                          ajaxCan = false; 
                        }
                      });
                      
                    if(!mobile && ajaxCan){

                        $('#modalVertProf').resizable({
                                    //alsoResize: ".modal-dialog",
                                    minHeight: 500,
                                    minWidth: 600,
                                    resize: function( event, ui ) {
                                        if (typeof $("#containerChartsVP").highcharts() != 'undefined'){
                                            $('#modalVertProf').center();
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
                        
                    }
                    if(ajaxCan){
                        var popuplink = (mobile) ? "" : "<button id='newVerticalProfileWindow' onclick='showVertProf()' class='btn btn-default btn-xs' > <span class='glyphicon glyphicon-new-window' ></span> </button><br>";
                        document.getElementById("modalLabelVertProf").innerHTML = latlon+" "+popuplink;
                        
                        var dataLink = "<b>Vertical profile: </b> <button type=\"button\" class=\"btn btn-default btn-xs\" onclick=\"$('#showVertProf').modal('toggle');\">Show</button><br>";
                        if(mobile){
                            
                            $( window ).on( "orientationchange", function( event ) {
                                console.log("mm", screen.width, screen.height-$("#showVertProf > .modal-dialog > .modal-content > .modal-header").outerHeight());
                                if( screen.width > screen.height){
                                    twidth = screen.width-50;
                                    theight = screen.height-$("#showVertProf > .modal-dialog > .modal-content > .modal-header").outerHeight()-30;
                                } else{
                                    twidth = screen.width-10;
                                    theight = screen.height-$("#showVertProf > .modal-dialog > .modal-content > .modal-header").outerHeight()-100;
                                }
                                $("#containerChartsVP").highcharts().setSize(twidth, theight, doAnimation = true);
                            });
                            
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
                                document.getElementById("containerChartsVP").innerHTML = "";
                                img1 = document.createElement('img');
                                img1.src= url;
                                img1.style.width = "100%";
                                document.getElementById("containerChartsVP").appendChild(img1);
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
                        
                        if( typeof layerDetails.featureInfo !== 'undefined' ){
                            url += "&LAYERS="+layerDetails.featureInfo;
                            url += "&QUERY_LAYERS="+layerDetails.featureInfo;
                        } else {
                            url += "&LAYERS="+currSource.getParams().LAYERS;
                            url += "&QUERY_LAYERS="+currSource.getParams().LAYERS;
                        }
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
                                    if( screen.width > screen.height){
                                            el_width = screen.width-50;
                                            el_height = screen.height-$("#showTimeSeries > .modal-dialog > .modal-content > .modal-header").outerHeight()-30;
                                    } else{
                                            el_width = screen.width-20;
                                            el_height = screen.height-$("#showTimeSeries > .modal-dialog > .modal-content > .modal-header").outerHeight()-100;
                                    }
                                 
                                 }else{
                                    el_width = null;
                                    el_height = 400;
                                 }
				console.log(el_width, el_height);	
				 //Create the plots
				 Highcharts.chart('containerChartsTS', {
				    chart: {
					width: el_width,
					height: el_height
                                    },
                                    title: {
                                      text: 'Time Series'
                                    },
                                    subtitle: {
                                        text: latlon
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
                                      lineWidth: 1
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
                            
                            if(!mobile && ajaxCan){
                                $('#modalTimeSeries').resizable({
                                    //alsoResize: ".modal-dialog",
                                    minHeight: 500,
                                    minWidth: 600,
                                    resize: function( event, ui ) {
                                        if (typeof $("#containerChartsTS").highcharts() != 'undefined'){
                                            $('#modalTimeSeries').center();
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
                            }
                            if( ajaxCan ){
                                var popuplink = (mobile) ? "" : "<button id='newTimeSeriesWindow' onclick='showTimeSeries()' class='btn btn-default btn-xs' > <span class='glyphicon glyphicon-new-window' ></span> </button>";
                                document.getElementById("modalLabelTimeSeries").innerHTML = latlon+" "+popuplink;
                                var dataLink = "<b>Time series plot: </b> <button type=\"button\" class=\"btn btn-default btn-xs\" onclick=\"$('#showTimeSeries').modal('toggle');\">Show</button><br>";
                                if(mobile){
                                    $( window ).on( "orientationchange", function( event ) {
                                        
                                        if( screen.width > screen.height){
                                            twidth = screen.width-50;
                                            theight = screen.height-$("#showTimeSeries > .modal-dialog > .modal-content > .modal-header").outerHeight()-30;
                                        } else{
                                            twidth = screen.width-10;
                                            theight = screen.height-$("#showTimeSeries > .modal-dialog > .modal-content > .modal-header").outerHeight()-100;
                                        }
                                
                                        $("#containerChartsTS").highcharts().setSize(twidth, theight , doAnimation = true);
                                    });
                                    
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
                                document.getElementById("containerChartsTS").innerHTML="";
                                img1 = document.createElement('img');
                                img1.src= url;
                                img1.style.width = "100%";
                                document.getElementById("containerChartsTS").appendChild(img1);
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

jQuery.fn.center = function() {
    var container = $(window);
    //var top = -this.height() / 2;
    var left = -this.width() / 2;
    return this.css('position', 'absolute').css({ 'margin-left': left + 'px', 'left': '50%' }); //, 'top': '50%'
}