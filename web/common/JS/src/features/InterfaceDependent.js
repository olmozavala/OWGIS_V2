// This JS file is used to modify the look of the site. All the modifications
// to the default template should be made at the function modifyInterface
// which is called insisde mapDisplay. 
goog.provide('owgis.interf');

var colorLink;
var colorLinkOver;
var colorLinkClick;
var colorLinkDisabled;

if(mapConfig['menuDesign']==='sideMenu'){
	colorLink = "#0D3D52"; // When the mouse is not over and is not being clicked
	colorLinkOver = "#467387"; // When the mouse is over
	colorLinkClick = "#72919E";	// When the button is being clicked
	colorLinkDisabled = "darkgray";	// When the button is disabled
}else{
	colorLink = "#CDF1FA"; // When the mouse is not over and is not being clicked
	colorLinkOver = "#91B6FF"; // When the mouse is over
	colorLinkClick = "#1B2DFF";	// When the button is being clicked
	colorLinkDisabled = "gray";	// When the button is disabled
}

/**
 * Defines how are we displaying a 'loading' behaviour at the mouse 
 * @param {bool} loading Indicates if the loading shoudl be on or off
 * @returns {void}
 */
owgis.interf.loadingatmouse= function(loading){
	if(mobile){
		if(loading){
			$('#l-animation').show("fade");
		}else{
			$('#l-animation').hide("fade");
		}
	}else{
		if(loading){
			$("#map").removeClass("defaultCursor");
			$("#map").addClass("loadingCursor");
		}else{
			$("#map").removeClass("loadingCursor");
			$("#map").addClass("defaultCursor");
		}
	}
}

/**
 * This function shows a 'loading' that involves all the screen.  
 * @param {type} loading
 * @returns {undefined}
 */
owgis.interf.loadingallscreen = function(loading){
	if(mobile){
		if(loading){
			$(".loader").fadeIn("slow");
            $("#map").addClass("overload");
		}else{
			$(".loader").fadeOut("slow");
            $("#map").removeClass("overload");
		}
	}else{
		if(loading){
			$("#map").removeClass("defaultCursor");
			$("#map").addClass("loadingCursor");
		}else{
			$("#map").removeClass("loadingCursor");
			$("#map").addClass("defaultCursor");
		}
	}
}
/**
 * This function is used to show a 'loading' behaviour at the middle 
 * of the map. If it receives a % then it is also displayed.  
 * @param {bool} loading Indicates if the 'loading' should be displayed or not
 * @param {int} percentage Percentaje of loading displayed. 
 * @returns void
 */
owgis.interf.loadingatmap = function(loading,percentage,extraText,vel){
	if(loading){
		if(percentage !== undefined){
			if(_.isEmpty(extraText)){
				$("#loadperc").html(percentage +"<small> %</small>");
			}else{
				$("#loadperc").html(extraText+" "+ percentage +"<small> %</small>");
			}
		}else{
			$("#loadperc").text("");
			$("#loadperc").addClass("loading")
		}
		$('#l-animation').show("fade",vel);
	}else{
		$('#l-animation').hide("fade",vel);
	}
}

/**
 * This is the main function that should encompass all the specific code for the site,
 * for example all the modifications to the interface depending on some layers 
 * @returns {undefined}
 */
