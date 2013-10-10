/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var firstCallToFilter = true;
var defaultCQLfilter = "";

/**
 * This functions hides and shows the text box to input a custom CQL filter
 */
function toggleCustomFilterTextBox(){
		$('#ocqlFilterInputTextParent').css("display","block");
}

function closeCustomFilterTextBox(){
    
    $('#ocqlFilterInputTextParent').css("display","none");

}




/**
 * When the user hits enter on the cqlfilter text box, the filter
 * gets applied into the base layer.
 */
function applyFilterOnEnter(){
	if(event.keyCode == 13){
		newcql_filter = applyCqlFilter();
		updateKmlLink('','',newcql_filter);
	}
	return false;
}

/**
 * Applies the cql filter into the base layer.
* @return String currFilter Returns the current filter been applied into the base layer
 */
function applyCqlFilter(){

	//Obtain OL main layer
	currMainLayer = getMainLayer();

	// It initializes the defaultCQLfilter variable (only the firt time
	// the user applies a filter)
	if(firstCallToFilter){
		firstCallToFilter = false;
		defaultCQLfilter = currMainLayer.params.CQL_FILTER;
	}

	currFilter = $('#idOcqlFilterInputText').val();
	
	$('#ocqlErrorParent').css('display','none');

	//In case of empty text box or not defined (layers with CQL_FILTER
	// but without custom filter option.
	if(currFilter == "" ||currFilter == undefined ){
		currMainLayer.params.CQL_FILTER = defaultCQLfilter; 
	}else{

		if(defaultCQLfilter == "" || defaultCQLfilter == undefined){
			currMainLayer.params.CQL_FILTER = currFilter;
		} else{
			currMainLayer.params.CQL_FILTER = defaultCQLfilter +" AND "+ currFilter;
		}
	}

	currMainLayer.redraw();

	//Returns the actual filter been used
	return currMainLayer.params.CQL_FILTER;
}
