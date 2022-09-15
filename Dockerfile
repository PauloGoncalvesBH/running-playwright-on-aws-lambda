FROM node:16-alpine3.16@sha256:2c405ed42fc0fd6aacbe5730042640450e5ec030bada7617beac88f742b6997b as build-image

RUN apk add --no-cache \
    build-base \
    libtool \
    libressl-dev\
    musl-dev \
    libffi-dev \
    autoconf \
    automake \
    libexecinfo-dev \
    make \
    cmake \
    python3 \
    py3-pip \
    libcurl \
    && rm -rf /var/cache/apk/*

WORKDIR /dependencies

COPY tests/package*.json ./

RUN npm ci \
    && npm install aws-lambda-ric@1.1.0 --save-exact

FROM node:16-alpine3.16@sha256:2c405ed42fc0fd6aacbe5730042640450e5ec030bada7617beac88f742b6997b

# Installs Chromium package
RUN apk add --no-cache \
    chromium=102.0.5005.173-r0 \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    && rm -rf /var/cache/apk/*

ENV IS_TEST_RUNNING_ON_LAMBDA true

WORKDIR /app

COPY lambda/handler.js ./
COPY tests/ ./

COPY --from=build-image /dependencies/node_modules/ ./node_modules

ENTRYPOINT ["node_modules/.bin/aws-lambda-ric"]
CMD ["handler.runTest"]
