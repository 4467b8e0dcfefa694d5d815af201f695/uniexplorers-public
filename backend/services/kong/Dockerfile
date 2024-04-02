FROM --platform=$BUILDPLATFORM kong/kong-gateway:3.6.1.1
USER root

ENV KONG_PLUGINS=custom-auth

COPY kong.yml /
COPY ./custom-auth /usr/local/share/lua/5.1/kong/plugins/custom-auth
# COPY certs /etc/kong/ssl

USER kong

RUN cp /etc/kong/kong.conf.default /etc/kong/kong.conf