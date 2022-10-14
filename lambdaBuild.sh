rm -rf dist
mkdir -p dist
cp index.js dist/
cp package-lambda.json dist/package.json
(cd dist && npm i --only-production)
(cd dist && zip -r ../function.zip .)
rm -rf dist