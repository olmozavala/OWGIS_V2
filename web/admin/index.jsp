<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
		<%@include file="Header.jsp" %>
</head>

<body>
		<!-- start: Header -->
	<%@include file="navbar.jsp" %>
	<!-- start: Header -->
	
		<div class="container-fluid-full">
		<div class="row-fluid">
				
			<!-- start: Main Menu -->
			<%@include file="Menu.jsp" %>
			<!-- end: Main Menu -->
			
<!-- 			<noscript> -->
<!-- 				<div class="alert alert-block span10"> -->
<!-- 					<h4 class="alert-heading">Warning!</h4> -->
<!-- 					<p>You need to have <a href="http://en.wikipedia.org/wiki/JavaScript" target="_blank">JavaScript</a> enabled to use this site.</p> -->
<!-- 				</div> -->
<!-- 			</noscript> -->
			
			<!-- start: Content -->
			<div id="content" class="span10">
			
			
			<ul class="breadcrumb">
				<li>
					<i class="icon-home"></i>
					<a href="index.html">Home</a> 
					<i class="icon-angle-right"></i>
				</li>
				<li><a href="#">Dashboard</a></li>
			</ul>

			<h1><b>Welcome to OWGIS Administration</b></h1>
			<br>
       		<h3>This interface will assist in configuring the OWGIS.</h3>
       		<br>
			<div style="padding: 20px; background-color: rgb(221, 255, 212); width: 400px; display: table; border-radius: 10px; border: 1px solid rgb(10,212,2);">
			<span style="vertical-align: middle;
    display: table-cell;"><img style="max-width: 85px; vertical-align: middle; display: table-cell; margin-right: 1em;" src="img/Green_check_mark.png"></span>
			<span style="vertical-align: middle;
    display: table-cell; width: 70%">
			
								<h5>Server status:</h5>
								<h1><b>Running</b></h1>
							</span>
			</div>
	</div><!--/.fluid-container-->
	
			<!-- end: Content -->
		</div><!--/#content.span10-->
		</div><!--/fluid-row-->
		
	<div class="modal hide fade" id="myModal">
		<div class="modal-header">
			<button type="button" class="close" data-dismiss="modal">×</button>
			<h3>Settings</h3>
		</div>
		<div class="modal-body">
			<p>Here settings can be configured...</p>
		</div>
		<div class="modal-footer">
			<a href="#" class="btn" data-dismiss="modal">Close</a>
			<a href="#" class="btn btn-primary">Save changes</a>
		</div>
	</div>
	
	<div class="clearfix"></div>
	
			<%@include file="footer.jsp" %>
	
	

</body>
</html>