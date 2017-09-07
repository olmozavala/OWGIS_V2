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
package com.mapviewer.business;

import com.mapviewer.conf.OpenLayerMapConfig;
import com.mapviewer.exceptions.XMLFilesException;
import com.mapviewer.model.Layer;
import com.mapviewer.model.menu.MenuEntry;
import com.mapviewer.tools.ConvertionTools;
import com.mapviewer.tools.HtmlTools;
import com.mapviewer.tools.StringAndNumbers;
import java.util.ArrayList;

/**
 * This class is in charge of configuring all the visualization for OpenLayers Its the
 * main class of the MapViewer and its in charge of administrating all the layers coming
 * from the different servers.
 *
 * @author Olmo Zavala Romero
 */
public class OpenLayersManager {

	OpenLayerMapConfig mapConfig;
	LayerMenuManagerSingleton layersManager;
	String language;

	/**
	 * Class constructor, it defines the file that will store the layers info
	 */
	public OpenLayersManager() throws XMLFilesException {
		this.layersManager = LayerMenuManagerSingleton.getInstance();
		mapConfig = OpenLayerMapConfig.getInstance();
	}

	/**
	 * Obtains the index of the list of vector layers or raster depending on the
	 * selection.
	 *
	 * @param {MenuEntry[]} menuEntry User selection array
	 * @param {boolean} layerType layer type checking it can be HtmlTools.RASTER_LAYERS
	 * @return int[] we return an array with the index of the layers.
	 */
	public int[] obtainArrayIndexOfLayers(MenuEntry[] menuEntry) {
		int index = 0;
		if (menuEntry.length == 0) {//if not entry return null
			return null;
		}

		ArrayList<Integer> resultado = new ArrayList();//temporal list to hold values
		Layer tempLayer = null;//temp layer used to check 
		//loop alentries until find the one selected
		for (index = 0; index < layersManager.getMainLayers().size(); index++) {
			tempLayer = layersManager.getMainLayers().get(index);//get index of this layer
			if (tempLayer.isThisLayer(menuEntry)) {//if this is the layer we are looking for
				resultado.add(Integer.valueOf(index));//add layer to list of index
				break;//if found then break from for loop. 
			}
		}

		//convert into array of ints and then return. 
		return ConvertionTools.convertObjectArrayToIntArray(resultado.toArray());
	}

	public int[] obtainIndexForOptionalLayers(String[] menuSelected) {

		if (menuSelected.length == 0) {//if not entry return null
			return null;
		}

		ArrayList<Integer> result = new ArrayList();//temporal list to hold values
		Layer tempLayer = null;
		for (int index = 0; index < layersManager.getVectorLayers().size(); index++) {//loop each vector layer
			tempLayer = layersManager.getVectorLayers().get(index);//temp variable 

			//each tree value has to be send separately. 
			//becuase the vector layers are all on one level of the tree
			for (int menuNumber = 0; menuNumber < menuSelected.length; menuNumber++) {
				if (tempLayer.isThisLayer(StringAndNumbers.strArrayFromStringColon(menuSelected[menuNumber]))) {
					//check to see if the layer is selected
					result.add(Integer.valueOf(index));
					break;
				}
			}
		}
		//convert into array of ints and then return. 
		return ConvertionTools.convertObjectArrayToIntArray(result.toArray());
	}


	/**
	 * Main method in charge of creating the OpenLayers dynamic configuration
	 *
	 * @param {int []} idsBaseLayers Arreglo que contiene los ids de las capas principales
	 * que se muestran/array with ids of the main layers
	 * @param {int[]} extraLayers Arreglo de las capas extras o vectoriales/array of
	 * vector layers
	 * @return String Regresa toda la configuracion de OpenLayers como una cadena/returns
	 * the configuration in a string form.
	 */
	public String createOpenLayConfig(int[] idsBaseLayers, int[] extraLayers, String language) {
		this.language = language;//Sets the language of the configuration
		if (extraLayers == null)//Evitamos que extraLayers sea nulo
		{
			extraLayers = new int[0];
		}
		if (idsBaseLayers == null)//Evitamos que baseLayers sea nulo
		{
			idsBaseLayers = new int[0];
		}
		String result = "";//Esta variable contiene toda la configuracion de OpenLayers

		result += this.agregaURLparaTraerDatos(idsBaseLayers[0]);
		result += "\nfunction addLayers(){\n";
		result += this.createInitFunction(idsBaseLayers, extraLayers) + "\n";//Esta funcion crea la configuracion central de OpenLayers
		result += "\t if(netcdf){ \n\t map.addLayer(transectLayer); \n "
				+ ""
				+ "} \n\n";
		result += "} ";
		return result;//Regresamos la configuracion
	}

