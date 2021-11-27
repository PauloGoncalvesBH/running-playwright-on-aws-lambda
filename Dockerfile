FROM node:14-alpine3.12@sha256:5733466201d57d5da95db081f7facc24f5505f290a9dd78e18fc81648ad44740 as build-image

RUN apk add --no-cache \
    build-base=0.5-r2 \
    libtool=2.4.6-r7 \
    libressl-dev=3.1.2-r0 \
    musl-dev=1.1.24-r10 \
    libffi-dev=3.3-r2 \
    autoconf=2.69-r2 \
    automake=1.16.2-r0 \
    libexecinfo-dev=1.1-r1 \
    make=4.3-r0 \
    cmake=3.17.2-r0 \
    python3=3.8.10-r0 \
    py3-pip=20.1.1-r0 \
    libcurl=7.79.1-r0 \
    && rm -rf /var/cache/apk/*

WORKDIR /dependencies

COPY tests/package*.json ./

RUN npm ci \
    && npm install aws-lambda-ric@1.1.0 --save-exact

FROM node:14-alpine3.12@sha256:5733466201d57d5da95db081f7facc24f5505f290a9dd78e18fc81648ad44740

# Installs Chromium package
RUN apk add --no-cache \
    chromium=86.0.4240.111-r0 \
    nss=3.60-r1 \
    freetype=2.10.4-r0 \
    freetype-dev=2.10.4-r0 \
    harfbuzz=2.6.6-r0 \
    ca-certificates=20191127-r4 \
    ttf-freefont=20120503-r1 \
    && rm -rf /var/cache/apk/*

WORKDIR /app

COPY lambda/handler.js ./
COPY tests/ ./

COPY --from=build-image /dependencies/node_modules/ ./node_modules

ENTRYPOINT ["/usr/local/bin/npx", "aws-lambda-ric@1.1.0"]
CMD ["handler.runTest"]
