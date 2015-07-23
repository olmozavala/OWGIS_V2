
<%-- 
    Document   : DefaultErrorPage
    Created on : Apr 3, 2013, 12:01:34 PM
    Author     : Olmo Zavala-Romero
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@page isErrorPage="true" %>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="Description" content="Deep-C Error" />
        <meta name="Keywords" content="GIS, COAPS, map viewer, Deep-C, Oceanography" />

		<link href="./common/CSS/ErrorPage.css" rel="stylesheet" type="text/css"/>

        <title>Ups, something went wrong!</title>
    </head>
    <body>
		<div id="divErrMsg">
			<p id="txtHeader" class="errorMsg"> Ups, something went wrong !!! </p>
			<p id="txtContact" class="errorMsg"> Please contact the system 
				administrator.
		</div>
    </body>
</html>