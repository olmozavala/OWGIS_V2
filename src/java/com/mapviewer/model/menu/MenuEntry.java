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
			System.out.println("\t Language: "+ (String)keys[i]);
			System.out.println("\t Text: "+ texts.get((String)keys[i]));
		}
	}
    
    /**
     *@param {String} language
     *@param {String} text
     */
	public void addText(String language, String text){
		texts.put(language, text);
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