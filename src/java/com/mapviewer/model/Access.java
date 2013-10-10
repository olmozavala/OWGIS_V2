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
