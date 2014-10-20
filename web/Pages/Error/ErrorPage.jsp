<%-- 
    Document   : Error
    Created on : Mar 28, 2013, 9:49:28 PM
    Author     : Olmo Zavala-Romero
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@page isErrorPage="true" %>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="Description" content="Deep-C Error" />
        <meta name="Keywords" content="DeepC, GIS, COAPS, map viewer, Deep-C, Oceanography" />

		<link href="./common/CSS/ErrorPage.css" rel="stylesheet" type="text/css"/>

        <title>Ups, something went wrong!</title>
    </head>
    <body>
		<div id="divErrMsg">
			<p id="txtHeader" class="errorMsg"> Ups, something went wrong !!! </p>
			<p id="txtContact" class="errorMsg"> Please contact the system 
				administrator and tell him this: </p>
			<p id="txtException" class="errorMsg"> ${errorText} </p>
			<p id="txtTrace" class="errorMsg"> ${traceText} </p>
		</div>
    </body>
</html>
