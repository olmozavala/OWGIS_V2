/**
 * This function makes the AJAX request to our NetCDF animation servlet
 * and sends the start and end date as get parameters.
 * req can be: "dispAnimation" or "getAnimTimes"
 * dispAnimaton: Makes the request for displaying the animation
 * getAnimTimes: Gets and sets the options for the animation
 */


/**
 *this is the variable assigned the function that changes the loading percentage
 the reason it is global is becuase whenever the animation is loaded we have to cancel the timeout functions that 
 havent finished executing. Also the stop animation button needs to cancel this variables. 
 */
for (var i = 0; i <= 20; i++) {
	eval("var timeout" + i + ";");
}

/**
 *This function creates an asynchronous object to request for the animation
 *it basically constructs a url to request the server. 
 *@param {js_var} startDate - calendar start date
 *@param {js_var} endDate - end date of calendar
 *@param {js_var} layerName - the layername of the animation
 *@param {js_var} req - (request)displayanimation or getanimation times
 */
function dispAnimationAjax(startDate, endDate, layerName, req) {
	var asynchronous5 = new Asynchronous();
	var asynchronous6 = new Asynchronous();

	var currUrl = window.location.href;//get server location
	lastSlash = currUrl.lastIndexOf("/");
	currUrl = currUrl.substr(0, lastSlash);

	var url3 = currUrl + '/ncAnimation';

	url3 += '?layerName=' + layerName;
	url3 += '&request=' + req;

	switch (req) {
		//In this case it loads and displays the animation
		case "dispAnimation":
			// Makes the request to call NetCDFAannimationServlet
			// This request obtains the animation
			url3 += '&style=' + lay_style;
			url3 += '&palette=' + mappalette;
			selcIndx = $('timeSelect').selectedIndex;
			url3 += '&dates=' + $('#timeSelect :selected').val();
			url3 += '&colorscalerange=' + minPalVal + ',' + maxPalVal;
			url3 += '&videores=' + $('input[name=video_res]:radio:checked').val();
			if (layerDetails.zaxis != undefined) {

				url3 += '&elevation=' + layerDetails.zaxis.values[elev_glob_counter];
			}

			//check to see if it is the same call as previous so we don't load it again'
			//this variable is defined in animation.js
			if (previous_url == url3 && finishedLoading == true)
			{
				console.log("Loading same animation as before");
				//if its the same date as previous then load right away and not make the ajax call again. 
				if (stoppedAnimation == true && anim_loaded == false)
				{
					date_frame = document.getElementById('timeSelect').value;

					// CalculateTime(date_frame);	
					animation_layer.setVisible(true);

                    updateMenusDisplayVisibility('displaying');

                    owgis.layers.main.getLayer().setVisibility(true);
                    //map.setLayerZIndex(animation_layer, idx_main_layer + 1);
                    stoppedAnimation = false;
                    updateTitleAndKmlLink();//change title resolution
                }
            }
            else
            {
                asynchronous5.complete = animationLoaded; //fucntion called in the animation.js
                asynchronous5.call(url3);
            }

            //only copy the previous url if the requet is for display animation
            if (req == "dispAnimation")
            {
                previous_url = url3;
            }
            // This section is only used to update the kmz link (for google earth display)
            urlForKmz = url3;
            urlForKmz = urlForKmz.replace("dispAnimation", "generateKMZlink");
            asynchronous6.complete = updateKmzLink;
            asynchronous6.call(urlForKmz);
            // console.log('updatio kml');
            break;
            //In this case it only loads the animation times to fill
            //the dropdown menu (daily, weekly, etc)
        case "getAnimTimes":
            url3 += '&startDate=' + startDate;
            url3 += '&endDate=' + endDate;
            asynchronous5.complete = asyncFillAnimationSelect;
            asynchronous5.call(url3);

            break;
    }

    finishedLoading = false;
}

/**
 *This function generates the properties needed to request the data of the base layer the user is 
 *currently viewing. It is used by the DownloadData.jsp to be able to download the Geotiff file
 *@param {js_var} path - base path /DeepCProject
 *
 */
function getWCSV1Ajax(path) {
    var asynchronous3 = new Asynchronous();

    //Generamos el URL que se manda llamar de manera asincrona
    var url2 = path + '/WCSServlet?wcs=True&height=' + height +
        "&width=" + width +
        //"&bbox=" + map.getExtent().toBBOX() +
        "&zoom=" + map.getZoom().toString() +
        "&esWcs=True" + //Indicamos que es una solicitud de WCS
        "&mainLayer=" + mainLayer;

    if (owgis.layers.main.getLayer().params.CQL_FILTER != undefined) {
        url2 += "&cqlfilter=" + applyCqlFilter();
    }

    url2 += "&center=" + map.getCenter().toString();
    //Aqui se asigna la funcion de un parametro que es la encargada de hacer algo con la respuesta
    asynchronous3.complete = AsyncCompleteEventWCS;

    asynchronous3.call(url2);

    //alert(url2);
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

                if (url.search("request=dispAnimation") != -1)
                {
                    // console.log("entro en el complete instance calculate time");
                    date_frame = document.getElementById('timeSelect').value;
                    CalculateTime(date_frame);
                }

                break;
        }
    }
    this._xmlhttp.send(null);

}

