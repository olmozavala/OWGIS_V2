<%-- 
    Document   : MainLayers
    Created on : Sep 18, 2014, 4:24:47 PM
    Author     : Olmo Zavala Romero
--%>
<%@ taglib prefix="menuHelper"
	uri="/WEB-INF/TLD/htmlStaticFunctions.tld"%>

<!-- These are the dropdowns for the base layer-->
<div class="transDraggableWindow toolTip  container-fluid" id="mainMenuParent" 
	 title="<fmt:message key='help.tooltip.mainlayers' />">
	 <div class="row ">
		<div  class="col-xs-9 text-center invShadow title"> 
			<fmt:message key='main.base' />
		</div>
		<div class="col-xs-3 text-center">
			<a class="btn btn-default btn-xs" href="#" 
			   onclick="owgis.layouts.draggable.minimizeWindow('mainMenuMinimize', 'mainMenuParent')">
				<i class="glyphicon glyphicon-resize-small"></i>
			</a>
		</div>
	</div>
	<div class="row">
		<div class="col-xs-12 ">
			${menuHelper:createMainMenu(MenuDelUsuario,language)}
		</div>
	</div>
	<c:if test='${cqlfilter}'>
		<div class="row">
			<div class="col-xs-12">
				<span id="ocqlMenuButtonParent">
					<button type="button" name="type" id="idOcqlMenuButton" class="buttonStyle" 
							onclick="owgis.cql.toggleCustomFilterTextBox();" ><fmt:message key="cql.custom" /></button>
				</span>
			</div>
		</div>
	</c:if>
</div>

