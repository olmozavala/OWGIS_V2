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
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.mapviewer.business.NetCDFRequestManager;
import com.mapviewer.exceptions.XMLFilesException;
import com.mapviewer.model.Layer;
import java.io.PrintWriter;
import org.json.me.JSONArray;
import org.json.me.JSONException;
import org.json.me.JSONObject;

/**
 * This servelet class is in charge of generating the url for the animations of the netcdf
 * 
 */
public class NetCDFAnimationServlet extends HttpServlet {

	/**
	 * This method obtains the 'animation options' (the number of frames
	 * available for the user selection). 
	 * @param {httpServlet} request
	 * @param {HttpServletResponse}response
	 * @param {PrintWriter} out
	 * @throws ServletException
	 * @throws IOException
	 * @throws JSONException 
	 */
	protected void getAnimationOptions(HttpServletRequest request, HttpServletResponse response, PrintWriter out)
			throws ServletException, IOException, JSONException, XMLFilesException {

			String layerName = request.getParameter("layerName");
			String firstDay = request.getParameter("startDate");
			String lastDay = request.getParameter("endDate");

			LayerMenuManagerSingleton layers = LayerMenuManagerSingleton.getInstance();
			Layer layer = layers.getLayerByName(layerName);//Search current layer

			//Retrieve all the times available on the first and last day of the
			//selected range
			JSONObject jsonStartDates = new JSONObject(NetCDFRequestManager.getLayerTimeStepsForAnimation(layer, firstDay, lastDay));
			out.print(jsonStartDates.toString());
	}
	/**
	 * available for the user selection). 
	 * @param {httpServlet} request
	 * @param {HttpServletResponse}response
	 * @param {PrintWriter} out
	 * @throws ServletException
	 * @throws IOException
	 * @throws JSONException 
	 */
	protected void getTimeSteps(HttpServletRequest request, HttpServletResponse response, PrintWriter out)
			throws ServletException, IOException, JSONException, XMLFilesException {

			String layerName = request.getParameter("layerName");
			String currday = request.getParameter("day");

			LayerMenuManagerSingleton layers = LayerMenuManagerSingleton.getInstance();
			Layer layer = layers.getLayerByName(layerName);//Search current layer

			//Retrieve all the times available on the first and last day of the
			//selected range
			JSONObject jsonStartDates = new JSONObject(NetCDFRequestManager.getLayerTimeSteps(layer, currday));
			out.print(jsonStartDates.toString());
	}

