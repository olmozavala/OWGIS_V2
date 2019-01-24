package com.mapviewer.business.servlets;

import java.io.File;
import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import org.json.me.JSONArray;
import org.json.me.JSONException;
import org.json.me.JSONObject;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.xml.sax.SAXException;

public class AddToXMLServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	public JSONObject obj;

	protected void processRequest(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException, InterruptedException, ParserConfigurationException, SAXException, JSONException, TransformerException {
		String json = request.getParameter("json");
		boolean ncWMS = request.getParameter("ncWMS").equals("true")? true:false;
		
		System.out.println("JSON received: " + json);
		obj = new JSONObject(json);

		DocumentBuilderFactory domFactory = DocumentBuilderFactory.newInstance(); 
		domFactory.setIgnoringComments(true);
		DocumentBuilder builder = domFactory.newDocumentBuilder(); 
		Document doc = builder.parse(new File(getServletContext().getRealPath("/layers/")+"TestLayers.xml")); 
		
		Node rootNode = doc.getFirstChild();

		Element layerParent = doc.createElement(getString("layerType")+"s");
		Element layer = doc.createElement("layer");
		
		layerParent.setAttribute("server", getString("server"));
		layerParent.setAttribute("BBOX", getString("bboxMinLong")+","+ getString("bboxMinLat")+"," +getString("bboxMaxLong")+"," +getString("bboxMaxLat"));
		
		layer.setAttribute("name", getString("name"));

		if(getString("layerType").equals("BackgroundLayer")){
			layer.setAttribute("featureInfo", getString("featureInfo"));
		}
		else if(getString("layerType").equals("OptionalLayer")){
			layerParent.setAttribute("vectorLayer", getString("isVectorLayer"));
			layerParent.setAttribute("format", getString("format"));
			layerParent.setAttribute("tiled", getString("tiled"));

			layer.setAttribute("Menu", getString("parentMenu")+","+getString("menuID"));
			layer.setAttribute("EN", getString("menuEN"));
			if("true".equals(getString("isVectorLayer"))){
				layer.setAttribute("CQL", getString("cql"));
			}
		}
		else if(getString("layerType").equals("MainLayer")){
			layerParent.setAttribute("vectorLayer", getString("isVectorLayer"));
			layerParent.setAttribute("format", getString("format"));
			layerParent.setAttribute("tiled", getString("tiled"));

			layer.setAttribute("Menu", getString("parentMenu").toString()+","+getString("menuID"));
			layer.setAttribute("EN", getString("menuEN"));
			if("true".equals(getString("isVectorLayer"))){
				layer.setAttribute("CQL", getString("cql"));
				layer.setAttribute("cqlcols", getString("cqlids"));
			}
			else if(ncWMS){
				layerParent.setAttribute("ncWMS", "true");
				layerParent.setAttribute("style", getString("style"));
				layerParent.setAttribute("width", getString("width"));
				layerParent.setAttribute("height", getString("height"));
				layerParent.setAttribute("palette", getString("palette"));
				layerParent.setAttribute("minColor", getString("minColor"));
				layerParent.setAttribute("maxColor", getString("maxColor"));
				layerParent.setAttribute("max_time_range", getString("max_time_range"));

			}
		}
		layerParent.appendChild(layer);
		
		Element menus = doc.createElement("Menus");		
		Element menu = doc.createElement("Menu");
		menu.setAttribute("ID", getString("menuID"));
		menu.setAttribute("EN", getString("menuEN"));
		menus.appendChild(menu);

		rootNode.appendChild(menus);
		rootNode.appendChild(layerParent);
		
		TransformerFactory transformerFactory = TransformerFactory.newInstance();
		Transformer transformer = transformerFactory.newTransformer();
		DOMSource source = new DOMSource(doc);
		StreamResult result = new StreamResult(new File(getServletContext().getRealPath("/layers/")+"\\TestLayers.xml"));
		transformer.transform(source, result);
 
		System.out.println("Done");
	}
    
	public String getSArray(JSONArray arr){
		String s ="";
		for (int i = 0; i < arr.length(); i++)
		{
		    try {
				s = s + arr.get(i).toString()+",";
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return s.substring(0, s.length()-1);
	}
	
	public String getString(String key) throws JSONException{
		return obj.has(key) ? obj.get(key) instanceof JSONArray ? getSArray(obj.getJSONArray(key)) : obj.getString(key) : "";
	}
	
	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
    
    
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		try {
			processRequest(request,response);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ParserConfigurationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SAXException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (TransformerException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		try {
			processRequest(request,response);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ParserConfigurationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SAXException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (TransformerException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

}