	/**
	 * Generates the text of the javascript function Init() Genera el texto en javaScript
	 * de la funcion Init() que utiliza OpenLayers
	 *
	 * @param idsBaseLayers int[] Arreglo con los identificadores de las capas raster
	 * seleccionadas
	 * @param extraLayers int[] Arreglo de capas extras o vectoriales
	 * @return String Cadena que contiene al configuracion de OpenLayers en la funcion
	 * init()
	 */
	private String createInitFunction(int[] idsBaseLayers, int[] extraLayers) {
		String initFunction = "\n";

		//Configures each layer using OpenLayers 3
		initFunction += this.createSeparateLayerScript(idsBaseLayers, extraLayers);
		// Relates the singleClick event with the request of punctualData ("identify feature")
		initFunction += "\t singleClickKey = map.on('singleclick', punctualData);";

		return initFunction;
	}

	/**
	 * This function creates the url to bring the data when the user clicks somewhere on
	 * the map.
	 *
	 * @param {int} baseLayer
	 *
	 */
	private String agregaURLparaTraerDatos(int baseLayer) {
		String layersScript = "";
		Layer actualLayer = null;
		int layerCount = 0;
		layersScript = "\n\tfunction punctualData(evt) {\n";//Se agrega al evento click del div map la siguiente funcion
		layersScript+= 
				"\t\t if(mobile){owgis.mobile.closePanels();"
				+ "\t\t\t owgis.interf.loadingatmap(true);}\n" +
				"\t\t var coordinate = evt.coordinate;\n" +
                "\t\t var currBBOX =  ol3view.calculateExtent(map.getSize());\n"+
				"\t\t $('#popup').hide();\n" +
				"\t\t currPopupText = '<b>Lon: </b>'+coordinate[0].toFixed(2)+ ' <b>Lat: </b>'+coordinate[1].toFixed(2)+'<br>'\n" +
				"\t\t ol_popup.setPosition(coordinate);\n";

		//En este for agrega las capas que son de fondo
		for (int i = 0; i < layersManager.getBackgroundLayers().size(); i++) {
			actualLayer = layersManager.getBackgroundLayers().get(i);
			if (actualLayer.getFeatureInfoLayer() != null) {
				layersScript += generateURLhelper(actualLayer, layerCount);
			}//If layer featureInfo not null
			layerCount++;
		}
		//Se agrega el URL de la capa base
		actualLayer = layersManager.getMainLayers().get(baseLayer);
		if (actualLayer.getFeatureInfoLayer() != null) {
			layersScript += generateURLhelper(actualLayer, layerCount);
		}//If layer  featureInfo  not null

		layerCount++;//Increment current layer (for  javascript, 'layer0' or 'layer1'....

		for (int i = 0; i < layersManager.getVectorLayers().size(); i++) {
			actualLayer = layersManager.getVectorLayers().get(i);
			if (actualLayer.getFeatureInfoLayer() != null) {
				layersScript += generateURLhelper(actualLayer, layerCount);
			}//If layer  featureInfo not null
			layerCount++;
		}

		layersScript += //"\t\tMapViewersubmitForm();\n" +
				"\t}\n";
		return layersScript;
	}

