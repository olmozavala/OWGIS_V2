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
 * This class contains the names of the files in javascript,
 * the images that are being used, page names, CSS files and 
 * is useful so we only have one place to change this names. 
 * The names can be accessed directly by EL on the jsp pages. 
 * @author Olmo Zavala Romero
 */
public class PagesNames {

	public PagesNames() {
	}

	public static String MAIN_PAGE = Globals.PAGES_PATH +"MapViewer.jsp";//Principal page of the atlas

        public static String MOBILE_PAGE = Globals.PAGES_PATH + "Mobile.jsp";//Mobile page
        
	//Error pages
	public static String ERROR_PAGE = Globals.PAGES_PATH + "Error/ErrorPage.jsp";//Error page of the atlas
	public static String MAIN_SERVLET = "/mapviewer";//URL to open the principal servlet

	public String getMainPageName() {
		return MAIN_PAGE;
	}

	public String getErrorPage() {
		return ERROR_PAGE;
	}

	public String getAcdmServlet() {
		return MAIN_SERVLET;
	}

}
