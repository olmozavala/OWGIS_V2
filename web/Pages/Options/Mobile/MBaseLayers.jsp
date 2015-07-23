	
<%@page errorPage="Error/ErrorPage.jsp"%>
<%@ taglib prefix="menuHelper" uri="/WEB-INF/TLD/htmlStaticFunctions.tld"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<!-- This sections generate the menu of optional layers, normally vector layers -->
<div class="row " onClick="owgis.optionalLayers.toogleList('#baseLayersData')">
	<div class="col-xs-9 text-center noShadow title">
		<fmt:message key="main.base" />
	</div>
	<div class="col-xs-3 text-right">
		<a class="btn btn-default btn-xs" href="#"
		   onclick="owgis.layouts.draggable.minimizeWindow('mainMenuMinimize', 'mainMenuParent')">
			<i class="glyphicon glyphicon-resize-small"></i>
		</a>
	</div>
</div>
<div class="row" id="baseLayersData">
	<div class="col-xs-12 " style="margin-left: 4px;">
		${menuHelper:createMainMenu(MenuDelUsuario,language)}</div>
</div>
