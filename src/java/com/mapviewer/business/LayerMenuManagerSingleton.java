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
/**
 * This class is a singleton class, meaning it only creates one instance of it when
 * running the program This class creates a tree structure for the menu based on the
 * parsing of the xml file in the layers folder.
 */
package com.mapviewer.business;

import com.mapviewer.conf.OpenLayerMapConfig;
import com.mapviewer.exceptions.XMLFilesException;
import com.mapviewer.exceptions.XMLLayerException;
import com.mapviewer.model.BoundaryBox;
import com.mapviewer.model.Layer;
import com.mapviewer.model.menu.MenuEntry;
import com.mapviewer.model.menu.TreeMenuUtils;
import com.mapviewer.model.menu.TreeNode;
import com.mapviewer.tools.ConvertionTools;
import com.mapviewer.tools.FileManager;
import com.mapviewer.tools.StringAndNumbers;
import java.io.File;
import java.io.IOException;
import java.util.*;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.jdom.Attribute;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;

/**
 * @param {LayerMenuManagerSingleton} - instance - initialize a singleton of this class
 * @param {TreeNode} rootMenu - menu of background and main layer
 * @param {TreeNode} rootVectorMenu - menu of vector layers
 * @param {Map} menuEntries - object of MenuEntry.java
 * @param {Layer array list} mainLayers - list of main layers
 * @param {Layer array list} vectorLayer - list of vector layers
 * @param {Layer array list} backgroundLayers - list of background layers
 * @param {String[]} xmlFiles - layers folder xml files
 * @param {Date} lastUpdate - last change of the xml files which leads to a change in the
 * tree of LayerMenuManagerSingleton
 */
public class LayerMenuManagerSingleton {
	
	private static LayerMenuManagerSingleton instance = null;
	private TreeNode rootMenu;// Contains the menu of the background and main layers
	private TreeNode rootVectorMenu;// Contains the menu for the vector or optional layers
	Map<String, MenuEntry> menuEntries;
	ArrayList<Layer> mainLayers;
	ArrayList<Layer> vectorLayers;
	ArrayList<Layer> backgroundLayers;
	static String[] xmlFiles;
	static String xmlFolder;
	static long MILLIS_PER_DAY = 24 * 60 * 60 * 1000L;
	Date lastUpdate;
	
