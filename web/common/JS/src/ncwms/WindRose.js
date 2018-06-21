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

owgis.features.punctual.showWindRose = function showWindRose(dataU, dataV, latlon) {
    var windDataJSON;
    var windDirection = [];
    var windSpeed= [];
    U = dataU;
    V = dataV;
    for(i=0; i < U.length; i++){    	
      //windDirection[i] = Math.atan(V[i]/U[i]) * (180/ Math.PI);
      T = Math.atan2(U[i],V[i])*(180/(Math.PI))
      if(T<0){
      	T = 360+T
      }      	
      windDirection[i] = T
      windSpeed[i] = Math.sqrt( Math.pow(U[i],2) + Math.pow(V[i],2) );
    } 
    console.log("*******************************");
    console.log(windDirection);
    console.log(windSpeed);
    
    windDataJSON = [];
    for (i = 0; i < windDirection.length; i++) {
        windDataJSON.push([ windDirection[i], windSpeed[i] ]);
    }
    
    console.log(windDataJSON);
    
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
    
    var categories = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    $('#containerChartsWR').highcharts({
        series: [{
            data: windDataJSON
        }],
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
    });
    
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
    
    document.getElementById("modalLabelWR").innerHTML = latlon;
    $('#showWindRose').modal('toggle');
    document.getElementById("containerChartsWR").style.display = 'block';

}