/*
* Copyright (c) 2013 Olmo Zavala
* Permission is hereby granted, free of charge, to any person obtaining a copy of 
* this software and associated documentation files (the "Software"), to deal in the 
* Software without restriction, including without limitation the rights to use, copy, 
* modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and 
* to permit persons to whom the Software is furnished to do so, subject to the following conditions: 
* The above copyright notice and this permission notice shall be included in all copies or substantial 
* portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
* INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR 
* PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE 
* FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, 
* ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. 
*/
package com.mapviewer.tools;

import com.mapviewer.business.GeneraSolicitudesWCS;
import com.mapviewer.business.LayerMenuManagerSingleton;
import com.mapviewer.exceptions.XMLFilesException;
import com.mapviewer.model.Layer;
import com.mapviewer.model.OptMenuStruct;
import com.mapviewer.model.menu.MenuEntry;
import com.mapviewer.model.menu.TreeNode;

import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * This class creates the drop down menu for the user to select layers, etc.
 *
 * @author Olmo Zavala Romero
 */
public class HtmlMenuBuilder {

	public static String baseLayerMenuOrientation = "";
	public static int numMainLayers = 0;
	public static String basePath = "";
	public static String[] vecLinks;

	/**
	 * Creates the drop down menus for the user
	 *
	 * @param {TreeNode} rootNode TreeNode User root menu
	 * @param {String} language String the user language
	 * @return String the htmlcode that creates the dropdown menus
	 */
	public static String createMainMenu(TreeNode rootNode, String language) {

		TreeNode currRoot = rootNode;
		int deepLevel = 1;
		String htmlCode = "<table id='t_mainMenu'>";
		String tabs = "\t\t\t\t\t";

		//if we want to display the horizontal menu type
		if (baseLayerMenuOrientation.toLowerCase().equals("horizontal")) {
			htmlCode += "<tr>";

			while (currRoot.getHasChilds()) {
				ArrayList<TreeNode> subMenus = currRoot.getChilds();
				htmlCode += "<td class='simpleSpace'>";
				htmlCode += "<select class='mainMenu' id='dropDownLevels" + deepLevel + "' name='dropDownLevels' onchange='MapViewersubmitForm();'>";
				for (int i = 0; i < subMenus.size(); i++) {
					MenuEntry menu = subMenus.get(i).getNode();
					htmlCode += "<option class='mainMenuOption' value='" + menu.getId() + "' ";

					if (subMenus.get(i).isSelected()) {
						currRoot = subMenus.get(i);
						htmlCode += "selected";
					}
					htmlCode += ">" + HtmlMenuBuilder.translateName(subMenus.get(i), language) + " </option>\n";
				}
				htmlCode += "</select></td>";
				deepLevel++;
			}

			htmlCode += "</tr>";

		} else {//this else is to display the vertical menu type. 
			while (currRoot.getHasChilds()) {
				ArrayList<TreeNode> subMenus = currRoot.getChilds();
				htmlCode += "\n" + tabs + "<tr><td class='simpleSpace'>\n";
				htmlCode += tabs + "\t<select class='mainMenu' id='dropDownLevels" + deepLevel + "' name='dropDownLevels' onchange='MapViewersubmitForm();'>\n";
				for (int i = 0; i < subMenus.size(); i++) {
					MenuEntry menu = subMenus.get(i).getNode();
					htmlCode += tabs + "\t\t<option class='mainMenuOption' value='" + menu.getId() + "' ";

					if (subMenus.get(i).isSelected()) {
						currRoot = subMenus.get(i);
						htmlCode += "selected";
					}
					htmlCode += ">" + HtmlMenuBuilder.translateName(subMenus.get(i), language) + " </option>\n";
				}
				htmlCode += tabs + "</select></td></tr>\n";
				deepLevel++;
			}
		}
		htmlCode += "</table>";
		return htmlCode;
	}

