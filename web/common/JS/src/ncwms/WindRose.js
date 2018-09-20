/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
goog.provide('owgis.features.punctual');

goog.require('owgis.calendars');
goog.require('ol.Map');
goog.require('ol.View');
goog.require('ol.source.Vector');
goog.require('owgis.utils');

owgis.features.punctual.showWindRose = function showWindRose(dataU, dataV, latlon, letime) {
    var windDataJSON;
    var windDirection = [];
    var windSpeed= [];
    U = dataU;
    V = dataV;
    for(i=0; i < U.length; i++){    	
      //windDirection[i] = Math.atan(V[i]/U[i]) * (180/ Math.PI);
      T = Math.atan2(-U[i],-V[i])*(180/(Math.PI));
      if(T<0){
      	T = 360+T;
      }      	
      windDirection[i] = T;
      windSpeed[i] = Math.sqrt( Math.pow(U[i],2) + Math.pow(V[i],2) );
    } 
    /*console.log("*******************************");
    console.log(windDirection);
    console.log(windSpeed);
    */
    windDataJSON = [];
    for (i = 0; i < windDirection.length; i++) {
        windDataJSON.push([ windDirection[i], windSpeed[i] ]);
    }
    //console.log(windDataJSON);
    /*
     * number of freqs = 6
     * [Â 0-3, 3-6, 6-9, 9-12, 12-15, >15 ]
     * 
     * */
    
    var freqs = [0,3,6,9,12,15,100];
    
    var categories = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    var catdict = {};

    for(var i=0; i<freqs.length-1; i++){
        
        catdict["freq"+(i+1)] = {
            N: 0,
            NNE: 0, 
            NE:0, 
            ENE:0, 
            E:0, 
            ESE:0, 
            SE:0,
            SSE:0,
            S:0,
            SSW:0,
            SW:0, 
            WSW:0, 
            W:0, 
            WNW:0, 
            NW:0, 
            NNW:0
        };
    }
    
    /*
     * Cardinal Direction	Degree Direction
            N                     348.75 - 11.25
            NNE                    11.25 - 33.75   
            NE                     33.75 - 56.25
            ENE                    56.25 - 78.75
            E                     78.75 - 101.25
            ESE                  101.25 - 123.75
            SE                   123.75 - 146.25
            SSE                  146.25 - 168.75
            S                    168.75 - 191.25
            SSW                  191.25 - 213.75
            SW                   213.75 - 236.25
            WSW                  236.25 - 258.75
            W                    258.75 - 281.25
            WNW                  281.25 - 303.75
            NW                   303.75 - 326.25
            NNW                  326.25 - 348.75
     */
    for(var i=0; i < windDirection.length; i++){

        for(var j=0; j<freqs.length-1; j++){

            if( windSpeed[i] >= freqs[j] && windSpeed[i]<freqs[j+1] ){
                //va en la primera frecuencia falta checar en que CARDINAL va
                if( windDirection[i]>= 348.75 || windDirection[i]< 11.25 ){
                    //N
                    catdict[ "freq"+(j+1) ]["N"] +=1;
                }else if( windDirection[i]>= 11.25 && windDirection[i]< 33.75 ){
                    //NNE
                    catdict["freq"+(j+1)]["NNE"] += 1;
                }else if( windDirection[i]>= 33.75 && windDirection[i]< 56.25 ){
                    //NE
                    catdict["freq"+(j+1)]["NE"] += 1;
                }else if( windDirection[i]>= 56.25 && windDirection[i]< 78.75 ){
                    //ENE
                    catdict["freq"+(j+1)]["ENE"] += 1;
                }else if( windDirection[i]>= 78.75 && windDirection[i]< 101.25 ){
                    //E
                    catdict["freq"+(j+1)]["E"] += 1;
                }else if( windDirection[i]>= 101.25 && windDirection[i]< 123.75 ){
                    //ESE
                    catdict["freq"+(j+1)]["ESE"] += 1;
                }else if( windDirection[i]>= 123.75 && windDirection[i]< 146.25 ){
                    //SE
                    catdict["freq"+(j+1)]["SE"] += 1;
                }else if( windDirection[i]>= 146.25 && windDirection[i]< 168.75 ){
                    //SSE
                    catdict["freq"+(j+1)]["SSE"] += 1;
                }else if( windDirection[i]>= 168.75 && windDirection[i]< 191.25 ){
                    //S
                    catdict["freq"+(j+1)]["S"] += 1;
                }else if( windDirection[i]>= 191.25 && windDirection[i]< 213.75 ){
                    //SSW
                    catdict["freq"+(j+1)]["SSW"] += 1;
                }else if( windDirection[i]>= 213.75 && windDirection[i]< 236.25 ){
                    //SW                
                    catdict["freq"+(j+1)]["SW"] += 1;
                }else if( windDirection[i]>= 236.25 && windDirection[i]< 258.75 ){
                    //WSW
                    catdict["freq"+(j+1)]["WSW"] += 1;
                }else if( windDirection[i]>= 258.75 && windDirection[i]< 281.25 ){
                    //W
                    catdict["freq"+(j+1)]["W"] += 1;
                }else if( windDirection[i]>= 281.25 && windDirection[i]< 303.75 ){
                    //WNW
                    catdict["freq"+(j+1)]["WNW"] += 1;
                }else if( windDirection[i]>= 303.75 && windDirection[i]< 326.25 ){
                    //NW
                    catdict["freq"+(j+1)]["NW"] += 1;
                }else if( windDirection[i]>= 326.25 && windDirection[i]< 348.75 ){
                    //NNW
                    catdict["freq"+(j+1)]["NNW"] += 1;
                }
            }

        }

    }
    //console.log(catdict);
    // round((catdict["freq"+(i+1)]["N"])*100/totalfreqs,1)
    var unims = " m/s";
    var dataseries= [ ] ;
    var totalfreqs=windDirection.length;
    
    for(var i=0;i< freqs.length-1;i++){
        if( i != freqs.length-2 ){
            dataseries.push({
                "type": "column",
                "name": freqs[i]+" - "+freqs[i+1]+unims,
                "data" : [
                    ["N",  round((catdict["freq"+(i+1)]["N"])*100/totalfreqs,1)],
                    ["NNE",  round(catdict["freq"+(i+1)]["NNE"]*100/totalfreqs,1)],
                    ["NE",  round(catdict["freq"+(i+1)]["NE"]*100/totalfreqs,1)],
                    ["ENE",  round(catdict["freq"+(i+1)]["ENE"]*100/totalfreqs,1)],
                    ["E",  round(catdict["freq"+(i+1)]["E"]*100/totalfreqs,1)],
                    ["ESE",  round(catdict["freq"+(i+1)]["ESE"]*100/totalfreqs,1)],
                    ["SE",  round(catdict["freq"+(i+1)]["SE"]*100/totalfreqs,1)],
                    ["SSE",  round(catdict["freq"+(i+1)]["SSE"]*100/totalfreqs,1)],
                    ["S",  round(catdict["freq"+(i+1)]["S"]*100/totalfreqs,1)],
                    ["SSW",  round(catdict["freq"+(i+1)]["SSW"]*100/totalfreqs,1)],
                    ["SW",  round(catdict["freq"+(i+1)]["SW"]*100/totalfreqs,1)],
                    ["WSW",  round(catdict["freq"+(i+1)]["WSW"]*100/totalfreqs,1)],
                    ["W",  round(catdict["freq"+(i+1)]["W"]*100/totalfreqs,1)],
                    ["WNW",  round(catdict["freq"+(i+1)]["WNW"]*100/totalfreqs,1)],
                    ["NW",  round(catdict["freq"+(i+1)]["NW"]*100/totalfreqs,1)],
                    ["NNW",  round(catdict["freq"+(i+1)]["NNW"]*100/totalfreqs,1)]
                ]
            });
        } else {
            dataseries.push({
                "type": "column",
                "name": " > "+freqs[i]+unims,
                "data" : [
                    ["N",  round(catdict["freq"+(i+1)]["N"]*100/totalfreqs,1)],
                    ["NNE",  round(catdict["freq"+(i+1)]["NNE"]*100/totalfreqs,1)],
                    ["NE",  round(catdict["freq"+(i+1)]["NE"]*100/totalfreqs,1)],
                    ["ENE",  round(catdict["freq"+(i+1)]["ENE"]*100/totalfreqs,1)],
                    ["E",  round(catdict["freq"+(i+1)]["E"]*100/totalfreqs,1)],
                    ["ESE",  round(catdict["freq"+(i+1)]["ESE"]*100/totalfreqs,1)],
                    ["SE",  round(catdict["freq"+(i+1)]["SE"]*100/totalfreqs,1)],
                    ["SSE",  round(catdict["freq"+(i+1)]["SSE"]*100/totalfreqs,1)],
                    ["S",  round(catdict["freq"+(i+1)]["S"]*100/totalfreqs,1)],
                    ["SSW",  round(catdict["freq"+(i+1)]["SSW"]*100/totalfreqs,1)],
                    ["SW",  round(catdict["freq"+(i+1)]["SW"]*100/totalfreqs,1)],
                    ["WSW",  round(catdict["freq"+(i+1)]["WSW"]*100/totalfreqs,1)],
                    ["W",  round(catdict["freq"+(i+1)]["W"]*100/totalfreqs,1)],
                    ["WNW",  round(catdict["freq"+(i+1)]["WNW"]*100/totalfreqs,1)],
                    ["NW",  round(catdict["freq"+(i+1)]["NW"]*100/totalfreqs,1)],
                    ["NNW",  round(catdict["freq"+(i+1)]["NNW"]*100/totalfreqs,1)]
                ]
            });
        }
    }
    //console.log(dataseries);    
    
    if(mobile){
        if( screen.width > screen.height ){
            el_width = screen.width-50;
            el_height = screen.height-$("#showWindRose > .modal-dialog > .modal-content > .modal-header").outerHeight()-30;
        } else {
            el_width = screen.width-20;
            el_height = screen.height-$("#showWindRose > .modal-dialog > .modal-content > .modal-header").outerHeight()-100;
        }                                                                                
    }else{
        el_width = null;
        el_height = 400;
    }
    
    $('#containerChartsWR').highcharts({
        series:dataseries,
        chart: {
            polar: true,
            type: 'column'
        },
        title: {
            text: (_curr_language == "ES") ? "Rosa de vientos "+getMonthName(letime)+" (1979-2017)"  : 'Wind Rose '+getMonthName(letime)+" (1979-2017)"
        },
        subtitle: {
            text: latlon
        },
        pane: {
            size: '85%'
        },
        legend: {
            align: 'right',
            verticalAlign: 'top',
            y: 100,
            layout: 'vertical'
        },
        xAxis: {
            tickmarkPlacement: 'on',
            type:'category'
        },
        yAxis: {
            min: 0,
            endOnTick: false,
            showLastLabel: true,
            labels: {
                formatter: function () {
                    return this.value + '%';
                }
            },
            reversedStacks: false
        },
        tooltip: {
            valueSuffix: '%'
        },
        plotOptions: {
            series: {
                stacking: 'normal',
                shadow: false,
                groupPadding: 0,
                pointPlacement: 'on'
            }
        }
    });
    /*
        chart: {
            polar: true,
            type: 'column'
        },
        title: {
            text: 'Wind Rose'
        },
        pane: {
            size: '85%'
        },
        legend: {
            align: 'right',
            verticalAlign: 'top',
            y: 100,
            layout: 'vertical'
        },
        xAxis: {
            min: 0,
            max: 360,
            type: "",
            tickInterval: 22.5,
            tickmarkPlacement: 'on',
            labels: {
                formatter: function () {
                    return categories[this.value / 22.5] + '°';
                }
            }
        },
        yAxis: {
            min: 0,
            endOnTick: false,
            showLastLabel: true,
            title: {
                text: 'Frequency (%)'
            },
            labels: {
                formatter: function () {
                    return this.value + '%';
                }
            },
            reversedStacks: false
        },
        tooltip: {
            valueSuffix: '%'
        },
        plotOptions: {
            series: {
                stacking: 'normal',
                shadow: false,
                groupPadding: 0,
                pointPlacement: 'on'
            }
        }
    });*/
    if( !mobile ){
        $('#modalWR').resizable({
            minHeight: 500,
            minWidth: 600,
            resize: function( event, ui ) {
                if (typeof $("#containerChartsWR").highcharts() != 'undefined'){
                    $('#modalWR').center();
                    $("#containerChartsWR").highcharts().setSize(document.getElementById('modalWR').offsetWidth-30, document.getElementById('modalWR').offsetHeight-60-30, doAnimation = true);
                }
            }
        });

        $('.modal-dialog').draggable();

        $('#showWindRose').on('show.bs.modal', function () {
            $(this).find('.modal-body').css({
                'max-height':'100%'
            });
        });
    }
    document.getElementById("modalLabelWR").innerHTML = latlon;
    $('#showWindRose').modal('toggle');
    document.getElementById("containerChartsWR").style.display = 'block';

}

Array.prototype.max = function() {
  return Math.max.apply(null, this);
};

Array.prototype.min = function() {
  return Math.min.apply(null, this);
};

/*
   * This is a handy little round function that takes precision
   * round(12345.6789, 2) // 12345.68
   */
 function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
 }