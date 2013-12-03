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

package com.mapviewer.model;

import java.util.Date;

/**
 * This class was used to record te access of the server. It recorded the ip
 * of the user, the date of access and the country. Currently it is not being used but
 * the functionality exist. 
 * @author Olmo Zavala Romero
 */
public class Access {
    private String ip;
    private Date accessDate;
    private String region;

    /**
     *@param{String} ip
     *@param{Date} accesDate
     */
    public Access(String ip, Date accessDate) {
        this.ip = ip;
        this.accessDate = accessDate;
        this.region= "Otra";
    }
    
    /**
     *@param{String} ip  
     *@param{Date} accessDate
     *@param{String} region
     */
    public Access(String ip, Date accessDate, String region) {
        this.ip = ip;
        this.accessDate = accessDate;
        this.region=region;
    }

    

    public Date getAccessDate() {
        return accessDate;
    }

    public void setAccessDate(Date accessDate) {
        this.accessDate = accessDate;
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }


}
