
#!/bin/sh
#find . -name '*.xml' -exec sed -i "s/viewer.coaps.fsu.edu\/ncWMS/146.201.212.61\/ncWMS/g" '{}' \;
#find . -name '*.xml' -exec sed -i "s/image\/gif/image\/png/g" '{}' \;
find . -name '*.xml' -exec sed -i "s/viewer.coaps.fsu.edu/146.201.212.61/g" '{}' \;

