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
package com.mapviewer.model;

/*
 * This class represent a point on a map. It contains the
 * values longitude and latitude on map
 * @author vladimir
 */
public class Point {

    private Double lon;//logitude
    private Double lat;//latitude

    /**
     * Constructor of the class. We indicate the values of each property.
     * @param lon the longitude
     * @param lat the latitude
     */
    public Point(double lon, double lat) {
        this.lon = lon;
        this.lat = lat;
    }

    /**
     * This functions receives a string separated by commas with the point in the following
     * order: "long,Lat"
     * @param pointStr as a point separated by commas
     */
    public Point(String pointStr) {
        this.convertStrToPoint(pointStr);
    }

    //getters and setters
    public double getLon() {
        return lon;
    }

    public void setLon(double lon) {
        this.lon = lon;
    }

    public double getLat() {
        return lat;
    }

    public void setLat(double lat) {
        this.lat = lat;
    }

    /*
    * Convert a string to Point if this is a valid point in a EPSG:4326 projection
    * @param pointStr string represent a point
    */
    public void convertStrToPoint (String pointStr) {
        if(pointStr == null || pointStr.indexOf(',') == -1) {
            this.lon = null;
            this.lat = null;
            return;
        }
        String[] tokens = pointStr.split(",");
        this.lon = Double.parseDouble(tokens[0]);
        this.lat = Double.parseDouble(tokens[1]);
        if(this.lon > 180 || this.lon < -180 || this.lat > 90 || this.lat < -90) {
            this.lon = null;
            this.lat = null;
        }
    }

    @Override
    /**
     * This function is used to convert the Point to a string separated by commas
     * in the format necesary for OpenLayers
     * @return String
     */
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(String.valueOf(this.lon));
        sb.append(", ");
        sb.append(String.valueOf(this.lat));
        return sb.toString();
    }
}
