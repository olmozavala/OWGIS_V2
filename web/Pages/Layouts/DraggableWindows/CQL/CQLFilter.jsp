<%-- 
    Document   : CQLFilter
    Created on : Feb 18, 2013, 10:50:57 AM
    Author     : Olmo Zavala-Romero
--%>
<div class="draggableWindow container-fluid toolTipWithImage" id="ocqlFilterInputTextParent"
	 title="ocqlFilterText" >
	<!--Title and close button-->
	<div class="row">
		<div class="col-xs-10 text-center defRowSpace">
			<span class="title invShadow"> <fmt:message key="cql.custom" /></span>
		</div>
		<div class="col-xs-2 ">
			<a class="btn btn-default btn-xs" href="#" onclick="owgis.cql.toggleCustomFilterTextBox();">
				<span class="glyphicon glyphicon-remove"> </span> </a>
		</div>
	</div>
	<%@include file="../../../Options/CQLFilter.jsp" %> 
</div>