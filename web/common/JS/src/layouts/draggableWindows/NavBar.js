goog.provide('owgis.layouts.draggable.topmenu');

owgis.layouts.draggable.topmenu.toogleUse = function(element){
	$(element).toggleClass("beenUsed");
}
owgis.layouts.draggable.topmenu.isUsed = function(element){
	$(element).addClass("beenUsed");
}
owgis.layouts.draggable.topmenu.isNotUsed= function(element){
	$(element).removeClass("beenUsed");
}