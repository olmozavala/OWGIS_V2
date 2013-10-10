package com.mapviewer.model;

/**
 * This class contains static properties of the paths of the proyect. For example
 * it contains the path where the images of the proyect are stored.
 * @author Olmo Zavala Romero
 */
public class Globals {
    
    //JS
    public static String JS_PATH = "/common/JS/";
    //images
    public static String IMG_PATH="/common/images/";
    //CSS
    public static String CSS_PATH="/common/CSS/";
    //fLASH
    public static String FL_PATH="common/flash/";
    //Pages path    
    public static String PAGES_PATH="/Pages/";

	public String getImagesPath(){
		return IMG_PATH;
	}
			
}

