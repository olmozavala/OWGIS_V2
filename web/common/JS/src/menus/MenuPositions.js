/*
 * This file contains all the functions used to 
 * reposition the windows of the interface.
 */

/** This function saves the positions and other parameters
 * that the user has on the interface to maintain the look
 * when he/she returns to the site
 */
function saveAllWindowPositionsAndVisualizationStatus(){
    localStorage.zoom = ol3view.getResolution();// Zoom of map
    localStorage.map_center =  ol3view.getCenter();// Center of the map

    localStorage.opt_menu_minimized =  $("#optionalsMinimize").css("display") === "none"? false: true;
    localStorage.main_menu_minimized = $("#mainMenuMinimize").css("display") === "none"? false: true;

    saveIndividualWindowPosition("pos_main_menu", "#mainMenuParent");
    saveIndividualWindowPosition("pos_opt_menu", "#optionalMenuParent");

    //Only for netCDF layers the position of palettes and color range windows get saved
    if (netcdf) {        
        saveIndividualWindowPosition("pos_palettes", "#palettes-div");
        saveIndividualWindowPosition("pos_color_range", "#paletteWindowColorRange");

        localStorage.palette_visible = $("#palettes-div").css("display") === "none"? false: true;
        localStorage.color_range_visible= $("#paletteWindowColorRange").css("display") === "none"? false: true;

        //Only if the main layer has multiple dates we save the calendars position
        if(_mainlayer_multipleDates){
            localStorage.calendars_minimized =  $("#calendarsMinimize").css("display") === "none"? false: true;
            saveIndividualWindowPosition("pos_calendars", "#CalendarsAndStopContainer");
        }
        if(_mainlayer_zaxisCoord){
            localStorage.elev_selector_visible= $("#zaxis_selector").css("display") === "none"? false: true;
            saveIndividualWindowPosition("pos_elev_selector", "#zaxis_selector");
        }
    }

    localStorage.disable_hover = hoverDisabled;
    
}

/**
 * Saves the position of one of the windows. 
 * @param {localStorage} localStorageVariable Local storage variable to be used.
 * @param {string} windowElement Name of the container of the window to save position
 */
function saveIndividualWindowPosition(localStorageVariable, windowElement){
    if( $(windowElement).css("display") !== "none"){//Just update the  position if the window is visible
        localStorage[localStorageVariable]= $(windowElement).position().left + "," + $(windowElement).position().top;
    }
}

/** Places the draggable windows to where the user last placed them. Also controls if they where
 * visible or minimized. 
 */
function draggableUserPositionAndVisibility()
{
    // Repositions the main layers menu
    repositionWindows(localStorage.pos_main_menu, localStorage.main_menu_minimized,
            'mainMenuParent', 'mainMenuMinimize');

    // Repositions the Optional layers menu 
    repositionWindows(localStorage.pos_opt_menu, localStorage.opt_menu_minimized,
            'optionalMenuParent', 'optionalsMinimize');

    // If the main layer is a netcdf layer then we update the position
    // of the calendars and palettes windows
    if (netcdf) {
                //The palettes window is never minimized
        repositionWindows(localStorage.pos_palettes, "false",
                'palettes-div', 'none');
        repositionWindows(localStorage.pos_color_range, "false",
                'paletteWindowColorRange', 'none');

        if(_mainlayer_multipleDates){
            repositionWindows(localStorage.pos_calendars, localStorage.calendars_minimized,
                    'CalendarsAndStopContainer', 'calendarsMinimize');
        }

        if(_mainlayer_zaxisCoord){
            repositionWindows(localStorage.pos_elev_selector, "false",
                'zaxis_selector', 'none');
        }
    }

   // -------- Visibility of windows ----------
   if (netcdf) {
        //Check if the palette windows where visible
        if( localStorage.palette_visible !== undefined &&  localStorage.color_range_visible !== "undefined"){
            if ( localStorage.palette_visible === "true") $("#palettes-div").show("fade");
            if ( localStorage.color_range_visible === "true") $("#paletteWindowColorRange").show("fade");
        }

        if( localStorage.elev_selector_visible!== undefined){
            if(_mainlayer_zaxisCoord){
                if ( localStorage.elev_selector_visible=== "true") {
                    $("#zaxis_selector").show("fade");
                }
            }
        }
   }

   // --------------- Map visualization and 
    if( localStorage.zoom !== undefined) ol3view.setResolution(localStorage.zoom);// Zoom of map 
    if( localStorage.map_center!== undefined){
        strCenter = localStorage.map_center.split(",")
        lat = Number(strCenter[0]);
        lon = Number(strCenter[1]);
        ol3view.setCenter([lat,lon]);// Center of the map
    }
    if( localStorage.disable_hover === "true"){
        //Disables the text hovers 
        displayHoverHelp();
    }

   // Finally we test if they fit on the screen
   repositionDraggablesByScreenSize();
}

/**
 * This function is used to repostion one of the following windows:
 * main menu, optional layers menu or calendars.
 * If any of these windows was minimized (before selecting a new main layer)
 * then the window gets minimized.
 */
function repositionWindows(localStorageVariable, localStorage_minimized, 
        windowToMove, minimizedElement)
{
    // We verify that the position is available
    try{
        if( localStorage_minimized !== undefined ){
            if ( localStorage_minimized === "true") {
                minimizeWindow( minimizedElement, windowToMove );
            } else {
                if( localStorageVariable!== undefined && localStorageVariable!== null){
                    var prevPosition = localStorageVariable.split(",");    //split the left position and top position. so mainMenuParent[0] is left and mainMenuParent[1] is top. 
                    document.getElementById(windowToMove).style.left = prevPosition[0] + "px";//move it from the left
                    document.getElementById(windowToMove).style.top = prevPosition[1] + "px";//move it from the top
                }
            }
        }
    }
    catch(err){
        console.log("Unable to reposition window:", windowToMove, err);
    }
}  
/**
 *This function moves one window when the browswer is reseized
 *@param id - id of draggable window.
 */
function moveOneWindowToFitOnScreen(id)
{
    var poundId = "#" + id;

    //We only check the 'div' if it is visible
    if($(poundId).is(":visible")){
        var windowLeft = $(window).width();
        var windowTop = $(window).height();
        var left = $(poundId).position().left;
        var top = $(poundId).position().top;
        var idWidth = $(poundId).width();
        var idHeight = $(poundId).height();
        var constant = 10;// Extra space for moving windows

        var finalLeft = windowLeft - idWidth - constant; //subtract the width of draggable from the border of the browswer
        var finalTop = windowTop - idHeight - constant;

        if (windowLeft < left + idWidth) {
            document.getElementById(id).style.left= finalLeft+ "px";//move it from the left
        }

        if (windowTop < top + idHeight) {
            document.getElementById(id).style.top = finalTop + "px";//move it from the top
        }
    }
}

/**
 *This function moves the draggable windows when the user changes its window size. 
 */
function repositionDraggablesByScreenSize()
{

	moveOneWindowToFitOnScreen("mainMenuParent");
	moveOneWindowToFitOnScreen("optionalMenuParent");

    if (cqlFilter) {
        moveOneWindowToFitOnScreen("ocqlFilterInputTextParent");
    }

    if (netcdf) {
        moveOneWindowToFitOnScreen("palettes-div");
        moveOneWindowToFitOnScreen("paletteWindowColorRange");
        if(_mainlayer_zaxisCoord) moveOneWindowToFitOnScreen("zaxis_selector");
        if(_mainlayer_multipleDates) moveOneWindowToFitOnScreen("CalendarsAndStopContainer");
    }
}


