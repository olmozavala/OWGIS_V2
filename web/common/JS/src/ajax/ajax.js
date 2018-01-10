/**
 * This function makes the AJAX request to our NetCDF animation servlet
 * and sends the start and end date as get parameters.
 * req can be: "dispAnimation" or "getAnimTimes"
 * dispAnimaton: Makes the request for displaying the animation
 * getAnimTimes: Gets and sets the options for the animation
 *
 * */

goog.provide('owgis.ajax');

goog.require('owgis.ogc');
goog.require('owgis.constants');
goog.require('owgis.calendars');

/**
 * This function is used to call a url without the crossorigin problems.
 * Internally is using the SimpleAjaxRedirectServlet to make the call
 * @param {type} url String containing the desired url
 * @param {type} callback Function to call after the call is made
 * @returns {undefined}
 */
owgis.ajax.crossorigin = function(url, callback){

    var hostUrl = window.location.href;
    lastSlash = hostUrl.lastIndexOf("/");
    hostUrl = hostUrl.substr(0,lastSlash);

    hostUrl += '/simpleAjaxRedirect?url='+encodeURIComponent(url);

	$.ajax({ 
		url: hostUrl
		}).done(callback);
};

/**
 *This function creates an asynchronous object to request for the animation
 *it basically constructs a url to request the server. 
 *@param {js_var} startDate - calendar start date
 *@param {js_var} endDate - end date of calendar
 *@param {js_var} layerName - the layername of the animation
 *@param {js_var} req - (request)displayanimation or getanimation times
 *@param {js_var} cal - (request) The calendar to update (start or end)
 */
function dispAnimationAjax(startDate, endDate, layerName, req, cal ) {
	var asynchronous5 = new Asynchronous();

	var currUrl = window.location.href;//get server location
	lastSlash = currUrl.lastIndexOf("/");
	currUrl = currUrl.substr(0, lastSlash);

	var url3 = currUrl + '/ncAnimation';

	url3 += '?layerName=' + layerName;
	url3 += '&request=' + req;

	switch (req) {
        case "getAnimTimes":
            url3 += '&startDate=' + startDate;
            url3 += '&endDate=' + endDate;
            asynchronous5.complete = asyncFillAnimationSelect;
            asynchronous5.call(url3);
        case "getTimeSteps":
            url3 += '&day=' + startDate;
			switch (cal) {
				case owgis.constants.startcal:
					asynchronous5.complete = asyncFillTimeStepsStart;
					break;
				case owgis.constants.endcal:
					asynchronous5.complete = asyncFillTimeStepsEnd;
					break;
			}
			asynchronous5.call(url3);
    }

    finishedLoading = false;
}

/*
 * Receives the number of time steps for the start date of the calendar
 * @param {type} responseText
 * @returns {undefined}
 */
function asyncFillTimeStepsStart(responseText){
	owgis.ncwms.calendars.updatehours(jQuery.parseJSON( responseText ), owgis.constants.startcal) ;
}

/*
 * Receives the number of time steps for the end date of the calendar
 * @param {type} responseText
 * @returns {undefined}
 */
function asyncFillTimeStepsEnd(responseText){
	owgis.ncwms.calendars.updatehours(jQuery.parseJSON( responseText ), owgis.constants.endcal) ;
}


/**
 *This function generates the properties needed to request the data of the base layer the user is 
 *currently viewing. It is used by the DownloadData.jsp to be able to download the Geotiff file
 *
 */
function downloadData() {

	var mainLayerServer = owgis.layers.getMainLayerServer();

	var requestParams = { 
		SERVICE: "WMS",
		VERSION: owgis.ogc.wfsversion,
		REQUEST: "GetMap"
		};

	switch(layerDetails.layerType){
		case "vector":
			requestParams.OUTPUTFORMAT = "SHAPE-ZIP";
			requestParams.SERVICE = "WFS";
//			requestParams.VERSION = owgis.ogc.wfsversion;
			requestParams.REQUEST = "GetFeature";
			requestParams.TYPENAME = layerDetails.name;
			requestParams.CRS= layerDetails.srs;

			var cqlfilter = owgis.layers.getCQLFilter();
			if (cqlfilter !== undefined) {
				requestParams.CQL_FILTER = applyCqlFilter();
			}
			break;
		case "raster":
			requestParams.FORMAT = "image/geotiff";
			requestParams.LAYERS = layerDetails.name;
			requestParams.STYLES = '';
			requestParams.SRS= layerDetails.srs;
			requestParams.WIDTH = $(window).width();
			requestParams.HEIGHT = $(window).height();
			requestParams.BBOX= layerDetails.bbox;
			break;
		case "ncwms"://No possible right now
			if (layerDetails.zaxis !== undefined) {
				animParams.elevation =  layerDetails.zaxis.values[owgis.ncwms.zaxis.globcounter];
			}
			break;
	}
	var url = mainLayerServer +"?"+owgis.utils.paramsToUrl(requestParams);
	console.log(url);
	window.open(url,'_self');
}

