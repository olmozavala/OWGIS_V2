/*
 * This file contains all the functions used to 
 * reposition the windows of the interface.
 */

/** This function saves the positions and other parameters
 * that the user has on the interface to maintain the look
 * when he/she returns to the site
 */
function savePositions(){
    localStorage.zoom = ol3view.getResolution();// Zoom of map
    localStorage.map_center =  ol3view.getCenter();// Center of the map
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

function repositionWindow(localId, element){
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

	if (netcdf)
	{
		moveOneWindow("elevationSelector");
		moveOneWindow("palettes-div");

		moveOneWindow("paletteWindowColorRange");


		moveOneWindow("CalendarsAndStopContainer");
	}
}

/**this function is called by the initMenus function and places the draggable windows to where the user last placed it. 
 it works based on session variables and the global variable 'userConfig' which is of json format. This function also handles the minimized
 *windows disaply or not.
 */
function DraggableUserPosition()
{
	if (userConfig.mainMenuParent != 'default')
	{
		if (userConfig.mainMenuMinimize != 'default' && userConfig.mainMenuMinimize != 'block')
		{
			var mainMenuParent = userConfig.mainMenuParent.split(",");    //split the left position and top position. so mainMenuParent[0] is left and mainMenuParent[1] is top. 
			document.getElementById("mainMenuParent").style.left = mainMenuParent[0] + "px";//move it from the left
			document.getElementById("mainMenuParent").style.top = mainMenuParent[1] + "px";//move it from the top
		}
		else
		{
			minimizeWindow('mainMenuMinimize', 'mainMenuParent');
		}
	}


	//Only 'update' position for the topMenu menu
	if (mapConfig['menuDesign'] == "topMenu") {
		if (userConfig.optionalMenuParent != 'default')
		{

			if (userConfig.optionalsMinimize != 'default' && userConfig.optionalsMinimize != 'block')
			{
				var optionalMenuParent = userConfig.optionalMenuParent.split(",");    //split the left position and top position. so mainMenuParent[0] is left and mainMenuParent[1] is top. 
				document.getElementById("optionalMenuParent").style.left = optionalMenuParent[0] + "px";//move it from the left
				document.getElementById("optionalMenuParent").style.top = optionalMenuParent[1] + "px";//move it from the top
			}
			else
			{

				minimizeWindow('optionalsMinimize', 'optionalMenuParent');
			}
		}
	}


	if (userConfig.helpInstructions != 'default')
	{
		var helpInstructions = userConfig.helpInstructions.split(",");    //split the left position and top position. so mainMenuParent[0] is left and mainMenuParent[1] is top. 
		document.getElementById("helpInstructions").style.left = helpInstructions[0] + "px";//move it from the left
		document.getElementById("helpInstructions").style.top = helpInstructions[1] + "px";//move it from the top
	}

	if (netcdf) {


		if (userConfig.CalendarsAndStopContainer != 'default')
		{
			if (userConfig.calendarsMinimize != 'default' && userConfig.calendarsMinimize != 'block')
			{

				var CalendarsAndStopContainer = userConfig.CalendarsAndStopContainer.split(",");    //split the left position and top position. so mainMenuParent[0] is left and mainMenuParent[1] is top. 

				document.getElementById("CalendarsAndStopContainer").style.left = CalendarsAndStopContainer[0] + "px";//move it from the left
				document.getElementById("CalendarsAndStopContainer").style.top = CalendarsAndStopContainer[1] + "px";//move it from the top
			}
			else
			{
				minimizeWindow('calendarsMinimize', 'CalendarsAndStopContainer');
			}
		}
	}
}
