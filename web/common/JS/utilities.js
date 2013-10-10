
/**
 * This function receives a 'map' of key values 
 * that represent url parameters and returns
 * the corresponding string "par1=val1&par2=val2&..."
 * @params params - parameter list to add to url
 * @return urlstr - returns the url containing key and value pair. 
 */
function paramsToUrl(params){
	
	urlstr = '';
	for (var key in params) {
		urlstr += key+"="+ params[key] +"&";
	}
	return urlstr;
}

/**
 *Depending on the number of background layers, this function
 * returns the OpenLayers 'mainlayer'
 */
function getMainLayer(){
	return eval('layer'+idx_main_layer);
}

/**
 * This function is used to replace parameters on a link. 
 * For example on link  http://server?param1=val&parm2=val2 we use this
 * function to replace any parameter
 * @params name - link
 * @params param - parameter to replace
 * @params newval - new value to replace with
 */
function replaceGetParamInLink(name, param, newval){
	// Updates the kml link to download the main data 
	link = $(name).attr("href");

	paramPos = link.lastIndexOf(param);

	//In this case the parameter doesn't exist previously so we just add the parameter
	if(paramPos==-1){
		newLink =  link+"&"+param+"="+newval;
		$(name).attr("href",newLink) ;
	}
	else{//In this case we replace the value of the parameter
		firstPart = link.slice(0,paramPos);
		secondPart = link.slice(paramPos, link.length);

		//Remove the old parameter argument
		paramEndPos = secondPart.indexOf("&");

		if(paramEndPos == -1){//In this case there are not more parameters
			secondPart = "";
		}else{
			secondPart = secondPart.slice(paramEndPos, secondPart.length);
		}

		newLink = firstPart+param+"="+newval+secondPart;
		$(name).attr("href",newLink) ;
	}

}

/**
 *open new window
 *@params url - page to display in new window
 *@params width - width of new window
 *@params height - height of new window
 *@return false - it returns false to exit the function. 
 */
function popItUp(url, width, height ) {
	newwindow=window.open(url,'','height='+height+',width='+width);
	if (window.focus) {
		newwindow.focus()
	}
	return false;
}

/**
 *Get minimum value
 *@params value1 - first value
 *@params value2 - second value
 *@return value - returns smaller value
 */

function minimo(value1,value2){
	if(value1<value2)
		return value1;
	else
		return value2;
}

/**
 *Check to see if value passed in is numeric type
 *@params val - value of string to check
 *@return true or false depending if value is numeric or not
 */
function IsNumeric(val) {

	if (isNaN(parseFloat(val))) {
		return false;
	}

	return true
}

/**
 * Assigns to the object 'img' the img_src text as an image
@params img - image name to attach source to
@params img_src - image source link

 * */

function rollImageBtn(img, img_src){
	img.style.backgroundImage = img_src;
}

/**
 * Assigns to the object 'img' the img_src text as an image
 * @params img - imaged to attach src
 * @params img_src - src link
 */
function rollImage(img, img_src){
	img.src = img_src;
}

/**This function changes the styel of the current id with the specified mode
 *@params id - id to change of css
 *@params mode - case of switch statment. case 1 is black, 2 is white. 
 */
function changeShadow(id, mode){
	switch(mode){
		case 1:
			id.style.color = 'black';
			id.style.textShadow= "0px -1px 5px #eeeeee,\n\
								  0px  1px 5px #eeeeee,\n\
								 -1px  0px 5px #eeeeee,\n\
								 1px  0px 5px #eeeeee,\n\
								 -1px -1px 5px #eeeeee,\n\
								 -1px  1px 5px #eeeeee,\n\
								 1px -1px 5px #eeeeee,\n\
								 1px  1px 5px #eeeeee";
			id.style.cursor = 'pointer';
			break;
		case 2:
			id.style.color = 'white';
			id.style.textShadow= "0px -1px 5px #000000,\n\
								  0px  1px 5px #000000,\n\
								 -1px  0px 5px #000000,\n\
								 1px  0px 5px #000000,\n\
								 -1px -1px 5px #000000,\n\
								 -1px  1px 5px #000000,\n\
								 1px -1px 5px #000000,\n\
								 1px  1px 5px #000000";
			id.style.cursor = 'pointer';
			break;
	}

}

/**this functions opens up the url passed in
 *@params url - link to new page
 *@params width - width of new window
 *@params height - height of new window
 */
function popUp(url, width, height)
{
	var day = new Date();
	var id = day.getTime();
    
	//pass in the url to open, the rest of the parameters are just options on the new window that will open.
	window.open(url, id, 'toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=1,width='
		+ width + ',height=' + height + ',left = 300,top = 300');
}

/**pass a number and if padding is needed then add 0. 
 *Example: pass 1 return 01
 *Example: pass 15 return 15. 
 *@params number - number to pad
 */
function pad(number) 
{  
	if(number < 10 && String(number).substr(0,1) == '0')
	{
		return number;
	}
    
	return (number < 10 ? '0' : '') + number
   
}

/*
 * Gets the day on a specified format like:
 * format = %Y-m-d
 * @param formato - format of date. %Y for just year. 
 * @return date string depeinding on format passed in. 
 */ 
function getDate(formato)
{   
	var hoy = new Date()
	var numDia = hoy.getDate();
	var numMes = hoy.getMonth() + 1;
	var anio = hoy.getFullYear();       
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
	if (numDia < 10)
	{
		numDiaS = '0' + numDia;
	}
	else
	{
		numDiaS = numDia;
	}
	if (numMes < 10)
	{
		numMesS = '0' + numMes;
	}
	else
	{
		numMesS = numMes;
	}   
	formato = formato.replace(/%Y/, anio);
	formato = formato.replace(/%d/, numDiaS);
	formato = formato.replace(/%m/, numMesS);
	formato = formato.replace(/%M/, meses[numMes]);
	return formato;
}
