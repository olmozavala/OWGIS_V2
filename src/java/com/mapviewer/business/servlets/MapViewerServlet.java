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
/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mapviewer.business.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.mapviewer.business.LayerMenuManagerSingleton;
import com.mapviewer.business.NetCDFRequestManager;
import com.mapviewer.business.OpenLayersManager;
import com.mapviewer.business.UserRequestManager;
import com.mapviewer.conf.OpenLayerMapConfig;
import com.mapviewer.exceptions.XMLFilesException;
import com.mapviewer.exceptions.XMLLayerException;
import com.mapviewer.model.Layer;
import com.mapviewer.model.PagesNames;
import com.mapviewer.model.menu.MenuEntry;
import com.mapviewer.model.menu.TreeMenuUtils;
import com.mapviewer.model.menu.TreeNode;
import com.mapviewer.tools.HtmlMenuBuilder;
import java.io.FileNotFoundException;
import java.util.Arrays;

/**
 * Servelet to process all the request of the user and incharge of presenting the client
 * with the OpenLayers configuration
 *
 *
 * @author Olmo Zavala Romero
 */
public class MapViewerServlet extends HttpServlet {

	OpenLayersManager opManager;//OpenLayers Code
	OpenLayerMapConfig mapConfig;
	NetCDFRequestManager ncManager;// This object is used to manage the netcdf curr_main_layers
	String[] linksVectorialesKmz;
	String configFilePath;

	Boolean exceptionInitializingVariables = false;

	/**
	 * Initiliazes the varibles of the Servlet 
	 * @throws FileNotFoundException
	 * @throws XMLFilesException
	 * @throws XMLLayerException 
	 */
	private void initializeVariables() throws FileNotFoundException, XMLFilesException, XMLLayerException{
			mapConfig = OpenLayerMapConfig.getInstance();

			configFilePath = getServletContext().getRealPath("/WEB-INF/conf/MapViewConfig.properties");

			mapConfig.updateProperties(configFilePath);

			//Obtains the folder where XML layers file is stored.
			String layersFolder = getServletContext().getRealPath("/layers/");
			String baseLayerMenuOrientation = mapConfig.getProperty("baseLayerMenuOrientation");
			HtmlMenuBuilder.baseLayerMenuOrientation = baseLayerMenuOrientation;

			LayerMenuManagerSingleton.setLayersFolder(layersFolder);//Set the layers folder

			opManager = new OpenLayersManager();//initialize the OpenLayers
			ncManager = new NetCDFRequestManager();

			LayerMenuManagerSingleton.getInstance().refreshTree(true);//Initializes all the layers from the XML files
	}
	/**
	 * Initializes the object that controls the access to the server
	 *
	 */
	@Override
	public void init() throws ServletException {
		try {
			initializeVariables();
		} catch (XMLFilesException ex) {
			exceptionInitializingVariables = true;
			Logger.getLogger(MapViewerServlet.class.getName()).log(Level.SEVERE, null, ex);
		} catch (FileNotFoundException ex) {
			Logger.getLogger(MapViewerServlet.class.getName()).log(Level.SEVERE, null, ex);
		}
		
		super.init();
	}
	
