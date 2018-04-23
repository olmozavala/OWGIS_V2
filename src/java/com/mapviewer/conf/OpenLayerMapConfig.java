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
package com.mapviewer.conf;

import com.mapviewer.tools.FileManager;
import com.mapviewer.tools.StringAndNumbers;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Date;
import java.util.Enumeration;
import java.util.Properties;

/**
 * This SINGLETON class represent the OpenLayer configuration of the map. For
 * example, it contains the maximun and minimum resolution of the map, the
 * default center and zoom and the boundary box of the map.
 *
 * @author Olmo Zavala Romero
 */
public class OpenLayerMapConfig {
	
	private String center = null;
	private String zoom = null;
	private int zoomLevels;
	private double zoomFactor;
	private double maxResolution;//Controls the maximum resolution of the map
	private String restrictedExtent = "-180.0,-90.0,180.0,90.0";//Restricts the extent of the map
	private String refreshLayers;
	Date lastUpdate;//Indicates when was the last update of the properties file

	//This contains the properties used on JavaScript, which are not the same
	//as the attributes. 
	private Properties prop;
	private String mapProj;
	private static OpenLayerMapConfig instance;//Singleton
	
	protected OpenLayerMapConfig() {
	}
	
	public static synchronized OpenLayerMapConfig getInstance() {
		if (instance == null) {//Only the first time we initialize
			instance = new OpenLayerMapConfig();
		}
		return instance;
	}
	
	/**
	 * This function creates a JSON text with the information of each of the
	 * variables. This text is used by JSP files
	 * @return json string
	 */
	public String toJSONObject() {
		String jsonText = "{";
		
		Enumeration e = prop.propertyNames();
		while (e.hasMoreElements()) {
			String key = (String) e.nextElement();
			String value = prop.getProperty(key);
			if(StringAndNumbers.isNumeric(value)){
				jsonText += "'"+key+"':"+ prop.getProperty(key)+",";
			} else{
				jsonText += "'"+key+"':'"+ prop.getProperty(key)+"',";
			}
		}
		jsonText = jsonText.substring(0, jsonText.length()-1);
		jsonText +="}";
		return jsonText;
	}

	/**
	 * This function is used to update one of the properties externally. Most
	 * of the properties in this class should remain the same at all times because they are 
	 * the same for all users.
	 * @param key
	 * @param value 
	 */
	public void updateProperty(String key, String value){
		prop.setProperty(key, value);
	}

	/**
	 * Reads an specific property
	 * @param key 
	 */
	public void readProperty(String key){
		prop.getProperty(key);
	}
	
	/**
	 * Reads the configuration parameters from the properties file 
	 * @param stream 
	 */
	public void updateProperties(String filePath) throws FileNotFoundException {
		
		Date currLastUpdate = FileManager.lastModification(filePath);

		//If the properties file has been modified we update the configuration properties
		synchronized (this) {
			if ((lastUpdate == null) || (lastUpdate.getTime() < currLastUpdate.getTime())) {
				
				FileInputStream stream = new FileInputStream(new File(filePath));
				
				lastUpdate = currLastUpdate;
				try {
					//If we are updating the file then we save the previous map projection
					String mapProjection = "EPSG:4326";
					if(prop != null){
						mapProjection = prop.getProperty("mapProjection");
					}
					prop = new Properties();
					prop.load(stream);//Loads all the properties from the Properties file
					//This property gets initialized when reading the XML files or
					// by directly in JavaScript
					prop.setProperty("mapProjection", mapProjection);
					initializeVariables();
				} catch (IOException ex) {
					System.out.println("EXCEPTION can't load the properties file" + ex.getMessage());
				}
			}
		}
	}
	
	/**
	 * Search a key inside the properties file and returns its value
	 *
	 * @param key
	 * @return
	 */
	public String getProperty(String key) {
		return prop.getProperty(key);
	}
	
	/**
	 * Initializes the required variables for the display of the map
	 */
	public void initializeVariables() {
		
        center = getProperty("mapcenter");
		zoom = getProperty("zoom");
        zoomLevels = Integer.parseInt(getProperty("zoomLevels"));
		zoomFactor = Float.parseFloat(getProperty("zoomFactor"));
		maxResolution = Float.parseFloat(getProperty("maxResolution"));
		restrictedExtent = getProperty("maxExtent");
        mapProj=getProperty("mapProjection");
		refreshLayers=getProperty("refreshLayers");
	}
	
	public String getCenter() {
		return center;
	}
	
	public void setCenter(String center) {
		this.center = center;
	}
	
	public String getZoom() {
		return zoom;
	}
	
	public void setZoom(String zoom) {
		this.zoom = zoom;
	}
	
	public double getMaxResolution() {
		return maxResolution;
	}
	
	public void setMaxResolution(double maxResolution) {
		this.maxResolution = maxResolution;
	}
	
	public String getRestrictedExtent() {
		return restrictedExtent;
	}
	public void setRestrictedExtent(String restrictedExtent) {
		this.restrictedExtent = restrictedExtent;
	}
	
	public String getMapProjection() {
		return mapProj;
	}
	
	public void setMapProjection(String mapProj) {
		this.mapProj = mapProj;
	}
	
	public int getZoomLevels() {
		return zoomLevels;
	}
	
	public void setZoomLevels(int zoomLevels) {
		this.zoomLevels = zoomLevels;
	}
	
	public double getZoomFactor() {
		return zoomFactor;
	}
	
	public void setZoomFactor(double zoomFactor) {
		this.zoomFactor = zoomFactor;
	}

	public String getRefreshLayers() {
		return refreshLayers;
	}

	public void setRefreshLayers(String refreshLayers) {
		this.refreshLayers = refreshLayers;
	}
}
