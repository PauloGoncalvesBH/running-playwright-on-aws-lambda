# Define custom function directory
ARG FUNCTION_DIR="/function"

FROM node:14-alpine3.12 as build-image

# Include global arg in this stage of the build
ARG FUNCTION_DIR

RUN apk add --update-cache \
    build-base \
    libtool \
    libressl-dev \
    musl-dev \
    libffi-dev \
    autoconf \
    automake \
    libexecinfo-dev \
    make \
    cmake \
    python3 \
    py3-pip \
    libcurl

# Create function directory
RUN mkdir -p ${FUNCTION_DIR}

WORKDIR ${FUNCTION_DIR}

# Copy test files and handler
COPY lambda/handler.js ${FUNCTION_DIR}
COPY tests/ ${FUNCTION_DIR}

# Install the function's dependencies
RUN npm ci

FROM node:14-alpine3.12

# Installs latest Chromium package.
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# Include global arg in this stage of the build
ARG FUNCTION_DIR

# Set working directory to function root directory
WORKDIR ${FUNCTION_DIR}

# Copy in the built dependencies
COPY --from=build-image ${FUNCTION_DIR} ${FUNCTION_DIR}

ENTRYPOINT ["/usr/local/bin/npx", "aws-lambda-ric"]
CMD ["handler.runTest"]