	/**
	 * Add layers to the menus from an XML element.
	 *
	 * @param {Element} layerConf - contains an Element type object with layers options
	 * read from xml files
	 * @param {String} layerType - background, main, or vector layer
	 */
	private void addLayers(Element layerConf, String layerType) throws XMLFilesException {
		
		List<String> layerExceptions = new ArrayList<>();
		
		//These are the default values
		Layer deflayer = defaultLayer(); // initialize private constructor
		
		//Compute the group values for these layers, fill in all values that are in layerConf object
		Layer groupLayer = updateFields(layerConf, deflayer);//Updates
		
		List layers = layerConf.getChildren();
		
		//we iterate through this loop which is going through each child of a layer
		for (Iterator it = layers.iterator(); it.hasNext();) {
			
			
			Element layerElem = (Element) it.next();
			
			Layer newLayer = updateFields(layerElem, groupLayer);
			System.out.println("Adding layer: "+newLayer.getName());
			
			String[] layerMenu = null;
			
			try {
				//For vector and main layers we update the current menu tree
				if (!layerType.equalsIgnoreCase("BackgroundLayers")) {
					//Obtains the menu for this layer
					layerMenu = StringAndNumbers.strArrayFromStringColon(layerElem.getAttributeValue("Menu"));
				}
				
				switch (layerType.toLowerCase()) {// Change the attributes that differ from layeres
					case "mainlayers":
						newLayer.setDisplayNames(getDisplayNames(layerElem));
						break;
					case "backgroundlayers":
						newLayer.setDisplayTitle(false);
						break;
					case "optionallayers":
						newLayer.setDisplayTitle(false);
						newLayer.setIsVectorLayer(true);
						break;
				}
				
				//this is where the server is checked to see if it is online or not.
				//in the case it it offline and exception is raised and it skips until the catch
				String layerDetails = NetCDFRequestManager.getLayerDetails(newLayer);
				
				switch (layerType.toLowerCase()) {// Change the attributes that differ from layeres
					case "mainlayers":
						//Updates the Root Tree menu with this new entry
						updateMenu(layerMenu, this.rootMenu, 0, newLayer.isSelected());
						//Assigns the 'Tree' of this menu to the layer
						newLayer.setIdLayer(searchMenuEntries(layerMenu));
						newLayer.setLayerDetails(layerDetails);//It has to be called at the end
						validateLayer(newLayer);
						break;
					case "backgroundlayers":
						//If this is the first background layer then we use its
						// projection as the default map projection. In case
						// we are using another background layer like OpenStreetMap, this
						//value will be overwritten directly on JavaScript
						if(this.backgroundLayers.isEmpty()){
							OpenLayerMapConfig mapConfig = OpenLayerMapConfig.getInstance();
							mapConfig.updateProperty("mapProjection", newLayer.getProjection());
						}
						newLayer.setLayerDetails(layerDetails);//It has to be called at the end
						validateLayer(newLayer);
						break;
					case "optionallayers":
						//Updates the Vector Tree menu with this new entry
						updateVectorMenu(layerMenu, this.rootVectorMenu, 0, newLayer.isSelected(),newLayer.getName());
						
						//Assigns the 'Tree' of this menu to the layer
						newLayer.setIdLayer(searchMenuEntries(layerMenu));
						newLayer.setLayerDetails(layerDetails);//It has to be called at the end
						validateLayer(newLayer);
						break;
				}
				
			} catch (XMLLayerException ex) {
				layerExceptions.add(ex.getMessage());
				break;//Try the next layer
			}
			
			//If we make it this far, then the layer has been added succesfully (or it should)
			switch (layerType.toLowerCase()) {// Change the attributes that differ from layeres
				case "mainlayers":
					this.mainLayers.add(newLayer);
					break;
				case "backgroundlayers":
					this.backgroundLayers.add(newLayer);
					break;
				case "optionallayers":
					this.vectorLayers.add(newLayer);
					break;
			}
		}//For Iterate over layers of a group
		
		if(layerExceptions.size() > 0){
			String exceptionString="";
			//Saving all the exceptions into one string
			//exceptionString = layerExceptions.stream().map((item) -> item).reduce(exceptionString, String::concat);
			exceptionString = layerExceptions.get(0).toString();
			throw new XMLLayerException(exceptionString);
		}
		
	}
	
	/**
	 * This function validates the final properties of a layer. It validates for example
	 * that it has a url for the server, etc.
	 * @param newLayer
	 */
	private void validateLayer(Layer newLayer) throws XMLFilesException {
		if(newLayer.getServer() == null || newLayer.getServer().equals("")){
			throw new XMLFilesException("Layer '"+newLayer.getName()+"' does not provides a url for the server");
		}
		
	}
	
	/**
	 * returns the index of a layer or -1 is not found
	 *
	 * @param{String} name - name of layer
	 * @return
	 */
	public int getLayerOpenLayerIndex(String name) {
		int indx = 0;
		for (int i = 0; i < backgroundLayers.size(); i++) {
			Layer currLayer = backgroundLayers.get(i);
			if (currLayer.getName().equalsIgnoreCase(name)) {
				return indx;
			}
			indx++;
		}
		
		//In this case we do not increment the index, because we should
		// have only one main layer.
		for (int i = 0; i < mainLayers.size(); i++) {
			Layer currLayer = mainLayers.get(i);
			if (currLayer.getName().equalsIgnoreCase(name)) {
				return indx;
			}
		}
		
		for (int i = 0; i < vectorLayers.size(); i++) {
			Layer currLayer = vectorLayers.get(i);
			if (currLayer.getName().equalsIgnoreCase(name)) {
				return indx;
			}
			indx++;
		}
		
		System.out.println("Layer name not found");
		return -1;
	}
	
