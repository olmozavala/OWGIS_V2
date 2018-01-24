#!/bin/sh

closureLibPath=/home/ixchel/ClosureLibrary/closure-library
closureCompilerPath=/home/ixchel/ClosureLibrary/closure-compiler
ol3Path=/home/ixchel/Downloads/openlayers-4.4.2/src
ol3cesium=/home/ixchel/Downloads/ol-cesium-1.32/src
#cesium=/home/ixchel/Downloads/Cesium-1.40/Source
#ol3cesium=/home/olmozavala/Dropbox/webgis_projects/External_Libs/ol3-cesium/src

#Because there is an error "Namespace 'ol.ext.rbush' never provided
ol3ext=/home/ixchel/External_Libs/OpenLayers3/ol3/build/ol.ext

python $closureLibPath/closure/bin/build/closurebuilder.py \
  --root=$closureLibPath \
  --root=$ol3ext \
  --root=$ol3Path \
  --root=$ol3cesium \
  --root=src \
  --namespace="owgis" \
  --output_mode=compiled \
  --compiler_jar=$closureCompilerPath/compiler.jar \
  --compiler_flags="--language_in=ECMASCRIPT6" \
  --compiler_flags="--language_out=ECMASCRIPT5" \
  > compiled/compiled.js
#  --root=$ol3cesium \
