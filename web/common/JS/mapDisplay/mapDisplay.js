var myWCSpopup; //variable for the small pop window that apears when the user clicks. 
var maxOpacity = 1;
var minOpacity = 0.1;
var opacity = 1;//Default opacity
var displayingAnimation = false;//Global variable that helps to disable the palette selection
var optionalArray = [];//this is the array to control the opacity of the different optional layers. 
var hoverDisabled = false; //Used to disable showing the hover texts

//Redirect any https request to http
if (window.location.protocol != "http:") {
	window.location.href = "http:" + window.location.href.substring(window.location.protocol.length);
}

/**
 * Instructions executed when the page
 * is ready
 */
jQuery(document).ready(function()
{
	initOl3();
	initMenus();
	initHelpTxtPos();
});

/**
 * Initializes the calendars with the details of the active layer
 */
function initMenus() {

	disableEnterButton(); //disable enter button

	if (mobile === false)
	{
		$("#helpInstrContainer").draggable();//Make helpInstructions draggable
	}

	//Only make windows draggable for 'topMenu' design
	if (mapConfig['menuDesign'] === "topMenu" && mobile === false) {
		$("#mainMenuParent").draggable({
			containment: "body"
		});//Make dropdows draggable
		$('#optionalMenuParent').draggable({
			containment: "body" });
	}
	if (cqlFilter && mobile == false) {
		$('#ocqlFilterInputTextParent').draggable({
			containment: "body"
		});
	}

	if (netcdf) {
		//Show the palettes
		loadPalettes();
		initCalendars();

		if (mobile == false) {
			createElevationSelector(); //initialize depth selector
			$("#elevationSelector").draggable({
				containment: "body"
			});

			$("#palettes-div").draggable({
				containment: "body"
			});

		} else {
			createElevationSelectorMobile(); //initialize depth selector
		}

		if (mobile == false)
		{
			$('#paletteWindowColorRange').draggable({
				containment: "body"
			});
			$('#CalendarsAndStopContainer').draggable({
				containment: "body"
			});
		}

		//if user changes the window size
		$(window).resize(function() {
			if (mobile == false)
			{
				respositionDraggables();
			}
		});
	}
	else {
		setAnimationDivsVisibility("noanimation");
	}
	//Deactivate the keyboard navigation, this allows changing
	// the font size
//	keyboardnav.deactivate();
	updateTitleAndKmlLink();

	if (mobile == false)
	{
		moveVerticalMenu();
		DraggableUserPosition();//moves the draggable windows to where the user last left them. 
	}

//smallMonitors();

}

/**
 *This function is used to minimize the windows and also to maximize it. 
 *@param appearId - id of window to make appear as minimized on the bottom of page
 *@param disapereId - id of window to minimize or disapear. 
 */
function minimizeWindow(appearId, disapearId)
{
    $(eval(disapearId)).toggle("drop",{direction:"down"});
    $(eval(appearId)).toggle("drop",{direction:"down"});
}

/**
 * This function disables the enter button for the user
 * The reason this function was created is becuase for some reason
 * the page reloads whenever the user clicks the enter in the maxPalVal input
 * box, also when a calendar date is selected and enter is pressed the page reloads, so we disable it. 
 */
function disableEnterButton()
{
	$('html').on('keypress', function(e)
	{
		if (e.keyCode == 13)
		{
			return false;
		}
	});
}



/** Displays an alert when oppening an animation in GoogleEarth.
 * The reason is that it takes some time to generate the file
 */
function KMZDownAlert()
{
	if (netcdf && anim_loaded && !stoppedAnimation)
		alert("Your download will beggin shortly.");
}

/**
 * Updates the time and elevation of the map title
 *@params dateText - date string
 *@params elevText - current depth of the displayed layer
 *
 */
