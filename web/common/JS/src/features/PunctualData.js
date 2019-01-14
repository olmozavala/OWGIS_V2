/* 
 */
goog.provide('owgis.features.punctual');

goog.require('owgis.calendars');
goog.require('ol.Map');
goog.require('ol.View');
goog.require('ol.source.Vector');
goog.require('owgis.utils');
goog.require('owgis.ncwms.animation');

var allDataVP = {};
var allFramesVP = [];
var loopVP;
var optionsChartVP = {};
var isPaused = false;
var isNextVP = false;
var isPrevVP = false;

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
        } catch(err) {
            time = layerDetails['nearestTimeIso'];
        }  
        var time_ = owgis.ncwms.calendars.getUserSelectedTimeFrame();
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
            url += "?REQUEST=GetVerticalProfile&STYLES=default/default";
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
            obtainSelectedDates();
            //var datesRange = moment.range(time_);
            //var allDates =  Array.from(datesRange.by('day'));
            //allDateFrames = allDates.map(m => m.utc().format()); 
            allFramesVP = allFrames; allDataVP= {};
            //console.log(allFramesVP);
            /*
            for(i=0; i<allDateFrames.length; i++){
                var locCurrDate = new Date(allDateFrames[i]);
                var reqTIME = owgis.utils.getDate("%Y-%m-%d",locCurrDate,true);
                var hoursForFirstDay = new Array();
                owgis.layers.getTimesForDay(owgis.layers.getMainLayer(),reqTIME,hoursForFirstDay);
                allFramesVP = allFramesVP.concat(hoursForFirstDay);
            }
            */
            var baseUrl = url; //console.log(allFramesVP.length);
            for(i=0; i<allFramesVP.length; i++){
                newUrl = baseUrl+"&TIME="+allFramesVP[i];   
                var request = $.ajax({ url: newUrl});
                allDataVP[allFramesVP[i]]  = request.done(function(data, status, xhr) { /*console.log("done request for vp !!!",data.split("\n")[0]);*/ }); //maybe we should check if the response is 200 / 404 / 401 (?)
            }
            
            // when all ajax calls are done we need to be able to start animation
            var ajaxCan = true;
            var latlon = "Latitude: "+(Math.round(coords[0]*100)/100)+" Longitude: "+(Math.round(coords[1]*100)/100);
            var dataLink = "";
            var first=0;
            
            $( document ).ajaxStop(function() {
                // we set first frame as the Vertical Profile current frame
                var vpCurrentFrame=0;
                first++;
                // check that it is not an html or xml response
                // but first check that it exists (?)
                var ajaxCan = false;
                if(allDataVP[allFramesVP[vpCurrentFrame]].status == 200){ ajaxCan = true; }
                if(first == 1 && typeof allDataVP[allFramesVP[vpCurrentFrame]] !== "undefined" && allDataVP[allFramesVP[vpCurrentFrame]].status == 200 ){
                    if( !allDataVP[allFramesVP[vpCurrentFrame]].hasOwnProperty("responseXML") ){
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

                        var templat = allDataVP[allFramesVP[vpCurrentFrame]].responseText.split('\n').slice(0,1)[0];
                        var templon = allDataVP[allFramesVP[vpCurrentFrame]].responseText.split('\n').slice(0,2)[1];
                        latlon = templat.substring(templat.indexOf("#") + 1, 17)+' '+templon.substring(templon.indexOf("#") + 1, 18);

                        var data = allDataVP[allFramesVP[vpCurrentFrame]].responseText; 
                        data = data.replace(/^.*null.*$/mg, "");
                        data = data.replace(/^\s*\n/gm, "");
                        
                        showButton(ajaxCan,latlon,first,data);
                        
                        //ajaxCan = !owgis.utils.check_empty_array(data.split('\n').slice(3,-1)); // there is actual data in the response
                        //console.log(ajaxCan);
                        //Create the plot
                        optionsChartVP = {
                            title: {
                                text: 'Vertical Profile of '+data.split('\n')[2].split(',')[1]+', Date '+allFramesVP[vpCurrentFrame]
                            },
                            subtitle: {
                                text: latlon
                            },
                            data: {
                              csv: data
                            },
                            chart: {
                                width: el_width,
                                height: el_height,
                                type: 'spline',
                                inverted: true,
                                animation: false
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
                                    animation: false,
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
                }
            });
            
            
            function showButton(ajaxCan, latlon, first,data){
                if(first == 1){
                    if(ajaxCan){
                        if(!mobile){

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

                            $('#showVertProf').on("hidden.bs.modal", function() { clearInterval(loopVP); });

                            $('.modal-dialog').draggable();

                            $('#showVertProf').on('show.bs.modal', function () { $(this).find('.modal-body').css({ 'max-height':'100%' }); });
                        }
                        
                        var popuplink = (mobile) ? "" : "<button id='newVerticalProfileWindow' onclick=\"openVertProf(allDataVP, allFramesVP, '"+latlon+"');\" class='btn btn-default btn-xs' > <span class='glyphicon glyphicon-new-window' ></span> </button>";
                        
                        document.getElementById("modalLabelVertProf").innerHTML = latlon+" "+
                                                                                  popuplink+
                                                                                  " <button style=\"display:none\" class='btn btn-default btn-xs' id=\"playVP\">"+
                                                                                  "<span class='glyphicon glyphicon-play' ></span>"+
                                                                                  "</button>"+
                                                                                  " <button class='btn btn-default btn-xs' id=\"pauseVP\">"+
                                                                                  "<span class='glyphicon glyphicon-pause' ></span> </button> "+
                                                                                  "<button style=\"display:none\" class='btn btn-default btn-xs' id=\"prevVP\">"+
                                                                                  "<span class='glyphicon glyphicon-step-backward' ></span> </button> "+
                                                                                  "<button style=\"display:none\" class='btn btn-default btn-xs' id=\"nextVP\">"+
                                                                                  "<span class='glyphicon glyphicon-step-forward' ></span> </button> ";
                        var dataLink = "<b>Vertical profile: </b> <button type=\"button\" id=\"toAnimateVP\" class=\"btn btn-default btn-xs\" onclick=\"$('#showVertProf').modal('toggle');letsLoopVP(allDataVP, allFramesVP, '"+latlon+"');\">Show</button><br>";

                        $('#modalVertProf .modal-header button.close').click(function(){  clearInterval(loopVP); });

                        $("#pauseVP").click(function(){ isPaused = true; $("#pauseVP").hide(); $("#playVP").show(); $("#prevVP").show(); $("#nextVP").show(); });

                        $("#playVP").click(function(){ isPaused = false; $("#playVP").hide(); $("#pauseVP").show(); $("#prevVP").hide(); $("#nextVP").hide(); });

                        $("#prevVP").click(function(){ isPrevVP=true; isNextVP=false;});

                        $("#nextVP").click(function(){ isNextVP=true; isPrevVP=false;});

                        if(mobile){
                                //startVPLoop();
                                $( window ).on( "orientationchange", function( event ) {
                                    if ( screen.width > screen.height){
                                        twidth = screen.width-50;
                                        theight = screen.height-$("#showVertProf > .modal-dialog > .modal-content > .modal-header").outerHeight()-30;
                                    } else {
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
                    currPopupText += dataLink;
                    $("#popup-content").html(currPopupText);
                }
            }//end of  function showButton()
            
        } else { //only one date!
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
                        latlon = templat.substring(templat.indexOf("#") + 1, 17)+' '+templon.substring(templon.indexOf("#") + 1, 18);
                                  
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
                        //console.log(el_width, el_height);		
                        //Create the plot
                        Highcharts.chart('containerChartsVP', {
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
                                width: el_width,
				height: el_height,
                                type: 'spline',
                                inverted: true,
                                animation: false
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
                                animation: false,
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
                                  }, 3000);
                                }, 300);
                            };
                          }
                        );

                    },
                    error: function(ex) {
                        console.log(ex);
                        //console.log('NOT!');
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
                        $(this).find('.modal-body').css({ 'max-height':'100%'});
                    });
                }
                
                if(ajaxCan){
                    var popuplink = (mobile) ? "" : "<button id='newVerticalProfileWindow' onclick='showVertProf()' class='btn btn-default btn-xs' > <span class='glyphicon glyphicon-new-window' ></span> </button><br>";
                    document.getElementById("modalLabelVertProf").innerHTML = latlon+" "+popuplink;
                        
                   var dataLink = "<b>Vertical profile: </b> <button type=\"button\" class=\"btn btn-default btn-xs\" onclick=\"$('#showVertProf').modal('toggle');\">Show</button><br>";
                    if(mobile){
                            
                        $( window ).on( "orientationchange", function( event ) {
                            //console.log("mm", screen.width, screen.height-$("#showVertProf > .modal-dialog > .modal-content > .modal-header").outerHeight());
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
        }
        currPopupText += dataLink;
        $("#popup-content").html(currPopupText);
    }//Only for ncwms layers
}

//
function openVertProf(allDataVP, allFramesVP, latlon){
    //open a new window with the highchart
    //var options = chart.userOptions,
    //container = chart.renderTo,
    var w,
        html = '<div class="loader" id="loader" style="display: block;"></div> <div id="containerChartsVP" style="display:none;min-width: 310px; height: 400px; margin: 0 auto"></div> <div id="controls" style="display:none"><button id="playVP"><span class="glyphicon glyphicon-play" ></span> </button><button id="pauseVP"><span class="glyphicon glyphicon-pause" ></span> </button></div>',
        s1 = document.createElement('script'),
        s2 = document.createElement('script'),
        s3 = document.createElement('script'),
        s4 = document.createElement('script'),
        s41 = document.createElement('script'),
        s5 = document.createElement('link'),
        s6 = document.createElement('link'),
        t = "Highcharts.chart(\"containerChartsVP\", " + JSON.stringify(optionsChartVP) + ");" +
                                            "var isPaused = false;"+
                                            "var allFramesVP = "+JSON.stringify(allFramesVP)+"; "+
                                            "var latlon='"+latlon+"'; var loopVP;" +
                                            "var allDataVP="+JSON.stringify(allDataVP)+";" +
                                            "$( \"#pauseVP\" ).click(function(){ isPaused = true; });"+
                                            "$( \"#playVP\" ).click(function(){ isPaused = false; });"+
                                            "function letsLoopVP(allDataVP,allFramesVP, latlon){"+ 
                                                "var vpCurrentFrame=0; loopVP = setInterval(function(){ if(!isPaused){ animateVerticalProfile(); } }, 4000); "+
                                                "function animateVerticalProfile(){"+
                                                    "vpCurrentFrame = vpCurrentFrame < (allFramesVP.length-1)? ++vpCurrentFrame: 0; var data_ = allDataVP[allFramesVP[vpCurrentFrame]].responseText; "+
                                                    "data_ = data_.replace(/^.*null.*$/mg, ''); data_ = data_.replace(/^\s*\\n/gm, ''); el_height =  400; "+
                                                    "var lines = data_.split('\\n'); lines.splice(0,3); var new_data_ = lines.join('\\n'); new_data_ = lines;"+ 
                                                    "new_data_ = new_data_.map(function(element){ return element.split(',').map(Number) ;}); new_data_.splice(-1,1); /*console.log( new_data_);*/"+
                                                    "Highcharts.chart('containerChartsVP', { title: { text: 'Vertical Profile of '+data_.split('\\n')[2].split(',')[1]+', Date '+allFramesVP[vpCurrentFrame] },"+
                                                        " subtitle: {text: latlon}, chart: {type: 'spline', inverted: true}, yAxis: {lineWidth: 1}, xAxis: {title: {text: data_.split('\\n')[2].split(',')[0]},lineWidth: 1}, "+
                                                        " tooltip: { pointFormat: '{point.y:.2f}' + '"+layerDetails.units+"' }, "+
                                                        "plotOptions: {series: { marker: { enabled: false }}}, series: [{ data: new_data_ ,lineWidth: 1, name: data_.split('\\n')[2].split(',')[1] }]"+ 
                                            "});} } "+
                                            "letsLoopVP(allDataVP,allFramesVP, latlon);";
    
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
        }, 3000);
    }, 300);
}

