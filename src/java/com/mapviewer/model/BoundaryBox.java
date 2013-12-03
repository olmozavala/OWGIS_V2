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

/**
 * This class represent a boundary box of a layer or a map. It contains the minimum and maximum
 * values longitud and latitud of the layer or map
 * @author Olmo Zavala Romero
 */
public class BoundaryBox {

    private double minLong;//Minimum longitude
    private double maxLong;//Maximum longitude
    private double minLat;//Minimum latitude
    private double maxLat;//Maximum latitud

    /**
     * Constructor of the class. We indicate the values of each property.
     * @param {double} minLong double Minimum longitude
     * @param {double} maxLong double Maximum longitude
     * @param {double} minLat double Minimum Latitude
     * @param {double} maxLat doulbe Maximum latitude
     */
    public BoundaryBox(double minLong, double maxLong, double minLat, double maxLat) {
        this.minLong = minLong;
        this.maxLong = maxLong;
        this.minLat = minLat;
        this.maxLat = maxLat;
    }

    /**
     * This functions receives a string separated by commas with the boundary box in the following
     * order: "minLong,minLat,maxLong,maxLat"
     * @param {String} bboxstr String boundary box separated by commas
     */
    public BoundaryBox(String bboxstr) {
        this.updateByString(bboxstr);
    }


    public double getMaxLat () {
        return maxLat;
    }

    public void setMaxLat (double val) {
        this.maxLat = val;
    }

    public double getMaxLong () {
        return maxLong;
    }

    public void setMaxLong (double val) {
        this.maxLong = val;
    }

    public double getMinLat () {
        return minLat;
    }

    public void setMinLat (double val) {
        this.minLat = val;
    }

    public double getMinLong () {
        return minLong;
    }

    public void setMinLong (double val) {
        this.minLong = val;
    }

    @Override
    /**
     * This function is used to convert the boundary box in a string separated by commas
     * in the format necesary for OpenLayers
     *@return String
     */
    public String toString() {        
        String maxLongStr = String.valueOf(maxLong);
        String minLongStr = String.valueOf(minLong);
        String maxLatStr = String.valueOf(maxLat);
        String minLatStr = String.valueOf(minLat);
        return minLongStr+","+minLatStr+","+maxLongStr+","+maxLatStr;
    }

    /**
     * This functions receives a string separated by commas with the boundary box in the following
     * order: "minLong,minLat,maxLong,maxLat"
     * @param {String} bboxstr String boundary box separated by commas
     */
    public void updateByString(String bboxStr){
		String[] bboxTokens = bboxStr.split(",");
		this.minLong = Double.parseDouble(bboxTokens[0]);
		this.minLat = Double.parseDouble(bboxTokens[1]);
		this.maxLong = Double.parseDouble(bboxTokens[2]);
		this.maxLat = Double.parseDouble(bboxTokens[3]);                        
    }

	/**
	 * This function fixes the coordinates when they are filpped
	 */
	public void fixFlippedCoords(){
		double temp = this.minLat;
		this.minLat = this.maxLong;
		this.maxLong = temp;
	}

}

