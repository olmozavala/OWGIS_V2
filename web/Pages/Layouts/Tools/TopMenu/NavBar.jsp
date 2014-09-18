<section class="container-fluid topMenu">
	<div class="row">
		<!--Logo OWGIS-->
		<div class="col-lg-1 " >
			<a href="http://owgis.org" target="_blank">
				<img border="0" src="./common/images/Logos/owgis.png" alt="OWGIS" height="20"  />
			</a>
		</div>

		<!--All feature buttons-->
		<section class="col-lg-9 text-center" >
			<!-- Link to download kml files-->
			<div class="buttonStyle toolTip" id="kmlLinkParent" title="<fmt:message key='help.tooltip.googleE'/>"> 
				<%@include file="../../../Options/KmlLink.jsp" %>
			</div>
			<!-- Transparency -->
			<div class="buttonLook toolTip" id="transParent" title="<fmt:message key='help.tooltip.transparency'/>">
				<%@include file="../../../Options/Transparency.jsp" %>
			</div>
			<!-- Depth or elevation-->
			<div class="buttonContainer menuHidden toolTip" id="elevationParent" title="<fmt:message key='help.tooltip.depthElevation'/>" >
				<%@include file="../../../Options/Elevation.jsp" %>
			</div>
			<!-- Palettes -->
			<div class="buttonStyle menuHidden toolTip" id="palettesMenuParent" 
				 title="<fmt:message key='help.tooltip.palettes'/>"
				 onclick="showPalettes()">
				<fmt:message key="ncwms.pal" />
			</div>
			<!-- Transect tool-->
			<div class="buttonStyle menuHidden toolTip" id="lineToggle" 
				 title="<fmt:message key='help.tooltip.transect'/>"
				 onclick="toggleControl(this,'below');" >
				<fmt:message key="ncwms.transect" />
			</div>
			<!-- Download data-->
			<div class="buttonStyle menuHidden toolTip" id="downloadDataParent" 
				 title="<fmt:message key='help.tooltip.download'/>"
				 onclick="downloadData();"  >
				<fmt:message key="main.download" />
			</div>
			<!-- Map Instructions-->
			<div class="buttonStyle toolTip" id="helpParent" 
				 title="<fmt:message key='help.tooltip.help'/>">
				<span id="helpText"  onclick="displayHelp();" />
				<fmt:message key="main.help" />
				</span>
			</div>
			<!-- Reset view -->
			<div class="buttonStyle toolTip" id="resetParent" 
				 title="<fmt:message key='help.tooltip.resetview'/>" >
				<span id="resetText" onclick="resetView();" />
				<fmt:message key="main.resetView" />
				</span>
			</div>
		</section >

		<!--Languages and tooltip help button-->
		<div class="col-lg-2" >
			<div id="languageContainer" class="col-lg-10 ">
				<select id='langDropDown' onchange='MapViewersubmitForm();'>
					<!--It gets initialized by languages.js-->
				</select>
			</div>
			<div id="helpHoverSpan" class="col-lg-2 ">
				<img title="<fmt:message key='help.helpicon'/>" class="toolTip"
					 onclick="displayHoverHelp();" id="helpHoverImg" src="./common/images/Help/Help1.png">
			</div>
		</div>
	</div>
</section>