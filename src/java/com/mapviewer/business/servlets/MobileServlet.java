package com.mapviewer.business.servlets;

/*import java.io.BufferedInputStream;
import java.io.File;
import java.io.FilenameFilter;
import java.io.InputStream;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;

import java.util.Iterator;

import javax.servlet.ServletContext;
*/
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Properties;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.imageio.ImageIO;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.jdom.Attribute;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;

public class MobileServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
        private final String[] ICON_DIRS= {"mipmap","mipmap-hdpi", "mipmap-mdpi", "mipmap-xhdpi", "mipmap-xxhdpi", "mipmap-xxxhdpi"};
        private final int[] ICON_DIRS_SIZES= {200,72,48,96,144,192};
           
	protected void processRequest(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException, InterruptedException, JDOMException, FileUploadException, Exception {
            
        String uploadkey_dir = getServletContext().getRealPath("/admin/OWGIS_Mob_V1/app/");
        String uploadicon_dir = getServletContext().getRealPath("/admin/OWGIS_Mob_V1/app/src/main/res/");
        
                List<FileItem> items = new ServletFileUpload(new DiskFileItemFactory()).parseRequest(request);
                String url = "";
                String appname = "";
                String kname = "";
                String kpass = "";

            for (FileItem item : items) {
                
                if (item.isFormField()) {
                    switch (item.getFieldName()){
                            case "url":
                                url = item.getString();
                                break;
                            case "appname":
                                appname = item.getString();
                                break;
                            case "kname":
                                kname = item.getString();
                                break;
                            case "kpass":
                                kpass = item.getString();
                                break;
                            default:
                                break;
                    }                
                    //ajaxUpdateResult += "Field " + item.getFieldName() +  " with value: " + item.getString() + " is successfully read\n\r";
                    System.out.println("************************************************************************"+item.getFieldName());
                    
                } else {
                    String fileName = item.getName();
                    System.out.println("***********FILE*************************************************************"+fileName+"---"+item.getFieldName());
                    
                    //process key file only if its multipart content
                    if(ServletFileUpload.isMultipartContent(request)){
                        if(item.getFieldName().equals("keyfile")){
                            String name = new File(item.getName()).getName();
                            item.write( new File(uploadkey_dir + "myKey.jks"));
                            System.out.println("File " + name + " is successfully uploaded\n\r");
                        } else if( item.getFieldName().equals("iconfile") ){
                            String name = new File(item.getName()).getName().toLowerCase();
                            System.out.println("!!!!!!!!!!!   "+name.split("\\.")[0]);
                            int count_dirs = 0;
                            
                            File writeFile = new File(uploadicon_dir  + File.separator + name);
                            item.write( writeFile ); /*+ File.separator */
                            
                            if(!name.equals("")){
                                SAXBuilder builder = new SAXBuilder();
                                File xmlFile = new File(getServletContext().getRealPath("/admin/OWGIS_Mob_V1/app/src/main/AndroidManifest.xml"));
                                Document doc = (Document) builder.build(xmlFile);
                                Element rootNode = doc.getRootElement();
                                Element string_ = rootNode.getChild("application");
                                //System.out.println(rootNode);
                                Attribute icon_attr = (Attribute) string_.getAttributes().get(1);
                                System.out.println(icon_attr.getName());
                                icon_attr.setValue("@mipmap/"+name.split("\\.")[0]);
                                //android:icon="@mipmap/ic_launcher"
                                //string_.getAttribute("icon").setValue("@mipmap/"+name.split("\\.")[0]);
                                XMLOutputter xmlOutput = new XMLOutputter();
                                // display nice nice
                                xmlOutput.setFormat(Format.getPrettyFormat());
                                xmlOutput.output(doc, new FileWriter(getServletContext().getRealPath("/admin/OWGIS_Mob_V1/app/src/main/AndroidManifest.xml")));
                                System.out.println("File updated!");
                            }
                            
                            for (String icondir : ICON_DIRS) {
                                int actsize = ICON_DIRS_SIZES[count_dirs];
                                //save and resize and save
                                //File writeFile = new File(uploadicon_dir  + icondir + File.separator + "ic_launcher.png");
                                //item.write( writeFile ); /*+ File.separator */
                                
                                //File input = new File(uploadicon_dir  + icondir + File.separator + "ic_launcher.png");
                                BufferedImage image = ImageIO.read(writeFile);

                                BufferedImage resized = resize(image, actsize, actsize);

                                File output = new File(uploadicon_dir  + icondir + File.separator + name);
                                ImageIO.write(resized, "png", output);
                                
                                System.out.println("File " + name + " is successfully uploaded\n\r");
                                count_dirs++;
                            }
                        }
                    }
                } 
            }
                
                System.out.println(getServletContext().getRealPath("/admin/OWGIS_Mob_V1/app/src/main/assets/url.properties")+" ---- "+url);
                
                /*set url of apk*/
		FileInputStream in = new FileInputStream(getServletContext().getRealPath("/admin/OWGIS_Mob_V1/app/src/main/assets/url.properties"));
		Properties props = new Properties();
		props.load(in);
		in.close();
		FileOutputStream out1 = new FileOutputStream(getServletContext().getRealPath("/admin/OWGIS_Mob_V1/app/src/main/assets/url.properties"));
		props.setProperty("url",url);
		props.store(out1, null);
		out1.close();
                
                /*set app name, if it exists*/
                if(!appname.equals("")){
                    SAXBuilder builder = new SAXBuilder();
                    File xmlFile = new File(getServletContext().getRealPath("/admin/OWGIS_Mob_V1/app/src/main/res/values/strings.xml"));
                    Document doc = (Document) builder.build(xmlFile);
                    Element rootNode = doc.getRootElement();
                    Element string_ = rootNode.getChild("string");
                    string_.setText(appname);
                    XMLOutputter xmlOutput = new XMLOutputter();
                    // display nice nice
                    xmlOutput.setFormat(Format.getPrettyFormat());
                    xmlOutput.output(doc, new FileWriter(getServletContext().getRealPath("/admin/OWGIS_Mob_V1/app/src/main/res/values/strings.xml")));
                    System.out.println("File updated!");
                }
                
                /*Set key data in config file*/
                /*BufferedReader reader = new BufferedReader(new FileReader(getServletContext().getRealPath("/admin/OWGIS_Mob_V1/app/build.gradle")));
                String currentReadingLine = reader.readLine();
                String originalFileContent = "";
                
                while (currentReadingLine != null) {
                    originalFileContent += currentReadingLine + System.lineSeparator();
                    currentReadingLine = reader.readLine();
                }
                
                System.out.println("LEFILE");
                System.out.println(originalFileContent);
                
                originalFileContent = originalFileContent.replace(originalFileContent.substring(originalFileContent.indexOf("keyAlias '") , originalFileContent.indexOf("keyAlias '")+10+kname.length()), kname+"'");
                originalFileContent = originalFileContent.replace(originalFileContent.substring(originalFileContent.indexOf("keyPassword '") , originalFileContent.indexOf("keyPassword '")+13+kpass.length()), kpass+"'");
                originalFileContent = originalFileContent.replace(originalFileContent.substring(originalFileContent.indexOf("storePassword '") , originalFileContent.indexOf("storePassword '")+15+kpass.length()), kpass+"'");
                BufferedWriter writer = null;
                writer = new BufferedWriter(new FileWriter(getServletContext().getRealPath("/admin/OWGIS_Mob_V1/app/build.gradle")));
                writer.write(originalFileContent);
                */
                
                //Check for OS so that we can correctly compile our apk !
                String opsys = System.getProperty("os.name").toLowerCase();
                
                if(opsys.indexOf("win") >= 0){
                    
                    String relativeBatPath = "/admin/appCompile/";
                    String absoluteBatDiskPath = getServletContext().getRealPath(relativeBatPath);
                    
                    Process p = Runtime.getRuntime().exec("cmd /c start /wait "+ absoluteBatDiskPath + "/1.bat " + getServletContext().getRealPath("\\admin\\OWGIS_Mob_v1"));
                    System.out.println("Waiting for batch file ...");
                    p.waitFor();
                    p = Runtime.getRuntime().exec("cmd /c start /wait "+ absoluteBatDiskPath + "/2.bat " + getServletContext().getRealPath("\\admin\\OWGIS_Mob_v1"));
                    p.waitFor();
                    p = Runtime.getRuntime().exec("cmd /c start /wait "+ absoluteBatDiskPath + "/3.bat " + getServletContext().getRealPath("\\admin\\OWGIS_Mob_v1"));
                    p.waitFor();
                    //p = Runtime.getRuntime().exec("cmd /c start /wait C:\\Users\\harshulpandav\\Desktop\\4.bat");
                    //p.waitFor();
                    System.out.println("Batch file done.");
                    //File dir = new File(getServletContext().getRealPath("\\admin\\OWGIS_Mob_v1\\bin"));   
                    //File[] fileList = dir.listFiles(new FilenameFilter() {
                    //	public boolean accept(File dir, String name) {
                    //		    return name.endsWith("debug.apk");
                    //  }
                    //});
                    //
                    //String filename = fileList[0].getPath();
                    //response.setContentType("application/octet-stream");
                    //String disHeader = "Attachment; Filename=OWGIS.apk";
                    //response.setHeader("Content-Disposition", disHeader);
                    //File fileToDownload = new File(filename);
                    //
                    //InputStream ipS = null;
                    //ServletOutputStream outs = response.getOutputStream();
                    //
                    //try {
                    //ipS = new BufferedInputStream
                    //(new FileInputStream(fileToDownload));
                    //int ch;
                    //while ((ch = ipS.read()) != -1) {
                    //outs.print((char) ch);
                    //}
                    //}
                    //finally {
                    //	if (ipS != null) ipS.close(); // very important
                    //}
                    //
                    //outs.flush();
                    //outs.close();
                    //ipS.close();
                    
                    response.setContentType("text/html");
                    response.setHeader("Cache-Control", "no-cache");
                    response.getWriter().write(request.getScheme() + "://"+ request.getServerName()+ ":"+ request.getServerPort()+getServletContext().getContextPath() +"/admin/OWGIS_Mob_V1/app/build/outputs/apk/release/app-release.apk");
                } else if(opsys.indexOf("nix") >= 0 || opsys.indexOf("nux") >= 0 || opsys.indexOf("aix") > 0 || opsys.indexOf("mac") >= 0 ) {
                    
                    String path_to_gradle = getServletContext().getRealPath("/admin/OWGIS_Mob_V1/");
                    String[] arguments = new String[] {"cd",path_to_gradle,"&&","./gradlew", "build"}; //"bash", "-c",
                    //Runtime rt = Runtime.getRuntime();
                    //Process proc = rt.exec(arguments);//new ProcessBuilder(arguments).start();
                    
                    // you need a shell to execute a command pipeline
                    List<String> commands = new ArrayList<String>();
                    commands.add("/bin/sh");
                    commands.add("-c");
                    commands.add("cd "+path_to_gradle+" && ./gradlew build");

                    SystemCommandExecutor commandExecutor = new SystemCommandExecutor(commands);
                    int result = commandExecutor.executeCommand();

                    StringBuilder stdout = commandExecutor.getStandardOutputFromCommand();
                    StringBuilder stderr = commandExecutor.getStandardErrorFromCommand();

                    System.out.println("STDOUT");
                    System.out.println(stdout);

                    System.out.println("STDERR");
                    System.out.println(stderr);
                    
                    if(result == 0){
                        //no errors, return apk link
                        response.setContentType("application/json");
                        String your_string = "{ \"url\" : \""+request.getScheme() + "://"+ request.getServerName()+ ":"+ request.getServerPort()+getServletContext().getContextPath() +"/admin/OWGIS_Mob_V1/app/build/outputs/apk/release/app-release.apk\" }";
                        PrintWriter out = response.getWriter();
                        out.write(your_string);
                    }
                }
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
		} catch (JDOMException ex) {
                Logger.getLogger(MobileServlet.class.getName()).log(Level.SEVERE, null, ex);
            } catch (Exception ex) {
                Logger.getLogger(MobileServlet.class.getName()).log(Level.SEVERE, null, ex);
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
		} catch (JDOMException ex) {
                Logger.getLogger(MobileServlet.class.getName()).log(Level.SEVERE, null, ex);
            } catch (Exception ex) {
                Logger.getLogger(MobileServlet.class.getName()).log(Level.SEVERE, null, ex);
            }
	}
        
        /*resize image function*/
        private static BufferedImage resize(BufferedImage img, int height, int width) {
            Image tmp = img.getScaledInstance(width, height, Image.SCALE_SMOOTH);
            BufferedImage resized = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);
            Graphics2D g2d = resized.createGraphics();
            g2d.drawImage(tmp, 0, 0, null);
            g2d.dispose();
            return resized;
        }
}
