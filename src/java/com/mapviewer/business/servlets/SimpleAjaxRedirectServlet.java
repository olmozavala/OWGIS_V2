/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mapviewer.business.servlets;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author olmozavala
 */
public class SimpleAjaxRedirectServlet extends HttpServlet {

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
        //variable 'server' we put the data of the request. 
        PrintWriter out = response.getWriter();
        synchronized (this) {
            String reqResult = "";
            try {
                reqResult = obtainRedirectText(request);
                //Sends the final request back
                out.println(reqResult);
            } catch (Exception e) {
                Logger.getLogger(RedirectServersServlet.class.getName()).log(Level.SEVERE, "Error MapViewer en Redirect en ProcessRequest" + e.getMessage(), e);
            } finally {
                out.close();
            }
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

    private String obtainRedirectText(HttpServletRequest request) {
        String result = "";
        boolean finish = false; //boolean to check if the request is done. 
        int numberOfRetries = 10; //This is the number of tries the class will try to make the HTML request
        int retry = 0;
        String server = request.getParameter("server");
        String possibleOptions[] = {"layers", "styles", "width", "height",
               "srs", "format", "service", "version", "bbox",
               "request", "x", "y", "item", "elevation", "time"};

        String finalRequest = server + "?";
        for(int i = 0; i < possibleOptions.length; i++){
            if(request.getParameter(possibleOptions[i]) != null) {
                finalRequest += possibleOptions[i] + "=" + request.getParameter(possibleOptions[i]) +"&";
            }
        }

		// If there is no time data we remove it. TODO this is hard coded there
		// is a need to fix it
		if(finalRequest.contains("time=No current date")){
			finalRequest = finalRequest.replaceFirst("time=No current date", "");
		}

        //while the server doesnt answer we keep trying until numberOfRetries
        while (!finish && retry < numberOfRetries) {
            try {
                URL acdm = new URL(finalRequest);//reques to server
                try {
                    acdm.openConnection(); //connect to server
                } catch (MalformedURLException e) {
                    System.out.println("Error on SimpleAjaxRedirectServlet" + e.getMessage());
                }
                //repeat until get correct data. 
                retry++;
                finish = true; 
                result = "";
                InputStreamReader input = new InputStreamReader(acdm.openStream());
                BufferedReader in = new BufferedReader(input); 
                String inputLine;

               
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
                        finish = false;//dont end if invalid character is present. 
                        break;
                    } else {
                            result += inputLine;//save input if no wierd characters appear. 
                    }
                }


                in.close();//close connection to server. 
                input.close();
            } catch (IOException ex) {
                Logger.getLogger(RedirectServersServlet.class.getName()).log(Level.SEVERE, "Error MapViewer en obtainRedirectText" + ex.getMessage(), ex);
                finish = false;
            }
        }
        if (retry == numberOfRetries) {//if max number of tryies return empty string. 
            result = "";
        }

        return result;
    }
}
