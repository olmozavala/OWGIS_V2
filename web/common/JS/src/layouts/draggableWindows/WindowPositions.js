/*
 * This file contains all the functions used to 
 * reposition the windows of the interface.
 */

goog.provide('owgis.layouts.draggable');
goog.require('owgis.ol3');

/** This function saves the positions and other parameters
 * that the user has on the interface to maintain the look
 * when he/she returns to the site
 */
owgis.layouts.draggable.saveAllWindowPositionsAndVisualizationStatus = function(){
    localStorage.zoom = ol3view.getResolution();// Zoom of map
    localStorage.map_center =  ol3view.getCenter();// Center of the map
    
    localStorage.language = _curr_language;
    
    var radioButtons = $('input[name^="elev_select"]:checked');
    if(typeof radioButtons[0] !== 'undefined'){ localStorage.depth = radioButtons[0].value; }
    if(typeof _cesium !== 'undefined'){ localStorage.cesium = _cesium.getEnabled(); }
    localStorage.transparency_layer = owgis.transparency.getTransp();

    localStorage.opt_menu_minimized =  $("#optionalsMinimize").css("display") === "none"? false: true;
    localStorage.main_menu_minimized = $("#mainMenuMinimize").css("display") === "none"? false: true;

    saveIndividualWindowPosition("pos_main_menu", "#mainMenuParent");
    saveIndividualWindowPosition("pos_opt_menu", "#optionalMenuParent");

    //Only for netCDF layers the position of palettes and color range windows get saved
    if (netcdf) {        
        saveIndividualWindowPosition("pos_palettes", "#palettes-div");
        saveIndividualWindowPosition("pos_color_range", "#paletteWindowColorRange");
        
        localStorage.map_palette = mappalette;
        localStorage.palette_visible = $("#palettes-div").css("display") === "none"? false: true;
        localStorage.color_range_visible= $("#paletteWindowColorRange").css("display") === "none"? false: true;

        //Only if the main layer has multiple dates we save the calendars position
        if(_mainlayer_multipleDates){
            localStorage.calendars_minimized =  $("#calendarsMinimize").css("display") === "none"? false: true;
            saveIndividualWindowPosition("pos_calendars", "#CalendarsAndStopContainer");
            var radioButtons1 = $('input[name="video_res"]:checked');
            if(typeof radioButtons1[0] !== 'undefined'){ localStorage.animation_res = radioButtons1[0].value; }
        }
        if(_mainlayer_zaxisCoord){
            localStorage.elev_selector_visible= $("#zaxis_selector_parent").css("display") === "none"? false: true;
            saveIndividualWindowPosition("pos_elev_selector", "#zaxis_selector_parent");
        }
        if(_mainlayer_streamlines){
            localStorage.currents_controls_visible = $("#currentsControlsContainer").css("display") === "none"? false: true;
            saveIndividualWindowPosition("pos_currents_controls", "#currentsControlsContainer");
            localStorage.particles_num = owgis.ncwms.currents.particles.getNumParticles();
            localStorage.particles_speed = owgis.ncwms.currents.particles.getParticleSpeed();
            localStorage.particles_lifetime = owgis.ncwms.currents.particles.getParticlesLifeTime();
            localStorage.particles_color = owgis.ncwms.currents.getColor();
        }
    }

    localStorage.server_name = window.location.href;
    localStorage.disable_hover = hoverDisabled;
    
}

/** Places the draggable windows to where the user last placed them. Also controls if they where
 * visible or minimized. 
 */
