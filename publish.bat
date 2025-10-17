@echo off
@REM nexus.crepen.cloud/crepencdn-docker/crepen-cdn-cloud:%version%
@REM nexus.crepen.cloud/crepencdn-docker/crepen-cdn-cloud:latest

@REM nexus.crepen.cloud/crepencdn-docker/crepen-cdn-server:%version%
@REM nexus.crepen.cloud/crepencdn-docker/crepen-cdn-server:latest

SET version=0.1.2

docker build --build-arg BASE_PATH=/cloud --no-cache -f dockerfile-cloud -t nexus.crepen.cloud/crepencdn-docker/crepen-cdn-cloud:%version% .
docker tag nexus.crepen.cloud/crepencdn-docker/crepen-cdn-cloud:%version% nexus.crepen.cloud/crepencdn-docker/crepen-cdn-cloud:latest

docker push nexus.crepen.cloud/crepencdn-docker/crepen-cdn-cloud:%version%
docker push nexus.crepen.cloud/crepencdn-docker/crepen-cdn-cloud:latest




docker build --no-cache -f dockerfile-server -t nexus.crepen.cloud/crepencdn-docker/crepen-cdn-server:%version% .
docker tag nexus.crepen.cloud/crepencdn-docker/crepen-cdn-server:%version% nexus.crepen.cloud/crepencdn-docker/crepen-cdn-server:latest

docker push nexus.crepen.cloud/crepencdn-docker/crepen-cdn-server:%version%
docker push nexus.crepen.cloud/crepencdn-docker/crepen-cdn-server:latest




docker build --no-cache -f dockerfile-admin -t nexus.crepen.cloud/crepencdn-docker/crepen-cdn-admin:%version% .
docker tag nexus.crepen.cloud/crepencdn-docker/crepen-cdn-admin:%version% nexus.crepen.cloud/crepencdn-docker/crepen-cdn-admin:latest

docker push nexus.crepen.cloud/crepencdn-docker/crepen-cdn-admin:%version%
docker push nexus.crepen.cloud/crepencdn-docker/crepen-cdn-admin:latest