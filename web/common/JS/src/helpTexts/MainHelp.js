goog.provide('owgis.help.main');

/** 
 *this function displays the help menu instructions for the user. 
 */
owgis.help.main.displayHelp = function()
{
    //$('#helpInstrContainer').toggle("fade");
    var ijs = introJs();
    if (_curr_language == "ES") {
        ijs.setOption("skipLabel", " Saltar ");
        ijs.setOption("doneLabel", " Terminar ");
    }
    
    ijs.setOption("nextLabel"," > ");
    ijs.setOption("prevLabel"," < ");
    
    ijs.start();   
    
}

/**
 * This function is a helper function specifically for the function initHelpTextTopMenu
 * It only checks if an id exists and is visible
 */
function testVisibility(id) {
    if (getElementById(id) != null &&
            getElementById(id).style.display != 'none')
        return true;
    else
        return false;
}