	/**
	 * This method makes the request of the animation. It builds
	 * the url and makes the request.
	 * @param request
	 * @param response
	 * @param out this parameter is used to send back a string
	 * @param {boolean} kmlLink
	 * @throws ServletException
	 * @throws IOException
	 * @throws JSONException 
	 */
	protected void dispAnimation(HttpServletRequest request, HttpServletResponse response, PrintWriter out, Boolean kmlLink)
			throws ServletException, IOException, JSONException, XMLFilesException {

			String layerName = request.getParameter("layerName");
			String datesStr = request.getParameter("dates");
			String palette = request.getParameter("palette");
			String colorscalerange = request.getParameter("colorscalerange");
			String elevation = request.getParameter("elevation");
			String videores = request.getParameter("videores");

			int animRes = 0;

			LayerMenuManagerSingleton layers = LayerMenuManagerSingleton.getInstance();
			Layer layer = layers.getLayerByName(layerName);//Search current layer
			
			String finalRequest = layer.getServer()+ "?";
			finalRequest+= "REQUEST=GetMap&";
			finalRequest+= "VERSION=1.3.0&";
			finalRequest+= "SRS="+layer.getProjection()+"&";
			finalRequest+= "CRS=CRS:84&";// WHAT IS THIS PARAMETER

			switch(videores){
				case "high":
					animRes = 512;
					break;
				case "normal":
					animRes = 256;
					break;
				case "low":
					animRes = 128;
					break;
				default:
				animRes = 128;
					break;
			}

			if( (layer.getStyle().equals("vector")||
				layer.getStyle().equals("contour") ||
				layer.getStyle().equals("arrows")  ||
				layer.getStyle().equals("barb") ) && (animRes < 512) ){
				//If we are animating vectors into lower resolutions we don't
				// display the vectors, they look bad.
				finalRequest+= "STYLES=boxfill/"+palette+"&";
			}else{
				finalRequest+= "STYLES="+layer.getStyle()+"/"+palette+"&";
			}
                        
                        if( !layer.getBelowMinColor().equals("") ){
				//If we are animating vectors into lower resolutions we don't
				// display the vectors, they look bad.
				finalRequest+= "BELOWMINCOLOR="+layer.getBelowMinColor()+"&";
			}
                        if( !layer.getAboveMaxColor().equals("") ){
				//If we are animating vectors into lower resolutions we don't
				// display the vectors, they look bad.
				finalRequest+= "ABOVEMAXCOLOR="+layer.getAboveMaxColor()+"&";
			}

//			finalRequest+= "WIDTH="+animRes+"&";//width and height of the image
//			finalRequest+= "HEIGHT="+animRes+"&";

			finalRequest+= "WIDTH=123&";//width and height of the image
			finalRequest+= "HEIGHT=79&";

			finalRequest+= "ELEVATION="+elevation+"&";

			if(kmlLink){
				finalRequest+= "FORMAT=application/vnd.google-earth.kmz&";
			}else{
				finalRequest+= "FORMAT=image/gif&";
			}
			finalRequest+= "TRANSPARENT=true&";
			finalRequest+= "LAYERS="+layer.getName()+"&";
			finalRequest+= "BBOX="+layer.getBbox()+"&";
			finalRequest+= "TIME="+datesStr+"&";
			finalRequest+= "COLORSCALERANGE="+colorscalerange;

			//Sends the final request back
			out.println(finalRequest);
	}

	/** 
	 * Processes requests for both HTTP <code>GET</code> and <code>POST</code> methods.
	 * This servlet is used with the /ncAnimation request, and it
	 * creates the final request send it to the ncWMS server to obtain
	 * the netcdf animation. 
	 * @param request servlet request
	 * @param response servlet response
	 * @throws ServletException if a servlet-specific error occurs
	 * @throws IOException if an I/O error occurs
	 */
	protected void processRequest(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		PrintWriter out = response.getWriter();

		try {
			response.setContentType("text/html;charset=UTF-8");

			String req = request.getParameter("request");
			switch(req.toLowerCase()){
				case "dispanimation":
					dispAnimation(request, response, out, false);
					break;
				case "generatekmzlink":
					dispAnimation(request, response, out, true);
					break;
				case "getanimtimes"://This is the set of days for a range of data
					getAnimationOptions(request, response, out);
					break;
				case "gettimesteps"://This obtains the times for an specific day
					getTimeSteps(request, response, out);
					break;
			}
		} catch (JSONException | XMLFilesException ex) {
			System.out.println("Exception reading NetCDF dates: " + ex.getMessage());
		} finally {
			out.close();
		}
	}

	// <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
	/** 
	 * Handles the HTTP <code>GET</code> method.
	 * @param request servlet request
	 * @param response servlet response
	 * @throws ServletException if a servlet-specific error occurs
	 * @throws IOException if an I/O error occurs
	 */
	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		processRequest(request, response);
	}

	/** 
	 * Handles the HTTP <code>POST</code> method.
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

	/** 
	 * Returns a short description of the servlet.
	 * @return a String containing servlet description
	 */
	@Override
	public String getServletInfo() {
		return "Short description";
	}// </editor-fold>
}
///ncAnimation?layerName=1/qtot&startDate=2011-11-11T00:00:00.000Z&endDate=2011-11-12T00:00:00.000Z