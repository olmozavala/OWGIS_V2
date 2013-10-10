package com.mapviewer.business;

import com.mapviewer.conf.OpenLayerMapConfig;
import com.mapviewer.conf.UserConfig;
import com.mapviewer.exceptions.XMLFilesException;
import com.mapviewer.model.Layer;
import com.mapviewer.model.menu.TreeNode;
import com.mapviewer.tools.ConvertionTools;
import com.mapviewer.tools.HtmlTools;
import com.mapviewer.tools.StringAndNumbers;
import java.util.ArrayList;
import java.util.Arrays;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import org.json.me.JSONArray;
import org.json.me.JSONException;
import org.json.me.JSONObject;

/**
 * This class is in charge of the menu of the map and the selection of layers of the user.
 * *
 *
 * @author Olmo Zavala Romero
 */
public class UserRequestManager {

	/**
	 * Generates a new menu depending on the request.
	 *
	 *
	 * @param {HttpServletRequest} request
	 * @param {HttpSession} session
	 * @return Treenode
	 */
	public static TreeNode createNewRootMenu(HttpServletRequest request, HttpSession session) throws XMLFilesException {
		String solicitudWCS = request.getParameter("esWcs");//Indicates if the request is WCS or normal WMS
		String[] levelsSelected = null;
		if (Boolean.valueOf(solicitudWCS)) {
			//if it is wcs then we look for the parameter valoresDropDown
			//This is done becuase data can't be send directly throught get
			//in case we had three levels then ajax.js needs to be modified. 

			levelsSelected = StringAndNumbers.strArrayFromStringColon(request.getParameter("valoresDropDown"));
		} else {
			//if the request is not wcs then we obtain the layers that the user selected. 

			levelsSelected = request.getParameterValues("dropDownLevels");
		}
		//Obtain the menu of the user that is in session. 
		TreeNode rootMenu = (TreeNode) session.getAttribute("MenuDelUsuario");


		String[] selectedValues = ConvertionTools.convertObjectArrayToStringArray(levelsSelected);

		LayerMenuManagerSingleton menuManager = LayerMenuManagerSingleton.getInstance();
		boolean update = menuManager.refreshTree();//Search for any update on the XML files

		//If is the first time the user access the webpage then we 
		// return the default menu. 
		if (rootMenu == null || selectedValues == null || update) {
			rootMenu = menuManager.getRootMenu();
		}
		//If something goes wrong updating the menu, we return the default menu
		try {

			if(selectedValues != null){
				rootMenu = HtmlTools.actualizaMenu(selectedValues, rootMenu);
			}

		} catch (Exception e) {
			System.out.println("ERROR!!!!! Building the menu in UserRequestmananger" + e.getMessage());
			rootMenu = menuManager.getRootMenu();
		}

		session.setAttribute("MenuDelUsuario", rootMenu);
		return rootMenu;
	}

	/**
	 * Updates the selection of vector layers
	 *
	 * @param request
	 * @param session
	 * @return
	 */
	public static String[] manageVectorLayersOptions(HttpServletRequest request, HttpSession session) throws XMLFilesException, Exception {
		String solicitudWCS = request.getParameter("esWcs");//indicates if the request is wcs or not. 
		String[] layersSelected = null;
		if (Boolean.valueOf(solicitudWCS)) {
			//if it is a wcs then we look for the parameter of the dropdown menu
			//this is done becuase we can not send the data directly to get. 
			//in the case of having three levels we need to modify the ajax.js. 

			layersSelected = StringAndNumbers.strArrayFromStringColon(request.getParameter("valoresOpcionales"));
		} else {
			//if the request is not wcs we need to obtain the user selection. 
			layersSelected = request.getParameterValues("vectorLayersSelected");
		}

		LayerMenuManagerSingleton menuManager = LayerMenuManagerSingleton.getInstance();
		TreeNode vectorLayerOptions = menuManager.getRootVectorMenu();

		String[] selectedValues = null;
		selectedValues = ConvertionTools.convertObjectArrayToStringArray(layersSelected);

		//in case nothing is selected or doesnt exist then the object vactorLayers in session just returns 
		//the initial menu. 

		if (selectedValues== null) {
			selectedValues = menuManager.getDefVectorLayers();
		}

		vectorLayerOptions = HtmlTools.actualizaOpcionesVectoriales(selectedValues, vectorLayerOptions);
		session.setAttribute("vectorLayers", vectorLayerOptions);
		return selectedValues;
	}

	/**
	 * Updates the request done by the user.
	 *
	 * @param request
	 */
	public static boolean updateDataSelected(HttpServletRequest request) {
		String[] url = request.getParameterValues("URL");
		boolean existeURL = false;
		if (url != null) {
			existeURL = true;
			request.setAttribute("layersSpecData", url);
		}
		return existeURL;
	}

