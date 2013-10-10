
package com.mapviewer.model;

/**
 * This class is just a structure used for building the optional menus recursively.
 * It contains the required information when constructing each menu.
 * @author Olmo Zavala Romero
 */
public class OptMenuStruct {
	String htmltxt;
	String tabs;
	int numLayers;
	int numUls;

	public OptMenuStruct(String htmltxt, String tabs, int numLayers, int numUls) {
		this.htmltxt = htmltxt;
		this.tabs = tabs;
		this.numLayers = numLayers;
		this.numUls = numUls;
	}

	
	public OptMenuStruct() {
		htmltxt = "";
		numUls = 0;
		numLayers = 0;
		tabs = "";
	}

	public String getTabs() {
		return tabs;
	}

	public void setTabs(String tabs) {
		this.tabs = tabs;
	}

	public String getHtmltxt() {
		return htmltxt;
	}

	public void setHtmltxt(String htmltxt) {
		this.htmltxt = htmltxt;
	}

	public int getNumLayers() {
		return numLayers;
	}

	public void setNumLayers(int numLayers) {
		this.numLayers = numLayers;
	}

	public int getNumUls() {
		return numUls;
	}

	public void setNumUls(int numUls) {
		this.numUls = numUls;
	}
}
