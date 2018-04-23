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
 * This is the class in charge of getting the request of the animations, palettes, etc of the layers on the ncWMS server. 
 *
 */
package com.mapviewer.business;

import com.mapviewer.exceptions.XMLLayerException;
import com.mapviewer.model.Layer;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import org.json.me.JSONArray;
import org.json.me.JSONException;
import org.json.me.JSONObject;

/**
 *
 * @author Olmo Zavala-Romero
 */
public class NetCDFRequestManager {

	/**
	 * This functions makes a URL request to one ncWMS server to retrieve the
	 * valid animation options for the selected dates
	 *
	 * @param {Layer} layer
	 * @param {String} startStr
         * @param {String} endStr
	 * @return
	 */
	public static String getLayerTimeStepsForAnimation(Layer layer, String startStr, String endStr) {

		URL ncReq;
		String urlRequest = buildRequest(layer, "GetMetadata", "animationTimesteps");
		urlRequest += "&start=" + startStr;
		urlRequest += "&end=" + endStr;

		JSONObject timeSteps = new JSONObject();

		try {
			ncReq = new URL(urlRequest);
			ncReq.openConnection();
			InputStreamReader input = new InputStreamReader(ncReq.openStream());
			BufferedReader in = new BufferedReader(input);
			String inputLine;

			while ((inputLine = in.readLine()) != null) {
				if (!inputLine.trim().equalsIgnoreCase("")) {// TODO check for errros
					timeSteps = new JSONObject(inputLine);

//					datesWithData = (JSONObject) layerDetails.get("datesWithData");
					/*
					 * //Iterating over the years for(Enumeration years =
					 * dates.keys(); years.hasMoreElements();){ String year =
					 * (String) years.nextElement(); JSONObject yearJson =
					 * dates.getJSONObject(year); for(Enumeration months =
					 * yearJson.keys(); months.hasMoreElements();){ String month
					 * = (String) months.nextElement(); int x = 1; } }
					 */
				}
			}

		} catch (JSONException | IOException e) {
			System.out.println("Error MapViewer en RedirectServer en generateRedirect" + e.getMessage());
			return "Error getting the layerDetials:" + e.getMessage();
		}
		return timeSteps.toString();
	}

	/**
	 * This functions makes a URL request to one ncWMS server to retrieve the
	 * valid times one layer has for an specific day.
	 *
	 * @param {Layer}layer
	 * @param {String}day
	 * @return
	 */
	public static String getLayerTimeSteps(Layer layer, String day) {

		URL ncReq;
		String urlRequest = buildRequest(layer, "GetMetadata", "timesteps");
		urlRequest += "&day=" + day;

		JSONObject timeSteps = new JSONObject();

		try {
			ncReq = new URL(urlRequest);
			System.out.println("URL: "+urlRequest);
			ncReq.openConnection();
			InputStreamReader input = new InputStreamReader(ncReq.openStream());
			BufferedReader in = new BufferedReader(input);
			String inputLine;

			while ((inputLine = in.readLine()) != null) {
				if (!inputLine.trim().equalsIgnoreCase("")) {// TODO check for errros
					timeSteps = new JSONObject(inputLine);
					System.out.println("Results: "+inputLine);

//					datesWithData = (JSONObject) layerDetails.get("datesWithData");
					/*
					 * //Iterating over the years for(Enumeration years =
					 * dates.keys(); years.hasMoreElements();){ String year =
					 * (String) years.nextElement(); JSONObject yearJson =
					 * dates.getJSONObject(year); for(Enumeration months =
					 * yearJson.keys(); months.hasMoreElements();){ String month
					 * = (String) months.nextElement(); int x = 1; } }
					 */
				}
			}

		} catch (JSONException | IOException e) {
			System.out.println("Error MapViewer en RedirectServer en generateRedirect" + e.getMessage());
			return "Error getting the layer Time Steps:" + e.getMessage();
		}
		return timeSteps.toString();
	}

