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
 * This servlet is used to avoid the 'cross origin' problem. It makes the call
 * of the received url and returns the result as a string. 
 * @author Olmo Zavala
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
				String url = request.getParameter("url");
                reqResult = obtainRedirectText(url);
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

    private String obtainRedirectText(String url) {
        String result = "";
        boolean finish = false; //boolean to check if the request is done. 
        int numberOfRetries = 10; //This is the number of tries the class will try to make the HTML request
        int retry = 0;

        //while the server doesnt answer we keep trying until numberOfRetries
        while (!finish && retry < numberOfRetries) {
            try {
                URL owgis = new URL(url);//reques to server
                try {
                    owgis.openConnection(); //connect to server
                } catch (MalformedURLException e) {
                    System.out.println("Error on SimpleAjaxRedirectServlet" + e.getMessage());
                }
                //repeat until get correct data. 
                retry++;
                finish = true; 
                result = "";
                InputStreamReader input = new InputStreamReader(owgis.openStream());
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
            result = "Failed to call: " + url;
        }

        return result;
    }
}
