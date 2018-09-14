goog.provide('owgis.help.main');

/** 
 *this function displays the help menu instructions for the user. 
 */
owgis.help.main.displayHelp = function()
{
    //$('#helpInstrContainer').toggle("fade");
    /*var intro = introJs();
    
    intro.setOptions({
            steps: [
              { 
                intro: "Hello world!"
              },
              {
                element: document.querySelector('#step1'),
                intro: "This is a tooltip."
              },
              {
                element: document.querySelectorAll('#step2')[0],
                intro: "Ok, wasn't that fun?",
                position: 'right'
              },
              {
                element: '#step3',
                intro: 'More features, more fun.',
                position: 'left'
              },
              {
                element: '#step4',
                intro: "Another step.",
                position: 'bottom'
              },
              {
                element: '#step5',
                intro: 'Get it, use it.'
              }
            ]
    });
    
    intro.start();
    */  
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