/**
 *This function calculates the loading % time of the animation based on the date frame passed in
 *@param date_frame - used to calculate time. Weekly, monthly, etc. 
 *
 */
function CalculateTime(date_frame)
{
    var geo_var = document.getElementById('dropDownLevels1').value;
    var long_date = date_frame.search("/");//if it contains the slash then its long date
    var fraction = 0;//It is being used 
    var diff = 0; //difference of dates represented as a decimal fraction
    $('#l-animation').css("visibility", 'visible');
    //if the frame rate is either weekly, monthly (NOT DAILY OR FULL)
    if (long_date == -1)
    {
        var commas_array = date_frame.split(",");

        if (commas_array.length <= 20)
            diff = commas_array.length * 2.5;
        else
            diff = commas_array.length * 3.0;
    }
    else
    {
        var dates = date_frame.split("/");//dates[0] will contain starting date,dates[1] is ending date
        var start = new Date(dates[0]);
        var end = new Date(dates[1]);
        diff = (end - start) / 100000000;//make it into a decimal (around 5(one day aproximately) to ~300(like a year))
    }
    //default for salinity layer
    var geo_var_const = 1.3;//this constant changes depending on the vairables chosen:temp, salinity, etc..                            
    animation_res = $('input[name=video_res]:radio:checked').val();
    switch (animation_res) {
        case "high":
            geo_var_const = 1.3;
            break;
        case "normal":
            geo_var_const = 1.0;
            break;
        case "low":
            geo_var_const = .5;
            break;
        default:
            break;
    }

    if (geo_var == "SeaVel")
        geo_var_const = 3.0;//velocity          

    if (diff < 5)//one day
        fraction = 2.5 * geo_var_const;
    else if (diff < 10)//one week
        fraction = 3.5 * geo_var_const;
    else if (diff < 20)//two weeks
        fraction = 3.8 * geo_var_const;
    else if (diff < 40)//month
        fraction = 4.1 * geo_var_const;
    else if (diff < 80) //2 months - 3months
        fraction = 4.6 * geo_var_const;
    else if (diff < 150)//4 months - 5months
        fraction = 5.0 * geo_var_const;
    else if (diff < 225)//6months
        fraction = 5.4 * geo_var_const;
    else if (diff < 250)
        fraction = 5.9 * geo_var_const;
    else
        fraction = 6.3 * geo_var_const;

    //this functions run independently, like in a seperate process different from the main javascript process executing in the browser
    count = 0;
    anim_perc = document.getElementById('loadperc');
    for (var i = 10; i <= 90; i += 10) {
        eval("timeout" + count + "=setTimeout(function(){ anim_perc.innerHTML = " + i + "; }, fraction*diff*" + i + ");");
        count++;
    }
    for (var i = 91; i < 100; i += 1) {
        eval("timeout" + count + "=setTimeout(function(){ anim_perc.innerHTML = " + i + "; }, fraction*diff*" + i + ((count - 10) * 10) + ");");
        count++;
    }
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

    currPopupText += responseText;
    $("#popup-content").html(currPopupText);
    $("#popup").show();
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

    var animOpts = eval('(' + responseText + ')');

    $('#timeSelect').find('option').remove().end();
    //Obtain the values for Full and daily, if they are equal
    // then assign to daily the same string as full.
    // Trying to avoid the long URL. TODO we need to find a better
    // solution to the problem, it may involve modifying the ncWMS server. 
    totDaily = 0;
    totFull = 0;
    tempfullStr = '';
    fullStr = '';

    for (var key in animOpts.timeStrings) {
        title = animOpts.timeStrings[key].title;
        fullStr = animOpts.timeStrings[key].timeString;

        if (title.indexOf("Full") != -1) {//Verifies it is the 'Full' option
            tempfullStr = title.match(/[0-9]+/);//Obtain only the number of frames
            totFull = parseInt(tempfullStr);//Parse them as int
            break;
        }
    }

    for (var key in animOpts.timeStrings) {
        timeStr = animOpts.timeStrings[key].timeString;
        title = animOpts.timeStrings[key].title;


        optNew = document.createElement('option');
        optNew.text = title;
        optNew.value = timeStr;

        //By default we select Daily if exists
        if (title.indexOf("Daily") != -1) {
            optNew.selected = true;

            //Verify which string to use for daily
            dailyStr = title.match(/[0-9]+/);
            //If the size of daily and Full are the same, then use the Full one
            if (totFull == parseInt(dailyStr)) {
                optNew.value = fullStr;
            }
        }
        $('#timeSelect').append(optNew); // standards compliant; doesn't work in IE
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
