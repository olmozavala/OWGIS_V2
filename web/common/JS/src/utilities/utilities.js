goog.provide('owgis.utils');

/**
 * This function receives a 'map' of key values 
 * that represent url parameters and returns
 * the corresponding string "par1=val1&par2=val2&..."
 * @param params - parameter list to add to url
 * @return urlstr - returns the url containing key and value pair. 
 */
owgis.utils.paramsToUrl = function(params){
	urlstr = '';
	for (var key in params) {
		urlstr += key+"="+ params[key] +"&";
	}
	return urlstr;
};

/**
 * This function is used to replace parameters on a link. 
 * For example on link  http://server?param1=val&parm2=val2 we use this
 * function to replace any parameter
 * @param name - link
 * @param param - parameter to replace
 * @param newval - new value to replace with
 */
owgis.utils.replaceGetParamInLink = function(name, param, newval){
	// Updates the kml link to download the main data 
	link = $(name).attr("href");

	paramPos = link.lastIndexOf(param);

	//In this case the parameter doesn't exist previously so we just add the parameter
	if(paramPos === -1){
		newLink =  link+"&"+param+"="+newval;
		$(name).attr("href",newLink) ;
	}
	else{//In this case we replace the value of the parameter
		firstPart = link.slice(0,paramPos);
		secondPart = link.slice(paramPos, link.length);

		//Remove the old parameter argument
		paramEndPos = secondPart.indexOf("&");

		if(paramEndPos === -1){//In this case there are not more parameters
			secondPart = "";
		}else{
			secondPart = secondPart.slice(paramEndPos, secondPart.length);
		}

		newLink = firstPart+param+"="+newval+secondPart;
		$(name).attr("href",newLink) ;
	}
};

/**
 *Get minimum value
 *@param value1 - first value
 *@param value2 - second value
 *@return value - returns smaller value
 */
owgis.utils.minimo = function(value1,value2){
	if(value1<value2)
		return value1;
	else
		return value2;
};

/**
 *Check to see if value passed in is numeric type
 *@param val - value of string to check
 *@return true or false depending if value is numeric or not
 */
owgis.utils.IsNumeric = function(val) {

	if (isNaN(parseFloat(val))) {
		return false;
	}

	return true;
};

/**
 * Assigns to the object 'img' the img_src text as an image
@param img - image name to attach source to
@param img_src - image source link

 * */

owgis.utils.rollImageBtn = function(img, img_src){
	img.style.backgroundImage = img_src;
};

/**
 * Assigns to the object 'img' the img_src text as an image
 * @param img - imaged to attach src
 * @param img_src - src link
 */
owgis.utils.rollImage = function(img, img_src){
	img.src = img_src;
};

/**This function changes the style of the current id with the specified mode
 *@param id - id to change of css
 *@param mode - case of switch statment. case 1 is black, 2 is white. 
 */
owgis.utils.changeShadow = function(id, mode){
	switch(mode){
		case 1:
			id.style.color = 'black';
			id.style.textShadow= "0px -1px 5px #eeeeee,\n" +
								"  0px  1px 5px #eeeeee,\n" +
								" -1px  0px 5px #eeeeee,\n" +
								" 1px  0px 5px #eeeeee,\n" +
								" -1px -1px 5px #eeeeee,\n" +
								" -1px  1px 5px #eeeeee,\n" +
								" 1px -1px 5px #eeeeee,\n" +
								" 1px  1px 5px #eeeeee";
			id.style.cursor = 'pointer';
			break;
		case 2:
			id.style.color = 'white';
			id.style.textShadow= "0px -1px 5px #000000,\n" +
								"  0px  1px 5px #000000,\n" +
								" -1px  0px 5px #000000,\n" +
								" 1px  0px 5px #000000,\n" +
								" -1px -1px 5px #000000,\n" +
								" -1px  1px 5px #000000,\n" +
								" 1px -1px 5px #000000,\n" +
								" 1px  1px 5px #000000";
			id.style.cursor = 'pointer';
			break;
	}
};

/**this functions opens up the url passed in with the desired width and height
 *@param url - link to new page
 *@param width - width of new window
 *@param height - height of new window
 */
owgis.utils.popUp = function(url, width, height)
{
	var day = new Date();
	var id = day.getTime();
    
	//pass in the url to open, the rest of the parameters are just options on the new window that will open.
	window.open(url, id, 'toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=1,width='
		+ width + ',height=' + height + ',left = 300,top = 300');
};

/**
 * Pass a number and if padding is needed then add 0. 
 *Example: pass 1 return 01
 *Example: pass 15 return 15. 
 *@param number - number to pad
 */
owgis.utils.pad = function(number) {  
	if(number < 10 && String(number).substr(0,1) === '0')
	{
		return number;
	}
    
	return (number < 10 ? '0' : '') + number;
};

function getDate(day,month,year,format){

	var numDays;
	var numMonths;
	var meses = new Array (
		'',
		'Enero', 
		'Febrero', 
		'Marzo', 
		'Abril', 
		'Mayo',
		'Junio',
		'Julio',
		'Agosto',
		'Septiembre',
		'Octubre',
		'Noviembre',
		'Diciembre'
		);
	if (day < 10) {
		numDays = '0' + day;
	} else {
		numDays = day;
	}
	if (month < 10) {
		numMonths = '0' + month;
	} else {
		numMonths = month;
	}   
	format = format.replace(/%Y/, year);
	format = format.replace(/%d/, numDays);
	format = format.replace(/%m/, numMonths);
	format = format.replace(/%M/, meses[month]);
	return format;

}
/**
 * Gets the day on a specified format like:
 * format = %Y-m-d
 * @param format - format of date. %Y for just year. 
 * @param fromDate - It is used rather than today
 * @param utc - Indicates if it should be returned as utc
 * @return date string depeinding on format passed in. 
 */ 
owgis.utils.getDate = function(format, fromDate, utc)
{   
	var usedDate = new Date();
	var day;
	var month;
	var year;

	if(fromDate !== undefined){
		usedDate = fromDate;
	}

	if(utc!== undefined){
		if(utc){
			year = usedDate.getUTCFullYear();       
			day = usedDate.getUTCDate();
			month = usedDate.getUTCMonth() + 1;
		}
	}else{
		day = usedDate.getDate();
		month = usedDate.getMonth() + 1;
		year = usedDate.getFullYear();       
	}
	
	return getDate(day,month,year,format);
	
};

/**
 * This method is simple used to check for undefined variables
 * @param {type} variable the variable used to check if it is undefined
 * @param {type} name Name of the variable
 */
owgis.utils.isNotUndefined = function(variable, name){
    if(typeof(variable) === undefined){
        throw "Variable: "+ name +" is undefined";
    }
    return variable;
};

/**
 * This function returns the total number of days between 2 dates.
 * @param {type} date1
 * @param {type} date2
 * @returns {Number}
 */
owgis.utils.days_between = function (date1, date2) {
	
    // The number of milliseconds in one day
    var ONE_DAY = 1000 * 60 * 60 * 24;
	
    // Convert both dates to milliseconds
    var date1_ms = date1.getTime();
    var date2_ms = date2.getTime();
	
    // Calculate the difference in milliseconds
    var difference_ms = Math.abs(date1_ms - date2_ms);
	
    // Convert back to days and return
    return Math.round(difference_ms/ONE_DAY);
}

/*
 * This function checks if a whole array is empty strings
 * @param {Array} x
 */
owgis.utils.check_empty_array = function (x) {
    return x.every(function (i) {
        return i === ""
    });
}