	/**
	 * Obtains a layer by its name.
	 *
	 * @param {String} name
	 * @return
	 */
	public Layer getLayerByName(String name) {
		Iterator itr = mainLayers.iterator();
		while (itr.hasNext()) {
			Layer currLayer = (Layer) itr.next();
			if (currLayer.getName().equalsIgnoreCase(name)) {
				return currLayer;
			}
		}
		
		itr = vectorLayers.iterator();
		while (itr.hasNext()) {
			Layer currLayer = (Layer) itr.next();
			if (currLayer.getName().equalsIgnoreCase(name)) {
				return currLayer;
			}
		}
		
		itr = backgroundLayers.iterator();
		while (itr.hasNext()) {
			Layer currLayer = (Layer) itr.next();
			if (currLayer.getName().equalsIgnoreCase(name)) {
				return currLayer;
			}
		}
		
		return null;
	}
	
	/**
	 * Gets the singleton object in charge of holding the original menu tree and the list
	 * of Layers.
	 *
	 * @return
	 */
	public static synchronized LayerMenuManagerSingleton getInstance() throws XMLFilesException {
		
		if (instance == null) {//Only the first time we initialize
			instance = new LayerMenuManagerSingleton();
		}
		
		return instance;
	}
	
	/**
	 * This function is called to refresh the Tree using all the XML files inside the
	 * specified folder.
	 *
	 * @param forceXMLreload It is used to force the reload of the XML files
	 * @return Indicates if the XML files (trees) were updated.
	 */
	public boolean refreshTree(boolean forceXMLreload) throws XMLFilesException {
		if (xmlFiles == null) {
			throw new XMLFilesException("XML Layers file is not defined (no XML files in the layers folder)");
		}
		
		
		Date currLastUpdate;
		boolean update = forceXMLreload;
		
		Date currDate = new Date();
		OpenLayerMapConfig mapConfig = OpenLayerMapConfig.getInstance();
		
		String refreshLayers = mapConfig.getRefreshLayers();
		long millsSinceLastUpdate = currDate.getTime() - lastUpdate.getTime();
		switch(refreshLayers.toLowerCase()){
			case "daily":
				if( millsSinceLastUpdate > MILLIS_PER_DAY) update = true;
				break;
			case "weekly":
				if( millsSinceLastUpdate > MILLIS_PER_DAY*7) update = true;
				break;
			case "monthly":
				if( millsSinceLastUpdate > MILLIS_PER_DAY*30) update = true;
				break;
		}
		
		//		If we still haven't decide if we are updating the layers.
		if(!update){
			//Verifies that there are not more or less xml files in the folder.
			if (xmlFiles.length != FileManager.numberOfFilesInFolder(xmlFolder)) {
				LayerMenuManagerSingleton.setLayersFolder(xmlFolder);
				update = true;
			} else {
				for (int i = 0; i < xmlFiles.length; i++) {
					currLastUpdate = FileManager.lastModification(xmlFiles[i]);
					//If is the first time we generate the tree or the file has been updated we
					// regenerate the tree menu and update the layers.
					synchronized (this) {
						if ( (lastUpdate.getTime() < currLastUpdate.getTime())) {
							update = true;
							break;//For any file that has been updated we reload everything
						}
					}
				}
			}
		}
		
		if (update) {//If at least one file was updated we change the lastUpdate date.
			resetVariables();
			lastUpdate = new Date();
			instance.createMenuFromXMLfiles();
		}
		
		return update;//Indicates if the menus were updated.
	}
	
	//------------------------ PRIVATE FUNCTIONS ----------------------
	private LayerMenuManagerSingleton() {
		lastUpdate = new Date(0);//Initialize the variable
		resetVariables();
	}
	
