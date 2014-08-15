
<%@ taglib prefix="menuHelper"
	uri="/WEB-INF/TLD/htmlStaticFunctions.tld"%>
<!-- This sections generate the menu of optional layers, normally vector layers -->
<div class="row" onClick="toogleList('#optionalLayersData')">
	<div class="col-xs-9 title noShadow text-center">
		<fmt:message key="main.optional" />
	</div>
	<div class="col-xs-3 text-right" >
		<a class="btn btn-default btn-xs " href="#" style="margin: 1px 5px 0px 0px"
			onclick="minimizeWindow('optionalsMinimize', 'optionalMenuParent')">
			<span class="glyphicon glyphicon-resize-small "></span>
		</a>
	</div>
</div>
<div class="row" id="optionalLayersData" >
	<div class="col-xs-12">
		        ${menuHelper:createOptionalLayersMenu(vectorLayers,language, basepath, mobile)}
<!-- 		<ul class='opt_lay_list_root' id='optUl0'> -->
<!-- 			<li class="opt_lay_title" id="optMenu1" -->
<!-- 				onclick="toogleList('#optUl1')">Level 1</li> -->
<!-- 			<ul class='opt_lay_list' id='optUl1'> -->
<!-- 				<fieldset data-role="controlgroup"> -->
<!-- 					<input type="checkbox" style= "margin-top:0px" id="checkBox1"> <a style="text-decoration: none; margin-left:35px; width: inherit">US States</a> -->
<!-- 					<div style="float: right"> -->
<!-- 						<a class="btn btn-default btn-xs" href="#" -->
<!-- 							id="minusButtonOptional1"> <span -->
<!-- 							class="glyphicon glyphicon-minus "></span> -->
<!-- 						</a> <a class="btn btn-default btn-xs" href="#" id="plusButtonTrans"> -->
<!-- 							<span class="glyphicon glyphicon-plus"> </span> -->
<!-- 						</a> <A href="#"> <img class="optionalImg" -->
<!-- 							src="/OWGIS_V2/common/images/kmz/kmz.png" border="0" -->
<!-- 							alt="Descargar KMZ"> -->
<!-- 						</A> <A href="#"> <img class="optionalImg" -->
<!-- 							src="/OWGIS_V2/common/images/Download/LayerDownload.png" -->
<!-- 							border="0" /> -->
<!-- 						</A> -->
<!-- 					</div> -->
<!-- 				</fieldset> -->
<!-- 			</ul> -->
<!-- 		</ul> -->
	</div>
</div>
