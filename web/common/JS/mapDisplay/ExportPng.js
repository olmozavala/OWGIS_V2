
// Downloads the current map as a png
//$("#exportMapLink").click( function() { 
function updateMapPngLink(){
            $("#exportMapLink").attr('href', map.getRenderer().getCanvas().toDataURL('image/png')); 
        };
