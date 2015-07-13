#!/bin/sh

#---------- All the CSS from our side ---- 
echo "git checkout --ours web/common/CSS/"
git checkout --ours web/common/CSS/
echo "git add --all web/common/CSS"
git add --all web/common/CSS

#---------- All the Java code from theirs---- 
echo "git checkout --theirs src"
git checkout --theirs src
echo "git add --all src"
git add --all src

#---------- Properties from us
echo "git checkout --ours web/WEB-INF/conf/MapViewConfig.properties"
git checkout --ours web/WEB-INF/conf/MapViewConfig.properties
echo "git add web/WEB-INF/conf/MapViewConfig.properties"
git add web/WEB-INF/conf/MapViewConfig.properties

#---------- Context from us
echo "git checkout --ours web/META-INF/context.xml"
git checkout --ours web/META-INF/context.xml
git add web/META-INF/context.xml

#---------- Interface dependent from us
echo "git checkout --ours web/common/JS/src/mapDisplay/InterfaceDependent.js"
git checkout --ours web/common/JS/src/mapDisplay/InterfaceDependent.js
git add web/common/JS/src/mapDisplay/InterfaceDependent.js

#---------- All the rest of the JS code from theirs---- 
echo "git checkout --theirs web/common/JS/src/"
git checkout --theirs web/common/JS/src/
git add --all web/common/JS/src

# ------- Remove Testlayers.xml"
echo "rm web/layers/TestLayers.xml"
rm web/layers/TestLayers.xml

#---------- TLD Functions
echo "git checkout --theirs web/WEB-INF/TLD/htmlStaticFunctions.tld"
git checkout --theirs web/WEB-INF/TLD/htmlStaticFunctions.tld
git add  web/WEB-INF/TLD/htmlStaticFunctions.tld

#-------- JSP files that should be the same
echo "git checkout --theirs web/Pages/NcWMSOptions.jsp"
git checkout --theirs web/Pages/NcWMSOptions.jsp
git add  web/Pages/NcWMSOptions.jsp

echo "git checkout --theirs web/Pages/Options/KmlLink.jsp"
git checkout --theirs web/Pages/Options/KmlLink.jsp
git add  web/Pages/Options/KmlLink.jsp

echo "git checkout --theirs web/Pages/Options/MapInstructionsLatest.jsp"
git checkout --theirs web/Pages/Options/MapInstructionsLatest.jsp
git add  web/Pages/Options/MapInstructionsLatest.jsp

echo "git checkout --theirs web/Pages/Options/Palettes.jsp"
git checkout --theirs web/Pages/Options/Palettes.jsp
git add  web/Pages/Options/Palettes.jsp

#---------- ONLY IF YOU HAVEN'T CHANGE ANY STYLING---
#echo "git checkout --theirs web/common/scss/"
#git checkout --theirs web/common/scss/
#git add --all web/common/scss


