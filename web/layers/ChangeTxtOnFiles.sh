
#!/bin/sh
#find . -name '*.xml' -exec sed -i "s/viewer.coaps.fsu.edu\/ncWMS/ncwms.coaps.fsu.edu\/ncWMS/g" '{}' \;
#find . -name '*.xml' -exec sed -i "s/image\/gif/image\/png/g" '{}' \;
find . -name '*.xml' -exec sed -i "s/viewer.coaps.fsu.edu/ncwms.coaps.fsu.edu/g" '{}' \;

