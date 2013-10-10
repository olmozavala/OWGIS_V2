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

	public static String MAIN_PAGE = Globals.PAGES_PATH + "MapViewer.jsp";//Principal page of the atlas

        public static String MOBILE_PAGE = Globals.PAGES_PATH + "Mobile.jsp";//Mobile page
        
	//Error pages
	public static String ERROR_PAGE = Globals.PAGES_PATH + "Error/ErrorPage.jsp";//Error page of the atlas
	public static String MAIN_SERVLET = "/mapviewer";//URL to open the principal servlet

	public String getAcdmPage() {
		return MAIN_PAGE;
	}

	public String getErrorPage() {
		return ERROR_PAGE;
	}

	public String getAcdmServlet() {
		return MAIN_SERVLET;
	}

}