	/**
	 * Processes requests for both HTTP
	 * <code>GET</code> and
	 * <code>POST</code> methods.
	 *
	 * @param {HttpServletRequest} request servlet request
	 * @param {HttpServletResponse} response servlet response
	 * @throws ServletException if a servlet-specific error occurs
	 * @throws IOException if an I/O error occurs
	 */
	protected void processRequest(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		
		String nextPage = PagesNames.ERROR_PAGE;//error page, this gets modified if everything is fine.
		mapConfig.updateProperties(configFilePath);
		//its important to erase the basePath becuase it get appended again.
		try {
			
			response.setContentType("text/html;charset=iso-8859-1");
			HttpSession session = request.getSession();//Se obtiene la sesion
			
			TreeNode arbolMenuRasters = null;

			//If there was a problem initializing the variables we try to do it again.
			// This code catches information about the exception and displays it for the user.
			try {
				if(exceptionInitializingVariables){
					initializeVariables();
				}
				arbolMenuRasters = UserRequestManager.createNewRootMenu(request, session);
				exceptionInitializingVariables = false;
			} catch (XMLLayerException ex) {
				//If an exception happens, we start with the default menu
				arbolMenuRasters = UserRequestManager.createNewRootMenu(request, session);
				session.setAttribute("MenuDelUsuario", arbolMenuRasters);
				//If there is an XMLLayerException exception we just display it as
				// warning in the main site
				StringWriter sw = new StringWriter();
				ex.printStackTrace(new PrintWriter(sw));
				String exceptionInfo = ex.getMessage();
				String exceptionTrace = sw.toString();
				exceptionTrace = exceptionTrace.substring(0, exceptionTrace.indexOf("\n"));
				exceptionTrace = exceptionTrace.replace("\"","");
				exceptionTrace = exceptionTrace.replace("\'","");
				exceptionInfo = exceptionInfo.replace("\"","");
				exceptionInfo = exceptionInfo.replace("\'","");
				
				request.setAttribute("warningText", exceptionInfo);
				request.setAttribute("warningInfo", exceptionTrace);
				
				exceptionInitializingVariables = true;
			}
			
			
			if(linksVectorialesKmz  == null){
				linksVectorialesKmz = UserRequestManager.getCheckboxKmlLinks(opManager.getVectorLayers());
				HtmlMenuBuilder.vecLinks = linksVectorialesKmz;
			}
			
			//get menu entry
			MenuEntry[] rasterSelecteLayers = TreeMenuUtils.obtieneMenuSeleccionado(arbolMenuRasters);
			
			//obtain layer index
			int[] baseLayers = opManager.obtainArrayIndexOfLayers(rasterSelecteLayers);
			
			Layer curr_main_layer = opManager.getRasterLayers().get(baseLayers[0]); //get main layer of user
			
			//this variables are then read by the GlobalJavascript.jsp
			
			request.setAttribute("ncwms", curr_main_layer.isncWMS());
			request.setAttribute("currents", curr_main_layer.isoverlayStreamlines());
			request.setAttribute("layerDetails", curr_main_layer.getLayerDetails());
			request.setAttribute("zaxis", curr_main_layer.isZaxis());
			request.setAttribute("multipleDates", curr_main_layer.isMultipleDates());
			
			//Obtains the selection of the vector layers of the user.
			
			
			String defaultLang=mapConfig.getProperty("defaultLanguage");
			String availableLanguages=mapConfig.getProperty("availableLanguages");
			
			request.setAttribute("defaultLanguage", defaultLang);
			request.setAttribute("availableLanguages", availableLanguages);
			
			String[] selectedVectorLayers = UserRequestManager.manageVectorLayersOptions(request, session);
			int[] vectorLayers = opManager.obtainIndexForOptionalLayers(selectedVectorLayers);
			
			//Setting the locale gotten from the one seleted by the user on the website
			String language=request.getParameter("_locale");
			
			//setting Default locale from the properties file on first time page load
			if(language==null || "".equals(language)){
				language=defaultLang;
			}
			
			//openlayers configuration of javascript.
			String openLayerConfig = opManager.createOpenLayConfig(baseLayers, vectorLayers, language);
			
			//This is for the configuration of the page, this are read by the javascript throuhg jsp.
			
			request.setAttribute("openLayerConfig", openLayerConfig);
			request.setAttribute("language", language);
			//add the link of the vactor layers the one with the checkboxes.
			request.setAttribute("sizeVectLayers", opManager.getVectorLayers().size());
			request.setAttribute("linksKmzVect", linksVectorialesKmz);
			
			String palette = request.getParameter("paletteSelect");
			if (palette == null) {
				palette = curr_main_layer.getPalette();
			}
			request.setAttribute("palette", palette);
			
			//We define the link to request a KML file
			request.setAttribute("linkKML", UserRequestManager.getKmlLink(opManager, baseLayers, palette));
			//Defines the title of the layer
			String layerTitle = UserRequestManager.getTitleOfLayer(opManager, baseLayers, vectorLayers, language);
			//we put the title of the layer next to Gulf of Mexico.
			request.setAttribute("layerTitle", layerTitle);
			request.setAttribute("titleSize", layerTitle.length());
			request.setAttribute("totalLayers", opManager.getTotalVisibleLayers());
			request.setAttribute("_id_first_main_layer", (opManager.getBackgroundLayers()).size());//Index of the  main layer (how many background layers we have)
			request.setAttribute("mainLayer", curr_main_layer.getName());
			request.setAttribute("style", curr_main_layer.getStyle());
			request.setAttribute("max_time_range", curr_main_layer.getMaxTimeLayer());
			request.setAttribute("newSession", session.isNew());//Inidicates if is the first time the map was loaded
			
			request.setAttribute("paletteUrl", NetCDFRequestManager.getPaletteUrl(curr_main_layer, palette));
			
			//Contains configuration of the Map like zoom, center, origin, etc.
			request.setAttribute("mapConfig", mapConfig.toJSONObject());
			
			request.setAttribute("cqlcols", curr_main_layer.getCql_cols());
			//The next variable is used to decide if the layer has
			// a custom CQL filter
			if (curr_main_layer.getCql_cols().equals("")) {
				request.setAttribute("cqlfilter", false);
			} else {
				request.setAttribute("cqlfilter", true);
			}
			
			//Setting the animation URL if any
			String animUrl = request.getParameter("animationURL");
			request.setAttribute("animationURL", animUrl == null ? "" : animUrl);
			
			//redirect the page.
			nextPage = PagesNames.MAIN_PAGE;
			//Detect Mobile Browser
			String mobileGet = request.getParameter("mobile");
			String ua = request.getHeader("User-Agent").toLowerCase();
			if ( ua.matches("(?i).*((android|bb\\d+|meego).+mobile|avantgo|bada\\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino).*") 
                                || ua.indexOf("iphone") != -1 || ua.indexOf("ipad") != -1 
                                || ua.indexOf("htc_flyer") != -1 || ua.indexOf("maemo") != -1 || ua.indexOf("tablet") != -1 || ua.indexOf("hpwos") != -1 || ua.indexOf("playbook") != -1
                                || ua.indexOf("palm") != -1 || ua.indexOf("webos") != -1
                                || ua.substring(0, 4).matches("(?i)1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\\-(n|u)|c55\\/|capi|ccwa|cdm\\-|cell|chtm|cldc|cmd\\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\\-s|devi|dica|dmob|do(c|p)o|ds(12|\\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\\-|_)|g1 u|g560|gene|gf\\-5|g\\-mo|go(\\.w|od)|gr(ad|un)|haie|hcit|hd\\-(m|p|t)|hei\\-|hi(pt|ta)|hp( i|ip)|hs\\-c|ht(c(\\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\\-(20|go|ma)|i230|iac( |\\-|\\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\\/)|klon|kpt |kwc\\-|kyo(c|k)|le(no|xi)|lg( g|\\/(k|l|u)|50|54|\\-[a-w])|libw|lynx|m1\\-w|m3ga|m50\\/|ma(te|ui|xo)|mc(01|21|ca)|m\\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\\-2|po(ck|rt|se)|prox|psio|pt\\-g|qa\\-a|qc(07|12|21|32|60|\\-[2-7]|i\\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\\-|oo|p\\-)|sdk\\/|se(c(\\-|0|1)|47|mc|nd|ri)|sgh\\-|shar|sie(\\-|m)|sk\\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\\-|v\\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\\-|tdg\\-|tel(i|m)|tim\\-|t\\-mo|to(pl|sh)|ts(70|m\\-|m3|m5)|tx\\-9|up(\\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\\-|your|zeto|zte\\-") 
                                || (mobileGet != null && mobileGet.equalsIgnoreCase("true")) 
                                || (request.getParameter("mobile") != null && request.getParameter("mobile").equals("true"))) {
				nextPage = PagesNames.MOBILE_PAGE;
				request.setAttribute("mobile", "true");//get get variable to true
			} else {
				request.setAttribute("mobile", "false");
			}
			
		} catch (XMLFilesException ex) {
			request.setAttribute("errorText", "Unable to parse XML files: " + ex.getMessage());
			StringWriter sw = new StringWriter();
			ex.printStackTrace(new PrintWriter(sw));
			String exceptionTrace = sw.toString();
			request.setAttribute("traceText", exceptionTrace);
			
			Logger.getLogger(MapViewerServlet.class.getName()).log(Level.SEVERE, null, ex);
			
		} catch (Exception ex) {
			request.setAttribute("errorText", "Inialization Exception: " + ex.getMessage());
			StringWriter sw = new StringWriter();
			ex.printStackTrace(new PrintWriter(sw));
			String exceptionTrace = sw.toString();
			request.setAttribute("traceText", exceptionTrace);
			
			Logger.getLogger(MapViewerServlet.class.getName()).log(Level.SEVERE, null, ex);
		}
		
		RequestDispatcher view = request.getRequestDispatcher(nextPage);
		view.forward(request, response);
	}
	
