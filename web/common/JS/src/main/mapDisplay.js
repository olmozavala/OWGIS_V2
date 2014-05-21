goog.provide('owgis');

goog.require('ol.Map');
goog.require('ol.View2D');
goog.require('ol.coordinate');
goog.require('ol.layer.Tile');
goog.require('ol.source.TileJSON');
goog.require('ol.source.TileWMS');
goog.require('ol.source.MapQuest');
goog.require('ol.proj');
goog.require('ol.Overlay');
goog.require('ol.control.MousePosition');
goog.require('ol.control.ScaleLine');
goog.require('ol.control.FullScreen');
goog.require('ol.control.ZoomSlider');
goog.require('ol.proj.Projection');

goog.require('owgis.ol3');
goog.require('owgis.utils');
goog.require('owgis.layers');
goog.require('owgis.ncwms.transect');
goog.require('owgis.ncwms.animation');

var myWCSpopup; //variable for the small pop window that apears when the user clicks. 
var maxOpacity = 1;
var minOpacity = 0.1;
var opacity = 1;//Default opacity
var displayingAnimation = false;//Global variable that helps to disable the palette selection
var optionalArray = [];//this is the array to control the opacity of the different optional layers. 
var hoverDisabled = false; //Used to disable showing the hover texts

//Redirect any https request to http
if (window.location.protocol !== "http:") {
	window.location.href = "http:" + window.location.href.substring(window.location.protocol.length);
}

/**
 * Instructions executed when the page
 * is ready
 */
function owgisMain(){
	initOl3();
    addLayers();
    initVariables();
	initMenus();
	initHelpTxtPos();
}

/**
 * This function is in charge of making draggable all the divs and spans
 * with the correct classes, in this case: draggableWindow or transDraggableWindow 
 * @returns {undefined}
 */
function addDraggableWindows(){

    //Only make windows draggable for 'topMenu' design
    if (mapConfig['menuDesign'] === "topMenu" && mobile === false) {
		$(".draggableWindow").each( function(index) {
			$(this).draggable({ containment: "#draggable-container" ,scroll:false}); 
		})
		$(".transDraggableWindow").each( function(index) {
			$(this).draggable({ containment: "#draggable-container" ,scroll:false}); 
		})
	}
}

/**
 * Initializes the calendars with the details of the active layer
 */
function initMenus() {
	
    disableEnterButton(); //disable enter button
    addDraggableWindows(); // Make the proper windows draggable.
	
    if (netcdf) {
        //Show the palettes
        loadPalettes();
        initCalendars();
        if (mobile === false) {
            createElevationSelector(); //initialize depth selector
        }else{
            createElevationSelectorMobile(); //initialize depth selector
        }
    } 
	
    updateTitleAndKmlLink();//Updates the title of the layer adding the time and depth of the layer
    updateMenusDisplayVisibility("default");
    draggableUserPositionAndVisibility();//moves the draggable windows to where the user last left them. 
	
    //if user changes the window size
    $(window).resize(function() {
        repositionDraggablesByScreenSize();
    });
}

/**
 *This function is used to minimize the windows and also to maximize it. 
 *@param appearId - id of window to make appear as minimized on the bottom of page
 *@param disapearId - id of window to minimize or disapear. 
 */
function minimizeWindow(appearId, disapearId)
{
    $(eval(disapearId)).toggle("drop",{direction:"down"});
    $(eval(appearId)).toggle("drop",{direction:"down"});
	
    //Check if they fit on the screen
    //(after 1 second) to be sure it is visible
    setTimeout( function (){repositionDraggablesByScreenSize();}, 1000);
}

/**
 * This function disables the enter button for the user
 * The reason this function was created is becuase for some reason
 * the page reloads whenever the user clicks the enter in the maxPalVal input
 * box, also when a calendar date is selected and enter is pressed the page reloads, so we disable it. 
 */
function disableEnterButton()
{
    $('html').on('keypress', function(e) {
        if (e.keyCode === 13) {
            return false;
        }
    });
}



/** Displays an alert when oppening an animation in GoogleEarth.
 * The reason is that it takes some time to generate the file
 */
function KMZDownAlert()
{
    if (netcdf && anim_loaded && !owgis.ncwms.animation.stoppedAnimation)
        alert("Your download will beggin shortly.");
}