	/**
	 * resets the variables before refresh
	 */
	private void resetVariables() {
		rootMenu = new TreeNode(true, null, null, false);
		rootVectorMenu = new TreeNode(true, null, null, false);
		
		menuEntries = new HashMap<>();
		mainLayers = new ArrayList<>();
		vectorLayers = new ArrayList<>();
		backgroundLayers = new ArrayList<>();
	}
	
	/**
	 * Creates the initial Tree of layers from the specified XML files.
	 */
	private void createMenuFromXMLfiles() throws XMLFilesException {
		List<String> layerExceptions = new ArrayList<>();
		try {
			//First search for MenuEntries in all the files
			for (int i = 0; i < xmlFiles.length; i++) {
				String fileName = xmlFiles[i];
				SAXBuilder builder = new SAXBuilder(); //used to read XML
				Document doc = builder.build(fileName);
				File tempFile = new File(fileName);
				
				// Obtains the root element of the current XML file
				Element root = doc.getRootElement();
				List children = root.getChildren();
				
				//Obtains the menu entries or the layers
				System.out.println("Adding menu entries from file: "+tempFile.getName());
				for (Iterator it = children.iterator(); it.hasNext();) {
					Element curr = (Element) it.next();
					if (curr.getName().equals("Menus")) {
						addMenuEntries(curr.getChildren());
					}
				}
				System.out.println("Done adding menu entries from file: "+tempFile.getName());
			}
			for (int i = 0; i < xmlFiles.length; i++) {
				String fileName = xmlFiles[i];
				SAXBuilder builder = new SAXBuilder();
				Document doc = builder.build(fileName);
				
				// Obtains the root element of the current XML file
				Element root = doc.getRootElement();
				List children = root.getChildren();
				
				//Obtains the menu entries or the layers
				for (Iterator it = children.iterator(); it.hasNext();) {
					Element curr = (Element) it.next();
					if (curr.getName().equalsIgnoreCase("BackgroundLayers")
							|| curr.getName().equalsIgnoreCase("MainLayers")
							|| curr.getName().equalsIgnoreCase("OptionalLayers")) {
						try{
							System.out.println("Adding group layers: "+ curr.getName());
							addLayers(curr, curr.getName());
						}catch(XMLLayerException ex){
							File tempFile = new File(fileName);
							System.out.println("Adding exception parsing XML layer");
							layerExceptions.add("<b>Error parsing XML file</b>: <small> "+tempFile.getName()+"</small> <br>"
									+ "<b>Layers: </b>: <small>" + ex.getMessage() + "</small><br>"
									+ "<b>Element</b>: <small>" + curr.getName()+ "</small><br>");
						}
						catch(XMLFilesException ex){
							throw new XMLFilesException(ex.getMessage());
						}
						
					}
				}
			}
			
			System.out.println("----------- FINAL Main MENU-------------");
			TreeMenuUtils.traverseTree(rootMenu);
			System.out.println("\n----------- FINAL Vector MENU-------------");
			TreeMenuUtils.traverseTree(rootVectorMenu);
			System.out.println("\n");
			
			if(layerExceptions.size() > 0){
				String exceptionString="";
				//Saving all the exceptions into one string
//				exceptionString = layerExceptions.stream().map((item) -> item).reduce(exceptionString, String::concat);
				exceptionString = layerExceptions.get(0).toString();
				
				throw new XMLLayerException(exceptionString);
			}
			
		} catch (JDOMException | IOException ex) {
			Logger.getLogger(LayerMenuManagerSingleton.class.getName()).log(Level.SEVERE, null, ex);
			throw new XMLFilesException("Error parsing XML files" + ex.getMessage());
		}
	}
	
	/**
	 * Reads the boundary box from the layers configuration node of the xml file.
	 *
	 * @param layerConf Element Layer configuration node
	 * @return BoundaryBox The obtained boundary box TODO if it can't create the
	 * BoundaryBox, throw an exception.
	 */
	private BoundaryBox getBoundaryBox(Element layerConf) {
		
		String bbox_str = layerConf.getAttributeValue("BBOX");
		if (bbox_str != null) {
			return new BoundaryBox(bbox_str);
		} else {
			return null;
		}
	}
	
