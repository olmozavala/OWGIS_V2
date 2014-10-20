#!/bin/sh

closureLibPath=/home/olmozavala/Dropbox/TutorialsByMe/JS/ClosureLibrary/closure-library
closureCompilerPath=/home/olmozavala/Dropbox/TutorialsByMe/JS/ClosureLibrary/closure-compiler
ol3Path=/home/olmozavala/Dropbox/OpenLayers3/ol3
python $closureLibPath/closure/bin/build/closurebuilder.py \
  --root=$closureLibPath \
  --root=$ol3Path/src/ \
  --root=src/ \
  --namespace="owgis" \
  --output_mode=compiled \
  --compiler_jar=$closureCompilerPath/compiler.jar \
  > compiled/compiled.js
