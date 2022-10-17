docker create --name binance-api-proxy-dist binance-api-proxy:latest
docker cp binance-api-proxy-dist:/usr/app/src/ dist/
docker rm binance-api-proxy-dist