	/**
	 * This method obtains all the title on different languages of the layer
	 *
	 * @param {Element} layer
	 * @return Map<String,String> Map of 2 Character language as the key (EN) and the text
	 * TODO throw an exception if there is no text for at least one language
	 */
	private Map<String, String> getDisplayNames(Element layer) {
		HashMap<String, String> displayNames = new HashMap<>();
		for (Iterator atribs = layer.getAttributes().iterator(); atribs.hasNext();) {
			Attribute atrib = (Attribute) atribs.next();
			// Important. We have the restriction that ALL the attributes relating
			// to languages has to be 2 characters, or 2 characters followed by _ followed by 2 characters e.g. HI_EN
			if (atrib.getName().length() == 2 || atrib.getName().matches("[A-X]{2}_[A-Z]{2}")) {
				displayNames.put(atrib.getName(), atrib.getValue());
			}
		}
		return displayNames;
	}
	
	/**
	 * It will fill all what it cans from elem into the layer
	 *
	 * @param {Element} layerConf
	 * @param {Layer} layer
	 * @return
	 */
	private Layer updateFields(Element layerConf, Layer layer) {
		
		BoundaryBox bbox = getBoundaryBox(layerConf);
		bbox = bbox != null ? bbox : layer.getBbox();
		
		String format = layerConf.getAttributeValue("format");
		format = format != null ? format : layer.getFormat();
		
		String proj = layerConf.getAttributeValue("proj");
		proj = proj != null ? proj : layer.getProjection();
		
		String server = layerConf.getAttributeValue("server");
		server = server != null ? server : layer.getServer();
		
		String palette = layerConf.getAttributeValue("palette");
		palette = palette != null ? palette : layer.getPalette();
		
		String transEffect = layerConf.getAttributeValue("trans_effect");
		transEffect = transEffect != null ? transEffect : layer.getTransEffect();

		String localAddress = layerConf.getAttributeValue("localAddress");
		localAddress = localAddress != null ? localAddress : layer.getLocalAddress();
		
		int width = layerConf.getAttributeValue("width") != null
				? Integer.parseInt(layerConf.getAttributeValue("width")) : layer.getWidth();
		
		int height = layerConf.getAttributeValue("height") != null
				? Integer.parseInt(layerConf.getAttributeValue("height")) : layer.getHeight();
		
		
		float minColor = layerConf.getAttributeValue("mincolor") != null
				? Float.parseFloat(layerConf.getAttributeValue("mincolor")) : layer.getMinColor();
		
		float maxColor = layerConf.getAttributeValue("maxcolor") != null
				? Float.parseFloat(layerConf.getAttributeValue("maxcolor")) : layer.getMaxColor();

		
		// Defines if a layer is a vector layer. It is used
		// to modify the way KML links are created and for the 'Download data' feature
		String tempVectorLayer = layerConf.getAttributeValue("vectorLayer");
		boolean vectorLayer = false;
		if (tempVectorLayer != null) {
			vectorLayer = tempVectorLayer.equals("true") ? true : layer.isVectorLayer();
		} else {
			vectorLayer = layer.isVectorLayer();
		}
		
		String tempTiled = layerConf.getAttributeValue("tiled");
		boolean tiled;
		if (tempTiled != null) {
			tiled = tempTiled.equals("false") ? false : layer.isTiled();
		} else {
			tiled = layer.isTiled();
		}
		
		String selectedStr = layerConf.getAttributeValue("selected");
		boolean selected = false;//false by default;
		if (selectedStr != null) {
			selected = selectedStr.equals("true") ? true : layer.isSelected();
		} else {
			selected = layer.isSelected();
		}
		
		String netCDF = layerConf.getAttributeValue("ncWMS");
		boolean boolnetCDF = netCDF != null ? Boolean.parseBoolean(netCDF) : layer.isncWMS();

		String ncWMStwo = layerConf.getAttributeValue("ncWMStwo");
		boolean boolnetCDFtwo= ncWMStwo!= null ? Boolean.parseBoolean(ncWMStwo) : layer.isNcwmstwo();

		//If it is ncWMStwo, then it has to be ncWMS
		if(boolnetCDFtwo){
			boolnetCDF = true;
		}
		
		String style = layerConf.getAttributeValue("style");
		style = style != null ? style : layer.getStyle();
		
		String name = layerConf.getAttributeValue("name");
		name = name != null ? name : layer.getName();
		
		String featureInfo = layerConf.getAttributeValue("featureInfo");
		
		if (featureInfo != null) {//If is not null we verify that is not equal to none
			//If is none, is the equivalent to not having anything.
			featureInfo = featureInfo.equals("none") ? null : featureInfo;
		} else {
			//By default (if nothing) then we request for the feature info of the same layer.
			featureInfo = name;
		}
		
		String max_time_range = layerConf.getAttributeValue("max_time_range") != null
				? layerConf.getAttributeValue("max_time_range") : layer.getMaxTimeLayer();
		
		//this is used to make queries to the database that is linked trhoguh the geoserver layer request.
		String cql = layerConf.getAttributeValue("CQL") != null
				? layerConf.getAttributeValue("CQL") : layer.getCql();
		
		//this is used to make queries to the database that is linked trhoguh the geoserver layer request.
		String cql_cols = layerConf.getAttributeValue("cqlcols") != null
				? layerConf.getAttributeValue("cqlcols") : layer.getCql_cols();
		
		
		String jsonp = layerConf.getAttributeValue("jsonp");
		boolean boolJsonp= jsonp != null ? Boolean.parseBoolean(jsonp) : layer.isJsonp();
		
		String overlayStreamlines = layerConf.getAttributeValue("overlaystreamlines") != null
				? layerConf.getAttributeValue("overlaystreamlines") : layer.getoverlayStreamlines();
		
		float defParticleSpeed = layerConf.getAttributeValue("defParticleSpeed") != null
				? Float.parseFloat(layerConf.getAttributeValue("defParticleSpeed")) : layer.getDefParticleSpeed();
                
                String belowMinColor = layerConf.getAttributeValue("belowMinColor") != null
				? layerConf.getAttributeValue("belowMinColor") : layer.getBelowMinColor();
                
                String aboveMaxColor = layerConf.getAttributeValue("aboveMaxColor") != null
				? layerConf.getAttributeValue("aboveMaxColor") : layer.getAboveMaxColor();
		
		/*
		String[] cql_cols = null;
		if(cql_cols_str!=null){
		ArrayList<String> items = new ArrayList<>(Arrays.asList(cql_cols_str.split(",")));
		cql_cols = items.toArray(new String[items.size()]);
		}*/
		
		Layer newLayer = new Layer(bbox, style, format, name, layer.getDisplayNames(),
				proj, layer.getIdLayer(), server, width, height, featureInfo,
				tiled, layer.isDisplayTitle(), layer.getLayout(), vectorLayer, palette, boolnetCDF,
				max_time_range, boolJsonp,overlayStreamlines,belowMinColor, aboveMaxColor, defParticleSpeed);
		
		newLayer.setMinColor(minColor);
                //newLayer.setBelowMinColor(belowMinColor);
                //newLayer.setAboveMaxColor(aboveMaxColor);
		newLayer.setMaxColor(maxColor);
		newLayer.setSelected(selected);
		newLayer.setTransEffect(transEffect);
		newLayer.setCql(cql);
		newLayer.setCql_cols(cql_cols);
		newLayer.setNcwmstwo(boolnetCDFtwo);
		newLayer.setLocalAddress(localAddress);
		
		return newLayer;
	}
	
