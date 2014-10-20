<%-- 
    Document   : GlobalJavaScripls
    Created on : Aug 3, 2012, 5:48:28 PM
    Author     : Olmo Zavala-Romero
--%>
<script type="text/javascript"  >
	function initVariables(){
		var idx_main_layer = '${idx_main_layer}';// What is the index of the main layer (depending on the number of background layers)
		owgis.layers.initMainLayer(eval('layer'+idx_main_layer));
	}
</script>
