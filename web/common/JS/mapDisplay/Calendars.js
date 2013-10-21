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
        
	$("#cal-start").css("visibility",visib);
	$("#cal-end").css("visibility",  visib);
	$("#hideOneDay").css("visibility",  visib);
	$("#hideOneDayEnd").css("visibility",  visib);
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

	for (var year in datesWithData) {
		if (typeof datesWithData[year] != 'function') { // avoid built-in functions
			if (year < minYear) minYear = year;
			if (year > maxYear) maxYear = year;
		}
	}

	for (var month in datesWithData[minYear]) {
		if(IsNumeric(month)){//Assume the first month is the minimum
			if(month < minMonth){
				minMonth = parseInt(month);
				minDay =datesWithData[minYear][month][0];//Assumes it has at least one day
			}
		}
	}

	for (var month2 in datesWithData[maxYear]) {
		if(IsNumeric(month2)){
			if(parseInt(month2) > maxMonth){
				maxMonth = parseInt(month2);
				//Assumes it has at least one day
				maxDay =datesWithData[maxYear][month2][datesWithData[maxYear][month2].length - 1];
			}
		}
	}

	minValidDate = new Date(minYear,minMonth, minDay);
	maxValidDate = new Date(maxYear,maxMonth, maxDay);
             
        
	//We verify that we have more than one day
	if( minValidDate < maxValidDate){
		//I don't know why but for the selection the month needs to be increased by one
		minMonth = minMonth + 1;
		startDate = minYear + (minMonth < 10? '0' + minMonth: minMonth) + (minDay < 10? '0' + minDay: minDay);
               
		calStart = Calendar.setup({
			cont    : "cal-start",
			min        : minValidDate,
			max        : maxValidDate,
			onSelect: updateCalendarStart,
			selection: [startDate],
			bottomBar: false
		});

		calEnd = Calendar.setup({
			cont    : "cal-end",
			min        : minValidDate,
			max        : maxValidDate,
			onSelect: updateCalendarEnd,
			bottomBar: false
		});

		startDate = getSuggestedDate(maxValidDate, false);
		calStart.selection.set(startDate);
		calStart.moveTo(startDate);

		startSel = calStart.selection.get();
       
		calEnd.selection.set(maxValidDate);
		calEnd.moveTo(maxValidDate, "true");

		calStart.redraw();
		calEnd.redraw();

		displayCalendars(true);

		calInitialized = true;
		updateCalendarOpts("startCal");
	}
	else{//If we only have one day then we hide all the calendar options
       
		//record the position of the calendar previous to the user chosing a one day layer. 
		if(userConfig.CalendarsAndStopContainer != 'default')
		{
			if(userConfig.calendarsMinimize != 'default' && userConfig.calendarsMinimize != 'block') 
			{
                
				var CalendarsAndStopContainer = userConfig.CalendarsAndStopContainer.split(",");    //split the left position and top position. so mainMenuParent[0] is left and mainMenuParent[1] is top. 
				calendarPosLeft = CalendarsAndStopContainer[0];//move it from the left
				calendarPosTop = CalendarsAndStopContainer[1];//move it from the top
			}
       
		}
       
		setAnimationDivsVisibility("noanimation");

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
	closePopUp();
}

/**
 * Disables the dates from the End calendar, depending on the 
 * start date that has been selected by de the user.
 * @param {string} calUpdated ['startCal'|'endCal'] Indicates which calendar was updated
 */
function updateCalendarOpts(calUpdated){

	//Only do it if the calendars have already beeing initialized
	if(calInitialized){
		var startSel = calStart.selection.get();
		var endSel = calEnd.selection.get();

		var startDate = Calendar.intToDate(startSel);
		var endDate = Calendar.intToDate(endSel);                     

		startDateTxt = Calendar.printDate(startDate, '%Y-%m-%d');
		endDateTxt = Calendar.printDate(endDate, '%Y-%m-%d');                  

		setAnimationDivsVisibility('BothCalendarsSelected');

		if(calUpdated ===  "startCal"){
			updateMainLayerDate(startDateTxt);

			if(  endDate <=  startDate){
				ahead = true;//Looking suggested time forward in time
				endDate = getSuggestedDate(startDate,ahead);
				calEnd.selection.set(endDate);
				calEnd.moveTo(endDate, "true");
			}

		}else if(calUpdated ===  "endCal"){
			if(  endDate <=  startDate ){
				ahead = false;// Suggested time backward in time
				startDate = getSuggestedDate(endDate,ahead);
				calStart.selection.set(startDate);
				calStart.moveTo(startDate, "true");
			}
		}

		dispAnimationAjax(startDateTxt, endDateTxt, mainLayer,"getAnimTimes");
	}
}

/**
 * This function return the selected dates taking into account the user selection.
 * For example if the user has selected only to display weekly or monthly
 */
function getUserSelectedTimeFrame(){
	if( $('#timeSelect :selected').val() != null ){
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
function getCurrentlySelectedDate(format, formatEnd){
	if(calInitialized){
		var startSel = calStart.selection.get();
		var startDate = Calendar.intToDate(startSel);
		startDateTxt = Calendar.printDate(startDate, format);

		if(formatEnd!=null){
			var endSel = calEnd.selection.get();
			var endDate = Calendar.intToDate(endSel);
			endDateTxt = Calendar.printDate(endDate, formatEnd);
			startDateTxt = startDateTxt+"/"+endDateTxt;
		}

		return startDateTxt;
	}
	//Don't change the following text, it is hardcoded in different places
	return 'No current date';
}
/**
 * This function returns the suggested day from the layer properties.
 * It can give one week ahead or one month etc. It takes into account
 * the maximum possible date. Depending on the property ahead
 * it returns the suggested date for a time 'ahead' the currDate or
 * 'back' in time 
 * @params actualDate - current date
 * @params ahead - true or false, true means ahead of time, false means back in time
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


/*
 * Updates the current layer ant map title with the selected date 
 * @params newDate - selected date object passed in
 */ 
function updateMainLayerDate(newDate){

    updateMainLayerParam('TIME',newDate);
	updateTitleAndKmlLink();
}

/**
 *this function is to hide the calendars and also show the back the calendar. for the button
 */
function hideCalendarFunc()
{
	var button = $('#hideCalendar');    
	var inner_text = button.html();  
      
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


