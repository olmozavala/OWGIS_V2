<%-- 
    Document   : KmlLink
    Created on : Aug 3, 2012, 6:34:03 PM
    Author     : Olmo Zavala-Romero
--%>

<%-- 
Download the link to view in Google Earth
--%>

<a class="maplink" id="kmlLink" href="${linkKML}" style="text-align:center;" onclick="owgis.kml.KMZDownAlert()" data-role="button">
    <img class="ui-li-icon" border="0" src="./common/images/kmz/google_earth_logo_topMenu.png" alt="Descargar en KML" />
    <fmt:message key="main.googleE" />
</a>
