goog.provide('owgis.kml');

goog.require('owgis.utils');
goog.require('owgis.ncwms.animation');
goog.require('owgis.ncwms.zaxis');
/**
 * Updates the time, elevation and CQL filter of the kml link
 * @param newDate - updated date
 * @param newElev - updated elevation
 * @param {type} cql_filter Updated CQL filter
 */
owgis.kml.updateKmlLink = function(newDate, newElev, cql_filter) {
    if (newDate !== '')
        owgis.utils.replaceGetParamInLink("#kmlLink", "TIME", newDate);
	
    if (newElev !== '')
        owgis.utils.replaceGetParamInLink("#kmlLink", "ELEVATION", newElev);
	
    if (cql_filter !== '')
        owgis.utils.replaceGetParamInLink("#kmlLink", "CQL_FILTER", cql_filter);
	
}

/** Displays an alert when oppening an animation in GoogleEarth.
 * The reason is that it takes some time to generate the file
 */
owgis.kml.KMZDownAlert = function() {
    if (netcdf && (owgis.ncwms.animation.status.current === owgis.ncwms.animation.status.playing))
        alert("Your download will beggin shortly.");
}

/** This function obtains the proper values
 * for the current date and the zaxis value (depth) 
 * and send them to updateTitle() and owgis.kml.updateKmlLink()
 */
owgis.kml.updateTitleAndKmlLink = function() {
    if (netcdf) {
        var dateText = '';
		
        var currElevation = '';
        var currElevationTxt = '';
		
        //Building elevation text.
        if (layerDetails.zaxis !== undefined)
        {
            currElevation = layerDetails.zaxis.values[owgis.ncwms.zaxis.globcounter];
            var units = (_curr_language == "ES") ? "metros" : layerDetails.zaxis.units;
            currElevationTxt = " " + getZaxisText() + " " + currElevation + ' ' + units;
        }

        var dateText =  owgis.ncwms.calendars.getCurrentDate(true, owgis.constants.startcal, true);
	var curr_date =  owgis.ncwms.calendars.getCurrentDate(false, owgis.constants.startcal, true);
		
        owgis.kml.updateKmlLink(dateText, currElevation, '');

        var meses = (_curr_language == "ES") ? ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"] : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        var dateForTitle = "";
	if(!_.isUndefined(dateText)){
            if(!_.isUndefined(layerDetails.subtitleText)){
                if(layerDetails.subtitleText == "daily"){
                    dateForTitle = curr_date.getUTCDate() +" "+ meses[curr_date.getUTCMonth()];
                }else if(layerDetails.subtitleText == "monthly"){
                    if( layerDetails.name.includes("umbrales") || layerDetails.name.includes("anomalias") ){
                        dateForTitle = meses[curr_date.getUTCMonth()]+" "+curr_date.getUTCFullYear();
                    } else {
                        dateForTitle = meses[curr_date.getUTCMonth()];
                    }
                } else if(layerDetails.subtitleText == "hourxmonth"){
                    dateForTitle = curr_date.getUTCHours() +":00 (GMT) "+ meses[curr_date.getUTCMonth()];
                } else{
                    dateForTitle = curr_date.getUTCHours() +":00 (GMT), "+ curr_date.getUTCDate() +" "+ meses[curr_date.getUTCMonth()];
                }
            } else {
		dateForTitle = ""; /*dateText.substring(0,dateText.indexOf("T"))
		+" "+ dateText.substring(dateText.indexOf("T")+1,dateText.indexOf("."));*/
            }
	}
        //console.log(dateText,curr_date,dateForTitle,currElevationTxt),
        updateTitle(dateForTitle, currElevationTxt);
    }
}