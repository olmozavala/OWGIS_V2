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
		<a href="#" class="ui-btn ui-icon-back ui-btn-icon-left" 
		   id="defaultColorRangeButton"
				  onclick="DefaultPalette();"> Default</a>

	</li>
</c:if>
<c:if test='${!mobile}'>
	<div class="row defRowSpace">
		<div class="col-xs-12">
			<table id="palettesTable"></table>
		</div>
	</div>
        <div class="row defRowSpace palpags">
            <a href="javascript:prevPage()" id="btn_prev">Prev</a>
            <a href="javascript:nextPage()" id="btn_next">Next</a>
        </div>
	<div class="row doubleRowSpace">
		<div class="col-xs-4 col-xs-offset-3 ">
			<span class="buttonStyle " id="defaultColorRangeButton"
				  onclick="DefaultPalette();"> Default</span>
		</div>	
	</div>
</c:if>