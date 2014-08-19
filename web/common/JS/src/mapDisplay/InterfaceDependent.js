// This JS file is used to modify the look of the site. All the modifications
// to the default template should be made at the function modifyInterface
// which is called insisde mapDisplay. 
goog.provide('owgis.interface');

var colorLink;
var colorLinkOver;
var colorLinkClick;
var colorLinkDisabled;

if(mapConfig['menuDesign']==='sideMenu'){
	colorLink = "#0D3D52"; // When the mouse is not over and is not being clicked
	colorLinkOver = "#467387"; // When the mouse is over
	colorLinkClick = "#72919E";	// When the button is being clicked
	colorLinkDisabled = "darkgray";	// When the button is disabled
}else{
	colorLink = "#CDF1FA"; // When the mouse is not over and is not being clicked
	colorLinkOver = "#91B6FF"; // When the mouse is over
	colorLinkClick = "#1B2DFF";	// When the button is being clicked
	colorLinkDisabled = "gray";	// When the button is disabled
}

/**
 * Defines how are we displaying a 'loading' behaviour at the mouse 
 * @param {type} loading
 * @returns {undefined}
 */
owgis.interface.loadingatmouse= function(loading){
	if(loading){
		$("#map").removeClass("defaultCursor");
		$("#map").addClass("loadingCursor");
	}else{
		$("#map").removeClass("loadingCursor");
		$("#map").addClass("defaultCursor");
	}
}

owgis.interface.loadingatmap = function(loading,percentage){
	if(loading){
		if(percentage !== undefined){
			$("#loadperc").html(percentage +"<small> %</small>");
		}
		$('#l-animation').show("fade");
	}else{
		$('#l-animation').hide("fade");
	}
}

/**
 * This is the main function that should encompass all the specific code for the site,
 * for example all the modifications to the interface depending on some layers 
 * @returns {undefined}
 */
function modifyInterface(){
}
