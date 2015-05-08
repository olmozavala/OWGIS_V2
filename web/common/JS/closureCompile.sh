#!/bin/sh

closureLibPath=/home/olmozavala/Dropbox/TutorialsByMe/JS/ClosureLibrary/closure-library
closureCompilerPath=/home/olmozavala/Dropbox/TutorialsByMe/JS/ClosureLibrary/closure-compiler
ol3Path=/home/olmozavala/Dropbox/webgis_projects/External_Libs/OpenLayers3/ol3/src
ol3cesium=/home/olmozavala/Dropbox/webgis_projects/External_Libs/ol3-cesium/src

#Because there is an error "Namespace 'ol.ext.rbush' never provided
ol3ext=/home/olmozavala/Dropbox/webgis_projects/External_Libs/OpenLayers3/ol3/build

python $closureLibPath/closure/bin/build/closurebuilder.py \
  --root=$closureLibPath \
  --root=$ol3Path \
  --root=$ol3cesium \
  --root=$ol3ext \
  --root=src/ \
  --namespace="owgis" \
  --output_mode=compiled \
  --compiler_jar=$closureCompilerPath/compiler.jar \
  > compiled/compiled.js
