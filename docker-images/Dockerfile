# Package the verified Expo export. Build it first with scripts/plumblines/build-container.sh.
FROM nginxinc/nginx-unprivileged:1.28-alpine@sha256:7377697a821c131a924a7105fafbe7414db4e9fcc77a6f08f776f33f141ec3f8
COPY docker-images/nginx.conf /etc/nginx/conf.d/default.conf
COPY dist/ /usr/share/nginx/html/
USER 101
EXPOSE 8080
HEALTHCHECK --interval=15s --timeout=3s --start-period=5s CMD wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1
LABEL org.opencontainers.image.source="https://github.com/Shikibashi/plumblines"
LABEL org.opencontainers.image.description="Plumblines independent AT Protocol web client"
