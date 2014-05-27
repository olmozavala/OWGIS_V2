cp /home/olmozavala/Dropbox/OpenLayers3/ol3/css/ol.css /home/olmozavala/Dropbox/OWGISV2_Projects/DeepCProjectV2/web/common/CSS/

python /home/olmozavala/Dropbox/TutorialsByMe/JavaScriptAndMore/ClosureLibrary/closure-library/closure/bin/build/depswriter.py  \
    --root=/home/olmozavala/Dropbox/OpenLayers3/ol3/src/ \
    --root=src \
    > ../../deps.js


python /home/olmozavala/Dropbox/TutorialsByMe/JavaScriptAndMore/ClosureLibrary/closure-library/closure/bin/build/closurebuilder.py \
  --root=/home/olmozavala/Dropbox/TutorialsByMe/JavaScriptAndMore/ClosureLibrary/closure-library/ \
  --root=/home/olmozavala/Dropbox/OpenLayers3/ol3/src/ \
  --root=src \
  --namespace="owgis" \
  --output_mode=script \
  --compiler_jar=/home/olmozavala/Dropbox/TutorialsByMe/JavaScriptAndMore/ClosureLibrary/closure-compiler/compiler.jar \
  > compiled/script.js
