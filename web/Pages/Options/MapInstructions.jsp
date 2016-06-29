<%-- 
    Document   : MapInstructionsLatest
    Created on : September 20, 2013, 10:57:3 
    Author     : Olmo Zavala Romero
--%>


<div class="helpInstructionsParentTable container-fluid" id="helpInstructions" >
	
    <div class="row ">
        <div class="col-xs-11  title text-center ">
			<span class="titleWOhalo"> <fmt:message key="main.help" /> </span> 
        </div>
        <div class="col-xs-1 text-right">
            <a class="btn btn-default btn-xs" href="#" onclick="owgis.help.main.displayHelp();">
                <span class="glyphicon glyphicon-remove"> </span> </a>
        </div>
    </div>
    <hr>
    <div class="row ">
        <div class="col-sm-3 title"> <fmt:message key="main.base" /> </div>
        <div class="col-sm-9"> <fmt:message key="help.mainLayer" /></div>
    </div>
	<c:if test='${ncwms}'>
		<div class="row defRowSpace">
			<div class="col-sm-3 title"> <fmt:message key="ncwms.cal.title" /></div>
			<div class="col-sm-9"> <fmt:message key="help.calendar" /></div>
		</div>
	</c:if>
    <div class="row defRowSpace">
        <div class="col-sm-3 title"><fmt:message key="main.optional" /></div>
        <div class="col-sm-9"> <fmt:message key="help.optional" /></div>
    </div>
    <div class="row defRowSpace">
        <div class="col-sm-3 title"><fmt:message key="main.googleE" /></div>
        <div class="col-sm-9"> <fmt:message key="help.tooltip.googleE" /></div>
    </div>
	<c:if test='${ncwms}'>
		<div class="row defRowSpace">
			<div class="col-sm-3 title"><fmt:message key="ncwms.transect" /></div>
			<div class="col-sm-9"> <fmt:message key="help.transect" /></div>
		</div>
	</c:if>
	<c:if test='${ncwms}'>
		<div class="row defRowSpace">
			<div class="col-sm-3 title"><fmt:message key="ncwms.depth" /></div>
			<div class="col-sm-9"> <fmt:message key="help.depth" /></div>
		</div>
	</c:if>
    <div class="row defRowSpace">
        <div class="col-sm-3 title"><fmt:message key="ncwms.trans" /></div>
        <div class="col-sm-9"> <fmt:message key="help.transparency" /></div>
    </div>
	<c:if test='${ncwms}'>
		<div class="row defRowSpace">
			<div class="col-sm-3 title"><fmt:message key="ncwms.pal" /></div>
			<div class="col-sm-9"><fmt:message key="help.palette" /></div>
		</div>
	</c:if>
	<c:if test='${cqlfilter}'>
    <div class="row defRowSpace">
        <div class="col-sm-3 title"><fmt:message key="cql.custom" /></div>
        <div class="col-sm-9"><fmt:message key="help.cql" /></div>
    </div>
	</c:if>
</div>