/**
 * Updates the time and elevation of the map title
 *@param dateText - date string
 *@param elevText - current depth of the displayed layer
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
    if (startSymbol !== -1) {
        // The -4 is because we need to delete also the <br> part.
        currTitle = currTitle.substring(0, startSymbol);
    }
	
    if ((dateText !== "") || (elevText !== "")) {
		
        var resolutionAnim = $('input[name=video_res]:radio:checked').val();
		
        var endDate = " ";
		
        if (typeof calEnd !== 'undefined') {
            locendSel = calEnd.selection.get();
            locendDate = Calendar.intToDate(locendSel);
            endDate = "/" + Calendar.printDate(locendDate, '%d-%B-%Y');
        }
		
        if (resolutionAnim !== "" && !owgis.ncwms.animation.stoppedAnimation)//falta hacer lo de resolution langauge y end date
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
 * Updates the time, elevation and CQL filter of the kml link
 * @param newDate - updated date
 * @param newElev - updated elevation
 * @param {type} cql_filter Updated CQL filter
 */
function updateKmlLink(newDate, newElev, cql_filter) {
    if (newDate !== '')
        owgis.utils.replaceGetParamInLink("#kmlLink", "TIME", newDate);
	
    if (newElev !== '')
        owgis.utils.replaceGetParamInLink("#kmlLink", "ELEVATION", newElev);
	
    if (cql_filter !== '')
        owgis.utils.replaceGetParamInLink("#kmlLink", "CQL_FILTER", cql_filter);
	
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
        if (layerDetails.zaxis !== undefined)
        {
            currElevation = layerDetails.zaxis.values[elev_glob_counter];
            units = layerDetails.zaxis.units;
            currElevationTxt = " " + getZaxisText() + " " + currElevation + ' ' + units;
        }
		
        if (typeof calStart !== 'undefined') {
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
 * @param val - new value of transparency
 * @param version - which version it is, it is passed to changeTransp() function
 */
function changeTranspManager(val, version) {
    layer = owgis.layers.getMainLayer();
    changeTransp(val, layer, version);
	
    if (netcdf) {
        if (animation_layer !== undefined) {
            changeTransp(val, animation_layer, version);
        }
    }
}

/**this function initializes the gloabl optionalArray
 *@param checkboxNum - 0 for us states, 1 for all cruises , and 2 for all sites. 
 */
function CreateArraysOptional(checkboxNum)
{
    optionalArray[checkboxNum] = 1;
}

/**
 *this function changes the transparency of the optional layers if the layer is selected, otherwise ignore
 *@param selectedLayer - currently displayed layer
 *@param val - transparency value
 *@param {type} index Index of the optional layer
 *@param id_minus - css id of minus button 
 *@param id_plus - css id of plus button 
 *@param checkboxId - option checkbox id
 */
function changeTranspOptionalLayers(selectedLayer, val, index, id_minus, id_plus, checkboxId)
{
    var checkid = document.getElementById(checkboxId);
	
    if (checkid.checked === true)//check if the layer is selected
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
 *@param index - index of select object
 *@param id_minus - css id of minus button of index object
 *@param id_plus - css id of plus button of index object
 *@param checkboxId - css id of checkbox
 */
function DisableTranspOptionalLayers(index, id_minus, id_plus, checkboxId)
{
	
    var checkid = document.getElementById(checkboxId);
	
	
    if (checkid.checked === true)//check if the layer is selected
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
 * @param val - value of transparency
 * @layer layer - currently viewing layer
 * @version - topMenu or master version, the reason is becuase the topMenu version 
 * uses buttons that are disabled, while the master version uses images that can not be disabled
 * so an alert is popped. 
 */
function changeTransp(val, layer, version) {
    opacity = opacity + val;
    //Checks we are not in the limits of transparency
    // This is only used for images, it should not display it for buttons
	
    if (version === "master")
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
    $("#map").width = $(window).width();
    $("#map").height = $(window).height();
}

/**
 * This functions returns a valid browser height for IE or null
 */
function findPageHeight() {
    if (typeof window.innerHeight !== 'undefined') {
        return window.innerHeight;
    }
    if (document.documentElement && typeof
	document.documentElement.clientWidth !== 'undefined' &&
            document.documentElement.clientHeight !== 0) {
		return document.documentElement.clientHeight;
	}
    if (document.body && typeof document.body.clientWidth !== 'undefined') {
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
    if (map !== null) {
        saveAllWindowPositionsAndVisualizationStatus();
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

/**
 * Change optionallayers + and - button colors
 * @param btn -   button id
 * @param pos - which color. 
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

/**
 * This function is used to reset all the paramenters
 * of the interface, like the positionso of the windows,
 * and center of the map.
 */
function resetView(){
    localStorage.clear();
    submitForm();
}

goog.exportSymbol('owgis',owgis);

