goog.provide('owgis.help.main');

/** 
 *this function displays the help menu instructions for the user. 
 */
owgis.help.main.displayHelp = function()
{
    //$('#helpInstrContainer').toggle("fade");
    
    if(_curr_language == "ES"){
        introJs().setOptions({
                nextLabel: "siguiente",
                prevLabel: "anterior",
                skipLabel: "saltar",
                doneLabel: "terminar"
            });
    }
            
    introJs().start();

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

