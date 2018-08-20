goog.provide('owgis.ncwms.calendars');

goog.require('owgis.constants');
goog.require('owgis.ol3.popup');
goog.require('owgis.ncwms.currents')

var calStart; //calendar start date
var calEnd;  //calendar end date
var minValidDate; //earliest possible day in data range
var maxValidDate; //last possible day in data range
var calInitialized = false;//Indicates if the calendars have already been initialized
var calendarPosLeft = null;//this is used for the program to remember the last calendar position if a layer makes it dissapear
var severalTimes = false;//Indicates if there is more than one time in the current date.
var currStartTime;//This variable is always pointing to the current start time
var currEndTime;// This variable is always pointing to the current end time (including hours minutes and seconds)

//this is becuase when you put a temporal data with one date the calendar disapears so it won't remeber the last
//position becuase its none existen becuase its display(CSS) is none. So this variables records the position before it actually disapeared 
//for rendering it into the next layer that does display the map. Other wise it will use the position of the disapeared display and will be an error. 
var calendarPosTop = null;

/**
 * Iterates over the number of hours available for the currently selected date
 * and adds the options into the corresponding select. 
 * @param {type} hours
 * @param {type} cal
 * @returns {undefined}
 */
owgis.ncwms.calendars.updatehours = function(hours, cal){
	/*var totHours = hours.timesteps.length;
	var currSelect;
	if(cal === owgis.constants.startcal){
		currSelect = $("#startTimeCalendar");
	}else{
		currSelect = $("#endTimeCalendar");
	}

	//If there are more than one time value, then we need to show the
	// corresponding select, as well as filling the options.
	if(totHours > 1){
		severalTimes = true;//Indicates that we have more than one possible time
		//Clear select
		currSelect.find('option')
					.remove()
					.end()
		
		//Fill select
		for(var i=0; i < totHours; i++){
			var hour = hours.timesteps[i];
			currSelect.append( $('<option>',{ 'value' : hour } ).text(hour.substring(0,hour.indexOf("."))));// Displaying UTC hour
		}
		//Show select
		currSelect.parent().show();

	}else{//If there is only one, then we 'hide' the selection.
		severalTimes = false;//Indicates that we don't have more than one possible time
		currSelect.parent().hide();
	}
        */
	setCurrentTime(cal);
	updateAnimationRange();
}

/**
 * Updates the time range ("Next to display animation") asynchronously 
 * @returns {undefined}
 */
function updateAnimationRange(){
	//Updates the total number of frames in the time range 
        var asString = true;
	//if(layerDetails.subtitleText == "hourxmonth"){ asString = false; } 
	var inGMT = true;
	var startDateTxt = owgis.ncwms.calendars.getCurrentDate(asString, owgis.constants.startcal, inGMT);
	var endDateTxt= owgis.ncwms.calendars.getCurrentDate(asString, owgis.constants.endcal, inGMT);
	if( !_.isUndefined(startDateTxt) && !_.isUndefined(endDateTxt) ){
		dispAnimationAjax(startDateTxt, endDateTxt, mainLayer,"getAnimTimes");
	}
}

owgis.ncwms.calendars.updateStartHour = function(){
	updateMainLayerDate();
	updateAnimationRange();
}
owgis.ncwms.calendars.updateEndHour = function(){
	//For the moment we don't need to do anything.
	updateAnimationRange();
}

/**
 *displays and hides the calendars
 *@param {string} disp - true or false
 *
 */
function displayCalendars(disp){
	var visib = disp ? "visible" : "hidden";
        console.log(visib, "wtf dnskjdh jkvsd ");
	if(mobile){
		$("#trigger2").css("display",disp?"block":"none");
	}
	$("#cal-start").css("visibility",visib);
	$("#cal-end").css("visibility",  visib);
        
}

/* 
 * This function initializes all the variables for the calendars
 * an it is called from 'animation.js' when the layer is
 * netcdf
 *
 */
