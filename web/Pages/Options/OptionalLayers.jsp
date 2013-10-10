<%-- 
Document   : OptionalLayers
Created on : Aug 3, 2012, 6:38:05 PM
Author     : olmozavala
--%>

<%@ taglib prefix="menuHelper" uri="/WEB-INF/TLD/htmlStaticFunctions.tld" %>
<!-- This sections generate the menu of optional layers, normally vector layers -->
<div class="row">
    <div class="col-xs-9 title noShadow text-center">
        <fmt:message key="main.optional" />

    </div>
    <div class="col-xs-3 text-right">
        <a class="btn btn-default btn-xs " href="#" 
            onclick="minimizeWindow('optionalsMinimize', 'optionalMenuParent')" >
            <span class="glyphicon glyphicon-resize-small "></span>
        </a>
    </div>
</div>
<div class="row">
    <div class="col-xs-12">
        ${menuHelper:createOptionalLayersMenu(vectorLayers,language, basepath)}
    </div>
</div>
