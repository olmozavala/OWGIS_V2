<section class="container-fluid topMenu">
	<div class="row">
		<!--Logo OWGIS-->
		<span class="col-lg-1 visible-lg" >
			<a href="http://owgis.org" target="_blank">
				<img border="0" src="./common/images/Logos/owgis.png" alt="OWGIS" height="20"  />
			</a>
		</span>
		<!--TODO Changing the margin at css didn't work -->
		<ul class="horizontal col-lg-9 col-md-10 text-center" style="margin-bottom: 0px">
			<li class="buttonStyle toolTip" id="kmlLinkParent" title="<fmt:message key='help.tooltip.googleE'/>"> 
				<%@include file="../../../Options/KmlLink.jsp" %>
			</li>
			<!-- Transparency -->
			<li class="buttonLook toolTip" id="transParent" title="<fmt:message key='help.tooltip.transparency'/>">
				<%@include file="../../../Options/Transparency.jsp" %>
			</li>
			<!-- Depth or elevation-->
			<li class="buttonContainer menuHidden toolTip" id="elevationParent" title="<fmt:message key='help.tooltip.depthElevation'/>" >
				<%@include file="../../../Options/Elevation.jsp" %>
			</li>
			<!-- Palettes -->
			<li class="buttonStyle menuHidden toolTip" id="palettesMenuParent" 
				title="<fmt:message key='help.tooltip.palettes'/>"
				onclick="showPalettes()">
			<fmt:message key="ncwms.pal" />
			</li>
			<!-- Transect tool-->
			<li class="buttonStyle menuHidden toolTip" id="lineToggle" 
				title="<fmt:message key='help.tooltip.transect'/>"
				onclick="toggleControl(this,'below');" >
			<fmt:message key="ncwms.transect" />
			</li>
			<!-- Download data-->
			<li class="buttonStyle menuHidden toolTip" id="downloadDataParent" 
				title="<fmt:message key='help.tooltip.download'/>"
				onclick="downloadData();"  >
			<fmt:message key="main.download" />
			</li>
			<!-- Map Instructions-->
			<li class="buttonStyle toolTip" id="helpParent" 
				title="<fmt:message key='help.tooltip.help'/>">
				<span id="helpText"  onclick="owgis.help.main.displayHelp();" />
			<fmt:message key="main.help" />
			</span>
			</li>
			<!-- Reset view -->
			<li class="buttonStyle toolTip" id="resetParent" 
				title="<fmt:message key='help.tooltip.resetview'/>" >
				<span id="resetText" onclick="resetView();" />
			<fmt:message key="main.resetView" />
			</span>
			</li>
		</ul>
		
		<!--Languages and tooltip help button-->
		<div class="col-lg-2 col-md-2 " >
<!-- 			<div class="btn-group col-lg-5 col-lg-offset-4 col-md-7 col-md-offset-1 -->
<!-- 				 hidden-sm hidden-xs "> -->
			<div class="btn-group col-lg-5 col-lg-offset-1 col-md-7 col-md-offset-1
				 hidden-sm hidden-xs ">
				<button id="selectedLanguage" type="button" 
						class="btn btn-default dropdown-toggle" data-toggle="dropdown">
					<!--It gets initialized by languages.js-->
				</button>
				<ul id="langDropDown" class="dropdown-menu" role="menu">
					<!--It gets initialized by languages.js-->
				</ul>
			</div>
<a class="btn btn-default btn-xs " href="./admin/index.jsp" id="adminConsole">
   Admin </a>
			<span id="helpHoverSpan" class="col-lg-3 col-md-4 hidden-sm hidden-xs ">
				<img title="<fmt:message key='help.helpicon'/>" class="toolTip"
					 onclick="owgis.help.tooltips.toogleTooltips();" id="helpHoverImg" src="./common/images/Help/Help1.png">
			</span>
		</div>
	</div>
	
</section>