	/**
	 * Creates the url script for one layer. It is used to aquire the specific data of one
	 * layer. Its when the user clicks on the map
	 *
	 * @param actualLayer Layer Object of the layer we are working on.
	 * @param layerNumber int Consecutive number of the layer we are generating the url
	 * @param mainLayer boolean Indicates if the layer is the main layer or not.
	 * @return
	 */
//	private String generateURLhelper(Layer actualLayer, int ajaxCallNumber, int layerNumber) {
	private String generateURLhelper(Layer actualLayer, int layerNumber) {

		String URLscript = "";


		URLscript += "\t\tif(typeof(layer" + layerNumber + ") !== 'undefined'){\n";
		URLscript += "\t\t\tif(layer" + layerNumber + ".getVisible()){\n";
		URLscript += "\t\t\t\towgis.features.punctual.getVerticalProfile(evt,"+layerNumber+");\n";//Se agrega al evento click del div map la siguiente funcion
		URLscript += "\t\t\t\towgis.features.punctual.getTimeSeries(evt,"+layerNumber+");\n";//Se agrega al evento click del div map la siguiente funcion
		URLscript += "\t\t\t\tvar url" + layerNumber + " = basepath+\"/redirect?server=" + actualLayer.getServer() + "&";

		URLscript += "LAYERS=" + actualLayer.getFeatureInfoLayer() + "&";
		URLscript += "WIDTH=\"+ map.getSize()[0] +\"&"
				+ "HEIGHT=\"+ map.getSize()[1] +\"&"
				+ "SRS=\"+ _map_projection+ \"&"
				+ "FORMAT=" + actualLayer.getFormat() + "&"
				+ "VERSION=1.1.1&"
				+ "REQUEST=GetFeatureInfo&"
				+ "EXCEPTIONS=application/vnd.ogc.se_xml&"
				+ "x=\"+ Math.floor(evt.pixel[0]) +\"&"
				+ "y=\"+ Math.floor(evt.pixel[1]) +\"&"
				+ "BBOX=\"+ currBBOX +\"&"
				+ "SERVICE=WMS&";

		if (!actualLayer.getCql().equals("")) {
			URLscript += "CQL_FILTER=" + actualLayer.getCql() + "&";
		}
                
		//In this case we also need the time information
		if (actualLayer.isncWMS()) {
			// The two variables: elevation and startDate have to match
			// javascript variable names. 
//			URLscript += "ELEVATION=\"+layerDetails.zaxis.values[owgis.ncwms.zaxis.globcounter]+\"&" 
			URLscript += "\"+owgis.ncwms.zaxis.addElevationText()+\""
					+ "TIME=\"+owgis.ncwms.calendars.getCurrentDate(true, owgis.constants.startcal, true)+\"&"
					+ "BOTHTIMES=\"+owgis.ncwms.calendars.getUserSelectedTimeFrame()+\"&"
					+ "INFO_FORMAT=text/xml&"
                                        + "STYLES=" + actualLayer.getStyle() + "/" + actualLayer.getPalette() +"&"
					+ "NETCDF=true&";
		} else {
			URLscript += "STYLES=" + actualLayer.getStyle() + "&" +
                                      "INFO_FORMAT=text/html&"
					+ "NETCDF=false&";
		}

		URLscript += "QUERY_LAYERS=" + actualLayer.getFeatureInfoLayer() + "&";
		URLscript += "FEATURE_COUNT=50\";\n";
		URLscript +=  "\t\t\t\t var asynchronous" + layerNumber + " = new Asynchronous();\n"
				+ "\t\t\t\t asynchronous" + layerNumber + ".complete = AsyncPunctualData;\n"
				+ "\t\t\t\t asynchronous" + layerNumber + ".call(url" + layerNumber + ");\n"
				+ "\t\t\t}\n"
				+ "\t\t}\n";

		return URLscript;
	}