function initCalendars(){
    webix.i18n.setLocale("es-ES");
    var datesWithData = layerDetails.datesWithData; // Tells the calendar which dates to disable
	var minYear = 100000000;
	var maxYear = -100000000;
	var minMonth = 13;
	var maxMonth = -1;
	var minDay = 32;
	var maxDay = -1;
	
	if(typeof datesWithData !== "undefined"){
		for (var year in datesWithData) {
			if (typeof datesWithData[year] !== 'function') { // avoid built-in functions
				if (year < minYear) minYear = year;
				if (year > maxYear) maxYear = year;
			}
		}
		console.log(minYear, maxYear);
		for (var month in datesWithData[minYear]) {
			if(owgis.utils.IsNumeric(month)){//Assume the first month is the minimum
				if(month < minMonth){
					minMonth = parseInt(month);
					minDay =datesWithData[minYear][month][0];//Assumes it has at least one day
				}
			}
		}
		
		for (var month2 in datesWithData[maxYear]) {
			if(owgis.utils.IsNumeric(month2)){
				if(parseInt(month2) > maxMonth){
					maxMonth = parseInt(month2);
					//Assumes it has at least one day
					maxDay =datesWithData[maxYear][month2][datesWithData[maxYear][month2].length - 1];
				}
			}
		}
		
		//Setting the time in local time
		var minValidDateLocal = new Date(Date.UTC(minYear,minMonth, minDay));
		var maxValidDateLocal = new Date(Date.UTC(maxYear,maxMonth, maxDay));

//		console.log("--------- LOCAL ---------")
//		console.log(minValidDateLocal +" --- " + maxValidDateLocal);
                
                var minValidDate = new Date(minYear,minMonth, minDay);
                var maxValidDate = new Date(maxYear,maxMonth, maxDay);
                if( minYear == 0 ){
                    minValidDate.setFullYear(0);
                } 
                if(maxYear == 0){
                    maxValidDate.setFullYear(0);
                }
//		console.log("--------- UTC ---------")
		//console.log(minValidDate +" --- " + maxValidDate);

		var locCurrDate = new Date(minValidDate);

		var reqTIME = owgis.utils.getDate("%Y-%m-%d",locCurrDate,true);
		var hoursForFirstDay = new Array();
                
		owgis.layers.getTimesForDay(owgis.layers.getMainLayer(),reqTIME,hoursForFirstDay);

		//We verify that we have more than one day
                console.log(minValidDate, maxValidDate);
		if( (minValidDate < maxValidDate) || (hoursForFirstDay.length > 1)){

			var datesWithNoData = new Array();
			while(locCurrDate <= maxValidDate){
				currYear = locCurrDate.getUTCFullYear();
				currMonth = locCurrDate.getUTCMonth();
				currDay = locCurrDate.getUTCDate();
				//Be sure the day is available in the layers
				if(!_.contains(datesWithData[currYear][currMonth],currDay)){
					datesWithNoData.push(owgis.utils.getDate("%Y-%m-%d",locCurrDate));
				}
				locCurrDate.setDate( locCurrDate.getDate() + 1);
			}
                        console.log(datesWithNoData);
                        
                        minValidDate.setHours(0);
                        //maxValidDate.setHours(maxValidDate.getHours() - maxValidDate.getTimezoneOffset()/60 );
                        var calendars = {
                            container:"cal-start",
                            id:"start_calendar",
                            minDate: minValidDate,
                            maxDate: maxValidDate,
                            width:200                            
                        };
                        var calendare = {
                            container:"cal-end",
                            id:"end_calendar",
                            minDate: minValidDate,
                            maxDate: maxValidDate,
                            width:200
                        };
                        
                        if(mobile){
                            calendars.view = "datepicker";
                            calendare.view = "datepicker";
                            calendars.value = minValidDate;
                            calendare.value = maxValidDate;
                        } else {
                            calendars.view="calendar";
                            calendars.date = minValidDate;
                            calendare.view = "calendar";
                            calendare.date = minValidDate;
                        }
                        
                        console.log(maxValidDate);
                        
                        switch(layerDetails.subtitleText){
                            case "daily":
                                if(mobile){
                                    
                                    calendars.calendarHeader = "%F";
                                    calendars.format = "%d de %F";
                                    calendars.blockDates = function(date){
                                            if(datesWithNoData.indexOf(date.toISOString().split('T')[0]) !== -1)
                                                return true;
                                        };
                                    
                                    calendare.calendarHeader = "%F";
                                    calendare.format = "%d de %F";
                                    calendare.blockDates = function(date){
                                            if(datesWithNoData.indexOf(date.toISOString().split('T')[0]) !== -1)
                                                return true;
                                        };
                                    
                                } else {
                                    
                                    calendars.calendarHeader = "%F";
                                    calendars.weekHeader=true;
                                    calendars.blockDates = function(date){
                                            if(datesWithNoData.indexOf(date.toISOString().split('T')[0]) !== -1)
                                                return true;
                                        };
                                    calendars.height = 200;
                                    
                                    calendare.calendarHeader = "%F";
                                    calendare.weekHeader = true;
                                    calendare.blockDates = function(date){
                                            if(datesWithNoData.indexOf(date.toISOString().split('T')[0]) !== -1)
                                                return true;
                                        };
                                    calendare.height = 200;
                                }
                                break;
                            case "monthly":
                                maxValidDate.setHours(0);
                                if(mobile){
                                   calendars.css = "calendarCustomClass";
                                   calendars.type = "month";
                                   calendars.format = "%F";
                                   calendars.headerHeight = 0;

                                    calendare.css = "calendarCustomClass";
                                    calendare.type= "month";
                                    calendare.format="%F";
                                    calendare.headerHeight = 0;             
                                } else {
                                    calendars.css ="calendarCustomClass";
                                    calendars.type = "month";
                                    calendars.height = 150;
                                    calendars.headerHeight = 0;

                                    calendare.css = "calendarCustomClass",
                                    calendare.type = "month";
                                    calendare.height = 150;
                                    calendare.headerHeight = 0;                   
                                }
                                  
                                break;
                            default: 
                                //case "hourxmonth":
                                calendars.type = "time";
                                calendare.type = "time";
                                if(!mobile){
                                    calendare.value=maxValidDate;
                                    calendars.value=minValidDate;
                                    //calendars.height = 150;
                                    calendars.blockTime = function(date){
                                            if (date.getMinutes() !== 0) return true;
                                        };
                                    //calendare.height = 150;
                                    calendare.blockTime = function(date){
                                            if (date.getMinutes() !== 0) return true;
                                        };
                               }
                                break;
                        }
                        
                        webix.ready(function(){
                            
                            webix.ui(calendars);
                            webix.ui(calendare);
                            
                            if(layerDetails.subtitleText !== "hourxmonth"){
                                if(mobile){
                                    $$('start_calendar').attachEvent("onChange", function(date){
                                        updateCalendarStart();
                                    });

                                    $$('end_calendar').attachEvent("onChange", function(date){
                                        updateCalendarEnd();
                                    });
                                } else {
                                    $$("start_calendar").selectDate(minValidDate);
                                    $$("start_calendar").showCalendar(minValidDate);
                                    $$("end_calendar").selectDate(maxValidDate);
                                    $$("end_calendar").showCalendar(maxValidDate);
                                    $$('start_calendar').attachEvent("onDateselect", function(date){
                                        updateCalendarStart();
                                    });

                                    $$('end_calendar').attachEvent("onDateselect", function(date){
                                        updateCalendarEnd();
                                    });
                                }
                            } else {
                                
                                $$("start_calendar").setValue(minValidDate);
                                $$("end_calendar").setValue(maxValidDate);       
                                $$('start_calendar').attachEvent("onChange", function(date){
                                    updateCalendarStart();
                                });

                                $$('end_calendar').attachEvent("onChange", function(date){
                                    updateCalendarEnd();
                                });
                            }        
                            
                            $('#CalendarsAndStopContainer').show("fade");
                            
                            if(!mobile && layerDetails.subtitleText == "hourxmonth"){
                                    $$("start_calendar").refresh();
                                    $$("end_calendar").refresh();
                            }
                           
                            displayCalendars(true);
                            
                            calInitialized = true;
                            _mainlayer_multipleDates= true;
                            updateCalendarOpts(owgis.constants.startcal);
                            updateCalendarOpts(owgis.constants.endcal);
                            
                            owgis.kml.updateTitleAndKmlLink();//Updates the title of the layer adding the time and depth of the layer
                            
                        });
                        
                        
			/*$("#cal-start").datepicker("setDate",startDate);
			$("#cal-end").datepicker("setDate",maxValidDate);
                        $("#cal-start").datepicker("option", "prevText", "");
                        $("#cal-start").datepicker("option", "nextText", "");
                        $("#cal-end").datepicker("option", "prevText", "");
                        $("#cal-end").datepicker("option", "nextText", "");*/
			
                
		}//We have more than one day
		else{//If we only have one day then we hide all the calendar options
			_mainlayer_multipleDates= false;
			currStartTime = layerDetails.nearestTimeIso;
		}

	}
	else{//If we only have one day then we hide all the calendar options
        _mainlayer_multipleDates= false;
		currStartTime = layerDetails.nearestTimeIso;
	}
}

