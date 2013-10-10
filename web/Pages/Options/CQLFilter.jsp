<%-- 
    Document   : CQLFilter
    Created on : Feb 18, 2013, 10:50:57 AM
    Author     : olmozavala
--%>

<span class="draggableWindow" id="ocqlFilterInputTextParent" 
	  onmouseover="hoverInstructionsFixedPos('ocqlFilterText', '1')" 
	  onmouseout="hoverInstructionsFixedPos('ocqlFilterText', '2')"  >

    <div class="row">
        <div class="col-xs-10 text-center defRowSpace">
            <span class="title invShadow"> Custom filter </span>
        </div>
        <div class="col-xs-2 ">
            <a class="btn btn-default btn-xs" href="#" onclick="closeCustomFilterTextBox();">
                <span class="glyphicon glyphicon-remove"> </span> </a>
        </div>
    </div>
    <div class="row defRowSpace">
        <div class="col-xs-12">
            <span id="availableFiltersText" class="defShadow"> 
                    Available filters: <b>${cqlcols}</b> </span>	
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


	<span id="ocqlFilterText" class="commonHover">
		This is a
		<a href="http://en.wikipedia.org/wiki/Contextual_Query_Language"> CQL </a>
		filter text box. Possible options: <br> <br>
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
		<br> <b>Examples (review available filters)</b>:
		<br> &nbsp;&nbsp;&nbsp;&nbsp; time <b>></b> '2013-01-01'
		<br> &nbsp;&nbsp;&nbsp;&nbsp; year <b>></b> 2008 <b>AND </b>year <b><</b> 2011
		<br> &nbsp;&nbsp;&nbsp;&nbsp; temperature <b>></b> 10 <b>OR</b> salinity <b>>=</b> 1
		<br> &nbsp;&nbsp;&nbsp;&nbsp; year <b>IN</b> (2012,2013) <b>AND</b> date < '8/10/2013'
		<br> &nbsp;&nbsp;&nbsp;&nbsp; name <b>LIKE</b> 'John<b>%</b>' <b>AND</b> year <b><</b> 2013
	</span>
	<span id="ocqlErrorParent" class="commonHover">
		<p class="errorText"></p>
	</span>
</span>
