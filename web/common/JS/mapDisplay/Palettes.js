var check_default = false; //boolean to check for default palette
var initialMaxPal;//default maxPalVal
var initialMinPal;//defualt minPalVal

var urlPaletteImg;//this variable is used to get the first original url

/**
 * This function updates the min
 * and max text fields and reloads the 
 * main layer with the appropiate color range
 * @params minMaxTxt - value of minimim and maximium colors
 */
function updateMinMaxFromJson(minMaxTxt){
	//    alert(minMaxTxt);
	var jsonMinMax = eval("("+minMaxTxt+")");
	$('#minPal').val(parseFloat(jsonMinMax["min"]).toPrecision(4) - 1); 
	$('#maxPal').val(parseFloat(jsonMinMax["max"]).toPrecision(4) + 1);
	UpdatePalette(mappalette);
	//Show the Loading message
	$('#l-animation').css("visibility","hidden");
}
/**
 * This function request the min and max value for the
 * current layer and updates the color range.
 * When the user clicks the auto button. 
 */
function setColorRangeFromMinMax(){
	var asyncMinMax = new Asynchronous();     

	var urlParams = {
		server:layerDetails["server"],
		request:"GetMetadata",
		version:"1.1.1",
		layers: layerDetails['name'],
		width: "10",
		height: "10",
		item:'minmax',
		time: getCurrentlySelectedDate('%Y-%m-%d'),
		bbox: layerDetails['bbox'].toString(),
		srs: layerDetails['srs']
	};

	//Verify that the layer has more than one zaxis option
	if(layerDetails.zaxis!= undefined){
		urlParams.elevation = layerDetails.zaxis.values[elev_glob_counter];
	}

	var currUrl = window.location.href;
	lastSlash = currUrl.lastIndexOf("/");
	currUrl = currUrl.substr(0,lastSlash);

	var url = currUrl+'/simpleAjaxRedirect?';

	url += paramsToUrl(urlParams);

    var path_image = basepath+"/common/images/load.gif";//loading ...
	//Show the Loading message
	document.getElementById('loadperc').innerHTML = "0";   
	$('#l-animation').css("visibility",'visible');
	asyncMinMax.complete = updateMinMaxFromJson;
	asyncMinMax.call(url);

}

/**
 * Fills the dropdown menu that contains the available palettes
 */
function loadPalettes(){
	//The 'default' style is defined in the MapViewerServlet
	origpalette = mappalette;
	if(mappalette == 'default'){
		mappalette = layerDetails.defaultPalette;
		//		$('#imgPalette').src = $('#imgPalette').src.replace(origpalette,mappalette);
		$('#imgPalette').attr("src", $('#imgPalette').attr("src").replace(origpalette,mappalette));
	}

	var tableRow = $('#palettesTable')[0].insertRow(0);

	for (var key in layerDetails.palettes) {
		palstr = layerDetails.palettes[key];

		var td = document.createElement('td');
		td.setAttribute('onclick',"UpdatePalette('"+palstr+"');");
		td.innerHTML = "<img src='"+paletteUrl.replace(origpalette,palstr)+"' /></td>";
		tableRow.appendChild(td);
	}

	minPalVal = layerDetails.scaleRange[0];
	maxPalVal  = layerDetails.scaleRange[1];

	$('#minPal').val( parseFloat(minPalVal).toPrecision(4)); 
	$('#maxPal').val( parseFloat(maxPalVal).toPrecision(4));

	//Position the windows if the menu we are using is the TopMenu 'horizontal'
	if(mapConfig['menuDesign'] == "topMenu"){
		//document.getElementById('palettes-div').style.left = (widthNum - 510) + "px"
	}
        if(mapConfig['menuDesign'] == "sideMenu")
        {
            document.getElementById('palettes-div').style.left = 180 + "px"
        }
}


/**
 * Replaces the image of the palette used
 */
function UpdatePalette(newPal){
	//alert("mapaalette: " + mappalette);
	$('#imgPalette').attr("src", $('#imgPalette').attr("src").replace(mappalette,newPal));
	mappalette = newPal;//Change the current palette to the one just selected

  	
	if(validatePaletteRange()){
        updateMainLayerParam('STYLES',lay_style+"/"+newPal);
        updateMainLayerParam('colorscalerange',minPalVal+ ',' + maxPalVal);
		
		//Update the KMLlink to visualize on google earth
		replaceGetParamInLink("#kmlLink", "STYLES", lay_style+"/"+newPal);
		replaceGetParamInLink("#kmlLink", "COLORSCALERANGE", minPalVal+ ',' + maxPalVal);
	}else{
        updateMainLayerParam('STYLES',lay_style+"/"+newPal);
		
		//Update the KMLlink to visualize on google earth
		replaceGetParamInLink("#kmlLink", "STYLES", lay_style+"/"+newPal);
	}
}