	/**
	 * Fills a layer with default values. Some of these values are very useful to avoid
	 * setting them on the xml file of layer.s
	 *
	 * @return
	 */
	private Layer defaultLayer() {
		Layer defLayer = new Layer();
		return defLayer;
	}
	
	/**
	 * Adds all the menu entries from a list of xml elements
	 *
	 * @param entries
	 */
	private void addMenuEntries(List entries) {
		try {
			for (Iterator it = entries.iterator(); it.hasNext();) {
				
				Element entry = (Element) it.next();
				
				// The id for the hash table is the same as the menu entry
				String id = entry.getAttributeValue("ID");
				String text = entry.getAttributeValue("EN");// English text is required
				
				MenuEntry currMenuEntry = new MenuEntry(id, "EN", text);
				
				List attribs = entry.getAttributes();//Add all the remaining languages
				for (Iterator it1 = attribs.iterator(); it1.hasNext();) {
					Attribute atrib = (Attribute) it1.next();
					// If the name is not equal to ID or EN then we assume is another language
					if (!(atrib.getName().equals("ID") || atrib.getName().equals("EN"))) {
						currMenuEntry.addText(atrib.getName(), atrib.getValue());
					}
				}
				
//				currMenuEntry.print();
menuEntries.put(id, currMenuEntry);
			}
		} catch (Exception ex) {
			System.out.println("Exception adding menu entries");
		}
	}
	
