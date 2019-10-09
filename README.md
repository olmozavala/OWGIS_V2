OWGIS 2
=====

For more info please visit [owgis.org](http://owgis.org)!

# What is OWGIS?
OWGIS is a Java web application that creates 
WebGIS sites by automatically writing HTML and JavaScript code. 

We built OWGIS because we wanted an easy way to 
publish scientific maps on the web. OWGIS provides a
self-contained WebGIS sites that can be easily customized.
OWGIS can publish any type of georeferenced data served
by a WMS server like [Geoserver](http://geoserver.org)
or [ncWMS](http://www.resc.rdg.ac.uk/trac/ncWMS/). 
The later uses an extension of the WMS standard to 
serve 3D or 4D data stored as [NetCDF](http://www.unidata.ucar.edu/software/netcdf/) files.

The default template of OWGIS can be tested 
<a href="http://server.owgis.org/OWGISV2Template/mapviewer"> here</a>.

Each WebGIS site is configured by two types of files, a 
Java properties file stored at `web/WEB-INF/conf/MapViewConfig.properties`
and XML files located at `web/layers/TestLayers.xml`.
With these two files you can create new maps with many layers
and customize the look of your map. 

For a detailed information on the configuration files please
read the tutorials section at [owgis.org](http://owgis.org).

# Quick Start 

[Quick start using ant](#ant)

[Quick start using Netbeans](#netbeans)

## Ant
Step 1. Clone the repository:
 
    git clone https://github.com/olmozavala/OWGIS_V2.git OWGISV2Template

Step 2. Edit `buildTemplate.xml` to match your paths, mainly the Tomcat folder.

Step 3. Build your war file:
    
    ant -f buildTemplate.xml dist

Step 3. Deploy the project in your servlet container, like [Tomcat](http://tomcat.apache.org/)

    cp OWGISV2Template.war /usr/local/tomcat/webapps

Step 4. Test your OWGIS Template at <http://localhost:8080/OWGISV2Template/mapviewer>

Once OWGIS template is working, you can modify the layers shown
in the map as well as the look of the website by following the
documentation at [owgis.org](http://owgis.org).

## Netbeans
Building a Netbeans project for OWGIS is very easy. 

Step 1. Clone the repository:

    git clone https://github.com/olmozavala/OWGIS_V2.git OWGISV2Template

Step 3. Create new project in Netbeans

    Delete `buildTemplate.xml` file (from OWGISV2Template directory)
    File -> New Project (Ctrl-Shift-N)
    Java Web -> Web Application with Existing Sources (Next)
    Location: point to the root folder "OWGISV2Template" (Next)
    Select your server (Tomcat, JBOSS, etc.) (Next)
    If not set by default set:
        Web Pages Folder -> OWGISV2Template/web
        Web-INF Folder  -> OWGISV2Template/web/WEB-INF
        Libraries Folder -> OWGISV2Template/libraries 
        Source package folders -> OWGISV2Template/src/java (Finish)

Step 3. Common Netbeans configuration (in Project Properties)

    Sources -> Change source to JDK 7 if necessary
    Run -> Relative URL -> /mapviewer (Ok)

Step 4. Test your OWGIS Template at <http://localhost:8080/OWGISV2Template/mapviewer>

Once OWGIS template is working, you can modify the layers shown
in the map as well as the look of the website by following the
documentation at [owgis.org](http://owgis.org).

## Mobile Interface
The mobile interface for OWGIS_V2 can be triggered by deploying the project and accessing 
the above mentioned URL through the web browser of your Mobile Phone.

To use the Mobile Interface as an installable Mobile App, refer the following process:

Step 1: Get Android SDK

    Install the latest Android SDK onto your machine (http://developer.android.com/sdk/index.html)

Step 2: Get Titanium Studio

    Download and install Titanium Studio http://www.appcelerator.com/titanium/download-titanium/ (Sign-up for Free)
    You will be prompted to select the location of Android SDK
    
    
Step 3: Get OWGIS_Mob

    Download the project OWGIS_Mob and import it in Titanium Studio
    Download link: https://github.com/harshulpandav/OWGIS_Mob

Step 4: Configure OWGIS_Mob

    Configure the URL on which your OWGIS_V2 is running
        Press Ctrl+Shift+R and type "app.js"
        Change the URL within Titanium.UI.createWebView({ .. }) 

Step 5: Run OWGIS_Mob

    Connect your Android device in debug mode to the computer
    Run the project by Right click > Run As > (Select your device if connected)    
    
    
## Community 
## Authors

** Olmo Zavala**
+ <https://github.com/olmozavala>
+ <https://olmozavala.com>

** Harshul Pandav**
+ <https://github.com/harshulpandav>

** Vladimir Mijail**
+ <https://github.com/mijailcc>

** Ixchel Zazueta**
+ <https://github.com/ixchelzg>

** Pablo Camacho**
+ <https://github.com/Pablocg0>

## License
OWGIS is licensed under the MIT Open Source license. 
For more information, see the LICENSE file in this repository.
