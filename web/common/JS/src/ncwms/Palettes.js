goog.provide('owgis.ncwms.palettes');

goog.require('owgis.utils');
goog.require('owgis.constants');
goog.require('owgis.ncwms.animation');
goog.require('owgis.ncwms.calendars');
goog.require('owgis.ogc');
goog.require('owgis.ajax');
goog.require('owgis.layouts.draggable.topmenu');

var initialMaxPal;//default maxPalVal
var initialMinPal;//default minPalVal
var urlPaletteImg;//this variable is used to get the first original url

/**
 * This function updates the min
 * and max text fields and reloads the 
 * main layer with the appropiate color range
 * @param minMaxTxt - value of minimim and maximium colors
 */
function updateMinMaxFromJson(minMaxTxt){
	owgis.interf.loadingatmap(false);

    var jsonMinMax = eval("("+minMaxTxt+")");
    $('#minPal').val(parseFloat(jsonMinMax["min"]).toPrecision(4)); 
    $('#maxPal').val(parseFloat(jsonMinMax["max"]).toPrecision(4));
    UpdatePalette(mappalette);
}

/**
 * This function request the min and max value for the
 * current layer and updates the color range.
 * When the user clicks the auto button. 
 */
function setColorRangeFromMinMax(){
	owgis.interf.loadingatmap(true);

    var urlParams = {

        request:"GetMetadata",
        version:owgis.ogc.wmsversion,
        layers: layerDetails['name'],
        width: "100",//Hardcoded it doesn't work without width and Height
        height: "100",
        item:'minmax',
        bbox: layerDetails['bbox'].toString(),
        srs: layerDetails['srs']
    };

	//There are some differences for ncWMS two: we need to add the style
	if(layerDetails['ncwmstwo']){
		urlParams.styles = layerDetails['supportedStyles'][0];
        urlParams.version = owgis.ogc.wmsversionncwms2;
	}

	var currTime = owgis.ncwms.calendars.getCurrentDate(true,owgis.constants.startcal,true);
	if( currTime !== owgis.constants.notimedim ){
        urlParams.time = currTime;
	}

    //Verify that the layer has more than one zaxis option
    if(layerDetails.zaxis !== undefined){
        urlParams.elevation = layerDetails.zaxis.values[owgis.ncwms.zaxis.globcounter];
    }

    var url = layerDetails["server"]+"?"+owgis.utils.paramsToUrl(urlParams);

//	console.log(url);
	owgis.ajax.crossorigin(url,updateMinMaxFromJson);
}

/*
 * Pagination for Palettes 
 */
var current_page = 1;
var records_per_page = 10;
//The 'default' style is defined in the MapViewerServlet
origpalette = mappalette;

function prevPage()
{
    if (current_page > 1) {
        current_page--;
        changePage(current_page);
    }
}

function nextPage()
{
    if (current_page < numPages()) {
        current_page++;
        changePage(current_page);
    }
}
    
function changePage(page)
{
    var btn_next = document.getElementById("btn_next");
    var btn_prev = document.getElementById("btn_prev");
    
    // Validate page
    if (page < 1) page = 1;
    if (page > numPages()) page = numPages();

    //Inserts the optional palettes in a table
    $("#palettesTable").empty();
    var tableRow = $('#palettesTable')[0].insertRow(0);

    for (var i = (page-1) * records_per_page; i < (page * records_per_page); i++) {
            
        palstr = layerDetails.palettes[i];
        if(typeof palstr !== "undefined"){
            var td = document.createElement('td');
            td.setAttribute('onclick',"UpdatePalette('"+palstr+"');");
            td.innerHTML = "<img class='optPaletteImg' src='"+_paletteUrl.replace(origpalette,palstr)+"' /></td>";
            tableRow.appendChild(td);
        }
    }

    if (page == 1) {
        btn_prev.style.visibility = "hidden";
    } else {
        btn_prev.style.visibility = "visible";
    }

    if (page == numPages()) {
        btn_next.style.visibility = "hidden";
    } else {
        btn_next.style.visibility = "visible";
    }
}

function numPages()
{
    return Math.ceil(layerDetails.palettes.length / records_per_page);
}

/**
 * Fills the dropdown menu that contains the available palettes
 */