	/**
	 * Searches for menu entries from an array of string keys
	 *
	 * @param strMenuEntries
	 * @return MenuEntry[] The obtained menu entries TODO if not all the entries are found
	 * then it should throw an exception
	 */
	private MenuEntry[] searchMenuEntries(String[] strMenuEntries) {
		MenuEntry[] result = new MenuEntry[strMenuEntries.length];
		for (int i = 0; i < strMenuEntries.length; i++) {
			result[i] = menuEntries.get(strMenuEntries[i]);
		}
		return result;
	}
	
	/**
	 * This method is a recursive method in charge of creating and updating the user menus
	 * (Very important)
	 *
	 * @param {String []} allMenus Ids of the menus to add
	 * @param {TreeNode} currNode TreeNode Current node on the tree
	 * @param {int} currMenu int position of the array of menus 'allMenus' that we are
	 * @param {boolean} selected Indicates if this layer should be selected by default.
	 * adding
	 */
	private void updateMenu(String[] allMenus, TreeNode currNode, int currMenu,boolean selected) throws XMLFilesException {
		MenuEntry menuEntry = menuEntries.get(allMenus[currMenu]);
		
		//Throw an exception if the menu was not found.
		if (menuEntry == null) {
			throw new XMLFilesException("The menu entry: " + allMenus[currMenu] + " was not found");
		}
		
		TreeNode newNode;
		if (currNode.getHasChilds()) {
			//If this level has menus then search for the current one
			ArrayList<TreeNode> childs = currNode.getChilds();
			newNode = menuPosition(allMenus[currMenu], childs);
			if (newNode == null) {//If the node was not found then we create it
				newNode = new TreeNode(false, menuEntry, null, selected);
				currNode.addChild(newNode);
				
				//If the layer was forced to be selected, then we need to 'remove'
				// that the first menu of that level on the tree is the one selected.
				if(selected){
					currNode.getChilds().get(0).setSelected(false);
				}
			}
		} else {
			//If this level doesn't have more menus then we need to add one extra level
			//By default the first layer is the one selected. (ATTENTION HERE)
			newNode = new TreeNode(false, menuEntries.get(allMenus[currMenu]), null, true);
			currNode.addChild(newNode);
		}
		
		if ((currMenu + 1) < allMenus.length) {
			updateMenu(allMenus, newNode, currMenu + 1, selected);
		}
	}
	