	/**
	 * It creates the html code for the optional layers recursively.
	 *
	 * @param {TreeNode} rootNode rootNode of the optional layers
	 * @param {String} language Language to be used on the menus Ex. {EN, SP, ...}
	 * @param {String} basePath Base path of the web page to link for images.
	 * @return {String} Html code of the optional menu.
	 */
	public static String createOptionalLayersMenu(TreeNode rootNode, String language, String basePath) {
		try {
			LayerMenuManagerSingleton menuSing = LayerMenuManagerSingleton.getInstance();
			//Updates the number of main layers and the base path of the website
			HtmlMenuBuilder.numMainLayers = menuSing.getBackgroundLayers().size();
			HtmlMenuBuilder.basePath = basePath;

			TreeNode currRoot = rootNode;
			String tabs = "\t\t";//Defines the default number of tabs for the html code
			OptMenuStruct menuParams = new OptMenuStruct();
			menuParams.setTabs(tabs);
			menuParams.setHtmltxt(tabs + "\n");
			tabs += "\t";

			menuParams = recursiveBuilder(currRoot, language, menuParams, null);

			String htmlCode = menuParams.getHtmltxt();
			htmlCode += "\n";
			return htmlCode;
		} catch (XMLFilesException ex) {
			Logger.getLogger(HtmlMenuBuilder.class.getName()).log(Level.SEVERE, null, ex);
			return "XMLException when building Optional menu";
		}
	}

	/**
	 * This function creates lists with different depths recursively
	 *
	 * @param {TreeNode} currentNode Current node on the tree to build the list
	 * @param {String} language Language to be used when creating the menu
	 * @param {OptMenuStruct} menuParamsCurrent
	 * @param {String} currMenuStr The current HTML code for the optional layers
	 * @return {OptMenuStruct} Menu structure containing the current html code
	 */
	public static OptMenuStruct recursiveBuilder(TreeNode currentNode, String language, OptMenuStruct menuParamsCurrent, String currMenuStr) {

		String finalHtml = menuParamsCurrent.getHtmltxt();
		String tabs = menuParamsCurrent.getTabs();
		int numUls = menuParamsCurrent.getNumUls();
		int numLayer = menuParamsCurrent.getNumLayers();

		OptMenuStruct menuParams = new OptMenuStruct(finalHtml, tabs, numLayer, numUls);

		//In this case we add the ul and call the function recursively
		if (currentNode.getHasChilds()) {

			ArrayList<TreeNode> subMenus = currentNode.getChilds();
			if (!currentNode.isRoot()) {
				MenuEntry menu = currentNode.getNode();
				finalHtml += tabs + "<li class=\"opt_lay_title\" id=\"optMenu" + numUls + "\"";
				finalHtml += tabs + " 	   onclick=\"toogleList('#optUl" + numUls + "')\">" + menu.getText(language) + "</li>\n";
				if (currMenuStr == null) {
					currMenuStr = menu.getId();
				} else {
					currMenuStr += "," + menu.getId();
				}
				finalHtml += tabs + "<ul class='opt_lay_list' id='optUl" + numUls + "'>\n";
			} else {
				finalHtml += tabs + "<ul class='opt_lay_list_root' id='optUl" + numUls + "'>\n";
			}

			for (int i = 0; i < subMenus.size(); i++) {
				//Updating num of Uls
				numUls++;
				menuParams.setNumUls(numUls);

				menuParams.setHtmltxt(finalHtml);
				menuParams.setTabs(tabs + "\t");
				menuParams = recursiveBuilder(subMenus.get(i), language, menuParams, currMenuStr);

				//Update current parameters
				numUls = menuParams.getNumUls();
				finalHtml = menuParams.getHtmltxt();
			}

			menuParams.setHtmltxt(menuParams.getHtmltxt() + tabs + "</ul>\n");

			return menuParams;
		} else {//In this case is a final checkbox
			//Increment layer number
			numLayer++;
			menuParams.setNumLayers(numLayer);

			MenuEntry menu = currentNode.getNode();
			String layername = menu.getLayername();
			if (currMenuStr == null) {
				currMenuStr = menu.getId();
			} else {
				currMenuStr += "," + menu.getId();
			}

			finalHtml += tabs + "<li class='opt_lay_menu' id='menuOpt" + numLayer + "'><p class='opt_lay_par'>\n";

			String oldtab = tabs;
			tabs += "\t";
			finalHtml += getOptionalCheckbox(numLayer, tabs, currentNode.isSelected(), currMenuStr)
					+ tabs + menu.getText(language) + "\n"
					+ tabs + "<span style='float: right'>\n";

			tabs += "\t";
			finalHtml += getMinusTransButton(numLayer, tabs)
					+ getPlusTransButton(numLayer, tabs)
					+ getKmlTxt(numLayer, tabs)
					+ getDownloadLink(layername, tabs)
					+ oldtab + "</span></p></li>\n";

			menuParams.setHtmltxt(finalHtml);
			return menuParams;
		}
	}

