<%@page pageEncoding="iso-8859-1"%>
<%@page errorPage="Error/ErrorPage.jsp" %>
<%@ taglib prefix="menuHelper" uri="/WEB-INF/TLD/htmlStaticFunctions.tld" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"  %>
<jsp:useBean id="names" class="com.mapviewer.model.PagesNames" scope="page"> </jsp:useBean>
<jsp:useBean id="globals" class="com.mapviewer.model.Globals" scope="page"> </jsp:useBean>

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="chrome=1">
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no, width=device-width">
		<link rel="icon" href="../common/images/icon/PageIcon.ico" type="image/x-icon" />
        <meta charset="utf-8"  />
        <meta name="Description" content="OWGIS Template" />
        <meta name="Keywords" content="OWGIS " />

        <!-- Jquery -->
		<script src="../common/JS/vendor/jquery-2.1.1.min.js"></script>
		<script src="../common/JS/vendor/jquery-ui-1.11.1/jquery-ui.min.js"></script>
		<link href="../common/JS/vendor/jquery-ui-1.11.1/jquery-ui.min.css" rel="stylesheet" type="text/css"/>
		
		<!--Specific for Images in Dropdown for locale-->		
		<script src="../common/JS/vendor/jquery.dd.min.js"></script>

        <!-- End Jquery -->
        <script>
		$.widget.bridge('uitooltip', $.ui.tooltip);
		</script>
        <!-- Bootstrap -->
		<!--<link href="//netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap.min.css" rel="stylesheet" type="text/css"/>-->
		<!--<script src="//netdna.bootstrapcdn.com/bootstrap/3.0.0/js/bootstrap.min.js"></script>-->
		<link href="../common/CSS/vendor/bootstrap.min.css" rel="stylesheet" type="text/css"/>
		<script src="../common/JS/vendor/bootstrap.min.js"></script>
        <!-- End Bootstrap -->

		<link href="../common/CSS/Calendars.css" rel="stylesheet" type="text/css"/>
		<link href="../common/CSS/MapInstructions.css" rel="stylesheet" type="text/css"/>
		<link href="../common/CSS/GeneralStyles.css" rel="stylesheet" type="text/css"/>
        <link href="../common/CSS/Buttons.css" rel="stylesheet" type="text/css"/>
        <link href="../common/CSS/Elevation.css" rel="stylesheet" type="text/css"/>
        <link href="../common/CSS/BaseLayers.css" rel="stylesheet" type="text/css"/>
        <link href="../common/CSS/Palettes.css" rel="stylesheet" type="text/css"/>
		<link href="../common/CSS/Popup.css" rel="stylesheet" type="text/css"/>
		<link href="../common/CSS/cqlFilter.css" rel="stylesheet" type="text/css"/>
		<link href="../common/CSS/OptionalLayersMenu.css" rel="stylesheet" type="text/css"/>
		<link href="../common/CSS/MenuOptions.css" rel="stylesheet" type="text/css"/>
		<link href="../common/CSS/MinimizedWindows.css" rel="stylesheet" type="text/css"/>
		<link href="../common/CSS/Animations.css" rel="stylesheet" type="text/css"/>
		<link href="../common/CSS/Locale.css" rel="stylesheet" type="text/css"/>
		<link href="../common/CSS/HomePage.css" rel="stylesheet" type="text/css"/>

		<!--Specific for Images in Dropdown for locale-->
		<link href="../common/CSS/vendor/dd.css" rel="stylesheet" type="text/css"/>


		<!--Specific for OpenLayers3 -->
		<!--<link rel="stylesheet" href="http://ol3js.org/en/master/css/ol.css" />-->
		<link rel="stylesheet" href="../common/CSS/ol.css" />
		<link href="../common/CSS/Ol3.css" rel="stylesheet" type="text/css"/>
		<!--Specific for OpenLayers3 -->


		<!--OpenLayers 3 Management -->
		<script type="text/javascript" src="../common/JS/src/ol3/PopUp.js"> </script>
		<!--OpenLayers 3 Management -->

		<!--NcWMS related-->
		<script type="text/javascript" src="../common/JS/src/ncwms/Elevation.js"> </script>
		<!--NcWMS related-->

		<!--Menus related-->
		<script src="../common/JS/src/menus/MenuPositions.js"> </script>
		<script src="../common/JS/src/menus/OptionalLayersMenu.js"> </script>
        <script src="../common/JS/src/menus/HelpInstructions.js"> </script>
		<!--Menus related-->
			
		<!--Debug mode-->
		<script src="http://resources.programmingclosure.com/closure-lite.js"></script>
		<!--<script src="../common/JS/vendor/closure/goog/base.js"> </script>-->
		<script src="../common/JS/vendor/ol.js"></script>
		<!--<script src="../common/JS/vendor/ol/ol.js"></script>-->
		<!--Debug mode-->
		<link href='http://fonts.googleapis.com/css?family=Arvo:400,700|PT+Sans:400,700|Open+Sans:400,700|Roboto:700,400|Raleway:400,700' rel='stylesheet' type='text/css'>
			
		<title>OZ hello Ol3</title>
  </head>
  <body style='background-color: white'>
	  <section class="container-fluid">
		  <div class="row">
			  <div class="col-lg-1 red" >
				  <a href="http://owgis.org" target="_blank">
					  <img border="0" src="../common/images/Logos/owgis.png" alt="OWGIS" height="20px"  />
				  </a>
			  </div>
			  <div class="col-lg-9 green text-center" >
				  <!-- Link to download kml files-->
				  <div class="col-lg-6 sh" >
					  <div class="buttonStyle toolTip" id="kmlLinkParent" > Google Earth</div>
					  <div class="buttonStyle toolTip" id="kmlLinkParent" > 222 Transparency 222</div>
					  <div class="buttonStyle toolTip" id="kmlLinkParent" > Color Palette </div>
				  </div>
				  <div class="col-lg-6 text-left" >
					  <div class="buttonStyle toolTip" id="kmlLinkParent" > Transect Tool </div>
					  <div class="buttonStyle toolTip" id="kmlLinkParent" > Help </div>
					  <div class="buttonStyle toolTip" id="kmlLinkParent" > Reset View</div>
				  </div>
			  </div>
			  <div class="col-lg-2" >
				  <div class="col-lg-10 yellow text-right" >
					  <select>
						  <option value="sopas">perico</option>
						  <option value="sopas">perico</option>
						  <option value="sopas">perico</option>
						  <option value="sopas">perico</option>
					  </select>
				  </div>
				  <div class="col-lg-2 blue"  >
					  <img class="toolTip" onclick="owgis.help.tooltips.toggleTooltips();" 
						   id="helpHoverImg" src="../common/images/Help/Help1.png">
				  </div>
			  </div>
		  </div>
	  </section>
  </body>
</html>
