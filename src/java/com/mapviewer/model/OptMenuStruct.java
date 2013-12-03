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