	/**
	 * Builds the HTML code for the checkbox of the current optional layer.
	 *
	 * @param layerNum {int} Number of the current optional layer
	 * @param tabs {String} String that contains the number of tabs being used
	 * @param selected {boolean} Indicates if the current layer is selected
	 * @param currMenuStr {String} Id of the corresponding menu of the layer
	 * @return
	 */
	public static String getOptionalCheckbox(int layerNum, String tabs, boolean selected, String currMenuStr) {
		int OPLayerNum = HtmlMenuBuilder.numMainLayers + layerNum;

		String finalHtml = tabs + "<input id=\"checkBox" + layerNum + "\" type=\"checkbox\" name=\"vectorLayersSelected\" \n";
		finalHtml += tabs + "\t value=\"" + currMenuStr + "\" onclick=\"manageOptionalLayers(layer" + OPLayerNum + ",this.checked); "
				+ "DisableTranspOptionalLayers(" + layerNum + ",'minusButtonOptional" + layerNum + "',"
				+ "'plusButtonOptional" + layerNum + "', 'checkBox" + layerNum + "' ); \"";

		if (selected) {
			finalHtml += " checked";
		}
		finalHtml += ">\n";
		return finalHtml;
	}

	public static String getDownloadLink(String layername, String tabs) {
		try {
			Layer selectedLayer = LayerMenuManagerSingleton.getInstance().getLayerByName(layername);

			String format = "";
			if (selectedLayer.isVectorLayer()) {
				format = "SHAPE-ZIP";
			} else {
				format = "image/geotiff";
			}

			String[][] solicitudWCS = GeneraSolicitudesWCS.wcsManager(selectedLayer, format, null);
			String finalHtml = tabs + "<A href=\"" + solicitudWCS[0][0] + "\">\n";
			tabs += "\t";
			finalHtml += tabs + "<img class=\"optionalImg\" src=\"" + HtmlMenuBuilder.basePath + "/common/images/Download/LayerDownload.png\" \n";
			finalHtml += tabs + "     onmouseover=\"owgis.utils.rollImage(this,'" + HtmlMenuBuilder.basePath + "/common/images/Download/LayerDownload_over.png' )\" \n";
			finalHtml += tabs + "     onmouseout=\"owgis.utils.rollImage(this,'" + HtmlMenuBuilder.basePath + "/common/images/Download/LayerDownload.png' )\" \n";
			finalHtml += tabs + "     onmousedown=\"owgis.utils.rollImage(this,'" + HtmlMenuBuilder.basePath + "/common/images/Download/LayerDownload_over_click.png' )\" \n";
//			finalHtml += tabs + "     onmouseup=\"owgis.utils.rollImage(this,'" + HtmlMenuBuilder.basePath + "/common/images/Download/LayerDownload_over.png' )\" \n";
			finalHtml += tabs + "     border=\"0\" /> </A> \n";

			return finalHtml;
		} catch (XMLFilesException ex) {
			Logger.getLogger(HtmlMenuBuilder.class.getName()).log(Level.SEVERE, null, ex);
		}
		return "ERROR building optional menu";
	}

	/**
	 * Builds the HTML code of the corresponding KML link of the current optional layer.
	 *
	 * @param layerNum {int} Number of the current optional layer
	 * @param tabs {String} String that contains the number of tabs being used
	 * @return
	 */
	public static String getKmlTxt(int layerNum, String tabs) {
		String finalHtml = tabs + "<A href=\"" + HtmlMenuBuilder.vecLinks[layerNum - 1] + "\">\n";
		tabs += "\t";
		finalHtml += tabs + "<img class=\"optionalImg\" src=\"" + HtmlMenuBuilder.basePath + "/common/images/kmz/kmz.png\" \n";
		finalHtml += tabs + "     onmouseover=\"owgis.utils.rollImage(this,'" + HtmlMenuBuilder.basePath + "/common/images/kmz/kmz_over.png' )\" \n";
		finalHtml += tabs + "     onmouseout=\"owgis.utils.rollImage(this,'" + HtmlMenuBuilder.basePath + "/common/images/kmz/kmz.png' )\" \n";
		finalHtml += tabs + "     onmousedown=\"owgis.utils.rollImage(this,'" + HtmlMenuBuilder.basePath + "/common/images/kmz/kmz_over_click.png' )\" \n";
//		finalHtml += tabs + "     onmouseup=\"owgis.utils.rollImage(this,'" + HtmlMenuBuilder.basePath + "/common/images/kmz/kmz_over.png' )\" \n";
		finalHtml += tabs + "     border=\"0\" alt=\"Descargar KMZ\" onload=\"CreateArraysOptional(" + layerNum + "); ";
		finalHtml += "DisableTranspOptionalLayers(" + layerNum + ",'minusButtonOptional" + layerNum + "',";
		finalHtml += "'plusButtonOptional" + layerNum + "', 'checkBox" + layerNum + "' ); \"></A> \n";

		return finalHtml;
	}

