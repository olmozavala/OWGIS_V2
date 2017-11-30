
goog.provide('owgis.ol3.popup');

/**
 * Hides the current popup, if any
 */
owgis.ol3.popup.closePopUp = function (){
	console.log("Closing popup punctual data");
    $('#popup').fadeOut();
    
    if(mobile){
                document.getElementById("containerChartsTS").innerHTML = "";
                document.getElementById("containerChartsVP").innerHTML = "";
                document.getElementById("containerChartsTS").style.display = 'none';
                document.getElementById("containerChartsVP").style.display = 'none';
                document.getElementById("popup").style.width = "200px";
        }
}
