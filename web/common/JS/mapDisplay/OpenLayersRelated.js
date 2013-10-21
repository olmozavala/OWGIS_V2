//these variables are used to set the popup sizes for when the user clicks the map
//the reason it is global is becuase in ajax.js a function uses it to reduce the size
//of the map depending on the resulting output. 
var popUpwidth = 250; 
var popUpheight = 300;


/** Hides or shows one layer of openLayers */
function showLayer(layer, show){
    layer.setVisible(show);
}

/** This function process the user's drawing and contacts the ncWMS server and the godiva program to
* produce graphs depending on the variables selected and the dates. It is used by transect.jsp
* @params line - the line the user drew
*/
function handleDrawing(line)
{   
    map.addLayer(dlayer);//add drawing layer so it stays in map
       
    var lat_lon = line.substring(11, line.length - 1);//extarct the lon_lat values of the drawing
    var time = null;
    
    try{
        time = calStart.selection.get();//get the selected time in the start calendar
        time = Calendar.intToDate(time);    
        time = Calendar.printDate(time, '%Y-%m-%d');    
    }
    catch(err)
    {
        time = layerDetails['nearestTimeIso'];
        
    }        
    
    var CRS = map.options['projection']; //get current map projection
    
    var url = getMainLayer().url; //get server
    url = url + '?REQUEST=GetTransect&LAYER=';
    
    url = url + mainLayer + "&CRS=" + CRS + "&TIME=" + time;
    url = url +"&LINESTRING=" + lat_lon + "&FORMAT=image/png&COLORSCALERANGE=auto";
    url = url + "&NUMCOLORBANDS=254&LOGSCALE=false&PALETTE=" + mappalette;

    popUp(url,400,600);
          
}

/**this functions opens up the url passed in
 *@params url - url passed in
 *@params width - width size of popup screen in pixels
 *@params height - height size of popup screen in pixels
 **/
function popUp(url, width, height)
{
    var day = new Date();
    var id = day.getTime();
    
    //pass in the url to open, the rest of the parameters are just options on the new window that will open.
    window.open(url, id, 'toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=1,width='
        + width + ',height=' + height + ',left = 300,top = 300');
}

/**
 *This is the function called when the transect tool button is selected, 
 *once selected it calls this function and lets the map know that this control 
 *is now activated. 
*/
function toggleControl() 
{
    
    var control = drawControls['line'];
 	
    
    if(!transectOn){
    
        control.activate();
        document.getElementById('lineToggle').innerHTML = unselectTransect.toString();
    } else {
        document.getElementById('lineToggle').innerHTML= transect.toString();
        dlayer.destroy();
       
        control.deactivate();
    }
    transectOn = !transectOn;        
}

/**
 *This is the function called when the transect tool button is selected, 
 *once selected it calls this function and lets the map know that this control 
 *is now activated. 
*/
function toggleControlMobile() 
{   
    var control = drawControls['line'];
    
    if(!transectOn){
    
        control.activate();
        document.getElementById('lineToggle').innerHTML = 'Unselect Tool';
        $("#mobileLevel3").css("z-index","0");
    } else {
        document.getElementById('lineToggle').innerHTML= 'Transect Tool';
        dlayer.destroy();
      
        control.deactivate();
            $("#mobileLevel3").css("z-index","1002");
    }
    transectOn = !transectOn;        
}


/**
 * This function replaces one parameter of the main layer and refresh the map
 */
function updateMainLayerParam(param,value){
    layerParams= getMainLayer().getSource().getParams();
    //eval('layerParams.'+param+'=\''+value+'\'');//Modify the time parameter
    eval("layerParams."+param+"=\""+value+"\"");//Modify the time parameter
    getMainLayer().getSource().updateParams(layerParams);//Updates the layer
}

/**
 * Hides the current popup, if any
 */
function closePopUp(){
    $('#popup').fadeOut();
}
