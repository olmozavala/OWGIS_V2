package com.example.owgis_mob_v1;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
//import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.content.res.Resources;
import android.content.res.AssetManager;


public class MainActivity extends AppCompatActivity {
    private WebView myWebView;

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
        myWebView = (WebView)findViewById(R.id.webView);
        //WebSettings webSettings = myWebView.getSettings();
        myWebView.getSettings().setJavaScriptEnabled(true);
        myWebView.getSettings().setLoadWithOverviewMode(true);
        myWebView.getSettings().setUseWideViewPort(true);
        myWebView.loadUrl(url);
        myWebView.setWebViewClient(new WebViewClient());
    }

    @Override
    public void onBackPressed(){
        if(myWebView.canGoBack()){
            myWebView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
