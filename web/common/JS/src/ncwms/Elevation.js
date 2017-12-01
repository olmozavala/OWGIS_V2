goog.provide('owgis.ncwms.zaxis');
goog.require('owgis.mobile');

owgis.ncwms.zaxis.globcounter = 0; //index of layerDetails.zaxis.values[owgis.ncwms.zaxis.globcounter]
var zAxis_span_visible = false; // Indicates if the span of the 'elevations' is being displayed

/**
 this function checks to see if the layer has elevation or not
this function is called by the init() in the OpenLayersConfig.jsp
*/
function noElevation(){	
    var check =	layerDetails.zaxis;		//check to see if it has elevation at all
    var hasElevation = true;

    //this means zaxis object exist, now we gotta check the amount of days it has
    if(check !== undefined)
    {
        var heights = layerDetails.zaxis.values.length;
		
        //In this case it only has one elevation
        if(heights === 1)
            hasElevation = false;
    }
    else//this means there is absolutely no hieght. 
    {		
        hasElevation = false;
    }

    if(!hasElevation){
        getElementById('elevationParent').style.display = "none";
    }
	
    return !hasElevation;
}

/**
 * This function adds the elevation 'text'to a normal url
 */
owgis.ncwms.zaxis.addElevationText = function addElevationText(){
    if(netcdf){
        //Asks if it has elevation
        if(!noElevation()){
            return "ELEVATION="+layerDetails.zaxis.values[owgis.ncwms.zaxis.globcounter] + "&";
        }
    }
    return '';
}

/**
 * Initializes the span of 'zaxis_selector' with the
 * zAxis options of the main layer
 */
owgis.ncwms.zaxis.createElevationSelector = function createElevationSelector(){
	
    //Verify we have at least one z-axis
	if(noElevation()) return;//Do not create anything 

	elev_counter = layerDetails.zaxis.values.length;
	
    var totByPage = 10;//Total number of element for each 'page'
		
	//Update the title of the container
	$("#zaxis_title").text(getZaxisText());
    var inner_text = "<table>";
    inner_text += "<tr><td align='left'>";
		
    var totPages = Math.ceil(elev_counter/totByPage);//Total number of pages
    var i = 0;
    var iCurrPage = 0;
    var selectedLink = 0;
    for(var page = 1; page <=totPages; page++){
        iCurrPage = 0;
        if( ((page-1)*totByPage <= owgis.ncwms.zaxis.globcounter) &&
            ( owgis.ncwms.zaxis.globcounter <= page*totByPage )){
            inner_text += "<table id='elevId"+page+"' style='display: inline' id='elevId"+page+"' >";
        } else{
            inner_text += "<table id='elevId"+page+"' style='display: none' id='elevId"+page+"' >";
        }

        inner_text += "<tr><td>";
        while(i < elev_counter && iCurrPage < totByPage)
        {	
            //when the current height is reached(index) then make the radio button checked
            if(i === owgis.ncwms.zaxis.globcounter)
            {
                inner_text += "<input id='zaxisCheckbox"+i+"' onclick='changeElev(" + i + ")' type='radio' name='elev_select' value='" 
                + layerDetails.zaxis.values[i] + "' checked> " + layerDetails.zaxis.values[i] + 
                "&nbsp;&nbsp; " + layerDetails.zaxis.units + "<BR/>";
                selectedLink = page;
            }
            else//all other are just printed without being checked. 
            {
                inner_text += "<input id='zaxisCheckbox"+i+"' onclick='changeElev(" + i + ")' type='radio' name='elev_select' value='" + 
                layerDetails.zaxis.values[i] + "'> " + layerDetails.zaxis.values[i] + 
                "&nbsp;&nbsp;" + layerDetails.zaxis.units +"<BR/>";
            }
            i++;
            iCurrPage ++;
        }	

        inner_text += "</td></tr>";
        inner_text += "</table>";
    }

    inner_text += "</td></tr>";
    inner_text += "<tr><td>";
    for(var link = 1; link <=totPages; link++){
        if(link === selectedLink){
            inner_text += "&nbsp;<a id='idElevPageLink"+link+"' class='linkElevPageSelected' href='#' onclick='dispElevPage("+link+","+totPages+")'>"+link+"</a>,";
        }else{
            inner_text += "&nbsp;<a id='idElevPageLink"+link+"' class='linkElevPageDef' href='#' onclick='dispElevPage("+link+","+totPages+")'>"+link+"</a>,";
        }
    }
    inner_text = inner_text.slice(0,inner_text.length-1);
		
    inner_text += "</td></tr></table>";
      
    $('#zaxis_selector').html(inner_text);
    
}

