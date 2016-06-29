<%-- 
    Document   : CQLFilter
    Created on : Feb 18, 2013, 10:50:57 AM
    Author     : olmozavala
--%>


<div data-role="panel" id="mobPanelCQL" data-theme="b"
	 data-display="overlay" data-position="right">
	<div class="row defRowSpace">
		<div class="col-xs-12">
			<span id="availableFiltersText" class="defShadow"> 
					<fmt:message key="cql.avai" />: <b>${cqlcols}</b> </span>	
		</div>
	</div>
	<div class="row">
		<div class="col-xs-8 ">
			<input placeholder="Type custom filter" class="form-control" type="text" id="idOcqlFilterInputText" 
					onkeyup="applyFilterOnEnter();" name="ocqlFilterInputText">
		</div>
		<div class="col-xs-4 ">
			<button type="button" name="type" id="idOcqlFilterButton" class="buttonStyle" 
					onclick="applyCqlFilter();" ><fmt:message key="main.apply" /></button>
		</div>
	</div>
</div>
