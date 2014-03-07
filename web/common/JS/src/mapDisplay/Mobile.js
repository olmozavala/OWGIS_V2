

var userChoice = 'undefined';//these are globals used to remeber the user choice of botton. 
var userChoice2 = 'undefined';
var userChoice3 = 'undefined';

/**
 * This function starts once the mobile version is loaded. called by body tag 
 * in mobile.jsp
 * 
 * @returns {undefined}
 */

function mobileInit()
{
    $("#pieDePaginaIzq").css("display", "none");
}

/**
 * This function records the value of a variable of the choosen botton into the global variable. 
 * 
 * @param {string} opt first variable passed in so the browser remebers which botton the user selected
 * @param {string} opt2 second variable if needed like for zoom options or palette color
 * @param {string} opt3 third option if needed
 * @returns {undefined}
 */
function UserChoice(opt, opt2, opt3)
{
    userChoice = opt;
    userChoice2 = opt2;
    userChoice3 = opt3;
}

/**
 * This function shows or hides the title of the map
 * @param {type} opt if 1 then hide else show. 
 * @returns {undefined}
 */

function showMobileTitle(opt)
{
    var timeout = 300;
    //hide the title
    if (opt === 1)
    {
        $("#mobileLev1HideTitleOn").fadeOut(0);
        $("#pTitleText").fadeOut(timeout);
        $("#mobileLev1HideTitleOff").fadeIn(0);
    }
    else
    {
        $("#mobileLev1HideTitleOff").fadeOut(0);
        $("#pTitleText").fadeIn(timeout);
        $("#mobileLev1HideTitleOn").fadeIn(0);

    }





}


/**
 * This function hides the level two options (this is where all the bottons are after clicking 
 * tools or herramientas. )
 * @param {type} timeout time to hide the level in microseconds
 * @returns {undefined}
 */
function hideLevel2(timeout)
{

    $("#mobileLevel2").fadeOut(timeout);
    $("#mobileLevel2").css("display", "none");


}


/**
 * This is the functions that shows and hides the different user options based on the value passed in
 * @param {string or int} opt option to hide
 * @returns {undefined}
 */
function hideMobileMenuLevel1(opt)
{
    var timeout = 300;
    //hide menu level 1 and show show button
    if (opt === 0)
    {
        $("#mobileLev1Tools").fadeOut(timeout);
        $("#mobileLev1Help").fadeOut(timeout);
        $("#mobileLev1Hide").fadeOut(timeout);
        $("#mobileLev1HideTitle").fadeOut(timeout);
        //$("#mobileLev1optOpen").css("display", "none");
        $("#mobileLev1optClose").delay(timeout).fadeIn(timeout);
        //$("#mobileLev1optClose").css("display", "block");

    }//otherwise
    else if (opt === 1)
    {

        $("#mobileLev1optClose").fadeOut(timeout);

        $("#mobileLev1Tools").delay(timeout).fadeIn(timeout);
        $("#mobileLev1Help").delay(timeout).fadeIn(timeout);
        $("#mobileLev1HideTitle").delay(timeout).fadeIn(timeout);

        $("#mobileLev1Hide").delay(timeout).fadeIn(timeout);


    }//hide level1 and show level 2
    else if (opt === 2)
    {

        $("#mobileLevel1").fadeOut(timeout);
        $("#mobileLevel1").css("display", "none");
        $("#mobileLevel2").delay(timeout).fadeIn(timeout);
    }
    else if (opt === 3)//go back to level 1 menu
    {

        $("#mobileLevel2").fadeOut(timeout);
        $("#mobileLevel2").css("display", "none");
        $("#mobileLevel1").delay(timeout).fadeIn(timeout);
        //   $("#mobileLevel1").css("display", "block");
    }
    else if (opt === "ResizeMap")
    {
        resizeMap();
    }
    else if (opt === "mainLayers")
    {
        hideLevel2(timeout);
        $("#mobileLevel3").delay(timeout).fadeIn(timeout);
        $("#level3MainLayers").delay(timeout).fadeIn(timeout);
        $("#mobileLev3Back").delay(timeout).fadeIn(timeout);

    }
    else if (opt === "optionalLayers")
    {
        hideLevel2(timeout);
        $("#mobileLevel3").delay(timeout).fadeIn(timeout);
        $("#level3OptionalLayers").delay(timeout).fadeIn(timeout);
        $("#mobileLev3Back").delay(timeout).fadeIn(timeout);


    }
    else if (opt === "calendars")
    {

        hideLevel2(timeout);
        $("#mobileLevel3").delay(timeout).fadeIn(timeout);
        $("#level3Calendars").delay(timeout).fadeIn(timeout);
        $("#CalendarsAndStopContainer").delay(timeout).fadeIn(timeout);

        $("#mobileLev3Back").delay(timeout).fadeIn(timeout);

        $(".DynarchCalendar").css("zoom", "200%");

    }
    else if (opt === "cqlFilter")
    {


        hideLevel2(timeout);
        $("#mobileLevel3").delay(timeout).fadeIn(timeout);
        $("#level3cqlFilter").delay(timeout).fadeIn(timeout);

        toggleCustomFilterTextBox();
        $("#mobileLev3Back").delay(timeout).fadeIn(timeout);



    }
    else if (opt === "transparency")
    {

        hideLevel2(timeout);
        $("#mobileLevel3").delay(timeout).fadeIn(timeout);
        $("#level3Transparency").delay(timeout).fadeIn(timeout);



        $("#mobileLev3Back").delay(timeout).fadeIn(timeout);



    }
    else if (opt === "depth")
    {

        hideLevel2(timeout);
        $("#mobileLevel3").delay(timeout).fadeIn(timeout);


        $("#level3Depth").delay(timeout).fadeIn(timeout);

        $("#mobileLev3Back").delay(timeout).fadeIn(timeout);



    }
    else if (opt === "colorPalette")
    {

        hideLevel2(timeout);
        $("#mobileLevel3").delay(timeout).fadeIn(timeout);
        $("#level3ColorPalette").delay(timeout).fadeIn(timeout);
        $("#palette").delay(timeout).fadeIn(timeout);

        $("#palettes-div").delay(timeout).fadeIn(timeout);

        $("#mobileLev3Back").delay(timeout).fadeIn(timeout);


    }
    else if (opt === "transect")
    {
        hideLevel2(timeout);

        $("#transectParent").delay(timeout).fadeIn(timeout);



    }
    else if (opt === "zoom")
    {
        hideLevel2(timeout);
        $("#mobileLevel3").delay(timeout).fadeIn(timeout);
        // $("#zoomOptions").delay(timeout).fadeIn(timeout);
        $("div.olControlPanPanel").delay(timeout).fadeIn(timeout);
        $("div.olControlZoomPanel").delay(timeout).fadeIn(timeout);

        $("#mobileLev3Back").delay(timeout).fadeIn(timeout);
    }
    else if (opt === "HideAll")
    {
        hideAll(timeout);
        $('#hideAllButton').fadeOut(timeout);
        $("#mobileLev3BackBotton").fadeOut(timeout);
        $("#mobileLev3resizeMap").fadeOut(timeout);
        $('#showAllButton').delay(timeout * 2).fadeIn(timeout);
        $('#showAllButton').delay(timeout * 2).fadeIn(timeout);
    }
    else if (opt === "helpInst")
    {
        hideLevel2(timeout);
        $("#mobileLevel3").delay(timeout).fadeIn(timeout);
        $("#mobileLev3Back").delay(timeout).fadeIn(timeout);
        $("#level3helpInst").delay(timeout).fadeIn(timeout);

        displayHelp();

    }
    else if (opt === "ShowAll")
    {
        $('#showAllButton').fadeOut(timeout);

        $("#mobileLevel3").delay(timeout).fadeIn(timeout);
        $('#hideAllButton').delay(timeout).fadeIn(timeout);
        $("#mobileLev3BackBotton").delay(timeout).fadeIn(timeout);
        $("#mobileLev3resizeMap").delay(timeout).fadeIn(timeout);

        if (userChoice !== "undefined")
        {
            var finalopt;
            if (userChoice.substr(0, 4) !== "div.")
            {
                finalopt = "#" + userChoice;
            }
            else
                finalopt = userChoice;

            $(finalopt).fadeIn(timeout);

            var finalopt2;
            if (userChoice2.substr(0, 4) !== "div.")
            {
                finalopt2 = "#" + userChoice2;
            }
            else
                finalopt2 = userChoice2;

            $(finalopt2).fadeIn(timeout);


            var finalopt3;
            if (userChoice3.substr(0, 4) !== "div.")
            {
                finalopt3 = "#" + userChoice3;
            }
            else
                finalopt3 = userChoice3;

            $(finalopt3).fadeIn(timeout);
        }
    }
    else if (opt === "mobileLev3Back")
    {
        hideAll(timeout);

        $("#mobileLevel3").fadeOut(timeout);
        $("#mobileLevel2").delay(timeout).fadeIn(timeout);
    }
}

