goog.provide('owgis.ncwms.ncwmstwo');
// This class contains a couple of tools used when we display streamlines
// from ncWMS TWO layers

/**
 * This class 
 * @param {type} data is the JSON file returned by ncWMS 2 
 * @returns {buildGridInfo.gridInfo} Is an object that contains the summary of the data
 */
owgis.ncwms.ncwmstwo.buildGridInfo = function buildGridInfo(data, layer){
	var gridInfo = {};
	
    var ext = layer.get("extbbox");
    var fext = [data.domain.axes.x.start, data.domain.axes.y.start, data.domain.axes.x.stop, data.domain.axes.y.stop];
    fext = fext.map(function(x){return ol.proj.transform([x, null], PROJ_4326, _map_projection)[0]});
    var fac = map.getView().getZoom() >= 3 ? 0.45 : 0.1 * map.getView().getZoom();//loss of accuracy with min zoom
    var err = Array.from(ext.keys()).map(function(i){ return (ext[i] - fext[i]) * fac});
    fext = Array.from(err.keys()).map(function(i){ return fext[i] + err[i]});
    
    
    // Set min and max latitudes
	gridInfo.la1 = fext[1]; 
	gridInfo.la2 = fext[3];
	

	// Set min and max longitudes
	gridInfo.lo1 = fext[0];
	gridInfo.lo2 = fext[2]; 

	// Set number of cells in the grid
	gridInfo.ny = data.domain.axes.y.num;
	gridInfo.nx = data.domain.axes.x.num;
	
	// Set the delta x and delta y of the cells
	gridInfo.dy = (gridInfo.la2 - gridInfo.la1)/gridInfo.ny;
	gridInfo.dx = (gridInfo.lo2 - gridInfo.lo1)/gridInfo.nx;

	return gridInfo;
}

/**
 * Builds the grid containing U and V 
 * @param {type} gridInfo
 * @param {type} uData
 * @param {type} vData
 * @returns {Array}
 */
owgis.ncwms.ncwmstwo.buildGrid = function buildGrid(gridInfo, uData, vData){

	var grid = new Array();
	for (j = 0, p = 0; j < gridInfo.ny; j++) {
		var row = [];
		for (i = 0; i < gridInfo.nx; i++, p++) {
			row[i] = [uData[p], vData[p]];
		}
		grid[gridInfo.ny-1-j] = row;
    }
	
	return grid;
}