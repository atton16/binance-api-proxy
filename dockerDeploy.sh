rsync -avp dist/ siri:/home/admin/binance-api-proxy/
ssh siri "
docker stop binance-api-proxy
docker rm binance-api-proxy
docker run \
  --workdir /usr/app/src \
  -v /home/admin/binance-api-proxy:/usr/app/src \
  --health-cmd='npm run healthcheck' \
  -d \
  -p 3000:3000 \
  --name binance-api-proxy \
  --restart always \
  node:16-alpine node .
docker ps -a | grep binance-api-proxy
docker image prune -f
"
rm -rf dist
