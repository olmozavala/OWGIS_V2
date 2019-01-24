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
 * This class is used to store user information, like how many times a user has access the 
 * application by storing his ip, the date, and the access region. 
 *   
 */
package com.mapviewer.business;

import com.mapviewer.model.*;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.Date;
import java.util.Locale;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import net.sf.javainetlocator.InetAddressLocator;
import net.sf.javainetlocator.InetAddressLocatorException;

/**
 * This class provides a counter of the accesses to the mapviewer. 
 * This counter can be access by AccessInfoServelet 
 */
 
public class AccessControls {
    private static ArrayList<Access> accesos; //internal array of type Access to keep track of all the acesses
    private static AccessControls instance = null; //intance variable used to create a AcessControls type 


    /**
     * This is a protected constructor becuase this is a singleton class. 
     *
     */
    protected AccessControls() {
        //initialize arraylist. 
        accesos = new ArrayList<Access>();
        
    }

    /**
     * This is the function that should be used to obtain the instance of an object
     * 
     * @return
     */
    public static AccessControls getInstance(){
        if(instance==null){
            instance = new AccessControls();
        }
        return instance;
    }

    /**
     * Adds an entry to an already existing list. 
     * 
     * @param {String} ip Ip Direction of person who makes request
     * @param {Date} accessDate Date and time of access
     * @param {String} region Region of the user
     */
    public static void addAccess(String ip, Date accessDate, String region){
        accesos.add(new Access(ip, accessDate,region) );
    }

    /**
     * Obtains the list of current accesses.    
     * @return
     */
    public ArrayList<Access> getAccess(){
        return accesos;
    }
    /**
     * This function holds the accesses to the server, the only thing it does is to increase a counter and store the ip.    
     * @param session {HttpSession} session variable 
     * @param request {HttpServeletRequest} request 
     * @throws java.net.UnknownHostException
     * @throws net.sf.javainetlocator.InetAddressLocatorException
     */
    public static void manageAccess(HttpSession session, HttpServletRequest request) throws UnknownHostException, InetAddressLocatorException{
        //make sure it is a new session 
        if(session.isNew()){
                if(request.getRemoteAddr().startsWith("10.")){                
                    AccessControls.addAccess(request.getRemoteAddr(), new Date(session.getCreationTime()),"UNIATMOS");
                }else{
                    InetAddress ipAddress = InetAddress.getByName(request.getRemoteAddr());
                    Locale country = InetAddressLocator.getLocale(ipAddress);
                    AccessControls.addAccess(request.getRemoteAddr(), new Date(session.getCreationTime()),country.getDisplayCountry());
                }                     
            }
    }
}
