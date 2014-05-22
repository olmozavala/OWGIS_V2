cp [OPENLAYERS PATH]/ol.css ../CSS/

python [CLOSURELIBRARY PATH]/closure/bin/build/depswriter.py  \
    --root=[OPENLAYERS PATH]/src/ \
    --root=src \
    > ../../deps.js


python [CLOSURELIBRARY PATH]/closure/bin/build/closurebuilder.py \
  --root= [CLOSURELIBRARY PATH]\
  --root=[OPENLAYERS PATH]/src/ \
  --root=src \
  --namespace="owgis" \
  --output_mode=script \
  --compiler_jar=[CLOSURELIBRARY PATH]/closure-compiler/compiler.jar \
  > compiled/script.js