function updateTitle(dateText, elevText) {

	//This symbol indicates when does the date and elevation text start
	separationSymbol = "--";

	var currTitle = $('#pTitleText').text();

	currTitleLC = currTitle.toLowerCase();



	//Removing date and elevation (search and remove -- )
	startSymbol = currTitleLC.indexOf(separationSymbol);



	// Remove everything until second br
	if (startSymbol != -1) {
		// The -4 is because we need to delete also the <br> part.
		currTitle = currTitle.substring(0, startSymbol);
	}

	if ((dateText != "") || (elevText != "")) {

		var resolutionAnim = $('input[name=video_res]:radio:checked').val();

		var endDate = " ";

		if (typeof calEnd != 'undefined') {
			locendSel = calEnd.selection.get();
			locendDate = Calendar.intToDate(locendSel);
			endDate = "/" + Calendar.printDate(locendDate, '%d-%B-%Y');
		}



		if (resolutionAnim !== "" && !stoppedAnimation)//falta hacer lo de resolution langauge y end date
		{
			if (resolutionAnim === "high")
			{
				resolutionAnim = resolutionHigh;

			}
			else if (resolutionAnim === "normal")
			{
				resolutionAnim = resolutionMiddle;

			}
			else if (resolutionAnim === "low")
			{
				resolutionAnim = resolutionLow;

			}

			var resolutiontext = " " + resolutionGlob + " " + resolutionAnim;
			$('#pTitleText').html(currTitle + '<br>' + separationSymbol + dateText + endDate + resolutiontext + elevText + separationSymbol);
		}
		else {
			$('#pTitleText').html(currTitle + '<br>' + separationSymbol + dateText + elevText + separationSymbol);
		}
	}



}

/**
 * Updates the time and elevation
 * of the kml link
 * @params newDate - updated date
 * @params newElev - updated elevation
 */
function updateKmlLink(newDate, newElev, cql_filter) {
	if (newDate != '')
		replaceGetParamInLink("#kmlLink", "TIME", newDate);

	if (newElev != '')
		replaceGetParamInLink("#kmlLink", "ELEVATION", newElev);

	if (cql_filter != '')
		replaceGetParamInLink("#kmlLink", "CQL_FILTER", cql_filter);

}

/** This function obtain the proper values
 * for the current date and the zaxis value (depth) 
 * and send them to updateTitle() and updateKmlLink()
 */
function updateTitleAndKmlLink() {
	if (netcdf) {

		dateForCal = '';
		dateText = '';

		currElevation = '';
		currElevationTxt = '';

		//Building elevation text.
		if (layerDetails.zaxis != undefined)
		{
			currElevation = layerDetails.zaxis.values[elev_glob_counter];
			units = layerDetails.zaxis.units;
			currElevationTxt = " " + getZaxisText() + " " + currElevation + ' ' + units;
		}

		if (typeof calStart != 'undefined') {
			locstartSel = calStart.selection.get();
			locstartDate = Calendar.intToDate(locstartSel);
			dateText = Calendar.printDate(locstartDate, '%d-%B-%Y');
			dateForCal = Calendar.printDate(locstartDate, '%Y-%m-%d');
		}
		updateKmlLink(dateForCal, currElevation, '');
		updateTitle(dateText, currElevationTxt);
	}
}

/**
 * Manages the transparency of the main layer and the animation (if loading)
 * the version parameter is either topMenu or master
 * @params val - new value of transparency
 * @params version - which version it is, it is passed to changeTransp() function
 */
function changeTranspManager(val, version) {
	layer = getMainLayer();
	changeTransp(val, layer, version);

	if (netcdf) {
		if (animation_layer != undefined) {
			changeTransp(val, animation_layer, version);
		}
	}
}

/**this function initializes the gloabl optionalArray
 *@params checkboxNum - 0 for us states, 1 for all cruises , and 2 for all sites. 
 */
function CreateArraysOptional(checkboxNum)
{
	optionalArray[checkboxNum] = 1;
}