owgis.ncwms.palettes.loadPalettes = function(){
    
    changePage(1);
    
    //Copied from loadDefault
    urlPaletteImg = $('#imgPalette').attr("src");

    minPalVal = layerDetails.scaleRange[0];
    maxPalVal  = layerDetails.scaleRange[1];

    initialMaxPal = maxPalVal;
    initialMinPal = minPalVal;

    //The 'default' style is defined in the MapViewerServlet
    origpalette = mappalette;
    
    if(mappalette === 'default' ||  mappalette === ''){
        mappalette = layerDetails.defaultPalette;
		owgis.layers.updateMainLayerParam('STYLES',lay_style+"/"+mappalette);
    }

    //Inserts the optional palettes in a table
    /*
    var tableRow = $('#palettesTable')[0].insertRow(0);

    for (var key in layerDetails.palettes) {
        palstr = layerDetails.palettes[key];

        var td = document.createElement('td');
        td.setAttribute('onclick',"UpdatePalette('"+palstr+"');");
        td.innerHTML = "<img class='optPaletteImg' src='"+_paletteUrl.replace(origpalette,palstr)+"' /></td>";
        tableRow.appendChild(td);
    }
    */

	owgis.ncwms.palettes.updateHorizontalPalette();

    $('#minPal').val( parseFloat(minPalVal).toPrecision(4)); 
    $('#maxPal').val( parseFloat(maxPalVal).toPrecision(4));
    
}

/**
 * This function is in charge of creating the color bar in the bottom of the map
 * @returns {String}
 */
owgis.ncwms.palettes.updateHorizontalPalette = function(){
	// This code currently only works for ncwmsTwo server
	if(layerDetails['ncwmstwo'] && !mobile){
		//Adding the colorbar at the bottom to a width of 50%
		// of the with of the website

		var barWidth = Math.ceil($(window).width()*.4);
//		var barHeight = Math.ceil(barWidth*.03);
		var barHeight = 15;

		//------ Modifying the size of the div container
		$("#div-palette-horbar").css("WIDTH",barWidth+"px");
		$("#div-palette-horbar").css("HEIGHT",barHeight+"px");

		//------ Modifying the url of the colobar ----------
		var finalUrl = replaceUrlParam(_paletteUrl,"WIDTH",barWidth);
		finalUrl= replaceUrlParam(finalUrl,"HEIGHT",barHeight);
		finalUrl= replaceUrlParam(finalUrl,"VERTICAL","False");
		finalUrl= replaceUrlParam(finalUrl,"PALETTE",mappalette);
		// Add the modified url to the img object

		var imageObj = new Image();
		imageObj.src = finalUrl;
//		console.log(finalUrl);

		var ctx = $('#canvas-palette-horbar')[0].getContext("2d");
		//------ Modifying the size of the canvas container
		var spaceForUnits = 40;
		ctx.canvas.width = barWidth+spaceForUnits;
		ctx.canvas.height = barHeight;

		imageObj.onload = function(){
			ctx.globalAlpha = 0.7;
			ctx.drawImage(imageObj,spaceForUnits,0);
			ctx.globalAlpha = 1;
			$("#div-palette-horbar").show();
			ctx.fillStyle = '#FFFFFF'; //Define color to use
			var pixBellowText = 3;// How many pixels bellow text
			ctx.font= (barHeight-pixBellowText)+"px Arial";

			//How many numbers do we want in the color bar	
			// It is not perfect because the ticks function modifies
			// the size of the array depending its parameters
			var totNumbers = 8;
			var minVal = minPalVal;
			var maxVal = maxPalVal;
//			console.log("-----",minVal,"-",maxVal);
			var values = d3.ticks(minVal,maxVal,totNumbers);
			//We need to substract 20 because if not the last number
			// goes outside the canvas.
			var step = (barWidth-20)/(values.length-1);
//			console.log(values);

			var idx = 0;
			//Write the units first
			ctx.fillText(layerDetails.units,2,Math.ceil(barHeight-pixBellowText));
			for (var pos = 2; pos <=  barWidth; pos+=step){
				ctx.fillText(values[idx],pos+spaceForUnits,Math.ceil(barHeight-pixBellowText));
				idx++;
			}
		};

		// Move the div container of the palette into the center. 
//		$('#div-palette-horbar').css('left', Math.ceil(($(window).width()-barWidth)/2));
	}
}

function replaceUrlParam(url, paramName, paramValue) {
	if (paramValue === null)
		paramValue = '';
	var pattern = new RegExp('\\b(' + paramName + '=).*?(&|$)')
	if (url.search(pattern) >= 0) {
		return url.replace(pattern, '$1' + paramValue + '$2');
	}
	return url + (url.indexOf('?') > 0 ? '&' : '?') + paramName + '=' + paramValue
}


/**
 * Replaces the image of the palette used
 */