	/**
	 * This method is in charge of creating the optional menu
	 *
	 * @param {String} allMenus String Ids of the menus to add
	 * @param {TreeNode} currNode TreeNode Current node on the tree
	 * @param {boolean} selected boolean Indicates if the optional layer should be
	 * selected by default adding
	 */
	private void updateVectorMenu(String[] allMenus, TreeNode currNode, int currMenu,boolean selected, String layerName) throws XMLFilesException {
		MenuEntry menuEntry = menuEntries.get(allMenus[currMenu]);
		menuEntry.setLayername(layerName);
		
		//Throw an exception if the menu was not found.
		if (menuEntry == null) {
			throw new XMLFilesException("The menu entry: " + allMenus[currMenu] + " was not found");
		}
		
		TreeNode newNode;
		if (currNode.getHasChilds()) {
			//If this level has menus then search for the current one
			ArrayList<TreeNode> childs = currNode.getChilds();
			newNode = menuPosition(allMenus[currMenu], childs);
			if (newNode == null) {//If the node was not found then we create it
				newNode = new TreeNode(false, menuEntry, null, selected);
				currNode.addChild(newNode);
			}
		} else {
			//If this level doesn't have more menus then we need to add one extra level
			//By default the first layer is the one selected. (ATTENTION HERE)
			newNode = new TreeNode(false, menuEntries.get(allMenus[currMenu]), null, selected);
			currNode.addChild(newNode);
		}
		
		if ((currMenu + 1) < allMenus.length) {
			updateVectorMenu(allMenus, newNode, currMenu + 1, selected, layerName);
		}
	}
	
	/**
	 * Searches for one specific menu inside a list of treenodes. If it finds it it
	 * returns the tree node, if not it returns null.
	 *
	 * @param {String} menu
	 * @param {ArrayList<TreeNode>} childs
	 * @return TreeNode
	 */
	private TreeNode menuPosition(String menu, ArrayList<TreeNode> childs) {
		
		int pos = 1;//Position of the menu inside the tree nodes of this level
		for (Iterator<TreeNode> it = childs.iterator(); it.hasNext();) {
			TreeNode treeNode = it.next();
			if (treeNode.getNode().getId().equals(menu)) {
				return treeNode;
			}
			pos++;
		}
		return null;// It didn't find the menu in this options
	}
	
	public ArrayList<Layer> getBackgroundLayers() {
		return backgroundLayers;
	}
	
	public ArrayList<Layer> getMainLayers() {
		return mainLayers;
	}
	
	public ArrayList<Layer> getVectorLayers() {
		return vectorLayers;
	}
	
	/**
	 * Sets the folder where the xml layers files are stored.
	 *
	 * @param folder
	 */
	public static void setLayersFolder(String folder) throws XMLFilesException {
		try {
			xmlFiles = FileManager.filesInFolder(folder);
			xmlFolder = folder;
		} catch (Exception e) {
			Logger.getLogger(LayerMenuManagerSingleton.class.getName()).log(Level.SEVERE, null, e);
			throw new XMLFilesException("Folder for XML files not found. \n Folder was: " + folder);
		}
		java.util.Arrays.sort(xmlFiles);
	}
	
	/**
	 * Returns the default vector menu for the user. It has to be a new object so it be
	 * different for every user.
	 *
	 * @return
	 */
	public TreeNode getRootVectorMenu() {
		return TreeMenuUtils.copyCurrentTree(rootVectorMenu);
	}
	
	/**
	 * Returns the default menu for the user. It has to be a new object so it be different
	 * for every user.
	 *
	 * @return
	 */
	public TreeNode getRootMenu() {
		return TreeMenuUtils.copyCurrentTree(rootMenu);
	}
	
	/**
	 * Obtains an array of strings containing the Menus of the selected optional layers.
	 *
	 * @return
	 */
	public String[] getDefVectorLayers() throws XMLFilesException {
		ArrayList<String> selOptional = new ArrayList<>();
		if (rootVectorMenu.getChilds() == null) {
			throw new XMLFilesException("There are not optional layers defined.");
		}
		for (int j = 0; j < rootVectorMenu.getChilds().size(); j++) {
			if (rootVectorMenu.getChilds().get(j).isSelected()) {
				selOptional.add(rootVectorMenu.getChilds().get(j).getNode().getId());
			}
		}
		return ConvertionTools.convertObjectArrayToStringArray(selOptional.toArray());
	}
}
