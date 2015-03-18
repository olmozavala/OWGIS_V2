<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<%@include file="Header.jsp"%>
</head>

<body>
	<!-- start: Header -->
	<%@include file="navbar.jsp"%>
	<!-- start: Header -->
<div class="loader"></div>
	<div class="container-fluid-full">
		<div class="row-fluid">

			<!-- start: Main Menu -->
			<%@include file="Menu.jsp"%>
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
					<li><i class="icon-home"></i> <a href="index.jsp">Home</a> <i
						class="icon-angle-right"></i></li>
					<li><a href="#">Mobile App</a></li>
				</ul>

				<div class="row-fluid sortable">
					<div class="box span12">
						<div class="box-header" data-original-title>
							<h2>
								<i class="halflings-icon edit"></i><span class="break"></span>Download
								Mobile App
							</h2>
							<div class="box-icon">
								<a href="#" class="btn-setting"><i
									class="halflings-icon wrench"></i></a> <a href="#"
									class="btn-minimize"><i class="halflings-icon chevron-up"></i></a>
								<a href="#" class="btn-close"><i
									class="halflings-icon remove"></i></a>
							</div>
						</div>
						<div class="box-content">
							<form class="form-horizontal" action="#">
								<fieldset>
									<div class="control-group">
										<label class="control-label" for="mobileSiteUrl">Enter the URL</label>
										<div class="controls">
											<div class="input-append">
												<input id="mobileSiteUrl" type="text" name="url">
												<button class="btn btn-primary" onclick="downloadMobileApp();" type="button">Download</button>
											</div>
										</div>
									<div class="control-group" id="qrcode-control" style="display:none">
										<label class="control-label" for="disabledInput" style="margin-top: 20px;">Scan QR to download directly on Device</label>
										<div class="controls">
								<div id="qrcode"></div>
										</div>
									  </div>
									</div>
								</fieldset>
								
							</form>

						</div>
						
					</div>
					<!--/span-->

				</div>
				<!--/row-->


			</div>
			<!--/.fluid-container-->

			<!-- end: Content -->
		</div>
		<!--/#content.span10-->
	</div>
	<!--/fluid-row-->

	<div class="modal hide fade" id="myModal">
		<div class="modal-header">
			<button type="button" class="close" data-dismiss="modal">×</button>
			<h3>Settings</h3>
		</div>
		<div class="modal-body">
			<p>Here settings can be configured...</p>
		</div>
		<div class="modal-footer">
			<a href="#" class="btn" data-dismiss="modal">Close</a> <a href="#"
				class="btn btn-primary">Save changes</a>
		</div>
	</div>

	<div class="clearfix"></div>

	<%@include file="footer.jsp"%>


</body>
</html>