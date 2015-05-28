/* 
 * This JavaScript file manages the languages in the interface.
 * It is mainly in charge of filling up the dropdown list with
 * the languages.
 */
goog.provide('owgis.languages');

/**
 * This function updates the language from the dropdown menu and refreshes the website.  
 * @param {type} locale
 * @returns {undefined}
 */
owgis.languages.setLocale = function (locale){
	$("#_locale").val(locale);
	MapViewersubmitForm();
}

/**
 * This function is used to set the selected locale to a parameter _locale
 * to use it in the MapViewerServlet
 */
owgis.languages.buildselection = function buildDropDownLanguages(){
	//Obtains the available languages
	var languages = mapConfig.availableLanguages.split(";");
	var currLang = _curr_language;
	//Iterates ver all the available languages
	for(var i = 0; i < languages.length; i++){
		//Creates a new option
		//Checks if the language is the one selected
		var img = $("<img>");
		img.attr('src','common/images/locale/'+languages[i]+'.png');
		var langText =" "+languages[i]+" ";


		if( languages[i] === currLang){
			$("#selectedLanguage").html("");//Clear current selection
			$("#selectedLanguage").append(img);
			$("#selectedLanguage").append(langText);
			$("#selectedLanguage").append("<span class='caret'></span>");
		}else{
			var li = $("<li>");
			var link = $("<a href='#' onclick='owgis.languages.setLocale(\""+languages[i]+"\")'></a>");
			link.append(img);
			link.append(langText);
			li.append(link);
			$("#langDropDown").append(li);
		}
		//Adds an image into the dropdown list
	}
}