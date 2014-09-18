<%-- 
    Document   : Palettes
    Created on : Aug 3, 2012, 6:26:56 PM
    Author     : olmozavala
--%>
<!-- Holds the optional palettes -->
<div class="row defRowSpace">
	<div class="col-xs-10 invShadow title" > <fmt:message key="ncwms.newpal" /></div>
		
	<div class="col-xs-2 pull-right">
		<a class="btn btn-default btn-xs" href="#" onclick="displayOptionalPalettes();">
			<span class="glyphicon glyphicon-remove"> </span> 
		</a>
	</div>
</div>
<div class="row defRowSpace">
	<div class="col-xs-12">
		<table id="palettesTable"></table>
	</div>
</div>
<div class="row doubleRowSpace">
	<div class="col-xs-4 col-xs-offset-3 ">
		<span class="buttonStyle " id="defaultColorRangeButton"
			  onclick="DefaultPalette();"> Default</span>
	</div>	
</div>
