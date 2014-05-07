var animation_layer; 
var anim_loaded = false;//Indicates if the animation has already been loaded
var stoppedAnimation = true;//Indicates if the request of the animation has been stopped (before arriving)
var previous_url; //compares the url requested for the animations. It is used in the ajax.js file
var finishedLoading = false; //this is used for when an animation is being made and the user changes the zoom, so it makes the loading text not disapear. 

var currentBBOX;

        
/**
 * Modifies the visibility of different html elements involved on 
 * the displaying of the animations.
 * @paramstatus - the status of the animation 
 * ['SelectingDates','loading', 'displaying', 'noanimation']
 */
function updateMenusDisplayVisibility(status){

    // ------- Visibility of top menus (general menus) -------
	if(netcdf){
		// When we are selecting dates. 
		switch( status ){
            case "loading":
                $('#CalendarParent').hide("fade");
                $('#s-animation').show("fade");
                $('#l-animation').show("fade");
                $('#minPal').disabled = true;
                $('#maxPal').disabled = true;
                $('#palettes-div').hide("fade");
                $('#hideCalendarButtonParent').hide("fade");
                displayingAnimation = true;//I believe it is used to control the async calls to obtain the animation
                break;
            case "displaying":
                $('#CalendarParent').hide("fade");
                $('#s-animation').show("fade");
                $('#l-animation').hide("fade");
                $('#minPal').disabled = true;
                $('#maxPal').disabled = true;
                $('#palettes-div').hide("fade");
                $('#elevationParent').hide("fade");
                $('#hideCalendarButtonParent').hide("fade");
                finishedLoading = true;
                killTimeouts();
                break;
            case "SelectingDates":
            default:
                $("#palettesMenuParent").show();
                $("#lineToggle").show();
                $("#downloadDataParent").hide();

                if(_mainlayer_zaxisCoord){
                    $('#elevationParent').show("fade");
                }else{
                    $('#elevationParent').hide();
                }
                if(_mainlayer_multipleDates){
                    $('#CalendarsAndStopContainer').show();
                    $('#CalendarParent').show("fade");
                    $('#s-animation').hide("fade");
                    $('#minPal').disabled = false;
                    $('#maxPal').disabled = false;
                    $('#hideCalendarButtonParent').show("fade");
                    $('#l-animation').hide("fade");
                }else{
                    $('#CalendarsAndStopContainer').hide();
                }
                break;
		}
    }else{
        //Menus when the layer is not a netcdf
        $("#palettesMenuParent").hide();
        $("#lineToggle").hide();
        $("#downloadDataParent").show();
        $("#elevationParent").hide();
        $('#CalendarsAndStopContainer').hide();
    }

}

/** this function clears all timeouts that are executed in ajax.js in CalculateTime() 
 */
function killTimeouts()
{
	for(var i = 0; i<=10; i++) {
		eval("clearTimeout(timeout"+i+")");//cancel the call to setimeout of lading percentage
	}
}


/**
 * This function hides the 'stop animation' option and shows the
 * calendar and 'display animation' option
 */ 
function stopAnimation(){

	killTimeouts();//destroy all the timers that update the loading % ...
	updateMenusDisplayVisibility("SelectingDates");

	owgis.layers.getMainLayer().setVisibility(true);
	if(animation_layer != undefined)//If animation has been called. 
	{             
		animation_layer.setVisibility(false);
        
		animation_layer.events.un({
			loadend: Loaded
		});
	}
    
  
        
	//change the global for stop so that we know it has been called.
	stoppedAnimation = true;  
	anim_loaded = false;
    
    
   
	updateTitleAndKmlLink();
    
}

/**
 *This function is executed as soon as an event concerning the animation layer changes
 *for example if the animation is ready to be displayed or the user zooms the map when the animation is playing. 
 * it is called by animationLoaded(), or when the user puts full screen. 
 */
function Loaded() {
      
    updateTitleAndKmlLink();//change title resolution
	//check if the boundry box is still the same, should only enter this if the animation arrived. 
	if(currentBBOX == map.getExtent().toBBOX()){ 
           
		//console.log("enters when map arrives");
		updateMenusDisplayVisibility('displaying');
		   
		owgis.layers.getMainLayer().setVisibility(true);
		map.setLayerZIndex(animation_layer,parseInt(idx_main_layer)+1);

		anim_loaded = true;
		finishedLoading = true;
      
               
	}else{//this means the function was called becuase a change in zoom of the map while animation was loading or user put screen to full screen. 
		//console.log("else del current box ");
		if(finishedLoading == false)
		{
			// console.log("entro en el if raro del unevent");
			animation_layer.events.un({
				loadend: Loaded
			});
                
			animationLoaded(animation_layer.getURL());
		}
	}
}


