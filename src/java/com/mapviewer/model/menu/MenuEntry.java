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
package com.mapviewer.model.menu;

import java.util.HashMap;
import java.util.Map;

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
/**
 * This class represents the entries of the menu of the users. Each object of this type 
 * contains a a chain with the title of the menu and an int with the id of the menu.
 * @author Olmo Zavala Romero
 */
public class MenuEntry {

	private Map<String,String> texts;
	private String id;// Id of the menu
	private String layername;// layer value

	/**
	 * Initializes the menu entry. At least it should have a text for one
	 * language.
	 * @param id
	 * @param language
	 * @param value 
	 */
	public MenuEntry(String id, String language, String text) {
		texts = new HashMap();
		texts.put(language, text);
		this.id = id;
	}

	public void print(){
		System.out.println("ID: " + id);
		Object[] keys = texts.keySet().toArray();
		for (int i = 0; i < texts.size(); i++) {
			System.out.println("\t Language: "+ keys[i]);
			System.out.println("\t Text: "+ texts.get(keys[i]));
		}
	}
    
    /**
     *@param {String} language
     *@param {String} text
     */
	public void addText(String language, String text){
		texts.put(language, text);
	}

   /**
     *@param details
     */
	public void addAll(Map<String, String> details){
		texts.putAll(details);
	}

	public String getText(String language){
		return texts.get(language);
	}
	
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getLayername() {
		return layername;
	}

	public void setLayername(String layername) {
		this.layername = layername;
	}

}