/**
 * This function is used by the elevation selector and what it does
 * is basically simulate a paging for the depth options, so instead of displaying all
 * height with a long scrollbar it instead uses page numbers that apear on the bottom. 
 * @param {number} num Number that indicates which radio is selected
 * @param {number} total Total number of zaxis options
 */
function dispElevPage(num, total){
    for(var i=1; i<= total; i++){
        if(i === num){
            getElementById("elevId"+i+"").style.display = "inline";
            getElementById("idElevPageLink"+i+"").className = "linkElevPageSelected";
        }else{
            getElementById("elevId"+i+"").style.display = "none";
            getElementById("idElevPageLink"+i+"").className = "linkElevPageDef";
        }
    }
}

/**Displays the different elevations for the user to select
 */
owgis.ncwms.zaxis.displayElevationSelector = function displayElevationSelector(){
    $("#zaxis_selector_parent").fadeToggle();
}

/**
 this function checks to see if the layer has elevation or not
this function is called by the init() in the OpenLayersConfig.jsp
*/
function noElevation()
{	
    var check =	layerDetails.zaxis;		//check to see if it has elevation at all
    var hasElevation = true;

    //this means zaxis object exist, now we gotta check the amount of days it has
    if(check !== undefined)
    {
        var heights = layerDetails.zaxis.values.length;
		
        //In this case it only has one elevation
        if(heights === 1)
            hasElevation = false;
    }
    else//this means there is absolutely no hieght. 
    {		
        hasElevation = false;
    }

    if(!hasElevation){
        getElementById('elevationParent').style.display = "none";
    }
	
    return !hasElevation;
}

/**
 *this changes the elevation and updates all necesary variables 
 *@param value - height of current elevation
 */
function changeElev(value)
{
    owgis.ncwms.zaxis.globcounter  = value;
    //add the elevation parameter to the layerDetails object. 
    var array_len = layerDetails.zaxis.values.length;
	
	// If is not mobile we update the signs of the button
	if(!mobile){
		//change the + sign in the menu
		if(owgis.ncwms.zaxis.globcounter  === 0)
			//getElementById('plusButtonElevation').disabled = true;
			//$(plusButtonElevation).hide();
                        $(plusButtonElevation).addClass("disabled");
		else
			//getElementById('plusButtonElevation').disabled = false;
			//$(plusButtonElevation).show();
                        $(plusButtonElevation).removeClass("disabled");
		
               
		//change the - sign in the menu
                
		if(owgis.ncwms.zaxis.globcounter  === array_len -1)
			//getElementById('minusButtonElevation').disabled = true;
                        $(minusButtonElevation).addClass("disabled");
		else
			//getElementById('minusButtonElevation').disabled= false;
			$(minusButtonElevation).removeClass("disabled");
                
	}else{
        //if(mobile){
		owgis.mobile.closePanels();
	}
	
    owgis.layers.updateMainLayerParam("ELEVATION",layerDetails.zaxis.values[owgis.ncwms.zaxis.globcounter]);

	//TODO next line is controvertial, do we want to update the 
	// color range when whe change the depth?
	//setColorRangeFromMinMax();

    owgis.kml.updateTitleAndKmlLink();
	if(_mainlayer_streamlines){
		owgis.ncwms.currents.startSingleDateAnimation();
	}
}

