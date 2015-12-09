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

/** This function obtain the proper values
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
            var units = layerDetails.zaxis.units;
            currElevationTxt = " " + getZaxisText() + " " + currElevation + ' ' + units;
        }

		var dateText =  owgis.ncwms.calendars.getCurrentDate(true, owgis.constants.startcal, true);
		
        owgis.kml.updateKmlLink(dateText, currElevation, '');
		var dateForTitle = dateText.substring(0,dateText.indexOf("T"))
		+" "+ dateText.substring(dateText.indexOf("T")+1,dateText.indexOf("."));
        updateTitle(dateForTitle, currElevationTxt);
    }
}