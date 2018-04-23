<%-- 
    Document   : Palettes
    Created on : Aug 3, 2012, 6:26:56 PM
    Author     : Olmo Zavala-Romero
--%>
<!-- Holds the optional palettes -->
<c:if test='${mobile}'>
	<li>
		<table id="palettesTable"></table>
	</li>
	<li>
            <i id="btn_prev" onclick="prevPage()" class="paletteMobilPrev glyphicon glyphicon-chevron-left" aria-hidden="true" ></i>
            <i id="btn_next" onclick="nextPage()" class="paletteMobilNext glyphicon glyphicon-chevron-right" aria-hidden="true"></i>
	</li>
        <li>
            <a href="#" class="ui-btn ui-icon-back ui-btn-icon-left" id="defaultColorRangeButton" onclick="DefaultPalette();"> Default</a>
        </li>
</c:if>
<c:if test='${!mobile}'>
	<div class="row defRowSpace">
		<div class="col-xs-12">
			<table id="palettesTable"></table>
		</div>
	</div>
        
	<div class="row doubleRowSpace">
		<div class="col-xs-12 col-xs-offset-2">
                    <a class="btn btn-default btn-xs btn-inverse" href="javascript:prevPage()" id="btn_prev" style="display: inline-block;"><span class="glyphicon glyphicon-chevron-left"></span></a>
		    <span class="buttonStyle " id="defaultColorRangeButton" onclick="DefaultPalette();"> Default </span>
                    <a class="btn btn-default btn-xs btn-inverse" href="javascript:nextPage()" id="btn_next" style="display: inline-block;"><span class="glyphicon glyphicon-chevron-right"></span></a>
		</div>	
	</div>
</c:if>
<script type="text/javascript">
    javascript:nextPage();
</script>