	/**
	 * Builds the HTML code of the '-' button of the current optional layer.
	 *
	 * @param layerNum {int} Number of the current optional layer
	 * @param tabs {String} String that contains the number of tabs being used
	 * @return
	 */
	public static String getMinusTransButton(int layerNum, String tabs) {
		int OPLayerNum = HtmlMenuBuilder.numMainLayers + layerNum;

		String finalHtml = "";
		finalHtml += tabs + "<button id=\"minusButtonOptional" + layerNum + "\" class=\"minusButtonSmall\" type=\"button\" disabled=\"disabled\" \n";
		finalHtml += tabs + "      onmouseover =\"changeColor(this,1);\" onmouseout =\"changeColor(this,0);\" \n";
		finalHtml += tabs + "      onmouseup =\"changeColor(this,1);\" onmousedown =\"changeColor(this,2);\" \n";
		finalHtml += tabs + "		onclick=\"changeTranspOptionalLayers(layer" + OPLayerNum + ", .20, " + layerNum + ",";
		finalHtml += "'minusButtonOptional" + layerNum + "','plusButtonOptional" + layerNum + "', 'checkBox" + layerNum + "' ) ;\">-</button>";
		//the reason it is a - (minus) and not html decimal encoding is becuase the mobile phone don't
		//understand some html encodings. 

		return finalHtml;
	}

	/**
	 * Builds the HTML code of the '+' button of the current optional layer.
	 *
	 * @param layerNum {int} Number of the current optional layer
	 * @param tabs {String} String that contains the number of tabs being used
	 * @return
	 */
	public static String getPlusTransButton(int layerNum, String tabs) {
		int OPLayerNum = HtmlMenuBuilder.numMainLayers + layerNum;

		String finalHtml = " ";
		finalHtml += "<button id=\"plusButtonOptional" + layerNum + "\" class=\"plusButtonSmall\" type=\"button\" disabled=\"disabled\" \n";
		finalHtml += tabs + "      onmouseover =\"changeColor(this,1);\" onmouseout =\"changeColor(this,0);\" \n";
		finalHtml += tabs + "      onmouseup =\"changeColor(this,1);\" onmousedown =\"changeColor(this,2);\" \n";
		finalHtml += tabs + "		onclick=\"changeTranspOptionalLayers(layer" + OPLayerNum + ", -.20, " + layerNum + ",";
		finalHtml += "'minusButtonOptional" + layerNum + "','plusButtonOptional" + layerNum + "', 'checkBox" + layerNum + "' ) ;\">+</button>\n";

		return finalHtml;
	}

	/**
	 * Obtains the text to be displayed from a TreeNode object
	 *
	 * @param {TreeNode} rootNode TreeNode Menu what we want to obtain its text
	 * @param {String} language String language
	 * @return
	 */
	public static String translateName(TreeNode rootNode, String language) {
		String txt = rootNode.getNode().getText(language);
		//If the node doesn't have the requiered language then we
		// return it in english
		if (txt == null) {
			txt = rootNode.getNode().getText("EN");
		}
		if (txt == null) {
			//TODO Send an exception that the language 'EN' is not found
			System.out.println("ERROR: the language EN is not defined for node:" + rootNode.getNode().getId() + " in translateName (HtmlMenuBuilder)");
		}
		return txt;
	}
	
	/**
	 * Creates and fills a combobox (dropdown) for selection of locale on the viewer
	 *
	 * @param {String} availableLanguages The list of available locales specified in the properties
	 * @param {String} defaultLanguage The default locale specified in the properties file
	 * @param {String} language String locale currently used in the viewer
	 * @return 
	 */
	public static String createLanguageComboBox(String availableLanguages, String defaultLanguage, String language){

		String 	htmlCode = "<select class='languageDropDownSel' id='langDropDown' onchange='MapViewersubmitForm();'>";

		String[] avLangs = availableLanguages.split(";");
				for (String lang: avLangs) {
					htmlCode += "<option class='mainMenuOption' value='" + lang + "' ";
					if (lang.equals(language)) {
//						currRoot = subMenus.get(i);
						htmlCode += "selected";
					}
					htmlCode += " title='"+ HtmlMenuBuilder.basePath + "/common/images/locale/" +lang +".png' >" + lang+ " </option>\n";
				}
				htmlCode += "</select>";
		return htmlCode;
	}
}