owgis.layouts.draggable.draggableUserPositionAndVisibility = function()
{
    try{
        if( localStorage.server_name === window.location.href){
            console.log('repositioning windows ...');
            // Repositions the main layers menu
            repositionWindow(localStorage.pos_main_menu, localStorage.main_menu_minimized, 'mainMenuParent', 'mainMenuMinimize');

            // Repositions the Optional layers menu 
            repositionWindow(localStorage.pos_opt_menu, localStorage.opt_menu_minimized, 'optionalMenuParent', 'optionalsMinimize');
			
            // If the main layer is a netcdf layer then we update the position
            // of the calendars and palettes windows
            if (netcdf) {
                console.log('is a netcdf, repositioning calendars and palettes windows ...');
		//The palettes window is never minimized
		repositionWindow(localStorage.pos_palettes, "false", 'palettes-div', 'none');
		repositionWindow(localStorage.pos_color_range, "false", 'paletteWindowColorRange', 'none');
		
                if(_mainlayer_multipleDates){
                    repositionWindow(localStorage.pos_calendars, localStorage.calendars_minimized, 'CalendarsAndStopContainer', 'calendarsMinimize');
		}
		
                if(_mainlayer_zaxisCoord){
                    repositionWindow(localStorage.pos_elev_selector, "false", 'zaxis_selector_parent', 'none');
		}
				
		if(_mainlayer_streamlines){
                    repositionWindow(localStorage.pos_currents_controls, "false", 'currentsControlsContainer', 'none');
		}
			
                // -------- Visibility of windows ----------
		//Check if the palette windows where visible
		if( localStorage.palette_visible !== undefined &&  localStorage.color_range_visible !== "undefined"){
                    if ( localStorage.palette_visible === "true") $("#palettes-div").show("fade");
                    if ( localStorage.color_range_visible === "true") $("#paletteWindowColorRange").show("fade");
		}
				
                if( localStorage.currents_controls_visible!== undefined){
                    if(_mainlayer_streamlines){
			if ( localStorage.currents_controls_visible=== "true") $("#currentsControlsContainer").show("fade");
                    }
		}
				
		if( localStorage.elev_selector_visible!== undefined){
                    if(_mainlayer_zaxisCoord){
			if ( localStorage.elev_selector_visible=== "true") {
                            $("#zaxis_selector_parent").show("fade");
			}
                    }
		}
            }

            //Updates the position of the map as it was previously set
            owgis.ol3.positionMap();
			
            if( localStorage.disable_hover === "true"){
		//Disables the text hovers 
                console.log('disable hover');
		owgis.help.tooltips.toggleTooltips();
                owgis.layouts.draggable.topmenu.toogleUse('.helpHoverSpan');
            }
            
            //set animation resolution 
            if(typeof localStorage.animation_res !== 'undefined' ){
                $("input[name=video_res][value=" + localStorage.animation_res + "]").attr('checked', 'checked');
            }
            // Finally we test if they fit on the screen
            owgis.layouts.draggable.repositionDraggablesByScreenSize();
                        
	}		
    }catch(err){
	console.log("Error initializing the menus... clearing local storage");
	localStorage.clear();
	owgis.layouts.draggable.draggableUserPositionAndVisibility();//moves the draggable windows to where the user last left them. 
    }
}

/**
 *This function moves the draggable windows when the user changes its window size. 
 */
owgis.layouts.draggable.repositionDraggablesByScreenSize = function(){
	
	moveOneWindowToFitOnScreen("mainMenuParent");
	moveOneWindowToFitOnScreen("optionalMenuParent");
	
    if (cqlFilter) {
        moveOneWindowToFitOnScreen("ocqlFilterInputTextParent");
    }
	
    if (netcdf) {
        moveOneWindowToFitOnScreen("palettes-div");
        moveOneWindowToFitOnScreen("paletteWindowColorRange");
        if(_mainlayer_zaxisCoord) moveOneWindowToFitOnScreen("zaxis_selector_parent");
        if(_mainlayer_multipleDates) moveOneWindowToFitOnScreen("CalendarsAndStopContainer");
        if(_mainlayer_streamlines) moveOneWindowToFitOnScreen("currentsControlsContainer");
    }
}

/**
 * This function is in charge of making draggable all the divs and spans
 * with the correct classes, in this case: draggableWindow or transDraggableWindow 
 * @returns {undefined}
 */
owgis.layouts.draggable.init = function(){
	
    //Only make windows draggable for 'topMenu' design
    if ( mobile === false) {
		$(".draggableWindow").each( function(index) {
			$(this).draggable({ containment: "#draggable-container" ,scroll:false}); 
		})
		$(".transDraggableWindow").each( function(index) {
			$(this).draggable({ containment: "#draggable-container" ,scroll:false}); 
		})
	}
}

/**
 *This function is used to minimize the windows and also to maximize it. 
 *@param appearId - id of window to make appear as minimized on the bottom of page
 *@param disapearId - id of window to minimize or disapear. 
 */
owgis.layouts.draggable.minimizeWindow = function(appearId, disapearId){
    $(eval(disapearId)).toggle("drop",{direction:"down"});
    $(eval(appearId)).toggle("drop",{direction:"down"});
	
    //Check if they fit on the screen
    //(after 1 second) to be sure it is visible
    setTimeout( function (){owgis.layouts.draggable.repositionDraggablesByScreenSize();}, 1000);
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

/**
 * This function is used to repostion one of the following windows:
 * main menu, optional layers menu or calendars.
 * If any of these windows was minimized (before selecting a new main layer)
 * then the window gets minimized.
 * @param {type} localStorageVariable
 * @param {type} localStorage_minimized
 * @param {type} windowToMove
 * @param {type} minimizedElement
 * @returns {undefined}
 */
function repositionWindow(localStorageVariable, localStorage_minimized, windowToMove, minimizedElement)
{
    // We verify that the position is available
    try{
        if( localStorage_minimized !== undefined ){
            if ( localStorage_minimized === "true") {
                owgis.layouts.draggable.minimizeWindow( minimizedElement, windowToMove );
            } else {
                if( localStorageVariable!== undefined && localStorageVariable!== null){
                    var prevPosition = localStorageVariable.split(",");    //split the left position and top position. so mainMenuParent[0] is left and mainMenuParent[1] is top. 
                    getElementById(windowToMove).style.left = prevPosition[0] + "px";//move it from the left
                    getElementById(windowToMove).style.top = prevPosition[1] + "px";//move it from the top
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
            getElementById(id).style.left= finalLeft+ "px";//move it from the left
        }
		
        if (windowTop < top + idHeight) {
            getElementById(id).style.top = finalTop + "px";//move it from the top
        }
    }
}