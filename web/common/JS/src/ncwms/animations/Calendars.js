goog.provide('owgis.ncwms.calendars');

goog.require('owgis.constants');
goog.require('owgis.ol3.popup');

var calStart; //calendar start date
var calEnd;  //calendar end date
var minValidDate; //earliest possible day in data range
var maxValidDate; //last possible day in data range
var calInitialized = false;//Indicates if the calendars have already been initialized
var calendarPosLeft = null;//this is used for the program to remember the last calendar position if a layer makes it dissapear
//this is becuase when you put a temporal data with one date the calendar disapears so it won't remeber the last
//position becuase its none existen becuase its display(CSS) is none. So this variables records the position before it actually disapeared 
//for rendering it into the next layer that does display the map. Other wise it will use the position of the disapeared display and will be an error. 
var calendarPosTop = null;

/**
 *displays and hides the calendars
 *@param {string} disp - true or false
 *
 */
function displayCalendars(disp){
	var visib = disp ? "visible" : "hidden";
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
		
		var minValidDate = new Date(minYear,minMonth, minDay);
		var maxValidDate = new Date(maxYear,maxMonth, maxDay);
        
		//We verify that we have more than one day
		if( minValidDate < maxValidDate){
			//I don't know why but for the selection the month needs to be increased by one
			minMonth = minMonth + 1;
			startDate = minYear + (minMonth < 10? '0' + minMonth: minMonth) + (minDay < 10? '0' + minDay: minDay);
			
			$("#cal-start").datepicker({
				minDate: minValidDate,
				maxDate: maxValidDate,
				defaultDate: minValidDate,
				dateFormat: dateFormat,
				onSelect: updateCalendarStart
			});
			
			$("#cal-end").datepicker({
				minDate: minValidDate,
				maxDate: maxValidDate,
				defaultDate: maxValidDate,
				dateFormat: dateFormat,
				onSelect: updateCalendarEnd
			});
			if(mobile){
			$("#ui-datepicker-div").click( function(event) {
                event.stopPropagation();
            });
			}
			
			startDate = getSuggestedDate(maxValidDate, false);
			$("#cal-start").datepicker("setDate",startDate);
			$("#cal-end").datepicker("setDate",maxValidDate);
			
			displayCalendars(true);
			
			calInitialized = true;
			_mainlayer_multipleDates= true;
			updateCalendarOpts("startCal");
		}
		else{//If we only have one day then we hide all the calendar options
			_mainlayer_multipleDates= false;
		}
		
	}
	else{//If we only have one day then we hide all the calendar options
        _mainlayer_multipleDates= false;
	}
}

/**
 * Function called when the end calendar gets updated
 */
function updateCalendarEnd(){
	updateCalendarOpts("endCal");
}

/**
 * Function called when the start calendar gets updated
 */
function updateCalendarStart(){
	//alert(max_time_range);
	updateCalendarOpts("startCal");
	
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
		var startDateTxt = $("#cal-start").val();
		var endDateTxt = $("#cal-end").val();
		
		var startDate = new Date(startDateTxt);
		var endDate = new Date(endDateTxt);
		
		if(calUpdated ===  "startCal"){
			updateMainLayerDate(startDateTxt);
			
			if(  endDate <=  startDate){
				ahead = true;//Looking suggested time forward in time
				endDate = getSuggestedDate(startDate,ahead);
				$("#cal-end").datepicker("setDate",endDate);
			}
			
		}else if(calUpdated ===  "endCal"){
			if(  endDate <=  startDate ){
				ahead = false;// Suggested time backward in time
				startDate = getSuggestedDate(endDate,ahead);
				$("#cal-start").datepicker("setDate",startDate);
			}
		}
		
		startDateTxt = $("#cal-start").val();
		endDateTxt = $("#cal-end").val();
		dispAnimationAjax(startDateTxt, endDateTxt, mainLayer,"getAnimTimes");
	}
}

/**
 * This function return the selected dates taking into account the user selection.
 * For example if the user has selected only to display weekly or monthly
 */
function getUserSelectedTimeFrame(){
	if( $('#timeSelect :selected').val() !== null ){
		return $('#timeSelect :selected').val();
	}else{
		//Don't change the following text, it is hardcoded in different places
		return 'No current date';
	}
}

/**
 * This function returns the current selected date
 * from the start Cal. In the requested format.
 * This function is used by the palettes.js
 * @param format - Format for the start date. Example of format: '%Y-%m-%d'
 * @param formatEnd - Format for the end date (if null then it doesn't display it) Example of format: '%Y-%m-%d'
 * @return selected date
 */
owgis.ncwms.calendars.getCurrentlySelectedDate = function(formatStart, formatEnd){
	if(calInitialized){
		
		if(formatStart!==null)
			startDateTxt = $.datepicker.formatDate(formatStart, $("#cal-start").datepicker("getDate"));
		else
			startDateTxt = $("#cal-start").val();
		
		if(typeof datesWithData !== "undefined" && formatEnd !== null){
			endDateTxt = $.datepicker.formatDate(formatEnd, $("#cal-end").datepicker("getDate"));
			startDateTxt = startDateTxt+"/"+endDateTxt;
		}
		
		return startDateTxt;
	}
	return owgis.constants.notimedim;
	
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
	
	// If we are within the limits return the computed date. 
	return end_final;
}

/**
 * Updates the current layer ant map title with the selected date 
 * @paramnewDate - selected date object passed in
 */ 
function updateMainLayerDate(newDate){
	
    owgis.layers.updateMainLayerParam('TIME',newDate);
	owgis.kml.updateTitleAndKmlLink();
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