/**
 *this function changes the transparency of the optional layers if the layer is selected, otherwise ignore
 *@params selectedLayer - currently displayed layer
 *@params val - transparency value
 *@params id_minus - css id of minus button 
 *@params id_plus - css id of plus button 
 *@params checkboxId - option checkbox id
 */
function changeTranspOptionalLayers(selectedLayer, val, index, id_minus, id_plus, checkboxId)
{
	var checkid = document.getElementById(checkboxId);

	if (checkid.checked == true)//check if the layer is selected
	{
		optionalArray[index] = optionalArray[index] + val;

		var optionOpacity = optionalArray[index];//locate which global opacity layer it is

		//Disables the buttons.
		if (optionOpacity < maxOpacity) {
			document.getElementById(id_minus).disabled = false;
			changeColor(document.getElementById(id_minus), 0);//Change color to enabled
		} else {
			document.getElementById(id_minus).disabled = true;
			changeColor(document.getElementById(id_minus), 3);//Change color to disabled 
		}

		if (optionOpacity > minOpacity) {
			document.getElementById(id_plus).disabled = false;
			changeColor(document.getElementById(id_plus), 0);//Change color to enabled
		} else {
			document.getElementById(id_plus).disabled = true;
			changeColor(document.getElementById(id_plus), 3);//Change color to disabled 
		}

		if (optionOpacity < .00001) {
			optionOpacity = 0;
		}
		selectedLayer.setOpacity(optionOpacity);
	}
}

/*
 *Disables the + or - buttons if the layer is not selected
 *@params index - index of select object
 *@params id_minus - css id of minus button of index object
 *@params id_plus - css id of plus button of index object
 *@params checkboxId - css id of checkbox
 */
function DisableTranspOptionalLayers(index, id_minus, id_plus, checkboxId)
{

	var checkid = document.getElementById(checkboxId);


	if (checkid.checked == true)//check if the layer is selected
	{
		var optionOpacity = optionalArray[index];//localte which global opacity layer it is

		//Disables the buttons.
		if (optionOpacity < maxOpacity) {
			document.getElementById(id_minus).disabled = false;
			changeColor(document.getElementById(id_minus), 0);//Change color to enabled
		} else {
			document.getElementById(id_minus).disabled = true;
			changeColor(document.getElementById(id_minus), 3);//Change color to disabled 
		}

		if (optionOpacity > minOpacity) {
			document.getElementById(id_plus).disabled = false;
			changeColor(document.getElementById(id_plus), 0);//Change color to enabled
		} else {
			document.getElementById(id_plus).disabled = true;
			changeColor(document.getElementById(id_plus), 3);//Change color to disabled 
		}
	}
	else
	{
		//Disables the buttons.
		document.getElementById(id_minus).disabled = true;
		changeColor(document.getElementById(id_minus), 3);//Change color to disabled 

		document.getElementById(id_plus).disabled = true;
		changeColor(document.getElementById(id_plus), 3);//Change color to disabled 

	}

}

/**
 * Changes the transparencya of the inputed layer.
 * @params val - value of transparency
 * @layer layer - currently viewing layer
 * @version - topMenu or master version, the reason is becuase the topMenu version 
 * uses buttons that are disabled, while the master version uses images that can not be disabled
 * so an alert is popped. 
 */
function changeTransp(val, layer, version) {
	opacity = opacity + val;
	//Checks we are not in the limits of transparency
	// This is only used for images, it should not display it for buttons

	if (version == "master")
	{
		if (opacity > maxOpacity) {
			opacity = maxOpacity;
			alert('You are at minimum transparency.');
			return;
		}

		if (opacity < minOpacity) {
			opacity = minOpacity;
			alert('You are at maximum transparency.');
			return;
		}

	}

	//Disables the buttons.
	if (opacity <= maxOpacity) {
        $(minusButtonTrans).css('visibility','visible');
	} else {
        $(minusButtonTrans).css('visibility','hidden');
	}

	if (opacity >= minOpacity) {
        $(plusButtonTrans).css('visibility','visible');
	} else {
        $(plusButtonTrans).css('visibility','hidden');
	}

	layer.setOpacity(opacity);
}

