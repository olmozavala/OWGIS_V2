<%-- 
    Document   : Error
    Created on : Mar 28, 2013, 9:49:28 PM
    Author     : Olmo Zavala-Romero
--%>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"  %>
<fmt:setLocale value="${language}"/>
<fmt:setBundle basename="com.mapviewer.messages.error.text" />

<!DOCTYPE html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<title></title>
	<meta name="description" content="">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	
	<link href="./common/CSS/vendor/bootstrap.min.css" rel="stylesheet" type="text/css"/>
	<link href="./common/CSS/ErrorPage.css" rel="stylesheet" type="text/css"/>

	<%@include file="../Header/ExternalJS.jsp" %>  
</head>
<body >
	<div class="container mainContainer">
		<div class="row">
			<div class="col-xs-4 col-xs-offset-2" >
				<h1 id="txtHeader"><fmt:message key="error.header"/></h1>
				<h2 id="txtException">${errorText}</h2>	
				<img  src="./common/images/ErrorPage/Back1.jpg" align="middle" width="40%">
				<h4 id="txtTrace">Error Trace:<br> ${traceText}</h4>	
			</div>
		</div><!-- Map row -->
	</div>
	
	<footer>
		<div class="col-xs-12 col-xs-offset-0 col-sm-11 col-sm-offset-1">
			<p> <a href="http://owgis.org">OWGIS</a> &copy; 2016</p>
		</div>
	</footer>
</body>
</html>
