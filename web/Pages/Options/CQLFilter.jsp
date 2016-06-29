<%-- 
    Document   : CQLFilter
    Created on : Feb 18, 2013, 10:50:57 AM
    Author     : Olmo Zavala-Romero
--%>

<div class="row defRowSpace">
	<div class="col-xs-12">
		<span id="availableFiltersText" class="defShadow"> 
			<fmt:message key="cql.avai" />: <b>${cqlcols}</b> </span>	
	</div>
</div>
<div class="row">
	<div class="col-xs-8 ">
		<input placeholder="Type custom filter" class="form-control" type="text" id="idOcqlFilterInputText" 
			   onkeyup="owgis.cql.applyFilterOnEnter();" name="ocqlFilterInputText">
	</div>
	<div class="col-xs-4 ">
		<button type="button" name="type" id="idOcqlFilterButton" class="buttonStyle" 
				onclick="owgis.cql.applyCqlFilter();" ><fmt:message key="main.apply" /></button>
	</div>
</div>
		
		
<div id="ocqlFilterText" class="row commonHover">
	<div clas="col-xs-12">
		<fmt:message key="help.tooltip.cql.customfilter.line1" />
	</div>
	<div clas="col-xs-12">
		<table class="cqlFilterExampleTable">
			<tr>
				<th>Boolean</th> <th>Comparison</th> <th>Chars</th> <th>Reg. Exp.</th>
			</tr>
			<tr>
				<td>or<br>and</td>
				<td>=,<>, <,<br><=,>=</td>
				<td>LIKE<br> IN</td>
				<td>% (any) </td>
			</tr>
		</table>
	</div>
		<div class="col-xs-12">
				
		<br> <b> <fmt:message key="help.tooltip.cql.customfilter.line2" /></b>:
		<br> &nbsp;&nbsp;&nbsp;&nbsp; time <b>></b> '2013-01-01'
		<br> &nbsp;&nbsp;&nbsp;&nbsp; year <b>></b> 2008 <b>AND </b>year <b><</b> 2011
		<br> &nbsp;&nbsp;&nbsp;&nbsp; temperature <b>></b> 10 <b>OR</b> salinity <b>>=</b> 1
		<br> &nbsp;&nbsp;&nbsp;&nbsp; year <b>IN</b> (2012,2013) <b>AND</b> date < '8/10/2013'
		<br> &nbsp;&nbsp;&nbsp;&nbsp; name <b>LIKE</b> 'John<b>%</b>' <b>AND</b> year <b><</b> 2013
	</div>
</div>
<span id="ocqlErrorParent" class="commonHover">
	<p class="errorText"></p>
</span>
