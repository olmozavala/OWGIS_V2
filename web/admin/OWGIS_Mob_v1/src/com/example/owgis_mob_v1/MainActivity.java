package com.example.owgis_mob_v1;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

import android.app.Activity;
import android.app.DownloadManager;
import android.content.Context;
import android.content.res.AssetManager;
import android.content.res.Resources;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.view.KeyEvent;
import android.webkit.MimeTypeMap;
import android.webkit.WebView;
import android.webkit.WebViewClient;


public class MainActivity extends Activity {

	private WebView mWebView;
	
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Resources resources = this.getResources();
        AssetManager assetManager = resources.getAssets();
        String url = "";
        try {
            InputStream inputStream = assetManager.open("url.properties");
            Properties properties = new Properties();
            properties.load(inputStream);
            url = properties.getProperty("url");
            System.out.println(url);
        } catch (IOException e) {
            System.err.println("Failedpen microlog property file");
            e.printStackTrace();
        }
        mWebView = (WebView)findViewById(R.id.webview);
        mWebView.getSettings().setJavaScriptEnabled(true);
//        mWebView.loadUrl("http://144.174.248.95:8080/OWGIS_V2/mapviewer");
        mWebView.loadUrl(url);
        mWebView.setWebViewClient(new HelloWebViewClient());
    }
    
    private class HelloWebViewClient extends WebViewClient{
    	@Override
    	public boolean shouldOverrideUrlLoading(WebView webview, String url){
//    		 if (url.endsWith(".apk")) {
    		if(url.contains("GetTransect")){
    			return false;
    		}
                 Uri source = Uri.parse(url);
                 String chopped = "";
                 String fileName = "";
                 
                 if(url.contains("application/vnd.google-earth")){
                	 chopped = url.substring(url.indexOf("layers=")+7);
                	 fileName = chopped.substring(0,chopped.indexOf("&"))+".kml";
                 }
                  
                 else if(url.toLowerCase().contains("typename=")){
                	 chopped = url.substring(url.toLowerCase().indexOf("typename=")+9);
                	 fileName = chopped.substring(0,chopped.indexOf("&"))+".zip";
                 }
                 String extension = MimeTypeMap.getFileExtensionFromUrl(url); 
                 System.out.println(extension);
                 // Make a new request pointing to the .apk url
                 DownloadManager.Request request = new DownloadManager.Request(source);
                 // appears the same in Notification bar while downloading
                 request.setDescription("Description for the DownloadManager Bar");
//                 request.setTitle("YourApp.apk");
//                 if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB) {
//                     request.allowScanningByMediaScanner();
//                     request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
//                 }
                 // save the file in the "Downloads" folder of SDCARD
                 request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, fileName);
                 // get download service and enqueue file
                 DownloadManager manager = (DownloadManager) getSystemService(Context.DOWNLOAD_SERVICE);
                 manager.enqueue(request);
//             }
             
             // if there is a link to anything else than .apk or .mp3 load the URL in the webview
//             else view.loadUrl(url);
             return true;    
    	}
    }
    
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event){
    	if((keyCode == KeyEvent.KEYCODE_BACK) && mWebView.canGoBack()){
    		mWebView.goBack();
    		return true;
    	}
    	return super.onKeyDown(keyCode, event);
    }

}