/**
 *This is the constructor function of the ajax asynchronous call
 */
function Asynchronous( ) {
    this._xmlhttp = new FactoryXMLHttpRequest();
}

/**
 *this functions sends the request to the server and also returns the different states the current call is in
 *like sending, loading, completed, etc. 
 *@param url - final url of to request animation, etc. 
 */
function Asynchronous_call(url) {
    var instance = this;
    this._xmlhttp.open('GET', url, true);
    this._xmlhttp.onreadystatechange = function() {
        switch (instance._xmlhttp.readyState) {
            case 1:
                instance.loading();

                break;
            case 2:
                instance.loaded();

                break;
            case 3:
                instance.interactive();

                break;
            case 4:
                instance.complete(instance._xmlhttp.responseText);
                break;
        }
    }
    this._xmlhttp.send(null);

}

function Asynchronous_loading() {
}//(No seria necesario modificar)
function Asynchronous_loaded() {
}//(No seria necesario modificar)
function Asynchronous_interactive() {
}//(No seria necesario modificar)
function Asynchronous_complete(responseText) {
}

//Here each asynchronous class gets its property value
//read ajax documentation to understand these calls. 
Asynchronous.prototype.loading = Asynchronous_loading;
Asynchronous.prototype.loaded = Asynchronous_loaded;
Asynchronous.prototype.interactive = Asynchronous_interactive;
Asynchronous.prototype.complete = Asynchronous_complete;
Asynchronous.prototype.call = Asynchronous_call;

/**
 * This function is the one that gets called when the user
 * clicks on the map to get data, the information displayed is on the div of the 
 * file Datos.jsp
 *@param responseText - parameter passed in by the OpenLayersManager.java
 */
function AsyncPunctualData(responseText) {
    responseText = responseText.replace("ADD_UNITS",layerDetails.units);
    currPopupText += responseText;
    $("#popup-content").html(currPopupText);
    $("#popup").show();
    //owgis.interf.loadingatmouse(false);//Stop showing the loading icon
    if(!mobile){document.getElementById('map').style.cursor = 'crosshair';}
}

/**
 * This function receives the new KML link for google earth and updates the link
 * @param responseText - link with downloadadble data, depending on what user is viewing. 
 */
function updateKmzLink(responseText) {

    $('#kmlLink').attr("href", responseText);
}

/**
 *This function receives the animation options from the ncWMS server
 *and puts them on the select below the calendars. 
 *@param responseText - basically it contains all the date ranges of the calendar
 */
function asyncFillAnimationSelect(responseText) {

    var animOpts = jQuery.parseJSON(responseText);

    $('#timeSelect').find('option').remove().end();

	//Get the total number of frames in "Full" 
	
    for (var key in animOpts.timeStrings) {
        var title = animOpts.timeStrings[key].title;
        var fullStr = animOpts.timeStrings[key].timeString;

		var tempNum= title.match(/[0-9]+/);//Obtain only the number of frames
		var totNum = parseInt(tempNum);//Parse them as int

		// We need to initialize the days for the 'full' case
		if( key === "0"){ 
			// If we have more than one day, then we copy the days from the 'daily' option
			if( animOpts.timeStrings.length > 1){
				fullStr = animOpts.timeStrings[1].timeString;//Force daily options
			}else{//If not, it means we are only looking at one day
				var tempStr = animOpts.timeStrings[0].timeString;//Force daily options
				fullStr = tempStr.substring(0,tempStr.lastIndexOf("/"));
			}
			$('#timeSelect').append( $('<option>', {'totFrames': totNum, 
				'forTimeSeries' : animOpts.timeStrings[0].timeString,
				'timeString' : fullStr, 'key' : key} ).text(title));// Add option into dates range select
		}else{
			$('#timeSelect').append( $('<option>', {'totFrames': totNum, 
				'timeString' : fullStr, 'key' : key} ).text(title));// Add option into dates range select
		}
    }
}


/**Function used to download the main layer data. 
 *@param responseText - url of dowload data
 */
function AsyncCompleteEventWCS(responseText) {
	
    window.location = responseText;
}

/**
 * This function is a default ajax function that handles the XMLHttpRequest. This objects are in charge of doing the magic behind ajax. 
 * 
 */
function FactoryXMLHttpRequest() {
    if (window.XMLHttpRequest) {
        return new XMLHttpRequest();
    }
    else if (window.ActiveXObject) {
        var msxmls = new Array(
                'Msxml2.XMLHTTP.5.0',
		'Msxml2.XMLHTTP.4.0',
		'Msxml2.XMLHTTP.3.0',
		'Msxml2.XMLHTTP',
		'Microsoft.XMLHTTP');
        for (var i = 0; i < msxmls.length; i++) {
            try {
                return new ActiveXObject(msxmls[i]);
            } catch (e) {
            }
        }
    }
    throw new Error("Could not instantiate XMLHttpRequest");
}