/** Changes the elevation of the layer if it is netCDF
 *this are used by the + and - of the elevation toolbar
 *@param {string} sign - either + or -
 *  */
function changeElevation(sign)
{
    //get the highest possible value
    var array_len = layerDetails.zaxis.values.length;   

    //if we need to add more height
    if(sign === '+') { 
        if(owgis.ncwms.zaxis.globcounter  !== 0)
            owgis.ncwms.zaxis.globcounter --;          
        else
            alert('You have reached the highest '+getZaxisText());
            
    }
    else if(sign === '-') {
        if(owgis.ncwms.zaxis.globcounter  !== array_len -1)
            owgis.ncwms.zaxis.globcounter ++;
        else
            alert('You have reached the lowest '+getZaxisText());
    }

    changeElev(owgis.ncwms.zaxis.globcounter);
    
    getElementById('zaxisCheckbox'+owgis.ncwms.zaxis.globcounter).checked=true;
}

/**Mobileversion Changes the elevation of the layer if it is netCDF
 *this are used by the + and - of the elevation toolbar
 *@param {string} sign - either + or -
 *  */
function changeElevationMobile(sign)
{
    //get the highest possible value
    var array_len = layerDetails.zaxis.values.length;

    //if we need to add more height
    if (sign === '+')
    {
        if (owgis.ncwms.zaxis.globcounter !== 0)
            owgis.ncwms.zaxis.globcounter--;
        else
            alert('You have reached the highest ' + getZaxisText());

    }
    else if (sign === '-')
    {
        if (owgis.ncwms.zaxis.globcounter !== array_len - 1)
            owgis.ncwms.zaxis.globcounter++;
        else
            alert('You have reached the lowest elevation');
    }

    //change the + sign in the menu
    if (owgis.ncwms.zaxis.globcounter === 0) {

        getElementById('plusButtonElevation').disabled = true;
        getElementById('plusButtonElevation').style.cursor = 'default';
    } else {
        getElementById('plusButtonElevation').disabled = false;
        getElementById('plusButtonElevation').style.cursor = 'pointer';
    }

    //change the - sign in the menu

    if (owgis.ncwms.zaxis.globcounter === array_len - 1) {

        getElementById('minusButtonElevation').disabled = true;
        getElementById('minusButtonElevation').style.cursor = 'default';
    } else {
        getElementById('minusButtonElevation').disabled = false;
        getElementById('minusButtonElevation').style.cursor = 'pointer';
    }

    //Update the elevation parameter on the Main layer parameters
    owgis.layers.updateMainLayerParam("ELEVATION",layerDetails.zaxis.values[owgis.ncwms.zaxis.globcounter ]);
        
    owgis.kml.updateTitleAndKmlLink();

    createElevationSelectorMobile();

}

/**checks if there is a layerDetails.zaxis and also changes the text to elevation or precipitation
 */
function initializeElevation()
{	  
    if(getElementById('elevationParent') !== null){
        if(layerDetails.zaxis === undefined) {
            getElementById('elevationParent').style.display = 'none';
        }
        else {
            var temp = getElementById('elevationText');
            temp.innerHTML = getZaxisText();
        }
    }
}

/**
 * Depending on the data units that we are using
 * it returns the 'title' of the zaxis.
 */
function getZaxisText(){
    var units;
    
    if(layerDetails.zaxis !== undefined)
        units= layerDetails.zaxis.units.toLowerCase();
	
	//TODO we can't use the corrent name from the properties because the text
	// is being filled by javascript but it has to be a better way

    if(units === 'pa') {
		return presText;

    }
    else if( (units === 'm') || (units === 'meter'))
    {
		return  depthText; 
    }
    else
        return "UNDEFINED";
}
