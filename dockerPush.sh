scp binance-api-proxy.tar siri:/tmp/binance-api-proxy.tar
ssh siri "
cd /tmp
docker load -i binance-api-proxy.tar
rm binance-api-proxy.tar
"
rm binance-api-proxy.tar