/**
 * This function gets the selected dates from the user and starts
 * the ajax request to generate the animation of the NetCDF files.
 */
function dispAnimation(){
        
    var loadperc = $('#loadperc');

    if(loadperc != null)
        loadperc.innerHTML = 0;   

    var startSel = calStart.selection.get();
    var endSel = calEnd.selection.get();

    if( (startSel != undefined)&&(endSel != undefined)){

        startDate = Calendar.intToDate(startSel);
        endDate = Calendar.intToDate(calEnd.selection.get());

        startDate = Calendar.printDate(startDate, '%Y-%m-%dT00:00:00.000Z');
        endDate = Calendar.printDate(endDate, '%Y-%m-%dT00:00:00.000Z');

        //While the animation is loading we don't show the  calendars
        updateMenusDisplayVisibility("loading");

        dispAnimationAjax(startDate, endDate, mainLayer,"dispAnimation");
    }else{
        alert('Select dates for the animation from the calendars. ');
    }

    //make global for stop button true
    stoppedAnimation = false;
}

/**
 * This function gets called when the gif animation is received from the 
 * map server. 
 * @paramresponseText - url with animation gif. 
 */
function animationLoaded(responseText){
    if(animation_layer != undefined){//If its not the first time we add an animation
        map.removeLayer(animation_layer);
    }

    //Used to keep track of when the animation has already
    // been loaded.
    anim_loaded = true;

    bbox =[layerDetails.bbox[0],layerDetails.bbox[1],
         layerDetails.bbox[2],layerDetails.bbox[3] ];

    //TODO verify width and height
    anim_width = 512;
    anim_height = 512;

    /*
    animation_layer = new ol.layer.Image({
            source: new ol.source.ImageWMS({
                      url: responseText,
                      //params: {'LAYERS': 'topp:states'},
                      extent: bbox })
                      });*/

    /*
    animation_layer = new ol.layer.Image({
            source: new ol.source.ImageWMS({
                      url: 'http://viewer.coaps.fsu.edu/ncWMS/wms',
                      params: { layers: 'hycom2013/temperature', 
                      //url: 'http://viewer.coaps.fsu.edu/geoserver/wms',
                      //params: { layers: 'comm:states', 
                                styles: 'boxfill/rainbow',
                                //width: 256,
                                //height: 256,
                                elevation: 0,
                                time:'2013-02-24/2013-03-26',
                                colorscalerange:'10.0,34.0',
                                },
                      extent: [-98.0,18.09164810180664,-76.400024,31.960647583007812]})
                      //extent: [-179.1473399999999,-14.378799999999956, 179.77848000000003,71.38961197300004 ]})
                        //extent: ol3view.calculateExtent(map.getSize())})
                      });

    layerParams= animation_layer.getSource().getParams();
    layerParams.FORMAT='image/gif';//Modify the time parameter
    animation_layer.getSource().updateParams(layerParams);//Updates the layer
    /* // Old version
        new OpenLayers.Layer.Image(
            "ncWMS", // Name for the layer
            responseText,
            layerBounds,
            new OpenLayers.Size(anim_width, anim_height), // Size of image
            { // Other options
                isBaseLayer : false,
                    maxResolution: map.baseLayer.maxResolution,
                    minResolution: map.baseLayer.minResolution,
                    resolutions: map.baseLayer.resolutions
            }
            );*/
    
    staticSource = new ol.source.ImageStatic({
                              imageSize: [256,256],
                              extent: ol3view.calculateExtent(map.getSize()),
                              imageExtent: [-98.0,18.09164810180664,-76.400024,31.960647583007812],
                              projection: 'EPSG:4326',
                              url: responseText
                        });
   animation_layer = new ol.layer.Image({
                        source:staticSource  });


    map.addLayer(animation_layer);

    //currentBBOX = map.getExtent().toBBOX();//Stores the current boundry box. 

    //This is the function that gets called when
    // the animation is finally loaded.
    /*
    animation_layer.events.on({
        loadend: Loaded
    });*/
    updateMenusDisplayVisibility('displaying');
}
