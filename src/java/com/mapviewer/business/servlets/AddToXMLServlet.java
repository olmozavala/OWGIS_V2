package com.mapviewer.business.servlets;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.me.JSONArray;
import org.json.me.JSONException;
import org.json.me.JSONObject;
/*
import java.io.File;
import java.io.IOException;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;
*/

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;
import org.xml.sax.SAXException;

public class AddToXMLServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	public JSONObject obj;

	protected void processRequest(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException, InterruptedException, SAXException, JSONException, JDOMException {
                
		String json = request.getParameter("json");
		boolean ncWMS = request.getParameter("ncWMS").equals("true")? true:false;
		
		System.out.println("JSON received: " + json);
		obj = new JSONObject(json);
                
                SAXBuilder builder = new SAXBuilder();
                String filePath = getServletContext().getRealPath("/layers/")+"TestLayers.xml";
                File xmlFile = new File(filePath);

		Document doc = (Document) builder.build(xmlFile);
		Element rootNode = doc.getRootElement();
                
		Element layerParent = new Element(getString("layerType")+"s");
		Element layer = new Element("layer");
		
		layerParent.setAttribute("server", getString("server"));
		layerParent.setAttribute("BBOX", getString("bboxMinLong")+","+ getString("bboxMinLat")+"," +getString("bboxMaxLong")+"," +getString("bboxMaxLat"));
		
		layer.setAttribute("name", getString("name"));

		if(getString("layerType").equals("BackgroundLayer")){
                    layer.setAttribute("featureInfo", getString("featureInfo"));
		}else if(getString("layerType").equals("OptionalLayer")){
			layerParent.setAttribute("vectorLayer", getString("isVectorLayer"));
			layerParent.setAttribute("format", getString("format"));
			layerParent.setAttribute("tiled", getString("tiled"));

			layer.setAttribute("Menu", getString("parentMenu")+","+getString("menuID"));
			layer.setAttribute("EN", getString("menuEN"));
			if("true".equals(getString("isVectorLayer"))){
				layer.setAttribute("CQL", getString("cql"));
			}
		}else if(getString("layerType").equals("MainLayer")){
			layerParent.setAttribute("vectorLayer", getString("isVectorLayer"));
			layerParent.setAttribute("format", getString("format"));
			layerParent.setAttribute("tiled", getString("tiled"));

			layer.setAttribute("Menu", getString("parentMenu")+","+getString("menuID"));
			layer.setAttribute("EN", getString("menuEN"));
			if("true".equals(getString("isVectorLayer"))){
				layer.setAttribute("CQL", getString("cql"));
				layer.setAttribute("cqlcols", getString("cqlids"));
			}else if(ncWMS){
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
		layerParent.addContent(layer);
		
		Element menus = rootNode.getChild("Menus");//new Element("Menus");		
		Element menu = new Element("Menu");
		menu.setAttribute("ID", getString("menuID"));
		menu.setAttribute("EN", getString("menuEN"));
		menus.addContent(menu);
                
                rootNode.addContent(layerParent);
                
		System.out.println("LOOK: " + doc);
                //write the updated document to file or console
                XMLOutputter xmlOutput = new XMLOutputter();

		// display nice nice
		xmlOutput.setFormat(Format.getPrettyFormat());
		xmlOutput.output(doc, new FileWriter("c:\\file.xml"));

		// xmlOutput.output(doc, System.out);
		System.out.println("File updated!");
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
     * @throws javax.servlet.ServletException
     * @throws java.io.IOException
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		try {
			processRequest(request,response);
                        //ServletException, IOException, InterruptedException, SAXException, JSONException, JDOMException
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ServletException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SAXException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (JDOMException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	/**
     * @throws javax.servlet.ServletException
     * @throws java.io.IOException
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		try {
			processRequest(request,response);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (JDOMException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SAXException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ServletException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

}