	/**
	 * It helps to create each layer in a open layer script
	 *
	 * @param actualLayer
	 * @param layerCount
	 * @param visible Boolean indicates if the layer should be visible
	 * @return
	 */
	private String layerHelper(Layer actualLayer, int layerCount, boolean visible) {
		String layersScript = "";
		//If they layer is a jsonp (dynamic vector) layer, we do not add it to the map
		if(!actualLayer.isJsonp()){
			if(actualLayer.isTiled()){
				layersScript += "\tlayer" + layerCount + " = new ol.layer.Tile({\n";
				layersScript += "\t\t source: new ol.source.TileWMS({\n";
			}else{
				layersScript += "\tlayer" + layerCount + " = new ol.layer.Image({\n";
				layersScript += "\t\t source: new ol.source.ImageWMS({\n";
				layersScript += "\t\t extent: [\n" + actualLayer.getBbox().toString() +"],";
			}
			layersScript += "\t\t url: '"+ actualLayer.getServer() + "',\n"
//				+ "\t\t crossOrigin: 'null',\n"
					+ "\t\t params: {LAYERS: '"+ actualLayer.getName() + "'";
			
			if (actualLayer.isncWMS()) {
				if (actualLayer.getMaxColor() != -1 && actualLayer.getMinColor() != -1) {
					layersScript += ", colorscalerange: '" + actualLayer.getMinColor() + "," + actualLayer.getMaxColor() + "'";
				}
				layersScript += ", ncwms:'true'";
			}

			//These are some specific configurations for ncWMS 2.0 >
			if (actualLayer.isNcwmstwo()) {
                            layersScript += ", ncwmstwo:'true', bgcolor:'transparent' ";                        
			}
                        
                        
                        if (actualLayer.isNcwmstwo() || actualLayer.isncWMS()){
                            layersScript += ", STYLES: '" + actualLayer.getStyle() + "/" +actualLayer.getPalette()+"'";                       
                        }else{
                            layersScript += ", STYLES: '" + actualLayer.getStyle() + "'";
                        }
                        
                        if (actualLayer.getBelowMinColor() != null) {
                            layersScript += ", BELOWMINCOLOR: '" + actualLayer.getBelowMinColor() + "'";
                        }
			
			
			layersScript += ", SRS: _map_projection";
			
			layersScript += "}\n\t\t\t})\n";
			layersScript += "\t\t});\n";
			
			//In this case the layer has some CQL that we need to add in its configuration
			if (!actualLayer.getCql().equals("")) {
				layersScript += "\tlayer" + layerCount + ".getSource().getParams().CQL_FILTER = \"" + actualLayer.getCql() + "\";\n";
			}
			
			if (!visible) {
				layersScript += "\tlayer" + layerCount + ".setVisible(false);\n";//we make the layer not visible.
			}
			layersScript += "\tmap.addLayer(layer" + layerCount + ");\n";
//			layersScript += "\tlayer"+layerCount+".getSource().on('change'))\n";
		}else{
			layersScript += "\t owgis.vector.manager.requestJSONLayer("+actualLayer.getLayerDetails()+","+layerCount+","+visible+");\n";
		}
		return layersScript;
	}
	
	/**
	 * Creates an OpenStreetMapLayer
	 * @param currentConf String Is the current configuration of OpenLayers
	 * @param actualLayer int Is the number of the current layer
	 */
	private String addOpenStreetMapLayer(String currentConf, int actualLayer){
		currentConf += "\tlayer"+actualLayer+" =  new ol.layer.Tile({\n "+
				" \t\t source: new ol.source.OSM()});\n";
		currentConf += "\tmap.addLayer(layer" + actualLayer + ");\n";
		return currentConf;
	}
	
	/**
	 * Creates a MapQuest OSM map
	 * @param currentConf String Is the current configuration of OpenLayers
	 * @param actualLayer int Is the number of the current layer
	 */
	private String addMapQuest(String currentConf, int actualLayer, String layerType){
		String layerMapQuest = "\tlayer"+actualLayer+" =  new ol.layer.Tile({\n "+
				" \t\t source: new ol.source.MapQuest({\n";
		switch(layerType){
			case "mapquesta":
				layerMapQuest += "\t\t\tlayer: 'sat' })});\n";
				break;
			case "mapquestr":
				layerMapQuest += "\t\t\tlayer: 'osm' })});\n";
				break;
			case "mapquesth":
				layerMapQuest = "\t layer"+actualLayer+" = new ol.layer.Group({\n "+
								"\t\t style: 'AerialWithLabels',\n "+
								"\t\t layers: [\n "+
								"\t\t 	new ol.layer.Tile({\n "+
								"\t\t		source: new ol.source.MapQuest({\n "+
								"\t\t		layer: 'sat'}) }),\n "+
								"\t\t	new ol.layer.Tile({\n "+
								"\t\t		source: new ol.source.MapQuest({\n "+
								"\t\t		layer: 'hyb' }) }) \n " +
								"\t\t ] });\n ";
						break;
		}
		layerMapQuest += "\tmap.addLayer(layer" + actualLayer + ");\n";
		currentConf += layerMapQuest;
		return currentConf;
	}
	
