<%-- 
    Document   : ErrorPopup
    Created on : Sep 4, 2015, 1:43:29 PM
    Author     : olmozavala
--%>
	
<div id="errorPopup" class="errorPopup">
	<!--Contains the applied pallete on the left of the window-->
	<div class="row defRowSpace">
		<div class="col-xs-8 invShadow title"> Warning!</div>
		<div class="col-xs-3 pull-right">
			<a class="btn btn-default btn-xs" href="#" onclick="$('#errorPopup').hide();">
				<span class="glyphicon glyphicon-remove"> </span> 
			</a>
		</div>
	</div>
	<div class="row defRowSpace">
		<div id="errorPopupText" class="col-xs-12 "> </div>
	</div>
</div>