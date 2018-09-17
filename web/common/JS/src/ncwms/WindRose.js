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

owgis.features.punctual.showWindRose = function showWindRose(dataU, dataV, latlon, time) {
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
     * number of freqs = 4
     * 
     * */
    var maxfreq = windSpeed.max();
    var minfreq = windSpeed.min();
    var freqs = [];
    //if( (maxfreq - minfreq) > 2 ){
        var dist =  (maxfreq - minfreq) / 4;
        for (var i = 0; i <= 4; ++i) freqs.push( minfreq + (i*dist) );
    /*} else {
        var dist = (maxfreq - minfreq) / 2;
        for (var i = 0; i <= 2; ++i) freqs.push( minfreq + (i*dist) );
    }*/
    //console.log(minfreq, maxfreq);
    
    var categories = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    var catdict = {
        freq1: {
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
        },freq2: {
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
        },freq3: {
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
        },freq4: {
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
        }        
    };
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
    for(i =0; i < windDirection.length; i++){
        if( windSpeed[i] >= freqs[0] && windSpeed[i]<freqs[1]){
            //va en la primera frecuencia falta checar en que CARDINAL va
            if( windDirection[i]>= 348.75 || windDirection[i]< 11.25 ){
                //N
                catdict.freq1.N += 1;
            }else if( windDirection[i]>= 11.25 && windDirection[i]< 33.75 ){
                //NNE
                catdict.freq1.NNE += 1;
            }else if( windDirection[i]>= 33.75 && windDirection[i]< 56.25 ){
                //NE
                catdict.freq1.NE += 1;
            }else if( windDirection[i]>= 56.25 && windDirection[i]< 78.75 ){
                //ENE
                catdict.freq1.ENE += 1;
            }else if( windDirection[i]>= 78.75 && windDirection[i]< 101.25 ){
                //E
                catdict.freq1.E += 1;
            }else if( windDirection[i]>= 101.25 && windDirection[i]< 123.75 ){
                //ESE
                catdict.freq1.ESE += 1;
            }else if( windDirection[i]>= 123.75 && windDirection[i]< 146.25 ){
                //SE
                catdict.freq1.SE += 1;
            }else if( windDirection[i]>= 146.25 && windDirection[i]< 168.75 ){
                //SSE
                catdict.freq1.SSE += 1;
            }else if( windDirection[i]>= 168.75 && windDirection[i]< 191.25 ){
                //S
                catdict.freq1.S += 1;
            }else if( windDirection[i]>= 191.25 && windDirection[i]< 213.75 ){
                //SSW
                catdict.freq1.SSW += 1;
            }else if( windDirection[i]>= 213.75 && windDirection[i]< 236.25 ){
                //SW                
                catdict.freq1.SW += 1;
            }else if( windDirection[i]>= 236.25 && windDirection[i]< 258.75 ){
                //WSW
                catdict.freq1.WSW += 1;
            }else if( windDirection[i]>= 258.75 && windDirection[i]< 281.25 ){
                //W
                catdict.freq1.W += 1;
            }else if( windDirection[i]>= 281.25 && windDirection[i]< 303.75 ){
                //WNW
                catdict.freq1.WNW += 1;
            }else if( windDirection[i]>= 303.75 && windDirection[i]< 326.25 ){
                //NW
                catdict.freq1.NW += 1;
            }else if( windDirection[i]>= 326.25 && windDirection[i]< 348.75 ){
                //NNW
                catdict.freq1.NNW += 1;
            }
        } else if(windSpeed[i] >= freqs[1] && windSpeed[i]<freqs[2]){
            if( windDirection[i]>= 348.75 || windDirection[i]< 11.25 ){
                //N
                catdict.freq2.N += 1;
            }else if( windDirection[i]>= 11.25 && windDirection[i]< 33.75 ){
                //NNE
                catdict.freq2.NNE += 1;
            }else if( windDirection[i]>= 33.75 && windDirection[i]< 56.25 ){
                //NE
                catdict.freq2.NE += 1;
            }else if( windDirection[i]>= 56.25 && windDirection[i]< 78.75 ){
                //ENE
                catdict.freq2.ENE += 1;
            }else if( windDirection[i]>= 78.75 && windDirection[i]< 101.25 ){
                //E
                catdict.freq2.E += 1;
            }else if( windDirection[i]>= 101.25 && windDirection[i]< 123.75 ){
                //ESE
                catdict.freq2.ESE += 1;
            }else if( windDirection[i]>= 123.75 && windDirection[i]< 146.25 ){
                //SE
                catdict.freq2.SE += 1;
            }else if( windDirection[i]>= 146.25 && windDirection[i]< 168.75 ){
                //SSE
                catdict.freq2.SSE += 1;
            }else if( windDirection[i]>= 168.75 && windDirection[i]< 191.25 ){
                //S
                catdict.freq2.S += 1;
            }else if( windDirection[i]>= 191.25 && windDirection[i]< 213.75 ){
                //SSW
                catdict.freq2.SSW += 1;
            }else if( windDirection[i]>= 213.75 && windDirection[i]< 236.25 ){
                //SW                
                catdict.freq2.SW += 1;
            }else if( windDirection[i]>= 236.25 && windDirection[i]< 258.75 ){
                //WSW
                catdict.freq2.WSW += 1;
            }else if( windDirection[i]>= 258.75 && windDirection[i]< 281.25 ){
                //W
                catdict.freq2.W += 1;
            }else if( windDirection[i]>= 281.25 && windDirection[i]< 303.75 ){
                //WNW
                catdict.freq2.WNW += 1;
            }else if( windDirection[i]>= 303.75 && windDirection[i]< 326.25 ){
                //NW
                catdict.freq2.NW += 1;
            }else if( windDirection[i]>= 326.25 && windDirection[i]< 348.75 ){
                //NNW
                catdict.freq2.NNW += 1;
            }
        } else if(windSpeed[i] >= freqs[2] && windSpeed[i]<freqs[3]){
            if( windDirection[i]>= 348.75 || windDirection[i]< 11.25 ){
                //N
                catdict.freq3.N += 1;
            }else if( windDirection[i]>= 11.25 && windDirection[i]< 33.75 ){
                //NNE
                catdict.freq3.NNE += 1;
            }else if( windDirection[i]>= 33.75 && windDirection[i]< 56.25 ){
                //NE
                catdict.freq3.NE += 1;
            }else if( windDirection[i]>= 56.25 && windDirection[i]< 78.75 ){
                //ENE
                catdict.freq3.ENE += 1;
            }else if( windDirection[i]>= 78.75 && windDirection[i]< 101.25 ){
                //E
                catdict.freq3.E += 1;
            }else if( windDirection[i]>= 101.25 && windDirection[i]< 123.75 ){
                //ESE
                catdict.freq3.ESE += 1;
            }else if( windDirection[i]>= 123.75 && windDirection[i]< 146.25 ){
                //SE
                catdict.freq3.SE += 1;
            }else if( windDirection[i]>= 146.25 && windDirection[i]< 168.75 ){
                //SSE
                catdict.freq3.SSE += 1;
            }else if( windDirection[i]>= 168.75 && windDirection[i]< 191.25 ){
                //S
                catdict.freq3.S += 1;
            }else if( windDirection[i]>= 191.25 && windDirection[i]< 213.75 ){
                //SSW
                catdict.freq3.SSW += 1;
            }else if( windDirection[i]>= 213.75 && windDirection[i]< 236.25 ){
                //SW                
                catdict.freq3.SW += 1;
            }else if( windDirection[i]>= 236.25 && windDirection[i]< 258.75 ){
                //WSW
                catdict.freq3.WSW += 1;
            }else if( windDirection[i]>= 258.75 && windDirection[i]< 281.25 ){
                //W
                catdict.freq3.W += 1;
            }else if( windDirection[i]>= 281.25 && windDirection[i]< 303.75 ){
                //WNW
                catdict.freq3.WNW += 1;
            }else if( windDirection[i]>= 303.75 && windDirection[i]< 326.25 ){
                //NW
                catdict.freq3.NW += 1;
            }else if( windDirection[i]>= 326.25 && windDirection[i]< 348.75 ){
                //NNW
                catdict.freq3.NNW += 1;
            }
        } else {
            if( windDirection[i]>= 348.75 || windDirection[i]< 11.25 ){
                //N
                catdict.freq4.N += 1;
            }else if( windDirection[i]>= 11.25 && windDirection[i]< 33.75 ){
                //NNE
                catdict.freq4.NNE += 1;
            }else if( windDirection[i]>= 33.75 && windDirection[i]< 56.25 ){
                //NE
                catdict.freq4.NE += 1;
            }else if( windDirection[i]>= 56.25 && windDirection[i]< 78.75 ){
                //ENE
                catdict.freq4.ENE += 1;
            }else if( windDirection[i]>= 78.75 && windDirection[i]< 101.25 ){
                //E
                catdict.freq4.E += 1;
            }else if( windDirection[i]>= 101.25 && windDirection[i]< 123.75 ){
                //ESE
                catdict.freq4.ESE += 1;
            }else if( windDirection[i]>= 123.75 && windDirection[i]< 146.25 ){
                //SE
                catdict.freq4.SE += 1;
            }else if( windDirection[i]>= 146.25 && windDirection[i]< 168.75 ){
                //SSE
                catdict.freq4.SSE += 1;
            }else if( windDirection[i]>= 168.75 && windDirection[i]< 191.25 ){
                //S
                catdict.freq4.S += 1;
            }else if( windDirection[i]>= 191.25 && windDirection[i]< 213.75 ){
                //SSW
                catdict.freq4.SSW += 1;
            }else if( windDirection[i]>= 213.75 && windDirection[i]< 236.25 ){
                //SW                
                catdict.freq4.SW += 1;
            }else if( windDirection[i]>= 236.25 && windDirection[i]< 258.75 ){
                //WSW
                catdict.freq4.WSW += 1;
            }else if( windDirection[i]>= 258.75 && windDirection[i]< 281.25 ){
                //W
                catdict.freq4.W += 1;
            }else if( windDirection[i]>= 281.25 && windDirection[i]< 303.75 ){
                //WNW
                catdict.freq4.WNW += 1;
            }else if( windDirection[i]>= 303.75 && windDirection[i]< 326.25 ){
                //NW
                catdict.freq4.NW += 1;
            }else if( windDirection[i]>= 326.25 && windDirection[i]< 348.75 ){
                //NNW
                catdict.freq4.NNW += 1;
            }
        }
    }
    //console.log(catdict);
    //me.round((catdict["freq"+(i+1)]["N"])*100/totalfreqs,1)
    var unims = " m/s";
    dataseries= [ 
            {
                "type": "column",
                "name": (minfreq + (0*dist)).toFixed(2) + " - "+ (minfreq + ((1)*dist)).toFixed(2)+unims,
                "data" : [
                    ["N", round( catdict.freq1.N*100/windDirection.length, 1)],
                    ["NNE", round(catdict.freq1.NNE*100/windDirection.length, 1)],
                    ["NE", round(catdict.freq1.NE*100/windDirection.length, 1)],
                    ["ENE", round(catdict.freq1.ENE*100/windDirection.length, 1)],
                    ["E", round(catdict.freq1.E*100/windDirection.length, 1)],
                    ["ESE", round(catdict.freq1.ESE*100/windDirection.length, 1)],
                    ["SE", round(catdict.freq1.SE*100/windDirection.length, 1)],
                    ["SSE",round( catdict.freq1.SSE*100/windDirection.length, 1)],
                    ["S",round( catdict.freq1.S*100/windDirection.length, 1)],
                    ["SSW", round(catdict.freq1.SSW*100/windDirection.length, 1)],
                    ["SW", round(catdict.freq1.SW*100/windDirection.length, 1)],
                    ["WSW",round( catdict.freq1.WSW*100/windDirection.length, 1)],
                    ["W",round( catdict.freq1.W*100/windDirection.length, 1)],
                    ["WNW", round(catdict.freq1.WNW*100/windDirection.length, 1)],
                    ["NW", round(catdict.freq1.NW*100/windDirection.length, 1)],
                    ["NNW", round(catdict.freq1.NNW*100/windDirection.length, 1)]
                ]
            },
            {
                "type": "column",
                "name": (minfreq + (1*dist)).toFixed(2) + " - "+ (minfreq + (2*dist)).toFixed(2)+unims,
                "data" : [
                    ["N", round(catdict.freq2.N*100/windDirection.length, 1)],
                    ["NNE",round( catdict.freq2.NNE*100/windDirection.length, 1)],
                    ["NE",round( catdict.freq2.NE*100/windDirection.length, 1)],
                    ["ENE",round( catdict.freq2.ENE*100/windDirection.length, 1)],
                    ["E",round( catdict.freq2.E*100/windDirection.length, 1)],
                    ["ESE", round(catdict.freq2.ESE*100/windDirection.length, 1)],
                    ["SE", round(catdict.freq2.SE*100/windDirection.length, 1)],
                    ["SSE", round(catdict.freq2.SSE*100/windDirection.length, 1)],
                    ["S", round(catdict.freq2.S*100/windDirection.length, 1)],
                    ["SSW", round(catdict.freq2.SSW*100/windDirection.length, 1)],
                    ["SW", round(catdict.freq2.SW*100/windDirection.length, 1)],
                    ["WSW", round(catdict.freq2.WSW*100/windDirection.length, 1)],
                    ["W", round(catdict.freq2.W*100/windDirection.length, 1)],
                    ["WNW", round(catdict.freq2.WNW*100/windDirection.length, 1)],
                    ["NW", round(catdict.freq2.NW*100/windDirection.length, 1)],
                    ["NNW", round(catdict.freq2.NNW*100/windDirection.length, 1)]
                ]
            },
            {
                "type": "column",
                "name": (minfreq + (2*dist)).toFixed(2) + " - "+ (minfreq + ((3)*dist)).toFixed(2)+unims,
                "data" : [
                    ["N", round(catdict.freq3.N*100/windDirection.length, 1)],
                    ["NNE", round(catdict.freq3.NNE*100/windDirection.length, 1)],
                    ["NE", round(catdict.freq3.NE*100/windDirection.length, 1)],
                    ["ENE", round(catdict.freq3.ENE*100/windDirection.length, 1)],
                    ["E", round(catdict.freq3.E*100/windDirection.length, 1)],
                    ["ESE", round(catdict.freq3.ESE*100/windDirection.length, 1)],
                    ["SE", round(catdict.freq3.SE*100/windDirection.length, 1)],
                    ["SSE", round(catdict.freq3.SSE*100/windDirection.length, 1)],
                    ["S", round(catdict.freq3.S*100/windDirection.length, 1)],
                    ["SSW", round(catdict.freq3.SSW*100/windDirection.length, 1)],
                    ["SW", round(catdict.freq3.SW*100/windDirection.length, 1)],
                    ["WSW", round(catdict.freq3.WSW*100/windDirection.length, 1)],
                    ["W",round( catdict.freq3.W*100/windDirection.length, 1)],
                    ["WNW", round(catdict.freq3.WNW*100/windDirection.length, 1)],
                    ["NW", round(catdict.freq3.NW*100/windDirection.length, 1)],
                    ["NNW",round( catdict.freq3.NNW*100/windDirection.length, 1)]
                ]
            },
            {
                "type": "column",
                "name": (minfreq + (3*dist)).toFixed(2) + " - "+ (minfreq + ((4)*dist)).toFixed(2)+unims,
                "data" : [
                    ["N",round( catdict.freq4.N*100/windDirection.length, 1)],
                    ["NNE", round(catdict.freq4.NNE*100/windDirection.length, 1)],
                    ["NE",round( catdict.freq4.NE*100/windDirection.length, 1)],
                    ["ENE", round(catdict.freq4.ENE*100/windDirection.length, 1)],
                    ["E", round(catdict.freq4.E*100/windDirection.length, 1)],
                    ["ESE", round(catdict.freq4.ESE*100/windDirection.length, 1)],
                    ["SE", round(catdict.freq4.SE*100/windDirection.length, 1)],
                    ["SSE",round( catdict.freq4.SSE*100/windDirection.length, 1)],
                    ["S", round(catdict.freq4.S*100/windDirection.length, 1)],
                    ["SSW",round( catdict.freq4.SSW*100/windDirection.length, 1)],
                    ["SW",round( catdict.freq4.SW*100/windDirection.length, 1)],
                    ["WSW", round(catdict.freq4.WSW*100/windDirection.length, 1)],
                    ["W", round(catdict.freq4.W*100/windDirection.length, 1)],
                    ["WNW", round(catdict.freq4.WNW*100/windDirection.length, 1)],
                    ["NW",round( catdict.freq4.NW*100/windDirection.length, 1)],
                    ["NNW", round(catdict.freq4.NNW*100/windDirection.length, 1)]
                ]
            }
    ];
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
            text: (_curr_language == "ES") ? "Rosa de vientos "+time : 'Wind Rose '+time
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