/**
 * Hides all the listed id's
 * @param {type} timeout time in microseconds to hide the ids.
 * @returns {undefined}
 */

function hideAll(timeout)
{

    $("#level3MainLayers").fadeOut(timeout);
    $("#level3MainLayers").css("display", "none");
    $("#level3OptionalLayers").fadeOut(timeout);
    $("#level3OptionalLayers").css("display", "none");
    $("#level3Calendars").fadeOut(timeout);
    $("#level3Calendars").css("display", "none");
    $("#CalendarsAndStopContainer").fadeOut(timeout);
    $("#CalendarsAndStopContainer").css("display", "none");
    $("#level3Transparency").delay(timeout).fadeOut(timeout);
    $("#level3Transparency").css("display", "none");
    $("#level3Depth").delay(timeout).fadeOut(timeout);
    $("#level3Depth").css("display", "none");
    $("#level3ColorPalette").delay(timeout).fadeOut(timeout);
    $("#level3ColorPalette").css("display", "none");
    $("#palette").delay(timeout).fadeOut(timeout);
    $("#palette").css("display", "none");
    $("#palettes-div").delay(timeout).fadeOut(timeout);
    $("#palettes-div").css("display", "none");
    $("#level3cqlFilter").delay(timeout).fadeOut(timeout);
    $("#level3cqlFilter").css("display", "none");
    $("#level3helpInst").delay(timeout).fadeOut(timeout);
    $("#level3helpInst").css("display", "none");
    $("#transectParent").delay(timeout).fadeOut(timeout);
    $("#zoomOptions").delay(timeout).fadeOut(timeout);
    $("div.olControlPanPanel").delay(timeout).fadeOut(timeout);
    $("div.olControlZoomPanel").delay(timeout).fadeOut(timeout);

}


/**
 *This fucntion get called when the option is not available 
 *becuase it not NTCDF. 
 */
function notAvailableOption()
{
    alert("This option is not available for this layer type.");
}


/**
 * Checks if the mobile browser is horizontal or vertical view
 * @returns {Number} return 0 for vertical view (portrait), 1 for horizontal (landscape)
 * 
 */
function detectOrientation()
{

    if (window.innerHeight > window.innerWidth)
    {
        return 0;
    }
    else if (window.innerHeight < window.innerWidth)
    {
        return 1;
    }

}
