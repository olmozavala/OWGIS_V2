
<%@ taglib prefix="menuHelper" uri="/WEB-INF/TLD/htmlStaticFunctions.tld"%>
<!-- This sections generate the menu of optional layers, normally vector layers -->
<div class="row" onClick="owgis.optionalLayers.toggleList('#optionalLayersData')">
	<div class="col-xs-12 title noShadow text-center">
		<fmt:message key="main.optional" />
	</div>
	<div class="col-xs-3 text-right" >
		<!-- <a class="btn btn-default btn-xs " href="#" style="margin: 1px 5px 0px 0px"
			onclick="owgis.layouts.draggable.minimizeWindow('optionalsMinimize', 'optionalMenuParent')">
			<span class="glyphicon glyphicon-resize-small "></span>
		</a> -->
	</div>
</div>
<div class="row" id="optionalLayersData" >
	<div class="col-xs-12">
        ${menuHelper:createOptionalLayersMenu(vectorLayers,language, ".", mobile)}
	</div>
</div>
