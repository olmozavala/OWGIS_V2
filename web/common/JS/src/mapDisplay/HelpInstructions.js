/** 
 *this function displays the help menu instructions for the user. 
 */
function displayHelp()
{
    $('#helpInstrContainer').toggle("fade");
}

function getop(x) {
    o = document.getElementById(x);
    var t = o.offsetTop;
    while (o = o.offsetParent)
        t += o.offsetTop;
    return t;
}
function getleft(x) {
    o = document.getElementById(x);
    var l = o.offsetLeft;
    while (o = o.offsetParent)
        l += o.offsetLeft;

    return l;
}
function getwidth(x) {
    o = document.getElementById(x);
    var l = o.offsetWidth;

    return l;
}

/**
  this function handles the instruction messages that apears when the user hovers over a button. 
  pass in id of element and pass in option 1 to make it apear and 2 to disapear
  @params id_name - Id of the container with the hover text
  @params option - 1 for apear and 2 for disappear. 
  @params container - Is the container where the help text should be displayed. It 
  is used to set the position of it. 
  @params pos - The position of the text can be 'above','below','right' or 'left'
  @params width - Specific width used for offseting the position of the text
  @params height - Specific height used for offseting the position of the text
  */
function hoverInstructions(id_name, option, container, pos, width, height)
{
    //if mobile or hover disabled don't display the hover help instructions
    if (mobile || hoverDisabled)
        return;

    contPos = $(container).offset();
    //If the parent container has width and height we use it, if not
    // we define a default size (TODO having default sizes won't work for all layouts)
    contWidth = width  == undefined ? 140 : width;
    contHeight = height == undefined ? 45 : height;

    if(pos === 'above'){
        contPos.top = contPos.top - contHeight;
    }
    if(pos === 'below'){
        contPos.top = contPos.top + contHeight;
    }
    if(pos === 'belowleft'){
        contPos.top = contPos.top + contHeight;
        contPos.left = contPos.left - contWidth;
    }
    if(pos === 'left'){
        contPos.left = contPos.left - contWidth;
    }
    if(pos === 'right'){
        contPos.left = contPos.left + contWidth;
    }
    try{
        $(eval(id_name)).css(contPos);

        hoverInstructionsFixedPos(id_name,option);

    }catch(err){
        console.log('The id:'+id_name+' was not found');
    }
}

/**
  this function handles the instruction messages that apears when the user hovers over a button. 
  pass in id of element and pass in option 1 to make it apear and 2 to disapear
  This function is used when the text hover has a fixed position.
  @params id_name - could be any named passed in as long as it matches an if statment inside this function. 
  @params option - 1 for apear and 2 for disappear. 
  */
function hoverInstructionsFixedPos(id_name,option){
    if (option == "2")  
        $(eval(id_name)).hide(); 
    else 
        $(eval(id_name)).show(); 
}
/**
 * This function initializes the positions of the
 * help texts depending on the menuDesign selected.
 */
function initHelpTxtPos() {
    design = mapConfig['menuDesign'];
}

/**
 * This function is a helper function specifically for the function initHelpTextTopMenu
 * It only checks if an id exists and is visible
 */
function testVisibility(id) {
    if (document.getElementById(id) != null &&
            document.getElementById(id).style.display != 'none')
        return true;
    else
        return false;
}

/**
 * This function enables or disables displaying the hover txts 
 */
function displayHoverHelp() {

    hoverInstructions('helpIconHover', '2');//Hides the text of the helpIcon
    hoverDisabled = !hoverDisabled;
    if (hoverDisabled) {
        $("#helpHoverImg").attr("src","./common/images/Help/Help1Disabled.png");
    } else {
        $("#helpHoverImg").attr("src","./common/images/Help/Help1.png");
    }
}