	/**
	 * Obtains the layerDetails from a ncWMS server and stores the result as a
	 * string (from a JSON object) this is then the javascript variable layerDetails
	 *
	 * @param {Layer} layer
	 * @return
	 */
	public static String getLayerDetails(Layer layer) throws XMLLayerException{

		//For the moment we only obtain the datails for netCDF layers (ncWMS server)
		if (!layer.isncWMS()) {
			return "";
		}

		URL ncReq;
		String detailsRequest = buildRequest(layer, "GetMetadata", "layerDetails");
		JSONObject layerDetails = new JSONObject();

		int maxTries = 2; //Number of tries we willl make to retrieve an specific layer
		int tryNumber = 0;// Current try
		boolean accepted = false;

		while (!accepted && (tryNumber < maxTries)) {// While 
			try {
				ncReq = new URL(detailsRequest);
				ncReq.openConnection();
				InputStreamReader input = null;

				// Number of times we will try to get the layer details for each layer
				// in this case we will wait at most 2 minutes

				input = new InputStreamReader(ncReq.openStream());

				BufferedReader in = new BufferedReader(input);
				String inputLine;
				String layerDetailsSTR ="";

				while ((inputLine = in.readLine()) != null) {
					if (!inputLine.trim().equalsIgnoreCase("")) {// TODO check for errros
						layerDetailsSTR += inputLine;
					}
				}
				//Convert output to jsonObject
				layerDetails = new JSONObject(layerDetailsSTR);

				// If minColor and maxColor are set in the xml file, we replace 
				// the JSONObject of LayerDetails
				if (!((layer.getMinColor() == -1) && (layer.getMaxColor() == -1))) {
					JSONArray scale = layerDetails.getJSONArray("scaleRange");
					scale.put(0, layer.getMinColor());
					scale.put(1, layer.getMaxColor());
				}

				accepted = true;//If there is no exception then we accept the layer details
			} catch (JSONException | IOException e) {
				try {
					tryNumber++;
					System.out.println("Layer details try number:" + tryNumber + " for layer "+ layer.getName() + " Error:"+ e.getMessage());
					Thread.sleep(500);//We wait for .1 seconds to make the request again.
				} catch (InterruptedException ex) {
					System.out.println("Interrupted exception while waiting for layer details:" + ex.getMessage());
				}
			}
		}
		
		if (accepted) {
			System.out.println("layer details: " + layerDetails.toString());
			return layerDetails.toString();
		} else {
			throw new XMLLayerException("ERROR: Not able to load layer details for layer:" + layer.getName());
		}
	}
	
	/**
	 * Gets the URL used to request the image of the color palette to a ncWMS
	 * server
	 *
	 * @param{Layer} layer
	 * @param {String} palette
	 * @return
	 */
	public static String getPaletteUrl(Layer layer, String palette) {
		
		if (layer == null || !layer.isncWMS()) {
			return "";
		}
		
		String paletteUrl = layer.getServer() + "?REQUEST=GetLegendGraphic"
				+ "&LAYER=" + layer.getName()
				+ "&COLORBARONLY=true"
				+ "&PALETTE=" + palette
				+ "&WIDTH=20&HEIGHT=100"
				+ "&NUMCOLORBANDS=250";
		
		return paletteUrl;
	}
	
	/**
	 * Build the http request
	 * @param {Layer} layer
	 * @param {String} request
	 * @param {String} item
	 * @return String
	 */
	private static String buildRequest(Layer layer, String request, String item) {
		String server = layer.getServer();

		String localAddress = layer.getLocalAddress();
		if(localAddress != null){
			server = localAddress;
		} 

		String layerName = layer.getName();
		
		String httpReq = server + "?";
		httpReq += "REQUEST=" + request;
		httpReq += "&item=" + item;
		httpReq += "&layerName=" + layerName;
		
		return httpReq;
	}
}
