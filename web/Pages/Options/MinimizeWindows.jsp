<%-- 
    Document   : MinimizeWindows
    Created on : Feb 19, 2013, 4:32:14 PM
    Author     : khan
--%>
<div class="row" id="minimizedWindowsContainer">
    <div class="col-xs-11" >
        <span id="mainMenuMinimize" class="draggableWindow minimizedWindow">
            <fmt:message key="main.base" />
            <a class="btn btn-default btn-xs " href="#" 
               onclick="owgis.layouts.draggable.minimizeWindow('mainMenuParent','mainMenuMinimize')"> 
                <i class="glyphicon glyphicon-resize-full "></i></a>

        </span>                
        <span id="calendarsMinimize" class="draggableWindow minimizedWindow">
            <fmt:message key="ncwms.cal.title" />
            <a class="btn btn-default btn-xs " href="#" 
                onclick="owgis.layouts.draggable.minimizeWindow('CalendarsAndStopContainer','calendarsMinimize')"> 
                <i class="glyphicon glyphicon-resize-full "></i></a>
        </span>                
        <span id="optionalsMinimize" class="draggableWindow minimizedWindow">
            <fmt:message key="main.optional" />
            <a class="btn btn-default btn-xs " href="#" 
                onclick="owgis.layouts.draggable.minimizeWindow('optionalMenuParent','optionalsMinimize')" >
                <i class="glyphicon glyphicon-resize-full "></i></a>
        </span>                
    </div>
</div>
