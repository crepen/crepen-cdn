@REM nexus.crepen.cloud/crepencdn-docker/crepen-cdn-cloud:0.1.0
@REM nexus.crepen.cloud/crepencdn-docker/crepen-cdn-cloud:latest

@REM nexus.crepen.cloud/crepencdn-docker/crepen-cdn-server:0.1.0
@REM nexus.crepen.cloud/crepencdn-docker/crepen-cdn-server:latest



docker build --build-arg BASE_PATH=/cloud --no-cache -f dockerfile-cloud -t nexus.crepen.cloud/crepencdn-docker/crepen-cdn-cloud:0.1.0 .
docker tag nexus.crepen.cloud/crepencdn-docker/crepen-cdn-cloud:0.1.0 nexus.crepen.cloud/crepencdn-docker/crepen-cdn-cloud:latest

docker push nexus.crepen.cloud/crepencdn-docker/crepen-cdn-cloud:0.1.0
docker push nexus.crepen.cloud/crepencdn-docker/crepen-cdn-cloud:latest




docker build --build-arg --no-cache -f dockerfile-server -t nexus.crepen.cloud/crepencdn-docker/crepen-cdn-server:0.1.0 .
docker tag nexus.crepen.cloud/crepencdn-docker/crepen-cdn-server:0.1.0 nexus.crepen.cloud/crepencdn-docker/crepen-cdn-server:latest

docker push nexus.crepen.cloud/crepencdn-docker/crepen-cdn-server:0.1.0
docker push nexus.crepen.cloud/crepencdn-docker/crepen-cdn-server:latest