goog.provide('owgis.cql');

/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var firstCallToFilter = true;
var defaultCQLfilter = "";

/**
 * This functions hides and shows the text box to input a custom CQL filter
 */
owgis.cql.toggleCustomFilterTextBox = function (){
		$('#ocqlFilterInputTextParent').toggle();
}

/**
 * When the user hits enter on the cqlfilter text box, the filter
 * gets applied into the base layer.
 */
owgis.cql.applyFilterOnEnter = function(){
	if(event.keyCode === 13){
		newcql_filter = owgis.cql.applyCqlFilter();
		owgis.kml.updateKmlLink('','',newcql_filter);
	}
	return false;
}

/**
 * Applies the cql filter into the base layer.
* @return String currFilter Returns the current filter been applied into the base layer
 */
owgis.cql.applyCqlFilter = function(){

	//Obtain OL main layer
	currMainLayer = owgis.layers.getMainLayer();
    layerParams= owgis.layers.getMainLayer().getSource().getParams();

	// It initializes the defaultCQLfilter variable (only the firt time
	// the user applies a filter)
	if(firstCallToFilter){
		firstCallToFilter = false;
        //If there is not a default CQL filter, we force it to be true. 
        //It is not working if we leave it as an empty string.
		defaultCQLfilter = layerParams.CQL_FILTER === undefined? "1>0" : layerParams.CQL_FILTER;//Read current parameter
	}

	currFilter = $('#idOcqlFilterInputText').val();
	
	$('#ocqlErrorParent').css('display','none');

	//In case of empty text box or not defined (layers with CQL_FILTER
	// but without custom filter option.
	if(currFilter == "" ||currFilter == undefined ){
        owgis.layers.updateMainLayerParam("CQL_FILTER",defaultCQLfilter); 
	}else{

		if(defaultCQLfilter == "" || defaultCQLfilter == undefined){
            owgis.layers.updateMainLayerParam("CQL_FILTER",currFilter); 
		} else{
            owgis.layers.updateMainLayerParam("CQL_FILTER",defaultCQLfilter +" AND "+ currFilter);
		}
	}

	//Returns the actual filter been used
	return layerParams.CQL_FILTER;//Read current parameter
}
