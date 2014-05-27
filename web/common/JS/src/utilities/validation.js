/**
 * called when the user changes an option on the main menu
 */
function submitForm(){
    document.baseForm.submit();
}

/**
 * Check for user input on the range of colors in the palette options. 
 */
function validatePaletteRange(){
	var fMin = parseFloat($('#minPal').val());
    var fMax = parseFloat($('#maxPal').val());
	
    if (isNaN(fMin)) {
        alert('Value ranges can only be numbers');
        $('#minPal').val( minPalVal );
    } else if (isNaN(fMax)) {
        alert('Value ranges can only be numbers');
        $('#maxPal').val( maxPalVal );
    } else if (fMin > fMax) {
        alert('Minimum scale val() must be less than the maximum');
        $('#minPal').val( minPalVal );
        $('#maxPal').val( maxPalVal );
    }  else {
        $('#minPal').val( fMin );
        $('#maxPal').val( fMax );
        minPalVal= fMin;
        maxPalVal= fMax;
		return true;
    }
	return false;
}