//lets create the highcharts animation loop, to start it when the user clicks the button !
function letsLoopVP(allDataVP,allFramesVP, latlon){
    var vpCurrentFrame=0;
    isPaused = false;
    
    loopVP = setInterval(function(){ if(!isPaused){ animateVerticalProfile(); } else if(isNextVP){ showNextVP();} else if(isPrevVP){showPrevVP();} }, 1500);
    
    function animateVerticalProfile(){
        vpCurrentFrame = vpCurrentFrame < (allFramesVP.length-1)? ++vpCurrentFrame: 0;
        var data_ = allDataVP[allFramesVP[vpCurrentFrame]].responseText;
        data_ = data_.replace(/^.*null.*$/mg, "");
        data_ = data_.replace(/^\s*\n/gm, ""); 
        
        if( $("#showVertProf > .modal-dialog > .modal-content ").height()-$("#showVertProf > .modal-dialog > .modal-content > .modal-header").height()-90 < 400 ){
           el_height =  400;
        } else {
           el_height =  $("#showVertProf > .modal-dialog > .modal-content ").height()-$("#showVertProf > .modal-dialog > .modal-content > .modal-header").height()-90;
        }
        
        $("#containerChartsVP").height(el_height);
        
        Highcharts.chart('containerChartsVP', {
                                title: {
                                  text: 'Vertical Profile of '+data_.split('\n')[2].split(',')[1]+', Date '+allFramesVP[vpCurrentFrame]
                                },
                                subtitle: {
                                  text: latlon
                                },
                                data: {
                                  csv: data_
                                },
                                chart: {
                                    type: 'spline',
                                    inverted: true,
                                    animation: false
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
                                    animation: false,
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
    
    function showNextVP(){
        animateVerticalProfile();
        isNextVP=false;
    }
    
    function showPrevVP(){
        vpCurrentFrame = vpCurrentFrame <= 0 ? allFrames.length-2 : vpCurrentFrame-2;
        animateVerticalProfile();
        isPrevVP=false; 
    }
    
}
                        
owgis.features.punctual.getTimeSeries= function getVerticalProfile(event,layerNumber) {
    var currLayer = eval('layer'+layerNumber);
    var currSource = currLayer.getSource();
    
    if("getParams" in currSource && currSource.getParams().ncwms){
        
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
                        
                        var hh = data.split("\n");
                        hh.splice(0,3);
                        hh.splice(1,hh.length-1);
                        var jj = new Date(hh[0].split(",")[0]);
                        var tzO = jj.getTimezoneOffset(); //console.log(jj,tzO);
                        Highcharts.setOptions({
                            time: {
                                timezoneOffset: (-tzO)
                            }
                        });
                        
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
                                    }
                        );
                    },
                    error: function(ex) {
                        ajaxCan = false;
                        console.log(ex);
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
                    
                    $('#showTimeSeries').on('show.bs.modal', function () { $(this).find('.modal-body').css({'max-height':'100%'}); });
                
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