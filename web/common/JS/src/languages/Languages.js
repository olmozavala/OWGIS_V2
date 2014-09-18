/* 
 * This JavaScript file manages the languages in the interface.
 * It is mainly in charge of filling up the dropdown list with
 * the languages.
 */
goog.provide('owgis.languages');

owgis.languages.buildselection = function buildDropDownLanguages(){
	//Obtains the available languages
	var languages = mapConfig.availableLanguages.split(";");
	var currLang = _curr_language;
	//Iterates ver all the available languages
	for(var i = 0; i < languages.length; i++){
		//Creates a new option
		var opt= new Option(languages[i],languages[i]);
		//Checks if the language is the one selected
		if( languages[i] === currLang){
			$(opt).attr('selected','selected');
		}
		//Adds an image into the dropdown list
		$(opt).attr('title','common/images/locale/'+languages[i]+'.png');
		$('#langDropDown').append(opt);
	}

	//Puts the flags in the right postion
	$("#langDropDown").msDropDown();
}