function UpdatePalette(newPal){
    //alert("mapaalette: " + mappalette);
    $('#imgPalette').attr("src", $('#imgPalette').attr("src").replace(mappalette,newPal));
    mappalette = newPal;//Change the current palette to the one just selected

    if(validatePaletteRange()){
        owgis.layers.updateMainLayerParam('colorscalerange',minPalVal+ ',' + maxPalVal);
        //Update the KMLlink to visualize on google earth
        owgis.utils.replaceGetParamInLink("#kmlLink", "COLORSCALERANGE", minPalVal+ ',' + maxPalVal);
    }

	//Changes the palette
	owgis.layers.updateMainLayerParam('STYLES',lay_style+"/"+newPal);
	owgis.utils.replaceGetParamInLink("#kmlLink", "STYLES", lay_style+"/"+newPal);

	//If an animation is being displayed it reloads it with the new palette.
	if(owgis.ncwms.animation.status.current !== owgis.ncwms.animation.status.none){
		clearLoopHandler();
		owgis.ncwms.animation.dispAnimation();
	}

	owgis.ncwms.palettes.updateHorizontalPalette();
}

/**
 * Replaces the image of the palette used to the default and original one, this functions is essentially the same
 * as the above but it uses the maxPal and minPalVal of the origin defualt image. 
 */
function UpdatePaletteDefault(newPal, maxPal, minPal){

    //alert("mapaalette: " + mappalette);
    $('#imgPalette').attr("src", $('#imgPalette').attr("src").replace(mappalette,newPal));
    mappalette = newPal;//Change the current palette to the one just selected

    if(validatePaletteRange()){
//        owgis.layers.getMainLayer().setOptions({
//            styles: lay_style+"/"+newPal, 
//            colorscalerange: minPal+ ',' + maxPal
//        });
        owgis.layers.updateMainLayerParam('colorscalerange',minPalVal+ ',' + maxPalVal);
    	owgis.layers.updateMainLayerParam('STYLES',lay_style+"/"+newPal);

        //Update the KMLlink to visualize on google earth
        owgis.utils.replaceGetParamInLink("#kmlLink", "STYLES", lay_style+"/"+newPal);
        owgis.utils.replaceGetParamInLink("#kmlLink", "COLORSCALERANGE", minPal+ ',' + maxPal);
    }else{
//        owgis.layers.getMainLayer().setOptions({
//            styles: lay_style+"/"+newPal
//        });
    	owgis.layers.updateMainLayerParam('STYLES',lay_style+"/"+newPal);

        //Update the KMLlink to visualize on google earth
        owgis.utils.replaceGetParamInLink("#kmlLink", "STYLES", lay_style+"/"+newPal);
    }
}

/**
 *Gets the get the value of the default palette from the url (urlPaletteImg)
 */
function DefaultPalette()
{
    minPalVal = initialMinPal;//reset globals back to defualt values
    maxPalVal = initialMaxPal;

	defaultColor = layerDetails.defaultPalette

    // here we don't use UpdatePalette() becuase that one defualt to the max and min that is currently 
    //selected by the user
    UpdatePaletteDefault(defaultColor, initialMaxPal, initialMinPal);//update to original defualt palette
    $('#maxPal').val(initialMaxPal);//change the text of the input box of the html
    $('#minPal').val(initialMinPal);

}

/**
 * Displays or hides the div that contains all the palettes.
 * @param force_visib Forces an specific visibility of optional palettes.
 */
function displayOptionalPalettes(){
	 $('#palettes-div').toggle("fade"); 
}

/** Shows and hides the palettes windows (both at the same time) */
function showPalettes()
{       
    // Toggles the color range window
    $('#paletteWindowColorRange').toggle("fade");

    // We test the opacity of the 'color range window' to decide what
    // to do with the 'optional palettes window'
	 if($('#paletteWindowColorRange').css("opacity") === "0") {
        $('#palettes-div').show();
	}else{
        $('#palettes-div').hide();
	}
}

/**
 * changes the color of the layer depengind on the amount passed in
 * @param amount - amount to change or update to 
 */
function increaseMaxColorRange(amount){
    $('#maxPal').val( eval(parseFloat($('#maxPal').val()).toPrecision(4)) + parseFloat(amount));
    UpdatePalette(mappalette);
}

/**
 * changes the color of the layer depengind on the amount passed in
 * @param amount - amount to change or update to 
 */
function decreaseMinColorRange(amount){
    $('#minPal').val( eval(parseFloat($('#minPal').val()).toPrecision(4)) - parseFloat(amount));
    UpdatePalette(mappalette);
}