/** This function is called when the Browser gets resized,
 it should keep all the user selections.
 */
function refreshWindow() {
	resizeMap();
	initHelpTxtPos();
}

/**
 * This function updates the size of the div that
 * contains the map. It is used to 'resize' the map
 */
function resizeMap() {
	widthNum = 0;  //Numeric variable of the width of the window
	heightNum = 0; //Numeric variable of the height of the window
	if (parseInt(navigator.appVersion)) {//Verificamos el tipo de navegador del cliente
		if (navigator.appName == 'Netscape') {//Si el navegador es Netscape
			//Se obtiene el numero de columnas y renglones de la siguiente forma
			widthNum = window.innerWidth;
			heightNum = window.innerHeight;
		}
		if (navigator.appName.indexOf('Microsoft') != -1) {//Si el navegador es Explorer
			//Se obtiene el numero de columnas y renglones de la siguiente forma
			widthNum = document.body.offsetWidth;
			heightNum = findPageHeight();
			console.log('entro aki');
		}
	}
	// Modifies the size of the map. The multiplied value represent the proportion of the screen 1 being complete screen 
	// The -1 is used to avoid a bug when using zoom with mouse selection
	widthNum = Math.round(widthNum * 1.0 - 1);
	heightNum = Math.round(heightNum * 1.0 - 1);

	//Convertimos los numeros a cadenas
	width = widthNum.toString();
	height = heightNum.toString();
	//alert(width + ":" + height);
	//Modificamos el ancho y alto del mapa de OPenLayers que contiene las capas del servidor de mapas
	document.getElementById('map').style.width = width + 'px';

	if (height !== null)
		document.getElementById('map').style.height = height + 'px';
}

/**
 * This functions returns a valid browser height for IE or null
 */
function findPageHeight() {
	if (typeof window.innerHeight != 'undefined') {
		return window.innerHeight;
	}
	if (document.documentElement && typeof
			document.documentElement.clientWidth != 'undefined' &&
			document.documentElement.clientHeight != 0) {
		return document.documentElement.clientHeight;
	}
	if (document.body && typeof document.body.clientWidth != 'undefined') {
		return document.body.clientHeight;
	}
	return (null);
}



/**
 * 
 * This function creates some input tags of the html form that are 
 * hidden to the user, it is used to pass in information to the java program to 
 * tell them some changes of the user, like the position of a draggable window or the zoom level of the map
 * 
 */
