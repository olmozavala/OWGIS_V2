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

import com.mapviewer.business.LayerMenuManagerSingleton;
import com.mapviewer.exceptions.XMLFilesException;
import com.mapviewer.model.BoundaryBox;
import com.mapviewer.model.Layer;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.net.URL;
import java.text.DecimalFormat;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * This servlet obtains the 'punctual' data of the layers by generating a WMS
 * 'GetFeatureInfo' request. In order to avoid the AJAX restriction of the 'same domain
 * request this servlet makes the request on its own and stores all the result in a
 * string, then it returns the string to the page. Fills in the ${server} variable
 *
 * @author Olmo Zavala Romero
 */
@WebServlet(name = "RedirectServersServlet", urlPatterns = {"/redirect"})
public class RedirectServersServlet extends HttpServlet {

	/**
	 * Processes requests for both HTTP
	 * <code>GET</code> and
	 * <code>POST</code> methods.
	 *
	 * @param request servlet request
	 * @param response servlet response
	 * @throws ServletException if a servlet-specific error occurs
	 * @throws IOException if an I/O error occurs
	 */
	protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("text/html;charset=iso-8859-1");

		synchronized (this) {
			String reqResult = "";
			try {
				reqResult = generateRedirect(request);
			} catch (Exception e) {
				Logger.getLogger(RedirectServersServlet.class.getName()).log(Level.SEVERE, "Error MapViewer en Redirect en ProcessRequest" + e.getMessage(), e);
			}
			request.setAttribute("server", reqResult);
		}
		RequestDispatcher view = request.getRequestDispatcher("Pages/Datos/Datos.jsp");//basically where to display the response 
		view.forward(request, response);
	}

	/**
	 *
	 * @param request object containing the parameters
	 *
	 * @return string that contains the html to geenrate the WCS page
	 */
	private String generateRedirect(HttpServletRequest request) {
		String result = "";
		boolean finish = false; //check to see if the request finished
		int numberOfRetries = 10; //retry number
		int retry = 0;
		String server = request.getParameter("server");
		String layers = request.getParameter("LAYERS");
		String styles = request.getParameter("STYLES");
		String width = request.getParameter("WIDTH");
		String height = request.getParameter("HEIGHT");
		String srs = request.getParameter("SRS");
		String format = request.getParameter("FORMAT");
		String service = request.getParameter("SERVICE");
		String version = request.getParameter("VERSION");
		String req = request.getParameter("REQUEST");
		String exceptions = request.getParameter("EXCEPTIONS");
		String bbox = request.getParameter("BBOX");
		
		String x = request.getParameter("x");
		String y = request.getParameter("y");
		String infoFormat = request.getParameter("INFO_FORMAT");
		String queryLayers = request.getParameter("QUERY_LAYERS");
		String featureCount = request.getParameter("FEATURE_COUNT");
		String cql_filter = request.getParameter("CQL_FILTER");

		//Only for Ol3 We need to be sure is always necessary
		BoundaryBox bboxObject= new BoundaryBox(bbox);
		bbox = bboxObject.toString();

		//final url request. 
		String finalRequest = server + "?LAYERS=" + layers + "&STYLES=" + styles + "&WIDTH=" + width + "&HEIGHT=" + height + "&SRS=" + srs + "&FORMAT=" + format + "&SERVICE=" + service + "&VERSION=" + version + "&REQUEST=" + req + "&EXCEPTIONS=" + exceptions + "&BBOX=" + bbox + "&x=" + x + "&y=" + y + "&INFO_FORMAT=" + infoFormat + "&QUERY_LAYERS=" + queryLayers + "&FEATURE_COUNT=" + featureCount;

		//Adding the CQL filter request
		if (cql_filter != null) {
			//The next line replaces spaces with the proper space character. 
			//It may be necessary to replace other chars that are not allowed inside an URL
			cql_filter = cql_filter.replace(" ", "%20");
			finalRequest += "&CQL_FILTER=" + cql_filter;
		}

		String elevation = "";
		String time = "";
		String timeSeriesUrl = "";

		//Just for netcdf
		boolean isNetCDF = Boolean.parseBoolean(request.getParameter("NETCDF"));

		if (isNetCDF) {//In this case we have a NetCDF layer

			elevation = request.getParameter("ELEVATION");
			time = request.getParameter("TIME");
			if( elevation != "" && elevation != null ){
                            finalRequest += "&ELEVATION=" + elevation;
                        }
			if (!time.equals("No current date")) {
				finalRequest += "&TIME=" + time;

				timeSeriesUrl = server + "?LAYERS=" + layers + "&STYLES=" + styles + "&WIDTH=" + width + "&HEIGHT=" + height + "&SRS=" + srs
						+ "&FORMAT=image/png&SERVICE=" + service + "&VERSION=" + version
						+ "&REQUEST=" + req + "&BBOX=" + bbox + "&x=" + x + "&y=" + y + "&INFO_FORMAT=image/png&QUERY_LAYERS=" + queryLayers;
                                if(elevation != null){
                                    timeSeriesUrl += "&ELEVATION=" + elevation ;
                                }
			}
		}

		DecimalFormat myFormatter = new DecimalFormat("###,###.###");

		//we keep trying until server answers or numberOfRetries is reached. 
		while (!finish && retry < numberOfRetries) {
			try {
				URL acdm = new URL(finalRequest);//make the request to the server. 
				try {
					acdm.openConnection(); //we connect ot eh server. 
				} catch (MalformedURLException e) {
					System.out.println("Error MapViewer en RedirectServer en generateRedirect" + e.getMessage());
				}
				//repeat process until we obtain data. 
				retry++; //increment tryies. 
				finish = true; //by default we supose data is good. 
				result = "";
				InputStreamReader input = new InputStreamReader(acdm.openStream());
				BufferedReader in = new BufferedReader(input);
				String inputLine;

				// These two variables are only used when requesting ncWMS layers
				// and are used to generate the link for the vertical profile
				float lon = 0;
				float lat = 0;

				boolean ncWMS_HeaderAdded = false;//Keeps track of adding a header of main layer

				//sometimes the server return wierd characters so we filter them.  (caracteres ,??,*, etc.) 
				while ((inputLine = in.readLine()) != null) {
					//In version 1.7.5 of the geoserver, we otain an error when we ask for data outside the the correspoinding layer
					//in this case we detect the execption type and we terminate. 

					if (inputLine.contains("Internal error occurred")) {
						result = "";
						break;
					}
					if (inputLine.contains("")
							|| inputLine.contains("??")
							|| inputLine.contains("`")
							|| inputLine.contains("*")) {
						finish = false;//if a invalid character comes we dont terminate it. 
						break;
					} else {
						// If using ncWMS the responses are very different so we need to 'patch' 
						// the answer in order to make it look nice. 
						if (isNetCDF) {
							if(!ncWMS_HeaderAdded){
								result += " <hr style='border: 0;" +
"											height: 1px;" +
"											background-image: -webkit-linear-gradient(left, rgba(0,0,0,0), rgba(0,0,0,0.75), rgba(0,0,0,0)); " +
"											background-image:    -moz-linear-gradient(left, rgba(0,0,0,0), rgba(0,0,0,0.75), rgba(0,0,0,0)); " +
"											background-image:     -ms-linear-gradient(left, rgba(0,0,0,0), rgba(0,0,0,0.75), rgba(0,0,0,0)); " +
"											background-image:      -o-linear-gradient(left, rgba(0,0,0,0), rgba(0,0,0,0.75), rgba(0,0,0,0));" +
"											margin: 5px; '>";
								ncWMS_HeaderAdded = true;
							}
							// We are interested in 3 lines. The one that contains the 'value'
							// at the specific point. The ones that contains 'lon' and 'lat'
							// to create the vertical profile link
							if (inputLine.toLowerCase().contains("longitude")) {
								inputLine = inputLine.replace("<longitude>", "");
								inputLine = inputLine.replace("</longitude>", "");
								lon = Float.parseFloat(inputLine);
							}

							if (inputLine.toLowerCase().contains("latitude")) {
								inputLine = inputLine.replace("<latitude>", "");
								inputLine = inputLine.replace("</latitude>", "");
								lat = Float.parseFloat(inputLine);
							}

							if (inputLine.contains("value")) {
								if (!inputLine.contains("none")) {
									inputLine = inputLine.replace("<value>", "");
									inputLine = inputLine.replace("</value>", "");
									float value = Float.parseFloat(inputLine);

									if (layers.toLowerCase().contains("Temp") || layers.toLowerCase().contains("temp")) {
										result += "<b >Temp: </b>" + myFormatter.format(value) + " &degC <br>";//if no random characters then we save the result. 
									} else {
										result += "<b >Value: </b>" + myFormatter.format(value) + " ADD_UNITS <br>";
									}
								} else {
									result = "";
									break;
								}
							}

						} else {
							result += inputLine;
						}
					}
				}

				//Finally we add the link to generate the vertical profile
				// for netCDF layers with more than one elevation.
				// Not needed any more, the vertical profile and vertical transect is generated by PunctualData.js
				//if (isNetCDF) {

				//	LayerMenuManagerSingleton layersSing = LayerMenuManagerSingleton.getInstance();
				//	Layer layer = layersSing.getLayerByName(layers);//Search current layer

				//	BoundaryBox BBOX = layer.getBbox();
				//	if ((lat <= BBOX.getMaxLat()) && (lat >= BBOX.getMinLat())
				//			&& (lon <= BBOX.getMaxLong()) && (lon >= BBOX.getMinLong())) {

				//		if (elevation != null && !elevation.equals("")) {
				//			String vertProfUrl = server + "?REQUEST=GetVerticalProfile&VERSION=1.1.1&STYLES="+styles+"&LAYER=" + layers + "&CRS=CRS:84"
				//					+ "&POINT=" + lon + " " + lat + "&FORMAT=image/png";
				//			if (!time.equals("No current date")) {
				//				vertProfUrl += "&TIME=" + time;
				//			}//if no current date
				//			result += "<b>Vertical profile: </b> <a href='#' onclick=\"owgis.utils.popUp('" + vertProfUrl + "',520,420)\" > show </a><br>";
				//		}
				//		// Add link for time series plot
				//		time = request.getParameter("BOTHTIMES");

				//		//We only add the link if we receive the TIME information
				//		if (!time.equals("No current date") && !time.equals("undefined")) {
				//			timeSeriesUrl += "&TIME=" + time;
				//			result += "<b>Time series plot: </b> <a href='#' onclick=\"owgis.utils.popUp('" + timeSeriesUrl + "',520,420)\" > show </a><br>";
				//		}//
				//	} else {
				//		result = "";
				//	}//else outside BBOX

				//}//if isNetCDF

				in.close();//close the connection with the server. 
				input.close();
			} catch (IOException ex) {
				Logger.getLogger(RedirectServersServlet.class.getName()).log(Level.SEVERE, "Error MapViewer en RedirectServer en generateRedirect" + ex.getMessage(), ex);
				finish = false;
			}
		}
		if (retry == numberOfRetries) {//if max number of tryies is reached we just send an empty string. 
			result = "";
		}

		return result;
	}

	// <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
	/**
	 * Handles the HTTP
	 * <code>GET</code> method.
	 *
	 * @param request servlet request
	 * @param response servlet response
	 * @throws ServletException if a servlet-specific error occurs
	 * @throws IOException if an I/O error occurs
	 */
	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		synchronized (this) {
			this.processRequest(request, response);
		}
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
		synchronized (this) {
			this.processRequest(request, response);
		}
	}

	/**
	 * Returns a short description of the servlet.
	 *
	 * @return a String containing servlet description
	 */
	@Override
	public String getServletInfo() {
		return "Short description";
	}// </editor-fold>
}