/**
 * This variable initializes the currStartTime and currEndTime of a layer
 * with only one time step (both are the same) 
 * @returns {undefined}
 */
function initVariablesForOneTimeLayer(){

}

/**
 * Function called when the end calendar gets updated
 */
function updateCalendarEnd(){
	updateCalendarOpts(owgis.constants.endcal);
}

/**
 * Function called when the start calendar gets updated
 */
function updateCalendarStart(){
	//alert(max_time_range);
	updateCalendarOpts(owgis.constants.startcal);
	
	// When updateing the 'current' layer by changing the start cal, we should
	// close the popup
	owgis.ol3.popup.closePopUp();
}

/**
 * Disables the dates from the End calendar, depending on the 
 * start date that has been selected by de the user.
 * @param {string} calUpdated ['startCal'|'endCal'] Indicates which calendar was updated
 */
function updateCalendarOpts(calUpdated){
	
	//Only do it if the calendars have already beeing initialized
	if(calInitialized){
		// These dates are in local time
		var startDateTxt = $$("start_calendar").getValue();
		var endDateTxt = $$("end_calendar").getValue();
		
		var startDateDays = new Date(startDateTxt);
		var endDateDays = new Date(endDateTxt);
		
                console.log("*****************************************************************************************************************/n",startDateDays.toISOString().split('T')[0],endDateDays);
                
		if(calUpdated ===  owgis.constants.startcal){
			dispAnimationAjax(startDateDays.toISOString().split('T')[0],null,mainLayer,"getTimeSteps",owgis.constants.startcal);
			
			if(endDateDays <=  startDateDays){
				//ahead = true;//Looking suggested time forward in time
				//endDateDays = getSuggestedDate(startDateDays,ahead);
				//$$("end_calendar").selectDate(endDateDays);
			}
			
		}else if(calUpdated ===  owgis.constants.endcal){

			dispAnimationAjax(endDateDays.toISOString().split('T')[0], null,mainLayer,"getTimeSteps", owgis.constants.endcal);

			if(  endDateDays <=  startDateDays ){
				//ahead = false;// Suggested time backward in time
				//startDateDays = getSuggestedDate(endDateDays,ahead);
				//$$("start_calendar").selectDate(startDateDays);
			}
		}
	}
}