	/**
	 * In charge of managing the OpenLayers object that each client uses. *
	 *
	 * @param {HttpSession} session HttpSession Objeto de sesion
	 * @param {OpenLayerMapConfig} defaultOpConfig OpenLayerMapConfig
	 * @return OpenLayerMapConfig
	 */
	public static UserConfig getClientOpConfig(HttpSession session, OpenLayerMapConfig defaultOpConfig) {
		UserConfig clientOPConfig;
		if (!session.isNew()) {//if the session is not new we obtain from object. 

			clientOPConfig = (UserConfig) session.getAttribute("clientOpConfig");
			if (clientOPConfig == null) {//is object is null we just return the default options. 
				clientOPConfig = new UserConfig(defaultOpConfig.getCenter(), defaultOpConfig.getZoom(), "default");
			}
		} else {
			clientOPConfig = new UserConfig(defaultOpConfig.getCenter(), defaultOpConfig.getZoom(), "default");
		}
		return clientOPConfig;
	}

	/**
	 * Updates the position and the zoom of the map
	 *
	 *
	 * @param {HttpServeletRequest}request
	 * @param {UserConfig} opConfig
	 * @return UserConfig
	 */
	public static UserConfig updateCenterAndZoom(HttpServletRequest request, UserConfig opConfig) {
		String zoomstr = request.getParameter("zoom");
		String centerstr = request.getParameter("center");

		if ((zoomstr == null) || (centerstr == null)) {
			OpenLayerMapConfig defConfig = OpenLayerMapConfig.getInstance();
			if (zoomstr == null) {
				zoomstr = defConfig.getZoom();
			}
			if (centerstr == null) {
				centerstr = defConfig.getCenter();
			}
		}

		opConfig.setCenter(centerstr);
		opConfig.setZoom(zoomstr);

		return opConfig;
	}

	/**
	 * Get the form parameters of the different draggable windows.
	 *
	 * @param {HttpServeletRequest} request
	 * @param {UserConfig} opConfig
	 * @return opConfig
	 */
	public static UserConfig windowPosition(HttpServletRequest request, UserConfig opConfig) {
		String mainMenuParentPos = request.getParameter("mainMenuParentPos");
		String palettes_divPos = request.getParameter("palettes_divPos");
		String palettePos = request.getParameter("palettePos");
		String optionalMenuParent = request.getParameter("optionalMenuParent");
		String CalendarsAndStopContainer = request.getParameter("CalendarsAndStopContainer");
		String helpInstructions = request.getParameter("helpInstructions");
		String mainMenuMinimize = request.getParameter("mainMenuMinimize");
		String calendarsMinimize = request.getParameter("calendarsMinimize");
		String optionalsMinimize = request.getParameter("optionalsMinimize");


		if (mainMenuParentPos != null && palettes_divPos != null && palettePos != null && optionalMenuParent != null && CalendarsAndStopContainer != null && helpInstructions != null
				&& mainMenuMinimize != null && calendarsMinimize != null && optionalsMinimize != null) {
			opConfig.setPositions(mainMenuParentPos, palettes_divPos, palettePos, optionalMenuParent, CalendarsAndStopContainer, helpInstructions, mainMenuMinimize, calendarsMinimize, optionalsMinimize);
		}

		return opConfig;
	}

	/**
	 * This function obtains the layer that the user is viewing, taking into account also
	 * the vector layers
	 *
	 *
	 * @param {OpenLayersManager []} opManager OpenLayersManager Contains all the layers
	 * (background, raster y vectoriales)
	 * @param {int[]} selectedBaseLayers int[] array with selected layers
	 * @param {int[]} selectedVectorLayers int[] array of selected vector layers
	 * @return layer - layer configuration of the user.
	 */
	public static Layer getRequestedLayer(OpenLayersManager opManager, int[] selectedBaseLayers, int[] selectedVectorLayers) {
		Layer layer = opManager.getRasterLayers().get(selectedBaseLayers[0]);
		//this part is used for the link that says Download current layer
		//it takes into account the rasters layers of the vectors. 

		if (selectedVectorLayers != null) {
			Arrays.sort(selectedVectorLayers);//Sort the array of vector layers. The layers should be in order so, the first one is the one that
			//will be show on top
			for (int i = selectedVectorLayers.length - 1; i >= 0; i--) {
				if (opManager.getVectorLayers().get(selectedVectorLayers[i]).getTitle()) {//If it should show its title we change it and end the loop
					layer = opManager.getVectorLayers().get(selectedVectorLayers[i]);
					break;
				}
			}
		}
		return layer;
	}

