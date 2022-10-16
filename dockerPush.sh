scp docker-image.tar siri:/tmp/docker-image.tar
ssh siri "
cd /tmp
docker load -i docker-image.tar
rm docker-image.tar
"
rm docker-image.tar