/**
 * This function return the selected dates taking into account the user selection.
 * For example if the user has selected only to display weekly or monthly
 */
owgis.ncwms.calendars.getUserSelectedTimeFrame = function (){
	var fullRange = $("#timeSelect option[fortimeseries]").attr("fortimeseries");
	return fullRange;
}

/**
 * This function returns the suggested day from the layer properties.
 * It can give one week ahead or one month etc. It takes into account
 * the maximum possible date. Depending on the property ahead
 * it returns the suggested date for a time 'ahead' the currDate or
 * 'back' in time 
 * @param actualDate - current date
 * @param ahead - true or false, true means ahead of time, false means back in time
 * @return final suggested date 
 */
function getSuggestedDate(actualDate,ahead){
	
	//	actualDate = new Date(actualDateTxt);
	var end_final = new Date();
	
	sign = "+";
	if(!ahead)
		sign = "-";
	
	if(max_time_range ==="week")
		end_final = new Date(actualDate.getFullYear(), actualDate.getMonth(), eval(actualDate.getDate()+sign+ "7")); 
	else if (max_time_range ==="month")
		end_final = new Date(actualDate.getFullYear(), eval(actualDate.getMonth() + sign + "1"), actualDate.getDate()); 
	else if (max_time_range ==="bimonth")
		end_final = new Date(actualDate.getFullYear(), eval(actualDate.getMonth() + sign + "2"), actualDate.getDate()); 
	else 
		end_final = getYearEnd(startSel);
	
	//Validate that we are not pass the limits
	if(ahead){
		if(end_final > maxValidDate)
			return maxValidDate;
	}else{
		if(end_final < minValidDate)
			return minValidDate;
	}
	
        console.log('suggested date is ',end_final)
	// If we are within the limits return the computed date. 
	return end_final;
}

/**
 * Updates the current layer ant map title with the selected date 
 * @paramnewDate - selected date object passed in
 */ 
function updateMainLayerDate(){
	
    var currTime = owgis.ncwms.calendars.getCurrentDate(false, owgis.constants.startcal, true);
    console.log(currTime,currTime.toISOString());
    //currTime.setHours(currTime.getHours() - 6);
    //console.log("*78*5678*567*876*8*5678*76*8*5678*65*7865*78*678*567*8",currTime,currTime.toISOString());
    owgis.layers.updateMainLayerParam('TIME', currTime.toISOString());
	owgis.kml.updateTitleAndKmlLink();
	
	if(_mainlayer_streamlines){
		owgis.ncwms.currents.startSingleDateAnimation();
	}
}

