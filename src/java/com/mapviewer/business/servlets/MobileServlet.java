package com.mapviewer.business.servlets;

/*import java.io.BufferedInputStream;
import java.io.File;
import java.io.FilenameFilter;
import java.io.InputStream;*/
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.util.Properties;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class MobileServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
           
	protected void processRequest(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException, InterruptedException {
            
		String url = request.getParameter("url");
                
                System.out.println(getServletContext().getRealPath("/admin/OWGIS_Mob_V1/app/src/main/assets/url.properties")+" ---- "+url);
                
		FileInputStream in = new FileInputStream(getServletContext().getRealPath("/admin/OWGIS_Mob_V1/app/src/main/assets/url.properties"));
		Properties props = new Properties();
		props.load(in);
		in.close();
		FileOutputStream out1 = new FileOutputStream(getServletContext().getRealPath("/admin/OWGIS_Mob_V1/app/src/main/assets/url.properties"));
		props.setProperty("url",url);
		props.store(out1, null);
		out1.close();
		
                //String relativeBatPath = "/admin/appCompile/";
                //String absoluteBatDiskPath = getServletContext().getRealPath(relativeBatPath);
                
                //Check for OS so that we can correctly compile our apk !
                String opsys = System.getProperty("os.name").toLowerCase();
                
                if(opsys.indexOf("win") >= 0){
                    /*
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
                    */
                    response.setContentType("text/html");
                    response.setHeader("Cache-Control", "no-cache");
                    response.getWriter().write(request.getScheme() + "://"+ request.getServerName()+ ":"+ request.getServerPort()+getServletContext().getContextPath() +"/admin/OWGIS_Mob_v1/bin"+"/MainActivity-debug.apk");
                } /*else if(opsys.indexOf("mac") >= 0){ }*/ 
                else if(opsys.indexOf("nix") >= 0 || opsys.indexOf("nux") >= 0 || opsys.indexOf("aix") > 0 || opsys.indexOf("mac") >= 0 ){
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
		}
	}

}