function modifyInterface(){
    
    var estaciones= ['ATI', 'BJU', 'CAM', 'LPR', 'MER', 'PED', 'TLA','UIZ','XAL'];
    estaciones.sort();
        
    for( var i=0; i<estaciones.length; i++ ){
            //create new li element like:
            // <li role="presentation"><a class="nav-link" id="v-pills-CUA-tab" href="#" role="tab" aria-controls="v-pills-CUA" aria-selected="false" onclick="changeEstTabContent('CUA')">CUA</a></li>
            var newNumberListItem = document.createElement("li");
            newNumberListItem.setAttribute("role", "presentation");
            var newLink = document.createElement("a");
            newLink.className = "nav-link";
            newLink.href = "#";
            newLink.setAttribute("id", "v-pills-"+estaciones[i]+"-tab");
            newLink.setAttribute("role", "tab");
            newLink.setAttribute("aria-controls", "v-pills-"+estaciones[i] );
            newLink.setAttribute("onclick", "changeEstTabContent('"+estaciones[i]+"')" );
            if( i ==0 ){
                // class="active" // aria-selected="true"
                newNumberListItem.className = "active";
                newLink.setAttribute("aria-selected", "true");
            } else {
                newLink.setAttribute("aria-selected", "false");
            }
            //create new text node
            var numberListValue = document.createTextNode(estaciones[i]);
            //add text node to li element
            newLink.appendChild(numberListValue);
            newNumberListItem.appendChild(newLink);
            //add new list element built in previous steps to unordered list called numberList
            document.getElementById("v-pills-tab").appendChild(newNumberListItem);
    }
    
    //createChartFVSR(estaciones[0]);
    if(typeof localStorage.station_selected != "undefined"){
        changeEstTabContent(localStorage.station_selected);
    } else {
        changeEstTabContent(estaciones[0]);
    }
    
    if(layerDetails.isParticle != "false" && !mobile ){ //&& false
        if( localStorage.charts_menu_minimized == "false" || typeof localStorage.charts_menu_minimized == "undefined") { 
            document.getElementById('estaciones_charts').style.display = "block";
        } else { 
            document.getElementById('estaciones_charts').style.display = "none";
        }
        
        document.getElementById('v-pills-tab').style.height = document.getElementById('estaciones_charts').offsetHeight-30+'px' ;
        //$('#estaciones_charts').draggable();
        
        /*$('#estaciones_charts').resizable({
            minHeight: 500,
            minWidth: 600,
            handles: "n, e, s, w, se, ne",
            resize: function( event, ui ) {
                if (typeof $("#forecastvsreportHighcharts").highcharts() != 'undefined'){
                    $("#forecastvsreportHighcharts").highcharts().setSize(document.getElementById('v-pills-tabContent').offsetWidth-30, document.getElementById('estaciones_charts').offsetHeight-30, doAnimation = true);
                }
                document.getElementById('v-pills-tab').style.height = document.getElementById('estaciones_charts').offsetHeight-30+'px';
            }
        });*/
        
        $(window).on('resize', function(){
            if (typeof $("#forecastvsreportHighcharts").highcharts() != 'undefined'){
                $("#forecastvsreportHighcharts").highcharts().setSize(document.getElementById('v-pills-tabContent').offsetWidth-30, document.getElementById('estaciones_charts').offsetHeight-30, doAnimation = true);
            }
            document.getElementById('v-pills-tab').style.height = document.getElementById('estaciones_charts').offsetHeight-30+'px';
        });

    } 
    else if(layerDetails.isParticle != "false" && mobile){
        
        $( "#pltchrt_btn" ).click(function() {
            $( "#estaciones_charts_mobile" ).show();
        });
        
        $("#pltchrt-closer").click(function() {
		$("#estaciones_charts_mobile").hide();
	});
    }
}

function changeEstTabContent(IDEST){
    //console.log(IDEST);
    allEsts = document.getElementById('v-pills-tab').getElementsByTagName("li");
    var arrayLength = allEsts.length;
    for (var i = 0; i < arrayLength; i++) {
        allEsts[i].className = "";
    }
    document.getElementById('v-pills-'+IDEST+'-tab').parentElement.className = "active"
    createChartFVSR(IDEST);
    
    localStorage.station_selected = IDEST ;
}

Date.prototype.addDays = function(days) {
       var dat = new Date(this.valueOf())
       dat.setDate(dat.getDate() + days);
       return dat;
}

Date.prototype.addHours= function(h){
    var copiedDate = new Date(this.getTime());
    copiedDate.setHours(copiedDate.getHours()+h);
    return copiedDate;
}

