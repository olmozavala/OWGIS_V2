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

import com.mapviewer.business.GeneraSolicitudesWCS;
import com.mapviewer.business.LayerMenuManagerSingleton;
import com.mapviewer.business.OpenLayersManager;
import com.mapviewer.model.Layer;
import com.mapviewer.conf.OpenLayerMapConfig;
import com.mapviewer.exceptions.XMLFilesException;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * This servlet is in charge of receiving the request of the tematic data. Like then the
 * user want to download a geotiff file.
 */
public class WCSServlet extends HttpServlet {

	OpenLayersManager opManager;//incharge of OpenLayers code. 
	OpenLayerMapConfig mapConfig;
	String basePath;

	@Override
	public void init() throws ServletException {
		super.init();
	}

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
	protected void processRequest(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.setContentType("text/html;charset=iso-8859-1");
		PrintWriter out = response.getWriter();

		try {
			String mainLayer = request.getParameter("mainLayer");


			Layer selectedLayer = LayerMenuManagerSingleton.getInstance().getLayerByName(mainLayer);

			String format = "";
			String cqlfilter = "";
			if (selectedLayer.isVectorLayer()) {
				format = "SHAPE-ZIP";
				cqlfilter = request.getParameter("CQLFILTER");
			} else {
				format = "image/geotiff";
			}

			String[][] solicitudWCS = GeneraSolicitudesWCS.wcsManager(selectedLayer, format, cqlfilter);
			out.println(solicitudWCS[0][0]);
//			out.println("<a href="+solicitudWCS[i][0]+" target='_blank' >"+solicitudWCS[i][2]+".<br>Capa GeoTiff <br> Resoluci&oacute;n  "+solicitudWCS[i][1]+" m</a><br><br>");
		}catch(XMLFilesException ex){
			out.println("XMLFiles Exception: "+ ex.getMessage());
		}
		finally {
			out.close();
		}
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
