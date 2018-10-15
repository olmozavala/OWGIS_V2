// This JS file is used to modify the look of the site. All the modifications
// to the default template should be made at the function modifyInterface
// which is called insisde mapDisplay. 
goog.provide('owgis.interf');

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
 * @param {bool} loading Indicates if the loading shoudl be on or off
 * @returns {void}
 */
owgis.interf.loadingatmouse= function(loading){
	if(mobile){
		if(loading){
			$('#l-animation').show("fade");
		}else{
			$('#l-animation').hide("fade");
		}
	}else{
		if(loading){
			$("#map").removeClass("defaultCursor");
			$("#map").addClass("loadingCursor");
		}else{
			$("#map").removeClass("loadingCursor");
			$("#map").addClass("defaultCursor");
		}
	}
}

/**
 * This function shows a 'loading' that involves all the screen.  
 * @param {type} loading
 * @returns {undefined}
 */
owgis.interf.loadingallscreen = function(loading){
	if(mobile){
		if(loading){
			$(".loader").fadeIn("slow");
            $("#map").addClass("overload");
		}else{
			$(".loader").fadeOut("slow");
            $("#map").removeClass("overload");
		}
	}else{
		if(loading){
			$("#map").removeClass("defaultCursor");
			$("#map").addClass("loadingCursor");
		}else{
			$("#map").removeClass("loadingCursor");
			$("#map").addClass("defaultCursor");
		}
	}
}
/**
 * This function is used to show a 'loading' behaviour at the middle 
 * of the map. If it receives a % then it is also displayed.  
 * @param {bool} loading Indicates if the 'loading' should be displayed or not
 * @param {int} percentage Percentaje of loading displayed. 
 * @returns void
 */
owgis.interf.loadingatmap = function(loading,percentage,extraText){
	if(loading){
		if(percentage !== undefined){
			if(_.isEmpty(extraText)){
				$("#loadperc").html(percentage +"<small> %</small>");
			}else{
				$("#loadperc").html(extraText+" "+ percentage +"<small> %</small>");
			}
		}else{
			$("#loadperc").text("");
			$("#loadperc").addClass("loading")
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
    var currLayer = eval('layer'+1);
    var currSource = currLayer.getSource();
    
    if(!_.isUndefined(layerDetails.windrose) && currSource.getParams().LAYERS == "cen:rosasviento" ){
        
        var x = document.createElement("SELECT");
        x.setAttribute("id", "mySelect");
        x.setAttribute("class", "mainMenu");
            
        if(!mobile){
            document.getElementById("mainMenuParent").children[1].children[0].appendChild(x);
        } else {
            var div1 = document.createElement("div");
            var div2 = document.createElement("div");
            div1.setAttribute("class", "ui-select ui-mini");
            div2.setAttribute("id","dropDownLevels3-button");
            div2.setAttribute("class","ui-btn ui-icon-carat-d ui-btn-icon-right ui-corner-all ui-shadow");
            var spani = document.createElement("span");
            spani.setAttribute("class","mainMenu mainMenuOption");
            spani.innerHTML = "Anual/Mensual";
            
            div2.appendChild(spani);
            div2.appendChild(x);
            div1.appendChild(div2);
            
            document.getElementById("baseLayersData").appendChild(div1);
            /*
             * <div class="ui-select ui-mini">
             *  <div id="dropDownLevels1-button" class="ui-btn ui-icon-carat-d ui-btn-icon-right ui-corner-all ui-shadow">
             *      <span class="mainMenu mainMenuOption">Viento </span>
             *      <select class="mainMenu" id="dropDownLevels1" name="dropDownLevels" onchange="MapViewersubmitForm();" data-mini="true">
			<option class="mainMenuOption" value="Temp">Temperatura </option>
                                                        ...
		    </select>
                </div>
               </div>
             */
            
            
        }
        
        
        var shortNames = ["0","1", "2","3" , "4" , "5" , "6" , "7" , "8" , "9" , "10", "11" , "12"];
        
        for(var i=0; i < shortNames.length ; i++){
            var z = document.createElement("option");
            z.setAttribute("value", shortNames[i]);
            var t = document.createTextNode(getMonthName(shortNames[i]));
            z.appendChild(t);
            document.getElementById("mySelect").appendChild(z);
        }
        
    }
}

function getMonthName(shortName){
    var shortNames = ["0","1", "2","3" , "4" , "5" , "6" , "7" , "8" , "9" , "10", "11" , "12"];
    var longNames = (_curr_language == "ES") ? ["Anual","enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"] : ["Annual","January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];//console.log(url);
    for(var i=0; i<shortNames.length; i++){
      if(shortNames[i] === shortName){
        return longNames[i];
      }
    }
  }