function MapViewersubmitForm() {
	if (map != null) {
		var inputZoom = document.createElement('INPUT');
		inputZoom.type = 'hidden';
		inputZoom.name = 'zoom';
		inputZoom.value = ol3view.getResolution();
		$('#baseForm').append(inputZoom);

		var inputCenter = document.createElement('INPUT');
		inputCenter.type = 'hidden';
		inputCenter.name = 'center';
		inputCenter.value = ol3view.getCenter().toString();
		$('#baseForm').append(inputCenter);

		//this are all hidden fields on the form to record the position the user wants the dragabble windows.
		//make sure to record first the left value and then the top value separated by a comma. 
		var mainMenuParentPos = document.createElement('INPUT');
		mainMenuParentPos.type = 'hidden';
		mainMenuParentPos.name = 'mainMenuParentPos';
		mainMenuParentPos.value = $("#mainMenuParent").position().left + "," + $("#mainMenuParent").position().top;
		$('#baseForm').append(mainMenuParentPos);

		var optionalMenuParent = document.createElement('INPUT');
		optionalMenuParent.type = 'hidden';
		optionalMenuParent.name = 'optionalMenuParent';
		optionalMenuParent.value = $("#optionalMenuParent").position().left + "," + $("#optionalMenuParent").position().top;
		$('#baseForm').append(optionalMenuParent);


		var optionalsMinimize = document.createElement('INPUT');
		optionalsMinimize.type = 'hidden';
		optionalsMinimize.name = 'optionalsMinimize';
		optionalsMinimize.value = $("#optionalsMinimize").css("display");
		$('#baseForm').append(optionalsMinimize);


		if (mobile == false) {
			var helpInstructions = document.createElement('INPUT');
			helpInstructions.type = 'hidden';
			helpInstructions.name = 'helpInstructions';
			helpInstructions.value = $("#helpInstructions").position().left + "," + $("#helpInstructions").position().top;
			$('#baseForm').append(helpInstructions);
		}

		var mainMenuMinimize = document.createElement('INPUT');
		mainMenuMinimize.type = 'hidden';
		mainMenuMinimize.name = 'mainMenuMinimize';
		mainMenuMinimize.value = $("#mainMenuMinimize").css("display");
		$('#baseForm').append(mainMenuMinimize);

		var mobileForm = document.createElement('INPUT');
		mobileForm.type = 'hidden';
		mobileForm.name = 'mobile';
		mobileForm.value = mobile; //global javascript variable
		$('#baseForm').append(mobileForm);




		if (netcdf) {
			var palettes_divPos = document.createElement('INPUT');
			palettes_divPos.type = 'hidden';
			palettes_divPos.name = 'palettes_divPos';

			if ($("#palettes-div").css("display") != 'none')
				palettes_divPos.value = $("#palettes-div").position().left + "," + $("#palettes-div").position().top;
			$('#baseForm').append(palettes_divPos);

			var palettePos = document.createElement('INPUT');
			palettePos.type = 'hidden';
			palettePos.name = 'palettePos';

			if ($("#palette").css("display") != 'none')
				palettePos.value = $("#paletteWindowColorRange").position().left + "," + $("#paletteWindowColorRange").position().top;

			$('#baseForm').append(palettePos);


			var CalendarsAndStopContainer = document.createElement('INPUT');
			CalendarsAndStopContainer.type = 'hidden';
			CalendarsAndStopContainer.name = 'CalendarsAndStopContainer';

			if ($("#CalendarsAndStopContainer").css("display") != 'none')
			{
				CalendarsAndStopContainer.value = $("#CalendarsAndStopContainer").position().left + "," + $("#CalendarsAndStopContainer").position().top;
			}
			else//this is used when the user is going from a layer with one date to many dates
			{
				CalendarsAndStopContainer.value = calendarPosLeft + "," + calendarPosTop;
			}

			$('#baseForm').append(CalendarsAndStopContainer);

			var calendarsMinimize = document.createElement('INPUT');
			calendarsMinimize.type = 'hidden';
			calendarsMinimize.name = 'calendarsMinimize';
			calendarsMinimize.value = $("#calendarsMinimize").css("display");
			$('#baseForm').append(calendarsMinimize);



		}

		submitForm();
	}
}

/** This function reduces the font size for small Monitors less than 800 px
 * 
 */
function smallMonitors()
{
	var height = screen.height;

	if (height <= 800)
	{
		$('.buttonStyle').css("font-size", '11px');
		$("#layersMenu").css("height", "40px");
	}
}

/*
 *moves vertical menu for small screens. 
 */
function moveVerticalMenu()
{
	var menu = document.getElementById("allMenuParent");
	height = screen.height;

	if (height <= 800 && menu != null)
	{
		menu.style.top = "0px";
	}
}

/**
 * Change optionallayers + and - button colors
 * @params btn -   button id
 * @params pos - which color. 
 */
function changeText(btn, pos) {
	switch (pos) {
		// When the mouse is not over and is not being clicked
		case 0:
			btn.style.color = "white";
			break;
			// When the mouse is over
		case 1:
			btn.style.color = "#36DC2C";
			break;
			// When the button is being clicked
		case 2:
			btn.style.color = "#33982D";
			break;
			// When the button is disabled
		case 3:
			btn.style.color = "gray";
			break;

	}
}