	/**
	 * Depending on the selected layer, it generates the link to request a kml file to the
	 * right server
	 *
	 * @param {OpenLayersManager} opManager
	 * @param {int[]} selectedBaseLayers
	 * @param {UserConfig} usrConf
	 * @return
	 */
	public static String getKmlLink(OpenLayersManager opManager, int[] selectedBaseLayers, UserConfig usrConf) {
		Layer tempLayer = opManager.getRasterLayers().get(selectedBaseLayers[0]);
		return UserRequestManager.buildKmlLink(tempLayer, usrConf.getPalette());
	}

	/**
	 * Builds the link to request a kml layer for an specific layer
	 *
	 * @param {Layer} layer
	 * @param {String} palette
	 * @return
	 */
	private static String buildKmlLink(Layer layer, String palette) {
		String server = layer.getServer();
		String layerName = layer.getName();
		String kmlLink = "";
		if (layer.isNetCDF()) {
			try {
				JSONObject layDet = new JSONObject(layer.getLayerDetails());
				String time = (String) layDet.get("nearestTimeIso");

				//This parameters should not change
				kmlLink = server + "?layers=" + layerName;
				kmlLink += "&FORMAT=application/vnd.google-earth.kmz"
						+ "&REQUEST=GetMap"
						+ "&VERSION=1.1.1"
						+ "&BBOX=" + layer.getBbox().toString()
						+ "&WIDTH=" + layer.getWidth()
						+ "&HEIGHT=" + layer.getHeight()
						+ "&TRANSPARENT=true"
						+ "&COLORSCALERANGE=" + layer.getMinColor() + "," + layer.getMaxColor()
						+ "&STYLES=" + layer.getStyle() + "/" + palette
						+ "&SRS=" + layer.getProjection();
				//This parameters will change with time
				try{
					JSONArray zAxisValues = (JSONArray) (((JSONObject) layDet.get("zaxis")).get("values"));
					kmlLink += "&ELEVATION=" + zAxisValues.get(0);
				} catch (JSONException ex) {
					System.out.println("ERROR building KML link (Assuming the layer has no zaxis):" + ex.getMessage());
				}
				kmlLink += "&TIME=" + time;

			} catch (JSONException ex) {
				System.out.println("ERROR building KML link:" + ex.getMessage());
			}
		} else {
			// Geoserver has the option of a reduced link, in this case
			// most of the properties get filled by default. 
			kmlLink = server + "?layers=" + layerName;
			kmlLink += "&REQUEST=GetMap"
					+ "&VERSION=1.1.1"
					+ "&BBOX=" + layer.getBbox().toString()
					+ "&WIDTH=" + layer.getWidth()
					+ "&HEIGHT=" + layer.getHeight()
					+ "&SRS=" + layer.getProjection();

			//We need to change the application format depending on if the
			// layer is raster or vector (only necessary in last version)
			if (layer.isVectorLayer()) {
				kmlLink += "&FORMAT=application/vnd.google-earth.kml+xml";
			} else {
				kmlLink += "&FORMAT=application/vnd.google-earth.kmz+xml";
			}

			if (!layer.getCql().equals("")) {
				kmlLink += "&CQL_FILTER=" + layer.getCql();
			}
		}
		return kmlLink;
	}

	/**
	 * Generate links for the default entry layers
	 *
	 * @param layers ArrayList<Layer> contains the layers
	 * @return String[] array with kml link of layers
	 */
	public static String[] getCheckboxKmlLinks(ArrayList<Layer> layers) {
		String[] kmlLinks = new String[layers.size()];//this array will have the links of the kml of each layer requested. 

		String layerName = null;
		String serverLayer = null;
		for (int i = 0; i < kmlLinks.length; i++) {
			kmlLinks[i] = UserRequestManager.buildKmlLink(layers.get(i), layers.get(i).getPalette());
		}
		return kmlLinks;
	}

	/**
	 * Depending on the layers selected by the user, it gets the title that will be
	 * displayed on the map
	 *
	 * @param {OpenLayersManager} opManager
	 * @param {int[]} selectedBaseLayers
	 * @param {int[]} selectedVectorLayers
	 * @param {String} language
	 * @return layerTitle in string
	 */
	public static String getTitleOfLayer(OpenLayersManager opManager, int[] selectedBaseLayers,
			int[] selectedVectorLayers, String language) {
		String layerTitle = opManager.getRasterLayers().get(selectedBaseLayers[0]).
				getDisplayName(language);
		if (selectedVectorLayers != null) {
			Arrays.sort(selectedVectorLayers);//Sort the array of vector layers. The layers should be in order so, the first one is the one that
			//will be show on top
			for (int i = selectedVectorLayers.length - 1; i >= 0; i--) {
				if (opManager.getVectorLayers().get(selectedVectorLayers[i]).getTitle()) {//If it should show its title we change it and end the loop
					layerTitle = opManager.getVectorLayers().get(selectedVectorLayers[i]).
							getDisplayName(language);
					break;
				}
			}
		}
		return layerTitle;
	}
}
