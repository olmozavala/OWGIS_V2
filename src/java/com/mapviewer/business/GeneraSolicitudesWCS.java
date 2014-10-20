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
 * This class
 * creates the url to be able to download the data of the geotiff files.
 *
 */
package com.mapviewer.business;

import com.mapviewer.model.BoundaryBox;
import com.mapviewer.model.Layer;
import com.mapviewer.conf.OpenLayerMapConfig;
import com.mapviewer.tools.StringAndNumbers;
import javax.servlet.http.HttpServletRequest;

/**
 * This class generates the WCS requests to obtain specific data from the map
 *
 * @author Olmo Zavala Romero
 */
public class GeneraSolicitudesWCS {

	/**
	 * This class obtains the call of WCS of the main layer depending on the
	 * zoom level.
	 *
	 * @param {Layer} selectedLayer - base layer to
	 * download
	 * @param {String} downloadFormat format to download the data. This depends
	 * if the layer is vector or raster, currently we accept 'GeoTiff' for raster
	 * and SHAPE-ZIP for vector layers
	 * @param {String} cqlFilter Is the CQL filter available for vector layers.
	 * @return {String[]} resultado [3]  First [] is for the WCS Request, the second index is for the resolucion
	 * of the layer, and the third is for the name of the layer.
	 */
	public static String[][] wcsManager(Layer selectedLayer, String downloadFormat, String cqlfilter) {

		String[][] resultado = null; //value to return
		String[] tituloCapasDatos = selectedLayer.getTituloCapasDatos();//get layer titles
		String[] capasDeDatos = StringAndNumbers.strArrayFromStringColon(selectedLayer.getFeatureInfoLayer());//get data of layer
		resultado = new String[capasDeDatos.length][3];
		for (int i = 0; i < capasDeDatos.length; i++) {
			String[] resultado1y2 = GeneraSolicitudesWCS.obtieneSolicitudWCSV12(selectedLayer, downloadFormat, capasDeDatos[i], cqlfilter);//we add one more to the zoom level
			resultado[i][0] = resultado1y2[0]; //get request url
			resultado[i][1] = resultado1y2[1]; //get zoom level
			if (tituloCapasDatos == null) {
				resultado[i][2] = selectedLayer.getDisplayName("EN");
			} else {
				if (tituloCapasDatos.length > i) {
					resultado[i][2] = tituloCapasDatos[i]; //get layer title name
				}
			}

		}

		return resultado;

	}


	/**
	 * Generates the WCS request depending on the parameter of the layer passed
	 * in. 
	 *
	 * @param {Layer} capaBase Layer - layer to which generate request
	 * @param {String} downloadFormat - download format for now GeoTiff
	 * @param {String} layerName the name of the layer
	 * @param {String} cqlFilter is the CQL filter available for vector layers.
	 * @return String[2]  first value is the WCS request and second value is
	 * the layer resolution.
	 */
	public static String[] obtieneSolicitudWCSV12(Layer capaBase, String downloadFormat, String layerName, String cql_filter) {
		String[] resultado = new String[2]; //return value
		String solicitud = capaBase.getServer();
		if (solicitud.endsWith("wms")) {
			int lengthSol = solicitud.length();
			solicitud = solicitud.substring(0, lengthSol - 3);
		}
		//we obtain the resolution in mts. If bbox comes with correct data, then the arrangment should be like:
		//-144.4,-3.55,-55.6,43.55
		BoundaryBox bboxCapa = capaBase.getBbox(); //"minLong,minLat,maxLong,maxLat"    
		double[] resolucionCapaFinalMtsYseg = resolucionMtsySeg(bboxCapa.getMinLong(), bboxCapa.getMaxLong(), capaBase.getWidth()); //get resolution
		
		if (capaBase.isVectorLayer()) {

			solicitud += "wms?SERVICE=WFS&VERSION=1.0.0"
					+ "&REQUEST=GetFeature"
					+ "&typeName=" + layerName
					+ "&outputFormat=" + downloadFormat 
					+ "&CRS=" + capaBase.getProjection();

			if(cql_filter!=null){
					solicitud += "&cql_filter=" + cql_filter;
			}

		} else {
			solicitud += "wms?SERVICE=WMS&VERSION=1.1.0"
					+ "&REQUEST=GetMap"
					+ "&layers=" + layerName
					+ "&FORMAT=" + downloadFormat
					+ "&CRS=" + capaBase.getProjection()
					+ //                                "&BBOX="+bbox+
					"&BBOX=" + bboxCapa
					+ "&WIDTH=" + capaBase.getWidth()
					+ "&HEIGHT=" + capaBase.getHeight();
		}
		resultado[0] = solicitud;
		resultado[1] = "" + (int) Math.floor(resolucionCapaFinalMtsYseg[0]);
		return resultado;
	}

	/**
	 * Obtains the resolution in mts and seconds of a layer, taking into account
	 * its longitud max, min, and number of colums 
	 * @param {double} longmin
	 * @param {double} longmax
	 * @param {int} numColumnas - width
	 * @return
	 */
	private static double[] resolucionMtsySeg(double longmin, double longmax, int numColumnas) {

		double metrosPorMinuto = 1852.5;//constant

		//This value represents the total minutes with the correct decimals
	
		double minutosTotales = Math.abs(longmax - longmin);//obtain total minutes

		//Now we obtain the size of the pixel in the image in a decimal value.
		double tamanoPixel = (minutosTotales / numColumnas);//pixel size of image

		//obtains seconds with decimal value
		double numeroDeSegundos = tamanoPixel * 3600;//get in seconds

		//obtain the resolution in meters mutipliyin by the meters per minute.
		//get the resolution in meters mutiplied by meters by minutes and divided by 60
		double resolucionMts = (numeroDeSegundos * metrosPorMinuto) / 60;
		double[] mtsYseg = new double[2];
		mtsYseg[0] = resolucionMts;
		mtsYseg[1] = numeroDeSegundos;

		return mtsYseg;
	}

	
}
