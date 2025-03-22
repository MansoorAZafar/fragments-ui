##############################################################################
# Stage 0:  Installing Alpine Linux + Node

FROM node:20.17.0-alpine3.20@sha256:2d07db07a2df6830718ae2a47db6fedce6745f5bcd174c398f2acdda90a11c03 AS build

##############################################################################
# Stage 1:  Setup of Work Directory & Args

# Define build arguments
ARG AWS_COGNITO_POOL_ID
ARG AWS_COGNITO_CLIENT_ID
ARG OAUTH_SIGN_IN_REDIRECT_URL

# Set them as environment variables for the build process
ENV AWS_COGNITO_POOL_ID=$AWS_COGNITO_POOL_ID
ENV AWS_COGNITO_CLIENT_ID=$AWS_COGNITO_CLIENT_ID
ENV OAUTH_SIGN_IN_REDIRECT_URL=$OAUTH_SIGN_IN_REDIRECT_URL

WORKDIR /app

##############################################################################
# Stage 2:  Installing Dependencies

COPY package*.json ./

RUN npm ci --production

##############################################################################
# Stage 3:  Copy Source Code & Define Args

COPY ./src ./src

##############################################################################
# Stage 4:  Metadata

LABEL maintainer="Mansoor Zafar <mzafar15@myseneca.ca>"
LABEL description="Fragments-UI node.js frontend"

##############################################################################
#Stage 5: Building the Frontend-UI

RUN npm run build

##############################################################################
# Serve with Nginx

FROM nginx:1.26.3-alpine@sha256:d2c11a1e63f200585d8225996fd666436277a54e8c0ba728fa9afff28f075bd7 AS deploy

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=build /app/dist .

EXPOSE 80

HEALTHCHECK --interval=3m \
    CMD wget --no-verbose --tries=1 --spider http://localhost || exit 1

CMD ["nginx", "-g", "daemon off;"]
