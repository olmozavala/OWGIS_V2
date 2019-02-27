package com.mapviewer.business.servlets;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.me.JSONArray;
import org.json.me.JSONException;
import org.json.me.JSONObject;
import java.io.File;
import java.io.FileFilter;
import org.apache.commons.io.filefilter.WildcardFileFilter;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;
import org.jdom.Attribute;
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

    /* 
     * Adds / Edits a layer element from the file TestLayers.xml
     * and its corresponding menu element(s)
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException, InterruptedException, SAXException, JSONException, JDOMException {
                
        String json = request.getParameter("json");
        boolean ncWMS = request.getParameter("ncWMS").equals("true")? true:false;
        String folderPath = getServletContext().getRealPath("/layers/"); //+"TestLayers.xml";
        
        boolean isEditing = false;
        System.out.println("JSON received: " + json);
        obj = new JSONObject(json);

        SAXBuilder builder = new SAXBuilder();
        /*
        String filePath = getServletContext().getRealPath("/layers/")+"TestLayers.xml";
        File xmlFile = new File(filePath);
        */
        String filePath = "";//+
        String filePathTMP = "";
        File xmlFile = null;
        Document doc = null;
        Document docTMP = null;
        Element rootNode = null;
        Element rootNodeTMP = null;
        
        Element layerParent = null;
        Element layer = null;
        	
        Element menu = null;
        
        File dir = new File(folderPath);
        FileFilter fileFilter = new WildcardFileFilter("*.xml");
        File[] files = dir.listFiles(fileFilter);
        for (File file : files) {
            System.out.println(file.getName());
            filePathTMP = getServletContext().getRealPath("/layers/")+file.getName();
            docTMP = (Document) builder.build(file);
            rootNodeTMP = docTMP.getRootElement();
            // aqui deberian de iterar buscando en cada archivo la ocurrencia de dicha capa
            //get Layers Elements
            List<Element> typeofLayerElementList = rootNodeTMP.getChildren(); //getString("layerType")+"s"
            //System.out.println(typeofLayerElementList);
            
            for (int temp = 0; temp < typeofLayerElementList.size(); temp++) {
                Element parentTypeElement = typeofLayerElementList.get(temp);
                //System.out.println(parentTypeElement);
                
                List<Element> layerslist = parentTypeElement.getChildren();
                //System.out.println(layerslist);
                for (int temp_ = 0; temp_ < layerslist.size(); temp_++) {
                    Element tempElement = layerslist.get(temp_);
                    //if element exists update it, check with layer name and server 
                    //missing to check with menu too
                    //check if menu elements exist or if new ones need to be created
                    if( getString("name").equals(tempElement.getAttributeValue("name")) && getString("server").equals(parentTypeElement.getAttributeValue("server")) ) {
                        
                        if( (getString("parentMenu")+","+getString("menuID")).equals(tempElement.getAttributeValue("Menu"))  
                        ||  getString("menuID").equals(tempElement.getAttributeValue("Menu")) 
                        || getString("parentMenu").equals(tempElement.getAttributeValue("Menu")) ){
                            layerParent = parentTypeElement; // this could be different ??
                            if( !layerParent.getName().equals(getString("layerType")+"s") ) {
                                layerParent.setName(getString("layerType")+"s");
                            }
                            
                            layer = tempElement;
                            isEditing = true;
                            //System.out.println(getString("name")+" "+tempElement.getAttributeValue("name")+" "+getString("server")+" "+parentTypeElement.getAttributeValue("server"));
                            //xmlFile = file;
                            filePath = filePathTMP;
                            rootNode = rootNodeTMP; 
                            doc=docTMP;
                            
                            Element menus = rootNode.getChild("Menus");		
                            
                            List<Element> menuslist = menus.getChildren();
                            for (int temp_menu = 0; temp_menu < menuslist.size(); temp_menu++) {
                                Element menuTMP = menuslist.get(temp_menu);
                                if( (getString("menuID")).equals(menuTMP.getAttributeValue("ID"))  ){
                                    menu=menuTMP;
                                }
                            }
                        }
                    }
                }
            }
        }
        
        if( isEditing == false ){
            filePath = folderPath + "TestLayers.xml";
            xmlFile = new File(filePath);
            doc = (Document) builder.build(xmlFile);
            rootNode = doc.getRootElement();
            layerParent = new Element(getString("layerType")+"s");
            layer = new Element("layer");
            layerParent.setAttribute("server", getString("server"));
        } 
        
        layerParent.setAttribute("BBOX", getString("bboxMinLong")+","+ getString("bboxMinLat")+"," +getString("bboxMaxLong")+"," +getString("bboxMaxLat"));
        layer.setAttribute("name", getString("name"));
        if( "true".equals(getString("selected")) ){
            layer.setAttribute("selected", "true");
        }
        
        /* add/change attributes according to layer type */
        if(getString("layerType").equals("BackgroundLayer")){
            layer.setAttribute("featureInfo", getString("featureInfo"));
        } else if(getString("layerType").equals("OptionalLayer")){
            layerParent.setAttribute("vectorLayer", getString("isVectorLayer"));
            layerParent.setAttribute("format", getString("format"));
            layerParent.setAttribute("tiled", getString("tiled"));
            layer.setAttribute("Menu", getString("parentMenu")+","+getString("menuID"));
            layer.setAttribute("EN", getString("title"));
            if("true".equals(getString("isVectorLayer"))){
                layer.setAttribute("CQL", getString("cql"));
            }
        } else if(getString("layerType").equals("MainLayer")){
            layerParent.setAttribute("vectorLayer", getString("isVectorLayer"));
            layerParent.setAttribute("format", getString("format"));
            layerParent.setAttribute("tiled", getString("tiled"));
            layer.setAttribute("Menu", getString("parentMenu")+","+getString("menuID"));
            layer.setAttribute("EN", getString("title"));
            if("true".equals(getString("isVectorLayer"))){
                layer.setAttribute("CQL", getString("cql"));
                layer.setAttribute("cqlcols", getString("cqlids"));
            } else if(ncWMS){
                layer.setAttribute("ncWMS", "true");
                layer.setAttribute("style", getString("style"));
                layer.setAttribute("width", getString("width"));
                layer.setAttribute("height", getString("height"));
                layer.setAttribute("palette", getString("palette"));
                layer.setAttribute("minColor", getString("minColor"));
                layer.setAttribute("maxColor", getString("maxColor"));
                layer.setAttribute("max_time_range", getString("max_time_range"));
            }
        }
        
        if(!isEditing){
            layerParent.addContent(layer);

            Element menus = rootNode.getChild("Menus");		
            menu = new Element("Menu");
            menu.setAttribute("ID", getString("menuID"));
            menu.setAttribute("EN", getString("menuEN"));
            menus.addContent(menu);

            rootNode.addContent(layerParent);
        } else {
            menu.setAttribute("EN", getString("menuEN"));
        }
        
        //write the updated document to file or console
        XMLOutputter xmlOutput = new XMLOutputter();
        // display nice nice
        Format f = Format.getPrettyFormat();  
        f.setEncoding("UTF-8");
        xmlOutput.setFormat(f);
        xmlOutput.output(doc, new FileOutputStream(filePath));
        // xmlOutput.output(doc, System.out);
        System.out.println("File updated! "+filePath+" "+xmlOutput.outputString(doc));
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
