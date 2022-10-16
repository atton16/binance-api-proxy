ssh siri "
docker stop binance-api-proxy
docker rm binance-api-proxy
docker run \
  -d \
  -p 3000:3000 \
  --name binance-api-proxy \
  --restart always \
  binance-api-proxy:latest
docker ps -a | grep binance-api-proxy
docker image prune -f
"