function createChartFVSR(id_est){
    var ajaxCan;
    var currDate = moment();
    var dateStr = currDate.format("YYYY-MM-DD");//Gets current date
    var hour = currDate.format("HH");// Gets current hour
	
    var elurl = "http://132.248.8.238:8080/WebServiceContingencia/API/contingencia/"+layerDetails.isParticle+"/"+id_est+"/"+dateStr+"/"+hour+"/1";
//    var elurl = "http://localhost:8888/WebServiceContingencia/API/contingencia/"+layerDetails.isParticle+"/"+id_est+"/"+dateStr+"/"+hour;
    console.log(elurl);
    $.ajax({
                url: elurl,
                async: true,
                crossDomain : true,
                type: "GET",
                dataType: 'json',
                success: function(data) {
			
					console.log(data);
					ajaxCan = true;
					
					var report = [];
					var forecast = [];
					
					//Access the result data from
					var reportLength = data.report.length;
					var forecastLength = data.forecast.length;
					var station = data.station;
					
					// Create the range of dates that we can obtain back
					// from the query
					var currDate= moment();
					// Set the minutes and seconds to 0
					currDate.minutes(0);
					currDate.seconds(0);
					var currDateMinus24 = currDate.clone();
					currDateMinus24 = currDateMinus24.add(-1,'day');
					var currDatePlus24= currDate.clone();
					currDatePlus24= currDatePlus24.add(1,'day');
					var dateArray = getDatesRangeMoment(currDateMinus24, currDatePlus24);
					
					//Iterate over the 'report' data and fill the values
					// in the correct dates.
					for(var i=0;i<reportLength;i++){
						var fechaRd = moment(data.report[i][0]);
						for(var j=0;j<dateArray.length;j++){
//							console.log(fechaRd.format()+ " -- " +dateArray[j].format());
							if(moment(dateArray[j].format()).isSame(fechaRd.format())){
								report[j] = data.report[i][1];
							} else if(_.isUndefined(report[j])) {
									report[j] = null;
								}
						}
					}
					//Iterate over the 'forecast' data and fill the values
					// in the correct dates.
					for(var i=0;i<forecastLength;i++){
						var fechaRdi = moment(data.forecast[i][0]);
						for(var j=0;j<dateArray.length;j++){
							if(moment(dateArray[j].format()).isSame(fechaRdi.format())){
								if(data.forecast[i][1] !== -1){ 
									forecast[j] = Math.round(data.forecast[i][1]); 
								}
							} else if(_.isUndefined(forecast[j])) {
								forecast[j] = null;
							}
						}
					}
                                        
                                        //calculate width for mobile or normal screen
                                        if(mobile){
                                            if(screen.width > screen.height){
                                                el_width = screen.width-(screen.width*.1)-$('#pltchrt-closer').outerWidth()-80;
                                                el_height = screen.height;
                                            } else {
                                                el_height = screen.width;
                                                el_width = screen.height-(screen.height*.1)-$('#pltchrt-closer').outerWidth()-80;
                                            }
                                            
                                            document.getElementById("forecastvsreportHighcharts").style.display = 'block';
                                            
                                        }else{
                                            el_width = document.getElementById('v-pills-tabContent').offsetWidth - 30;
                                            el_height = document.getElementById('estaciones_charts').offsetHeight-30;
                                        }
					
                                        console.log(el_width, el_height);
					//Create the plots
					Highcharts.chart('forecastvsreportHighcharts', {
						chart: {
							width: el_width,
							height: el_height,
                                                        backgroundColor: '#FFFFFF'
						},
						title: {
							text: 'Estación VS Pronóstico, ' +station
						},
						subtitle: {
							text: 'Contaminante '+getContaminantName(layerDetails.isParticle)
						},
						xAxis: {
							categories: getStringsFromDateArray(dateArray,"DD MMM, ha"),
                                                        labels : {
                                                            enabled: false
                                                        },
                                                        /*dateTimeLabelFormats: {
                                                              second:"%e %b, %H:%M:%S",
                                                              minute:"%e %b, %H:%M",
                                                              hour:"%e %b, %H:%M",
                                                              day: '%e %b',
                                                              week: '%e %b',
                                                              month: '%b',
                                                              year: '%b'
                                                        },
							labels: {
								formatter: function () {
									return this.value;
								}
							},*/
							title: {
								text: 'Fecha'
							}
							
						},
						yAxis: [
							{ // Primary yAxis
								labels: {
									//format: '{value}°C',
								},
								title: {
									text: 'Concentración del contaminante'
								},
								min: 0,
								max: Math.max(Math.max.apply(NaN,forecast), Math.max.apply(NaN,report))/*,
                                                                plotBands: [{ // Light air
                                                                    from: 160,
                                                                    to: 200,
                                                                    color: 'rgba(229, 0, 0, 0.1)',
                                                                    label: {
                                                                        text: 'Contingencia',
                                                                        style: {
                                                                            color: '#606060'
                                                                        }
                                                                    }
                                                                }]*/
							}
						],
						tooltip: {
							shared: true
						},
						series: [{
								name: 'Estación',
								type: 'spline',
								data: report,
								dashStyle: 'shortdot'
								
							}, {
								name: 'Pronóstico',
								type: 'spline',
								data: forecast
							}]
					});
					
				},
				error: function(ex) {
					console.log(ex);
					console.log('NOT!');
					ajaxCan = false; 
				}
			});
}


function getStringsFromDateArray(dateArray,dateFormat){
	var dateArrayStr = new Array();
	for(var i=0; i <dateArray.length; i++){
        dateArrayStr.push(dateArray[i].format(dateFormat));
	}
	return dateArrayStr;
}

/**
* This function is used to obtain the correct title for each contaminant 
* @param {type} shortName
* @returns {String}
*/
function getContaminantName(shortName){
var shortNames = ["pmdoscinco", "pmdiez", "nox" , "codos" , "co" , "nodos" , "no" , "otres" , "sodos"];
var longNames = ["PM2.5", "PM10", "NOX", "CO2", "CO", "NO2", "NO", "O3", "SO2"];
for(var i=0; i<shortNames.length; i++){
	if(shortNames[i] === shortName){
		return longNames[i];
	}
}
}

function getDatesRangeMoment(startDate, stopDate) {
    var dateArray = new Array();
    var range = moment.range(startDate,stopDate);
    for(let currHour of range.by('hours')){
            dateArray.push(currHour);
    }
    return dateArray;
}

function getDates(startDate, stopDate) {
    var dateArray = new Array();
    var currentDate = startDate;
    while (currentDate <= stopDate) {
            dateArray.push(currentDate)
            currentDate = currentDate.addHours(1);
    }
    return dateArray;
}