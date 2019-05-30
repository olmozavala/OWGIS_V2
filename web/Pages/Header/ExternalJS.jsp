	<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!--Debug mode-->        
	<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.2.0/backbone-min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/4.10.2/d3.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js"></script>
	<script src="./common/JS/vendor/minimized/moment-range.min.js"></script>        
        <script src="https://cdn.jsdelivr.net/npm/bootstrap-select@1.13.9/dist/js/bootstrap-select.min.js"></script>

	<c:if test='${currents}'>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/spectrum/1.8.0/spectrum.min.js"></script>
	</c:if>

	<!--this is the Mobile case-->
	<c:if test='${mobile}'>
		<script src="./common/JS/vendor/minimized/jquery.mobile.min.js"></script>
		<script src="./common/JS/vendor/minimized/jquery.slidePanel.js"></script>
		<script src="./common/JS/vendor/minimized/jquery_ui_datepicker/jquery-ui.min.js"></script>
                <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
	</c:if>
	<!--this is the Desktop case-->
	<c:if test='${!mobile}'>
		<script src="./common/JS/vendor/minimized/jquery-ui.min.js"></script>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap-select@1.13.9/dist/js/bootstrap-select.min.js"></script>
		<script> $.widget.bridge('uitooltip', $.ui.tooltip); </script>	
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
	</c:if>
        <c:if test='${language.equals("ES")}'>
            <script src="./common/JS/vendor/minimized/jquery_ui_datepicker/datepicker-es.js"></script>
        </c:if>
            
        <script src="https://cdnjs.cloudflare.com/ajax/libs/highcharts/6.0.3/highcharts.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/highcharts/6.0.3/js/modules/data.js"></script>
        <script src="./common/JS/vendor/minimized/exporting.js"></script>