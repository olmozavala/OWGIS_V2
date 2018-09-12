/* 
 */
goog.provide('owgis.features.punctual');

goog.require('owgis.calendars');
goog.require('ol.Map');
goog.require('ol.View');
goog.require('ol.source.Vector');
goog.require('owgis.utils');

var allData= {};
var allFrames = [];
var loopVP;
var optionsChartVP = {};
var isPaused = false;

owgis.features.punctual.getVerticalProfile = function getVerticalProfile(event,layerNumber) {
    var currLayer = eval('layer'+layerNumber);
    var currSource = currLayer.getSource();
    clearInterval(loopVP); // se deberia de terminar cuando cierran el popup tmb
    
	// Verifies that this layer has zaxis data and that comes from an ncWMS server
	if("getParams" in currSource && _mainlayer_zaxisCoord){
            var coords = event.coordinate;
            
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
            var time_ = owgis.ncwms.calendars.getUserSelectedTimeFrame();
            //console.log(time_);
            //create Base Url
            var url;
            var currBBOX = ol3view.calculateExtent(map.getSize());
            //TODO not if this function can returnmore than one result
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
		url += "&POINT="+coords[0]+" "+coords[1];
            }
            
            if(typeof time_ !== "undefined" && currSource.getParams().ncwmstwo){
                //we have a lot of dates! ...
                var datesRange = moment.range(time_);
                var allDates =  Array.from(datesRange.by('day'));
                allDateFrames = allDates.map(m => m.utc().format()); 
                //console.log(allDateFrames, allDateFrames.length);
                
                for(i=0; i<allDateFrames.length; i++){
                    var locCurrDate = new Date(allDateFrames[i]);
                    var reqTIME = owgis.utils.getDate("%Y-%m-%d",locCurrDate,true);
                    var hoursForFirstDay = new Array();
                    owgis.layers.getTimesForDay(owgis.layers.getMainLayer(),reqTIME,hoursForFirstDay);
                    //console.log(hoursForFirstDay);
                    allFrames = allFrames.concat(hoursForFirstDay);
                    //console.log(allFrames);
                }
                
                //console.log(allFrames, allFrames.length);
                var baseUrl = url;
                for(i=0; i<allFrames.length; i++){
                    //console.log(baseUrl+"&TIME="+allFrames[i]);
                    newUrl = baseUrl+"&TIME="+allFrames[i];                    
                    var request = $.ajax({ url: newUrl});
                    allData[allFrames[i]]  = request.done(function(data, status, xhr) { }); //maybe we should check if the response is 200 / 404 / 401 (?)
                }
                // when all ajax calls are done we need to be able to start animation
                var ajaxCan = true;
                if(_curr_language == 'ES'){
                    var latlon = "Latitud: "+(Math.round(coords[0]*100)/100)+" Longitud: "+(Math.round(coords[1]*100)/100);
                } else if(_curr_language == 'EN'){
                    var latlon = "Latitude: "+(Math.round(coords[0]*100)/100)+" Longitude: "+(Math.round(coords[1]*100)/100);
                }
                
                $( document ).ajaxStop(function() {
                    // we set first frame as the Vertical Profile current frame
                    var vpCurrentFrame=0;
                    // check that it is not an html or xml response
                    if( !allData[allFrames[vpCurrentFrame]].hasOwnProperty("responseXML") ){
                        //console.log(allData);
                        //all data ready, lets create the First highchart
                        
                        if(mobile){
                                if( screen.width > screen.height ){
                                    el_width = screen.width-50;
                                    el_height = screen.height-$("#showVertProf > .modal-dialog > .modal-content > .modal-header").outerHeight()-30;
                                } else {
                                    el_width = screen.width-20;
                                    el_height = screen.height-$("#showVertProf > .modal-dialog > .modal-content > .modal-header").outerHeight()-100;
                                }
                        }else{
                                    el_width = null;
                                    el_height = 400;
                        }
                        
                        var templat = allData[allFrames[vpCurrentFrame]].responseText.split('\n').slice(0,1)[0];
                        var templon = allData[allFrames[vpCurrentFrame]].responseText.split('\n').slice(0,2)[1];
                        latlon = templat.substring(templat.indexOf("#") + 1, 17)+' '+templon.substring(templon.indexOf("#") + 1, 18);
                        
                        var data = allData[allFrames[vpCurrentFrame]].responseText;              
                        data = data.replace(/^.*null.*$/mg, "");
                        data = data.replace(/^\s*\n/gm, "");
                        
                        ajaxCan = !owgis.utils.check_empty_array(data.split('\n').slice(3,-1)); // there is actual data in the response
                        console.log(ajaxCan);                            
                        //Create the plot
                        optionsChartVP = {
                            chart: {
                                width: el_width,
				height: el_height
                            },
                            title: {
                              text: (_curr_language == 'ES') ? 'Perfil Vertical de '+data.split('\n')[2].split(',')[1]+', Fecha '+allFrames[vpCurrentFrame] : 'Vertical Profile of '+data.split('\n')[2].split(',')[1]+', Date '+allFrames[vpCurrentFrame]
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
                        };
                          
                        Highcharts.chart('containerChartsVP', optionsChartVP);
                       
                    }
                });
                if(!mobile && ajaxCan){

                            $('#modalVertProf').resizable({
                                        minHeight: 500,
                                        minWidth: 600,
                                        resize: function( event, ui ) {
                                            if (typeof $("#containerChartsVP").highcharts() != 'undefined'){
                                                $('#modalVertProf').center();
                                                $("#containerChartsVP").highcharts().setSize(document.getElementById('modalVertProf').offsetWidth-30, document.getElementById('modalVertProf').offsetHeight-60-30, doAnimation = true);
                                            }
                                        }
                            });
                            
                            $('#showVertProf').on("hidden.bs.modal", function() {
                                clearInterval(loopVP);
                            });

                            $('.modal-dialog').draggable();

                            $('#showVertProf').on('show.bs.modal', function () {
                               $(this).find('.modal-body').css({
                                    'max-height':'100%'
                                });
                            });
                }
                
                if(ajaxCan){
                    var popuplink = (mobile) ? "" : "<button id='newVerticalProfileWindow' onclick=\"openVertProf(allData, allFrames, '"+latlon+"');\" class='btn btn-default btn-xs' > <span class='glyphicon glyphicon-new-window' ></span> </button>";
                    document.getElementById("modalLabelVertProf").innerHTML = latlon+" "+popuplink+ "&nbsp;<button class='btn btn-default btn-xs' id=\"playVP\"><span class='glyphicon glyphicon-play' ></span> </button>&nbsp;<button class='btn btn-default btn-xs' id=\"pauseVP\"><span class='glyphicon glyphicon-pause' ></span> </button> ";
                    var dataLink = (_curr_language == "ES") ? "<b>Perfil Vertical: </b> <button type=\"button\" id=\"toAnimateVP\" class=\"btn btn-default btn-xs\" onclick=\"$('#showVertProf').modal('toggle');letsLoopVP(allData, allFrames, '"+latlon+"');\">Mostrar</button><br>" : "<b>Vertical profile: </b> <button type=\"button\" id=\"toAnimateVP\" class=\"btn btn-default btn-xs\" onclick=\"$('#showVertProf').modal('toggle');letsLoopVP(allData, allFrames, '"+latlon+"');\">Show</button><br>";
                    
                    $('#modalVertProf .modal-header button.close').click(function(){
                        clearInterval(loopVP); // se deberia de terminar cuando cierran el popup tmb
                    });
                    
                    $( "#pauseVP" ).click(function(){
                        isPaused = true;
                    });
                    
                    $( "#playVP" ).click(function(){
                        isPaused = false;
                    });
                    
                    if(mobile){
                                //startVPLoop();
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
            } else {
		//only one date!		
		url += "&TIME=" + time;
                                
                if(currSource.getParams().ncwmstwo){
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
                          //latlon = templat.substring(templat.indexOf("#") + 1, 17)+' '+templon.substring(templon.indexOf("#") + 1, 18);
                          if(_curr_language == 'ES'){
                                var latlon = "Latitud: "+(Math.round(coords[0]*100)/100)+" Longitud: "+(Math.round(coords[1]*100)/100);
                          } else if(_curr_language == 'EN'){
                                var latlon = "Latitude: "+(Math.round(coords[0]*100)/100)+" Longitude: "+(Math.round(coords[1]*100)/100);
                            }        
                          data = data.replace(/^.*null.*$/mg, "");
                          data = data.replace(/^\s*\n/gm, "");
                          
                          ajaxCan = !owgis.utils.check_empty_array(data.split('\n').slice(3,-1));
                          
                          if(mobile){
                              
                                if( screen.width > screen.height ){
                                    el_width = screen.width-50;
                                    el_height = screen.height-$("#showVertProf > .modal-dialog > .modal-content > .modal-header").outerHeight()-30;
                                } else {
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
                              text: (_curr_language == "ES") ? 'Perfil Vertical de '+data.split('\n')[2].split(',')[1] : 'Vertical Profile of '+data.split('\n')[2].split(',')[1]
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
                        
                        var dataLink = (_curr_language == "ES") ? "<b>Perfil Vertical: </b> <button type=\"button\" class=\"btn btn-default btn-xs\" onclick=\"$('#showVertProf').modal('toggle');\">Mostrar</button><br>" : "<b>Vertical profile: </b> <button type=\"button\" class=\"btn btn-default btn-xs\" onclick=\"$('#showVertProf').modal('toggle');\">Show</button><br>";
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
                } else if(!layerDetails['ncwmstwo']){
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
                                var dataLink = (_curr_language == "ES") ? "<b>Perfil Vertical: </b> <a href='#' onclick=\"showImgVP('" + url + "')\" > Mostrar </a><br>" : "<b>Vertical profile: </b> <a href='#' onclick=\"showImgVP('" + url + "')\" > show </a><br>";
                    } else {
                                document.getElementById("containerChartsVP").innerHTML = "";
                                img1 = document.createElement('img');
                                img1.src= url;
                                img1.style.width = "100%";
                                document.getElementById("containerChartsVP").appendChild(img1);
                                var dataLink = (_curr_language == "ES") ? "<b>Perfil Vertical: </b> <button type=\"button\" class=\"btn btn-default btn-xs\" onclick=\"$('#showVertProf').modal('toggle');\">Mostrar</button><br>" : "<b>Vertical profile: </b> <button type=\"button\" class=\"btn btn-default btn-xs\" onclick=\"$('#showVertProf').modal('toggle');\">Show</button><br>";
                    }
                }else {
                    var dataLink = "";
                }
            }
            currPopupText += dataLink;
            $("#popup-content").html(currPopupText);
	}//Only for ncwms layers
}

//
function openVertProf(allData, allFrames, latlon){
                                //open a new window with the highchart
                                //var options = chart.userOptions,
                                //container = chart.renderTo,
                                var w,
                                html = '<div class="loader" id="loader" style="display: block;"></div> <div id="containerChartsVP" style="display:none;min-width: 310px; height: 400px; margin: 0 auto"></div> <div id="controls" style="display:none"><button id="playVP"><span class="glyphicon glyphicon-play" ></span> </button><button id="pauseVP"><span class="glyphicon glyphicon-pause" ></span> </button></div>',
                                s1 = document.createElement('script'),
                                s2 = document.createElement('script'),
                                s3 = document.createElement('script'),
                                s4 = document.createElement('script'),
                                s41 = document.createElement('script');
                                s5 = document.createElement('link'),
                                s6 = document.createElement('link');
                                t = "Highcharts.chart(\"containerChartsVP\", " + JSON.stringify(optionsChartVP) + ");" +
                                            "var isPaused = false;"+
                                            "var allFrames = "+JSON.stringify(allFrames)+"; "+
                                            "var latlon='"+latlon+"'; var loopVP;" +
                                            "var allData="+JSON.stringify(allData)+";" +
                                            "$( \"#pauseVP\" ).click(function(){ isPaused = true; });"+
                                            "$( \"#playVP\" ).click(function(){ isPaused = false; });"+
                                            "function letsLoopVP(allData,allFrames, latlon){"+ 
                                                "var vpCurrentFrame=0; loopVP = setInterval(function(){ if(!isPaused){ animateVerticalProfile(); } }, 4000); "+
                                                "function animateVerticalProfile(){"+
                                                    "vpCurrentFrame = vpCurrentFrame < (allFrames.length-1)? ++vpCurrentFrame: 0; var data_ = allData[allFrames[vpCurrentFrame]].responseText; "+
                                                    "data_ = data_.replace(/^.*null.*$/mg, ''); data_ = data_.replace(/^\s*\\n/gm, ''); el_height =  400; "+
                                                    "var lines = data_.split('\\n'); lines.splice(0,3); var new_data_ = lines.join('\\n'); new_data_ = lines;"+ 
                                                    "new_data_ = new_data_.map(function(element){ return element.split(',').map(Number) ;}); new_data_.splice(-1,1); /*console.log( new_data_);*/"+
                                                    "Highcharts.chart('containerChartsVP', { title: { text: 'Vertical Profile of '+data_.split('\\n')[2].split(',')[1]+', Date '+allFrames[vpCurrentFrame] },"+
                                                        " subtitle: {text: latlon}, chart: {type: 'spline', inverted: true}, yAxis: {lineWidth: 1}, xAxis: {title: {text: data_.split('\\n')[2].split(',')[0]},lineWidth: 1}, "+
                                                        " tooltip: { pointFormat: '{point.y:.2f}' + '"+layerDetails.units+"' }, "+
                                                        "plotOptions: {series: { marker: { enabled: false }}}, series: [{ data: new_data_ ,lineWidth: 1, name: data_.split('\\n')[2].split(',')[1] }]"+ 
                                            "});} } "+
                                            "letsLoopVP(allData,allFrames, latlon);"
                                            ;
                                s3.setAttribute('type', 'text/javascript');
                                s3.innerHTML = t;
                                s5.setAttribute('href', window.location.origin+window.location.pathname+'/../common/CSS/highcharts.css');
                                s5.setAttribute('rel',"stylesheet");
                                s6.setAttribute('href', window.location.origin+window.location.pathname+'/../common/CSS/vendor/bootstrap.min.css');
                                s6.setAttribute('rel',"stylesheet");
                                s4.setAttribute('src', 'http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js');
                                s41.setAttribute('src', window.location.origin+window.location.pathname+'/../common/JS/vendor/bootstrap.min.js');
                                s1.setAttribute('src', 'https://code.highcharts.com/highcharts.js');
                                s2.setAttribute('src', 'https://code.highcharts.com/modules/exporting.js');
                                w = window.open('', '_blank', "height=420,width=520");

                                w.document.getElementsByTagName('head')[0].appendChild(s5);
                                w.document.getElementsByTagName('head')[0].appendChild(s6);
                                w.document.getElementsByTagName('head')[0].appendChild(s4);
                                setTimeout(function() {
                                  w.document.getElementsByTagName('head')[0].appendChild(s1);
                                  w.document.body.innerHTML=html;
                                  setTimeout(function() {
                                    w.document.getElementsByTagName('head')[0].appendChild(s2);
                                    w.document.getElementsByTagName('body')[0].appendChild(s3);
                                    w.document.getElementsByTagName('head')[0].appendChild(s41);
                                    w.document.getElementById('loader').style.display = 'none';
                                    w.document.getElementById('containerChartsVP').style.display = "block";
                                    w.document.getElementById('controls').style.display = "block";
                                  }, 3000)
                                }, 300);
                                                                
                        }

//lets create the highcharts animation loop, to start it when the user clicks the button !
function letsLoopVP(allData,allFrames, latlon){
    var vpCurrentFrame=0;
    
    loopVP = setInterval(function(){ if(!isPaused){ animateVerticalProfile(); } }, 4000);
    
    function animateVerticalProfile(){

                            vpCurrentFrame = vpCurrentFrame < (allFrames.length-1)? ++vpCurrentFrame: 0;

                            var data_ = allData[allFrames[vpCurrentFrame]].responseText;              
                            data_ = data_.replace(/^.*null.*$/mg, "");
                            data_ = data_.replace(/^\s*\n/gm, ""); 
                            
                            if( $("#showVertProf > .modal-dialog > .modal-content ").height()-$("#showVertProf > .modal-dialog > .modal-content > .modal-header").height()-90 < 400 ){
                                el_height =  400;
                            } else {
                                el_height =  $("#showVertProf > .modal-dialog > .modal-content ").height()-$("#showVertProf > .modal-dialog > .modal-content > .modal-header").height()-90;
                            }
                            //console.log( data_); 
                            $("#containerChartsVP").height(el_height);
                            Highcharts.chart('containerChartsVP', {
                                title: {
                                  text: 'Vertical Profile of '+data_.split('\n')[2].split(',')[1]+', Date '+allFrames[vpCurrentFrame]
                                },
                                subtitle: {
                                  text: latlon
                                },
                                data: {
                                  csv: data_
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
                                    text: data_.split('\n')[2].split(',')[0]
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
                              }
                            );
    }
}
                        
owgis.features.punctual.getTimeSeries= function getVerticalProfile(event,layerNumber) {
	var currLayer = eval('layer'+layerNumber);
	var currSource = currLayer.getSource();
	
	if("getParams" in currSource && currSource.getParams().ncwms){
		var x = Math.floor(event.pixel[0]);
		var y = Math.floor(event.pixel[1]);
		var coords = event.coordinate;
                
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
                                  if(_curr_language == 'ES'){
                                        latlon = "Latitud: "+(Math.round(coords[1]*100)/100)+" Longitud: "+(Math.round(coords[0]*100)/100);
                                  } else if(_curr_language == 'EN'){
                                        latlon = "Latitude: "+(Math.round(coords[1]*100)/100)+" Longitude: "+(Math.round(coords[0]*100)/100);
                                  }
                                  //latlon = templat.substring(templat.indexOf("#") + 1, 17)+' '+templon.substring(templon.indexOf("#") + 1,18);

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
                                 
                                 hh = data.split("\n");
                                 hh.splice(0,3);
                                 hh.splice(1,hh.length-1);
                                 
                                 var jj = new Date(hh[0].split(",")[0]);
                                 var tzO = jj.getTimezoneOffset();
                                 console.log(jj,tzO);
                                 
                                Highcharts.setOptions({
                                    time: {
                                        timezoneOffset: (-tzO)
                                    }
                                });
                                
                                if(_curr_language == "ES"){
                                    Highcharts.setOptions({
                                        lang: {
                                            months: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
                                            shortMonths: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"]
                                        }
                                    });
                                }
                                
                                var meses = (_curr_language == "ES") ? ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"] : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];//console.log(url);
                                var dateTexts =  owgis.ncwms.calendars.getCurrentDate(true, owgis.constants.startcal, true);
                                var dateTexte =  owgis.ncwms.calendars.getCurrentDate(true, owgis.constants.endcal, true);
                                var curr_dates =  owgis.ncwms.calendars.getCurrentDate(false, owgis.constants.startcal, true);
                                var curr_datee =  owgis.ncwms.calendars.getCurrentDate(false, owgis.constants.endcal, true);
                                var letime = "";
                                var datetitle = "Fecha";
                                if(!_.isUndefined(dateTexts) && !_.isUndefined(dateTexte)){
                                    if(!_.isUndefined(layerDetails.subtitleText)){
                                        if(layerDetails.subtitleText == "daily"){
                                            datetitle = "Días";
                                            letime =  (_curr_language == 'ES') ? "del "+curr_dates.getUTCDate() +" de "+ meses[curr_dates.getUTCMonth()]+" al "+curr_datee.getUTCDate() +" de "+ meses[curr_datee.getUTCMonth()] : "from "+curr_dates.getUTCDate() +" "+ meses[curr_dates.getUTCMonth()]+" to "+curr_datee.getUTCDate() +" "+ meses[curr_datee.getUTCMonth()];
                                        }else if(layerDetails.subtitleText == "monthly"){
                                            datetitle = "Meses";
                                            letime =  (_curr_language == 'ES') ? "de "+meses[curr_dates.getUTCMonth()]+" a "+meses[curr_datee.getUTCMonth()] : "from "+meses[curr_dates.getUTCMonth()]+" to "+meses[curr_datee.getUTCMonth()];
                                        } else if(layerDetails.subtitleText == "hourxmonth"){
                                            datetitle = "Horas";
                                            letime = (_curr_language == 'ES') ? "de las "+curr_dates.getUTCHours() +":00 a las "+curr_datee.getUTCHours() +":00 de "+ meses[curr_dates.getUTCMonth()] : "from "+curr_dates.getUTCHours() +":00 to "+curr_datee.getUTCHours() +":00 of "+ meses[curr_dates.getUTCMonth()];
                                        }
                                    } else {
                                        letime = ""; 
                                    }
                                }
                                 
				 Highcharts.chart('containerChartsTS', {
				    chart: {
					width: el_width,
					height: el_height
                                    },
                                    legend: {
                                      enabled: false  
                                    },
                                    title: {
                                      text: (_curr_language == 'ES') ? "Serie de Tiempo "+letime : 'Time Series '+letime
                                    },
                                    subtitle: {
                                        text: latlon
                                    },
                                    yAxis: {
                                      title: {
                                        text: (_curr_language == 'ES') ? "("+ layerDetails.units +")" : data.split('\n')[2].split(',')[1]
                                      },
                                      lineWidth: 1
                                    },
                                    xAxis: {
                                      title: {
                                        text: (_curr_language == 'ES') ? datetitle : data.split('\n')[2].split(',')[0]
                                      },
                                      dateTimeLabelFormats: {
                                            second:"%b, %H:%M:%S",
                                            minute:"%H:%M",
                                            hour:"%H:%M",
                                            day: '%e %b',
                                            week: '%e %b ',
                                            month: '%b',
                                            year: '%b'
                                        },
                                      lineWidth: 1
                                    },
                                    data: {
                                      csv: data
                                    },
                                    tooltip: {
                                        pointFormat: "{point.y:.2f} " + layerDetails.units,
                                        dateTimeLabelFormats: {
                                            second:"%b, %H:%M:%S",
                                            minute:"%b, %H:%M",
                                            hour:"%e %b, %H:%M",
                                            day: '%e %b',
                                            week: '%e %b',
                                            month: '%e %b',
                                            year: '%e %b'
                                        }
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
                                var dataLink = (_curr_language == "ES") ? "<b>Serie de Tiempo: </b> <button type=\"button\" class=\"btn btn-default btn-xs\" onclick=\"$('#showTimeSeries').modal('toggle');\">Mostrar</button><br>" : "<b>Time series plot: </b> <button type=\"button\" class=\"btn btn-default btn-xs\" onclick=\"$('#showTimeSeries').modal('toggle');\">Show</button><br>";
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
                                var dataLink =(_curr_language == "ES") ? "<b>Serie de tiempo: </b> <a href='#' onclick=\"showImgTS('" + url + "')\" > Mostrar </a><br>" : "<b>Time series plot: </b> <a href='#' onclick=\"showImgTS('" + url + "')\" > Mostrar </a><br>";
                            } else {
                                document.getElementById("containerChartsTS").innerHTML="";
                                img1 = document.createElement('img');
                                img1.src= url;
                                img1.style.width = "100%";
                                document.getElementById("containerChartsTS").appendChild(img1);
                                var dataLink = (_curr_language == "ES") ? "<b>Serie de tiempo: </b> <button type=\"button\" class=\"btn btn-default btn-xs\" onclick=\"$('#showTimeSeries').modal('toggle');\">Mostrar</button><br>" : "<b>Time series plot: </b> <button type=\"button\" class=\"btn btn-default btn-xs\" onclick=\"$('#showTimeSeries').modal('toggle');\">Show</button><br>";
                            }
                        } else {
                            var dataLink = "";
                        }
			currPopupText += dataLink;
			$("#popup-content").html(currPopupText);
		}//Only for ncwms layers
	}
}

owgis.features.punctual.getWindRose= function getWindRose(event,layerNumber) {
    var currLayer = eval('layer'+layerNumber);
    var currSource = currLayer.getSource();
	
    if("getParams" in currSource && currSource.getParams().ncwms){
        
        var coordinate = event.coordinate;
        var newCoordinate =  ol.proj.transform(coordinate, _map_projection, 'EPSG:4326');
        var lon = newCoordinate[0].toFixed(2);
        var lat = newCoordinate[1].toFixed(2);	
        var time = owgis.ncwms.calendars.getUserSelectedTimeFrame();
        console.log(time);
        
	if(time !== undefined){
            var url;
            // check if web service url is defined
            if(!_.isUndefined(layerDetails.windrose)){
		url = layerDetails.windrose;
            }else{
		return;
            }
            
            var latlon = (_curr_language == "ES") ? "Latitud: "+lat+" Longitud: "+lon : "Latitude: "+lat+" Longitude: "+lon;
            var times = time.split("/");
            var s = Date.parse(times[0]);
            var sdate = new Date(s);
            var e = Date.parse(times[1]);
            var edate = new Date(e);

            var stime =  (sdate.getUTCDate().toString().length == 1 ? "0"+sdate.getUTCDate().toString() : sdate.getUTCDate().toString()) + "-" + ( (sdate.getUTCMonth()+1).toString().length == 1 ? "0"+(sdate.getUTCMonth()+1).toString() : (sdate.getUTCMonth()+1).toString())+ "-" +
                         sdate.getUTCFullYear()+" "+ (sdate.getUTCHours().toString().length == 1 ? "0"+sdate.getUTCHours().toString() : sdate.getUTCHours().toString())+ ":" +(sdate.getUTCMinutes().toString().length == 1 ? "0"+sdate.getUTCMinutes().toString() : sdate.getUTCMinutes().toString());
            var etime =  (edate.getUTCDate().toString().length == 1 ? "0"+edate.getUTCDate().toString() : edate.getUTCDate().toString()) + "-" + ((edate.getUTCMonth()+1).toString().length == 1 ? "0"+(edate.getUTCMonth()+1).toString() : (edate.getUTCMonth()+1).toString())+ "-" +
                         edate.getUTCFullYear()+" "+ (edate.getUTCHours().toString().length == 1 ? "0"+edate.getUTCHours().toString() : edate.getUTCHours().toString())+ ":" +(edate.getUTCMinutes().toString().length == 1 ? "0"+edate.getUTCMinutes().toString() : edate.getUTCMinutes().toString());
                 
            url += lat+"/"+lon+"/"+stime+"/"+etime;
            var meses = (_curr_language == "ES") ? ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"] : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            //console.log(url);
            var dateTexts =  owgis.ncwms.calendars.getCurrentDate(true, owgis.constants.startcal, true);
            var dateTexte =  owgis.ncwms.calendars.getCurrentDate(true, owgis.constants.endcal, true);
            var curr_dates =  owgis.ncwms.calendars.getCurrentDate(false, owgis.constants.startcal, true);
            var curr_datee =  owgis.ncwms.calendars.getCurrentDate(false, owgis.constants.endcal, true);
            var letime = "";
            if(!_.isUndefined(dateTexts) && !_.isUndefined(dateTexte)){
                if(!_.isUndefined(layerDetails.subtitleText)){
                    if(layerDetails.subtitleText == "daily"){
                        letime =  (_curr_language == 'ES') ? "del "+curr_dates.getUTCDate() +" "+ meses[curr_dates.getUTCMonth()]+" al "+curr_datee.getUTCDate() +" "+ meses[curr_datee.getUTCMonth()] : "from "+curr_dates.getUTCDate() +" "+ meses[curr_dates.getUTCMonth()]+" to "+curr_datee.getUTCDate() +" "+ meses[curr_datee.getUTCMonth()];
                    }else if(layerDetails.subtitleText == "monthly"){
                        letime =  (_curr_language == 'ES') ? "de "+meses[curr_dates.getUTCMonth()]+" a "+meses[curr_datee.getUTCMonth()] : "from "+meses[curr_dates.getUTCMonth()]+" to "+meses[curr_datee.getUTCMonth()];
                    } else if(layerDetails.subtitleText == "hourxmonth"){
                        letime = (_curr_language == 'ES') ? "de "+curr_dates.getUTCHours() +":00 a "+curr_datee.getUTCHours() +":00 de "+ meses[curr_dates.getUTCMonth()] : "from "+curr_dates.getUTCHours() +":00 to "+curr_datee.getUTCHours() +":00 of "+ meses[curr_dates.getUTCMonth()];
                    }
                } else {
                    letime = ""; 
                }
            }
            
            var ajaxCan;
            var dataU, dataV;
            $.ajax({
                url: url,
                async: false,
                cache: false,
                success: function(data) {
                    ajaxCan = true;
                    dataU = data.result.U;
                    dataV = data.result.V;
                    console.log(data);	
                },
                error: function(ex) {
                    ajaxCan = false;
                    console.log(ex);
                }
            });
                            
            if(ajaxCan){
                                            
                //if( mobile ){
                    var dataLink = (_curr_language == "ES") ? "<b>Rosa de Vientos: </b> <button type=\"button\" class=\"btn btn-default btn-xs\" onclick=\"owgis.features.punctual.showWindRose(["+dataU+"],["+dataV+"],'"+latlon+"','"+letime+"')\">Mostrar</button><br>" : "<b>Wind Rose: </b> <button type=\"button\" class=\"btn btn-default btn-xs\" onclick=\"owgis.features.punctual.showWindRose(["+dataU+"],["+dataV+"],'"+latlon+"','"+letime+"')\">Show</button><br>";                            
                /*} else {
                    var dataLink = "<b>Wind Rose: </b> <button type=\"button\" class=\"btn btn-default btn-xs\" onclick=\"\">Show</button><br>";  
                }*/
		
            } else {
                var dataLink = "";
            }
            currPopupText += dataLink;
            $("#popup-content").html(currPopupText);
	}
    }
}


jQuery.fn.center = function() {
    var container = $(window);
    //var top = -this.height() / 2;
    var left = -this.width() / 2;
    return this.css('position', 'absolute').css({ 'margin-left': left + 'px', 'left': '50%' }); //, 'top': '50%'
}