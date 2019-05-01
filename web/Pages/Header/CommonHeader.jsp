<%-- 
    Document   : Header
    Created on : Sept 17, 2015, 5:45:27 PM
    Author     : Olmo Zavala-Romero
--%>

<%-- 
    This page contains all the links to the CSS, and the javascript 
--%>
	<link rel="icon" href="./common/images/icon/PageIcon.ico" type="image/x-icon" />
	<meta charset="utf-8"  />
	<meta name="Description" content="OWGIS Template" />
	<meta name="Keywords" content="OWGIS " />

	<!--External CSS -->
	<link href="./common/CSS/vendor/ol.css" rel="stylesheet"  type="text/css"/>
        <link href="./common/CSS/vendor/bootstrap.min.css" rel="stylesheet" type="text/css"/>
	<c:if test='${currents}'>
	<link href="./common/CSS/vendor/spectrum.css" rel="stylesheet" type="text/css"/>
	</c:if>
	<!--This is the mobile case-->
	<c:if test='${mobile}'>
	<link href="./common/CSS/vendor/jquery.mobile-1.4.5.min.css"  rel="stylesheet"/>
	<link href="./common/CSS/vendor/jqm-icon-pack-fa-modified.css"  rel="stylesheet"/>
	<link href="./common/CSS/vendor/jquery-ui.min.css" rel="stylesheet" type="text/css"/>
	<link href="./common/CSS/mobile.css" rel="stylesheet" type="text/css"/>
	<link href="./common/CSS/vendor/dd.css" rel="stylesheet" type="text/css"/>
	</c:if>
	<!--this is the Desktop case-->
	<c:if test='${!mobile}'>
	<link href="./common/CSS/vendor/jquery-ui.min.css" rel="stylesheet" type="text/css"/>
	<link href="./common/CSS/desktop.css" rel="stylesheet" type="text/css"/>
	</c:if>
	<!--Internal CSS -->
	<link href="./common/CSS/commonStyle.css" rel="stylesheet" type="text/css"/>