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

    localStorage.opt_menu_minimized =  $("#optionalsMinimize").css("display") == "none"? false: true;
    localStorage.main_menu_minimized = $("#mainMenuMinimize").css("display") == "none"? false: true;

    saveIndividualWindowPosition("pos_main_menu", "#mainMenuParent");
    saveIndividualWindowPosition("pos_opt_menu", "#optionalMenuParent");

    //Only for netCDF layers the position of palettes and color range windows get saved
    if (netcdf) {        
        saveIndividualWindowPosition("pos_palettes", "#palettes-div");
        saveIndividualWindowPosition("pos_color_range", "#paletteWindowColorRange");

        localStorage.palette_visible = $("#palettes-div").css("display") == "none"? false: true;
        localStorage.color_range_visible= $("#paletteWindowColorRange").css("display") == "none"? false: true;

        //Only if the main layer has multiple dates we save the calendars position
        if(_mainlayer_multipleDates){
            localStorage.calendars_minimized =  $("#calendarsMinimize").css("display") == "none"? false: true;
            saveIndividualWindowPosition("pos_calendars", "#CalendarsAndStopContainer");
        }
    }
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

/**this function is called by the initMenus function and places the draggable windows to where the user last placed it. 
 it works based on session variables and the global variable 'userConfig' which is of json format. This function also handles the minimized
 *windows disaply or not.
 */
function draggableUserPosition()
{
    // Repositions the main layers menu
    repositionWindows(localStorage.pos_main_menu, localStorage.main_menu_minimized,
            'mainMenuParent', 'mainMenuMinimize');

    // Repositions the Optional layers menu 
    repositionWindows(localStorage.pos_opt_menu, localStorage.opt_menu_minimized,
            'optionalMenuParent', 'optionalsMinimize');

    // If the main layer is a netcdf layer then we update the position
    // of the calendars
    if (netcdf) {
        repositionWindows(localStorage.pos_calendars, localStorage.calendars_minimized,
                'CalendarsAndStopContainer', 'calendarsMinimize');

        //The palettes window is never minimized
        repositionWindows(localStorage.pos_palettes, "false",
                'palettes-div', 'none');
        repositionWindows(localStorage.pos_color_range, "false",
                'paletteWindowColorRange', 'none');
    }
}


/**
 * This function is in charge of showing or hidding the windows in the 
 * interface like the palettes, color ranges and depth windows
 */
function toggleVisualizedWindows(){

    if (netcdf) {
        //Check if the palette windows where visible
        if( localStorage.palette_visible !== undefined &&  localStorage.color_range_visible !== "undefined"){
            if ( localStorage.palette_visible === "true") $("#palettes-div").show("fade");
            if ( localStorage.color_range_visible === "true") $("#paletteWindowColorRange").show("fade");
        }
    }
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
                if( localStorageVariable!== undefined ){
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
function moveOneWindow(id)
{
    var windowLeft = $(window).width();
    var windowTop = $(window).height();
    var poundId = "#" + id;
    var left = $(poundId).position().left;
    var top = $(poundId).position().top;
    var idWidth = $(poundId).width();
    var idHeight = $(poundId).height();
    var constant = 5;

    var finalLeft = windowLeft - idWidth - constant; //subtract the width of draggable from the border of the browswer
    var finalTop = windowTop - idHeight - constant;

    if (windowLeft < left + idWidth)
    {
        document.getElementById(id).style.left = finalLeft + "px";//move it from the left
    }

    if (windowTop < top + idHeight)
    {
        document.getElementById(id).style.top = finalTop + "px";//move it from the top
    }
}

/**
 *This function moves the draggable windows when the user changes its window size. 
 */
function respositionDraggables()
{

    if (mapConfig['menuDesign'] == "topMenu") {
        moveOneWindow("mainMenuParent");
        moveOneWindow("optionalMenuParent");
    }

    if (cqlFilter) {
        moveOneWindow("ocqlFilterInputTextParent");
    }

    if (netcdf) {
        moveOneWindow("elevationSelector");
        moveOneWindow("palettes-div");
        moveOneWindow("paletteWindowColorRange");
        moveOneWindow("CalendarsAndStopContainer");
    }
}