/**
 * Replaces the image of the palette used to the defualt and original one, this functions is essentially the same
 * as the above but it uses the maxPal and minPalVal of the origin defualt image. 
 */
function UpdatePaletteDefualt(newPal, maxPal, minPal){
    
	//alert("mapaalette: " + mappalette);
	$('#imgPalette').attr("src", $('#imgPalette').attr("src").replace(mappalette,newPal));
	mappalette = newPal;//Change the current palette to the one just selected
	
	if(validatePaletteRange()){
		getMainLayer().setOptions({
			styles: lay_style+"/"+newPal, 
			colorscalerange: minPal+ ',' + maxPal
		});
		
		//Update the KMLlink to visualize on google earth
		replaceGetParamInLink("#kmlLink", "STYLES", lay_style+"/"+newPal);
		replaceGetParamInLink("#kmlLink", "COLORSCALERANGE", minPal+ ',' + maxPal);
	}else{
		getMainLayer().setOptions({
			styles: lay_style+"/"+newPal
		});
		
		//Update the KMLlink to visualize on google earth
		replaceGetParamInLink("#kmlLink", "STYLES", lay_style+"/"+newPal);
	}
//	keyboardnav.activate();
}

/**
 *Gets the get the value of the default palette from the url (urlPaletteImg)
 */
function DefaultPalette()
{

	var lookup = /PALETTE=[A-z]*&/g; //use regular expresion to find the default palette
	//  alert(urlPaletteImg);
	//  alert(initialMaxPal);
	//  alert(initialMinPal);
    
	minPalVal = initialMinPal;//reset globals back to defualt values
	maxPalVal = initialMaxPal;

	var match = urlPaletteImg.match(lookup);
	match = String(match);
	var equalSign = match.indexOf("=");
	var ampersand = match.indexOf("&");
	var defaultColor = match.substring(equalSign+1, ampersand);  
   	
	// here we don't use UpdatePalette() becuase that one defualt to the max and min that is currently 
	//selected by the user
	UpdatePaletteDefualt(defaultColor, initialMaxPal, initialMinPal);//update to original defualt palette
	$('#maxPal').val(initialMaxPal);//change the text of the input box of the html
	$('#minPal').val(initialMinPal);
    
    
}

/**
 *checks to see the default palette value, it is only executed once because of the boolean. 
 * This function is called when the html of the pallete is loaded. 
 */
function getDefault()
{

	if(check_default == false)
	{
		urlPaletteImg = $('#imgPalette').attr("src");
		initialMaxPal = maxPalVal;
		initialMinPal = minPalVal;
	}    
	check_default = true;
}


/**
 * Displays or hides the div that contains all the palettes.
 * @params force_visib Forces an specific visibility of optional palettes.
 */
function displayOptionalPalettes(){
	
	//If the animation is being displayed we do not show optional palettes
	// and display and alert explaining why.
	if( anim_loaded && !stoppedAnimation ){
		$(palettes-div).hidde();
		alert("The color palette can't be changed while loading or displaying an animation");
	}
	else{ $('#palettes-div').toggle("fade"); }
}
  
  
/** Shows and hides the palettes windows (both at the same time) */
function showPalettes()
{       
    // Toggles the color range window
	$('#paletteWindowColorRange').toggle("fade");
    
    // We test the opacity of the 'color range window' to decide what
    // to do with the 'optional palettes window'
	if($('#paletteWindowColorRange').css("opacity") === "0") 
        $('#palettes-div').show();
    else
        $('#palettes-div').hide();
	
}

/**
 * changes the color of the layer depengind on the amount passed in
 * @params amount - amount to change or update to 
 */
function increaseMaxColorRange(amount){
	$('#maxPal').val( eval(parseFloat($('#maxPal').val()).toPrecision(4)) + parseFloat(amount));
	UpdatePalette(mappalette);
}

/**
 * changes the color of the layer depengind on the amount passed in
 * @params amount - amount to change or update to 
 */
function decreaseMinColorRange(amount){
	$('#minPal').val( eval(parseFloat($('#minPal').val()).toPrecision(4)) - parseFloat(amount));
	UpdatePalette(mappalette);
}
