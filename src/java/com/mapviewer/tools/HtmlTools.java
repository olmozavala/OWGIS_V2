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

import com.mapviewer.model.menu.TreeNode;
import java.util.StringTokenizer;

/**
 * This class is in charge of the menus of the application. It has two types of menus
 * rootMenu that contains a tree with the menus of the layers. VectorMenuOptions is a tree
 * with only one level that contains all the options of the vector layers.
 *
 * @author Olmo Zavala Romero
 */
public class HtmlTools {

	public static String INIT_JAVA_SCRIPT = "<script type='text/javascript'>";//static string for javascript
	public static String END_JAVA_SCRIPT = "</script>";//end javascript
	public static String OP_RELOAD_ATTEMPS = "OpenLayers.IMAGE_RELOAD_ATTEMPTS=";//indicates the reload trys of openlayers
	public static String OP_DOTS_INCH = "OpenLayers.DOTS_PER_INCH=";//it indicates how many dots per inch in the openlayers
	public static boolean RASTER_LAYERS = true;
	public static boolean VECTOR_LAYERS = false;

	/**
	 * Class constructor, initializes the default menu.
	 */
	public HtmlTools() {
	}

	public static TreeNode unselectAllMenus(TreeNode actualRoot) {

		TreeNode newTree = actualRoot;

		if (newTree.getHasChilds()) {
			for (int i = 0; i < newTree.getChilds().size(); i++) {
				TreeNode child = newTree.getChilds().get(i);
				child = unselectAllMenus(child);
			}
		} else {
			newTree.setSelected(false);
		}

		return newTree;
	}

	/**
	 * Updates the list of vector layers that the user selected.
	 *
	 * @param {String} selectedValues int[] with all the options the user selected from
	 * the checkbox of optional layers.
	 * @param {TreeNode} actualRoot the root tree before the change is made on the user
	 * menu.
	 * @return TreeNode node with the modified options.
	 */
	public static TreeNode actualizaOpcionesVectoriales(String[] selectedValues, TreeNode actualRoot) throws Exception {

		TreeNode updatedMenu = actualRoot;
		boolean found = false;

		if(selectedValues.length > 0){
			updatedMenu = unselectAllMenus(updatedMenu);
		}

		for (int i = 0; i < selectedValues.length; i++) {
			String[] currenMenu = StringAndNumbers.strArrayFromStringColon(selectedValues[i]);
			actualRoot = updatedMenu;//move to root again

			for (int k = 0; k < currenMenu.length; k++) {
				found = false;
                
                if( actualRoot.getChilds() != null){
                    int len = actualRoot.getChilds().size();
                    for (int j = 0; j < len ; j++) {
                        //check to see if selected value if of the node currently viewing
                        if (currenMenu[k].equals(actualRoot.getChilds().get(j).getNode().getId())) {
                            //Check childs
                            if (actualRoot.getChilds().get(j).getHasChilds()) {
                                actualRoot = actualRoot.getChilds().get(j);
                                found = true;
                                break;
                            } else {
                                actualRoot.getChilds().get(j).setSelected(true);
                                found = true;
                                break;
                            }
                        }else if( actualRoot.getChilds().get(j).getChilds() != null ){
                            for (int jj = 0; jj < actualRoot.getChilds().get(j).getChilds().size(); jj++) {
                                if (currenMenu[k].equals(actualRoot.getChilds().get(j).getChilds().get(jj).getNode().getId())) {
                                    actualRoot.getChilds().get(j).getChilds().get(jj).setSelected(true);
                                    found = true;
                                    break;
                                }
                            }
                        }
                    }
                    if (!found) {
                        throw new Exception("Exception The menu: " + StringAndNumbers.arrregloSeparadoPorComas(currenMenu) + " was not found on the menu tree");
                    }
                } else {
                    throw new Exception("Exception The menu: " + StringAndNumbers.arrregloSeparadoPorComas(currenMenu) + " was not found on the menu tree!!!");
                }
			}
		}
		return updatedMenu;
	}

	/**
	 * Update the user menu for the base layers.
	 *
	 * @param selectedValues int[] it contains the layers the user selected from the
	 * dropdown menu
	 * @param actualRoot root node of user before modification.
	 * @return TreeNode root node of user after modification.
	 */
	public static TreeNode actualizaMenu(String[] selectedValues, TreeNode actualRoot) throws Exception {
		//we will go throught the selection of the user until it finds the modified level and updates the root

		TreeNode menuActualizado = actualRoot;
		boolean terminar = false;
		int indiceSeleccionado = 0;
		for (int i = 0; i < selectedValues.length; i++) {
			for (int j = 0; j < actualRoot.getChilds().size(); j++) {
				//check to see if seelcted value if of the node currently viewing
				if (selectedValues[i].equals(actualRoot.getChilds().get(j).getNode().getId())) {
					//check to see a modification
					if (actualRoot.getChilds().get(j).isSelected()) {//check childs
						indiceSeleccionado = j;
					} else {//if not seelcted one
						//just modify the ones in the same level and exit
						actualRoot.getChilds().get(j).setSelected(true);//if not seelcted then update
						terminar = true;//boolean set to true to exit
					}
				} else {//put node as nto selected
					actualRoot.getChilds().get(j).setSelected(false);
				}
			}
			if (terminar)//means we already modified the level we were looking for. 
			{
				return menuActualizado;
			} else//if not finished then go to next level
			{
				if (indiceSeleccionado > actualRoot.getChilds().size()) {
					String menuText = "";
					for (int k = 0; k < selectedValues.length; k++) {
						menuText += selectedValues[k] + ",";
					}
					throw new Exception("Exception The menu: " + menuText + " was not found on the menu tree");
				}
				actualRoot = actualRoot.getChilds().get(indiceSeleccionado);
			}
		}
		return menuActualizado;
	}

	/**
	 * It obtains the corresponding language from the browser EN, or ES or something else
	 *
	 * @param browserLanguage The browser accepted-language string something like
	 * "en-us,en,q=0.5"
	 * @return String the Accepted language (EN, ES)
	 */
	public static String getLanguage(String browserLanguage) {
		StringTokenizer st = new StringTokenizer(browserLanguage, ",;");
		String language = ((String) st.nextElement()).substring(0, 2).toUpperCase();
		return language;
	}
}