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
			int zoomLevel = Integer.parseInt((String) request.getParameter("zoom"));
			String mainLayer = (String) request.getParameter("mainLayer");


			Layer selectedLayer = LayerMenuManagerSingleton.getInstance().getLayerByName(mainLayer);

			String format = "";
			String cqlfilter = "";
			if (selectedLayer.isVectorLayer()) {
				format = "SHAPE-ZIP";
				cqlfilter = (String) request.getParameter("cqlfilter");
			} else {
				format = "image/geotiff";
			}

			String[][] solicitudWCS = GeneraSolicitudesWCS.wcsManager(zoomLevel, selectedLayer, format, cqlfilter);
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