	/**
	 * Processes requests for both HTTP
	 * <code>GET</code> and
	 * <code>POST</code> methods.
	 *
	 * Logger.getLogger(MapViewerServlet.class.getName()).log(Level.SEVERE, null, ex);
	 * } catch (Exception ex) {
	 * request.setAttribute("errorText", "Exception: " + ex.getMessage());
	 * StringWriter sw = new StringWriter();
	 * ex.printStackTrace(new PrintWriter(sw));
	 * String exceptionTrace = sw.toString();
	 * request.setAttribute("traceText", exceptionTrace);
	 *
	 * Logger.getLogger(MapViewerServlet.class.getName()).log(Level.SEVERE, null, ex);
	 * }
	 *
	 *
	 * RequestDispatcher view = request.getRequestDispatcher(nextPage);
	 * view.forward(request, response);
	 *
	 * }
	 *
	 * /**
	 * Handles the HTTP
	 * <code>GET</code> method.
	 *
	 * @param {httpServletRequest} request servlet request
	 * @param {HttpServletResponse} response servlet response
	 * @throws ServletException if a servlet-specific error occurs
	 * @throws IOException if an I/O error occurs
	 */
	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		processRequest(request, response);
	}
	
	/**
	 * Handles the HTTP
	 * <code>POST</code> method.
	 *
	 * @param request servlet request
	 * @param response servlet response
	 * @throws ServletException if a servlet-specific error occurs
	 * @throws IOException if an I/O error occurs
	 */
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		processRequest(request, response);
	}
}