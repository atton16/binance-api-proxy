rm -rf dist
mkdir -p dist
cp *.js dist/
cp package*.json dist/
(cd dist && npm i --production)
(cd dist && zip -r ../function.zip .)
rm -rf dist