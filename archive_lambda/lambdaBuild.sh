rm -rf dist
mkdir -p dist
cp *.js dist/
cp package*.json dist/
(cd dist && NODE_ENV=production npm install)
rm -rf function.zip
(cd dist && zip -r ../function.zip .)
rm -rf dist