/**
 *this function is to hide the calendars and also show the back the calendar. for the button
 */
function hideCalendarFunc() {
	var button = $('#hideCalendar');    
	var inner_text = button.html();  
	if(!mobile){
		//this if handles when the calendar is hiden and we should show it
		if(inner_text === hideCal)
		{
			
			button.html(showCal.toString());
			$('#CalendarsAndStopContainer').css("display","none");
		}
		else//this handles when we need to hide the calendar. 
		{           
			button.html(hideCal.toString());
			$('#CalendarsAndStopContainer').css("display","block");
		}
	}
}

/**
 * Updates the two global variables that control the selected
 * time in the calendars. 
 * @param {type} cal
 * @returns {undefined}
 */
function setCurrentTime(cal){

	var asString = false;
	var inGMT = true;
	switch(cal){
		case owgis.constants.startcal:
			currStartTime = owgis.ncwms.calendars.getCurrentDate(asString, cal, inGMT);
//			console.log("Setting start time to: " + currStartTime);
			updateMainLayerDate();
			break;
		case owgis.constants.endcal:
			currEndTime = owgis.ncwms.calendars.getCurrentDate(asString, cal, inGMT);
//			console.log("Setting end time to: " + currEndTime);
			break;
	}
}

/**
 * This function returns the current selected date
 * from the start Cal or the end calendar.
 * @param asString - Indicates if the return value is a string or a date 
 * @param cal - The calendar to retrieve, it can be: owgis.constants.startcal, or owgis.constants.endcal
 * @param inGMT - If the return value should be in GMT Or local time
 * @return selected date
 */
owgis.ncwms.calendars.getCurrentDate = function(asString, cal, GMT){
	var currDateStr;// Value from selected calendar
	var currTimeStr;// Value from selected time select
	var currCal; //Current calendar
	var requestedDate; //The final requested date

	//If this layer only has one time step, we return what is inside currStartTime
	// which should be initialized properly with the only time step value
	if(!_mainlayer_multipleDates){
		return currStartTime;
	}

	var currTimeCal;
	switch(cal){
		case owgis.constants.startcal:
			currCal = $$("start_calendar");
			//currTimeCal = "startTimeCalendar";
			break;
		case owgis.constants.endcal:
			currCal = $$("end_calendar");
			//currTimeCal = "endTimeCalendar";
			break;
	}
	//Get date from calendar
	currDateStr = currCal.getValue(); 
	//We need to verify that we have the time information
	/*currTimeStr = $("#"+currTimeCal+" option");
	if(currTimeStr.length > 1){
		currTimeStr = $("#"+currTimeCal+" option:selected").attr("value");
	}else{
		currTimeStr = 0;
	}*/
	console.log(currDateStr);
	//Get hours from select and update date
	/*if( !_.isUndefined(currTimeStr) ){
		requestedDate = new Date(currDateStr);
                requestedDate.setHours(currTimeStr);
	}else{
		requestedDate = new Date(currDateStr);
	}*/
        requestedDate = new Date(currDateStr);    
	console.log(requestedDate);
	/*
	if(GMT){
		requestedDate = new Date(requestedDate.getUTCFullYear(), requestedDate.getUTCMonth(), 
						requestedDate.getUTCDate(),  requestedDate.getUTCHours(), 
						requestedDate.getUTCMinutes(), requestedDate.getUTCSeconds());
	
	}
	 */
	
	if(asString){
            if(layerDetails.subtitleText == "hourxmonth"){
                requestedDate.setHours(requestedDate.getHours() - requestedDate.getTimezoneOffset()/60);
                return requestedDate.toISOString(); //.split('T')[0];
            } else {
               return requestedDate.toISOString().split('T')[0]; 
            }
		
	}else{
            if(layerDetails.subtitleText == "hourxmonth"){
                requestedDate.setHours(requestedDate.getHours() - requestedDate.getTimezoneOffset()/60);
                return requestedDate; //.split('T')[0];
            } else {
               requestedDate.setHours(requestedDate.getHours() - requestedDate.getTimezoneOffset()/60);
               return requestedDate;
            }
		
	}
}

function localStringToUTCstring(localString){
	var localDate = new Date(localString); 
	return localDate.getUTCFullYear()+"-"+localDate.getUTCMonth()+"-"+localDate.getUTCDay();
}