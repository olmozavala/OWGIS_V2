#!/bin/sh

#closureLibPath=/home/olmozavala/Dropbox/TutorialsByMe/JS/ClosureLibrary/closure-library
closureLibPath=/Users/ixchykun/Work/ClosureLibrary/closure-library
#closureCompilerPath=/home/olmozavala/Dropbox/TutorialsByMe/JS/ClosureLibrary/closure-compiler
closureCompilerPath=/Users/ixchykun/Work/ClosureLibrary/closure-compiler
#ol3Path=/home/olmozavala/Dropbox/webgis_projects/External_Libs/OpenLayers3/ol3/src
ol3Path=/Users/ixchykun/Work/openlayers-4.4.2/src
#ol3cesium=/home/olmozavala/Dropbox/webgis_projects/External_Libs/ol3-cesium/src
ol3cesium=/Users/ixchykun/Work/ol-cesium-1.32/src
#cesium=/home/olmozavala/Dropbox/webgis_projects/External_Libs/cesium/Source
#Because there is an error "Namespace 'ol.ext.rbush' never provided
#ol3ext=/home/olmozavala/Dropbox/webgis_projects/External_Libs/OpenLayers3/ol3/build/ol.ext
ol3ext=/Users/ixchykun/Work/openlayers-4.4.2/build/ol.ext
#ol3ext=/Users/ixchykun/Work/ol-ext-master/src

python $closureLibPath/closure/bin/build/closurebuilder.py \
  --root=$closureLibPath \
  --root=$ol3ext \
  --root=$ol3Path \
  --root=$ol3cesium \
  --root=src \
  --namespace="owgis" \
  --output_mode=compiled \
  --compiler_jar=$closureCompilerPath/compiler.jar \
  > compiled/compiled.js
#  --root=$ol3ext \
#  --root=$ol3Path \
#  --root=$cesium\
#  --root=$ol3cesium \