	/**
	 * Creates an BingMap layer
	 * @param currentConf String Is the current configuration of OpenLayers
	 * @param actualLayer int Is the number of the current layer
	 */
	private String addBingLayer(String currentConf, int actualLayer,String style){
		currentConf += "\tlayer"+actualLayer+" =  new ol.layer.Tile({\n "+
				" \t\t preload: Infinity,	\n"+
				" \t\t source: new ol.source.BingMaps({\n"+
				" \t\t\t key: 'Ak-dzM4wZjSqTlzveKz5u0d4IQ4bRzVI309GxmkgSVr1ewS6iPSrOvOKhA-CJlm3',\n"+
				" \t\t\t imagerySet: '"+style+"'})\n \t\t});\n";
		
		currentConf += "\tmap.addLayer(layer" + actualLayer + ");\n";
		return currentConf;
		
	}
	/**
	 * Creates the javascript of the layers that are going to be shown separatly. Each
	 * layer is an object first is the raster layers then the vector layers.
	 *
	 * @param idsBaseLayers
	 * @param idsExtraLayers
	 * @return
	 */
	private String createSeparateLayerScript(int[] idsBaseLayers, int[] idsExtraLayers) {
		String layersScript = "";
		Layer actualLayer = null;
		int layerCount = 0;
		
		String backgroundLayer = mapConfig.getProperty("backgroundLayer");
		
		switch (backgroundLayer){
			case "wms"://Read the background layer from xml file
				//add the layers that are the background.
				for (int i = 0; i < layersManager.getBackgroundLayers().size(); i++) {
					actualLayer = layersManager.getBackgroundLayers().get(i);
					if (actualLayer.getName() != null) {
						layersScript += layerHelper(actualLayer, layerCount, true);
						layerCount++;
					}//If layer not null
				}
				break;
			case "osm": //Add OpenStreetMap as the background layer
				layersScript += addOpenStreetMapLayer(layersScript, layerCount);
				layerCount++;
				break;
			case "binga": //Add Aerial Bing layer as the background layer
				layersScript += addBingLayer(layersScript, layerCount,"Aerial");
				layerCount++;
				break;
			case "bingr": //Add Road Bing layer as the background layer
				layersScript += addBingLayer(layersScript, layerCount,"Road");
				layerCount++;
				break;
			case "bingh": //Add Hybrid Bing layer as the background layer
				layersScript += addBingLayer(layersScript, layerCount,"AerialWithLabels");
				layerCount++;
				break;
			case "mapquesta": //Add MapQuest as the background layer
			case "mapquestr": //Add MapQuest as the background layer
			case "mapquesth": //Add MapQuest as the background layer
				layersScript += addMapQuest(layersScript, layerCount, backgroundLayer);
				layerCount++;
				break;
		}
		
		//Generates the layer configuration for OpenLayers
		// The name of the layer variable inside OpenLayers is of the form layer'number of layer'
		for (int i = 0; i < idsBaseLayers.length; i++) {
			actualLayer = layersManager.getMainLayers().get(idsBaseLayers[i]);
			if (actualLayer.getName() != null) {
				layersScript += layerHelper(actualLayer, layerCount, true);
				layerCount++;
			}//If layer not null
		}

		for (int i = 0; i < layersManager.getVectorLayers().size(); i++) {
			actualLayer = layersManager.getVectorLayers().get(i);
			if (StringAndNumbers.intArrayContains(idsExtraLayers, i)) {//Si esta en los seleccionados lo mostramos
				//Si no no
				layersScript += layerHelper(actualLayer, layerCount, true);
			} else {
				layersScript += layerHelper(actualLayer, layerCount, false);
			}
			layerCount++;
		}
		return layersScript;
	}
	
	/**
	 * Gets the list of Background layers
	 *
	 * @return ArrayList<Layer>
	 */
	public ArrayList<Layer> getBackgroundLayers() {
		return layersManager.getBackgroundLayers();
	}
	
	/**
	 * Obtains e list of raster layers
	 *
	 * @return ArrayList<Layer>
	 */
	public ArrayList<Layer> getRasterLayers() {
		return layersManager.getMainLayers();
	}
	
	/**
	 * Obtains a list of vector layers.
	 *
	 * @return ArrayList<Layer>
	 */
	public ArrayList<Layer> getVectorLayers() {
		return layersManager.getVectorLayers();
	}
	
	public int getTotalLayers() {
		return layersManager.getBackgroundLayers().size() + layersManager.getMainLayers().size() + layersManager.getVectorLayers().size();
		
	}
	
	public int getTotalVisibleLayers() {
		int layerCount = 0;
		//loop incharge of the layers that are background.
		for (int i = 0; i < layersManager.getBackgroundLayers().size(); i++) {
			if (layersManager.getBackgroundLayers().get(i).getName() != null) {
				layerCount++;
			}
		}
		layerCount += 1;//represents the base layer.
		for (int i = 0; i < layersManager.getVectorLayers().size(); i++) {
			if (layersManager.getVectorLayers().get(i).getName() != null) {
				layerCount++;
			}//If layer not null
		}
		return layerCount;
	}
}
