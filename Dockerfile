##############################################################################
# Stage 0:  Installing Alpine Linux + Node

FROM node:20.17.0-alpine3.20@sha256:2d07db07a2df6830718ae2a47db6fedce6745f5bcd174c398f2acdda90a11c03 AS dependencies


##############################################################################
# Stage 1:  Setup of Work Directory

WORKDIR /app

##############################################################################
# Stage 2:  Installing Dependencies

COPY package.json package-lock.json ./

RUN npm ci --only=production

##############################################################################
# Stage 3:  Copy Source Code

COPY --chown=node:node ./src ./src

##############################################################################
# Stage 4:  Metadata

LABEL maintainer="Mansoor Zafar <mzafar15@myseneca.ca>"
LABEL description="Fragments-UI node.js frontend"

##############################################################################
#Stage 5: Building the Frontend-UI

RUN npm i -g parcel-bundler && parcel build ./src/index.html --dist-dir /app/dist


##############################################################################
# Serve with Nginx

FROM nginx:1.26.3-alpine@sha256:d2c11a1e63f200585d8225996fd666436277a54e8c0ba728fa9afff28f075bd7 AS deploy

COPY --from=dependencies /app/dist /usr/share/nginx/html

EXPOSE 80

USER node

HEALTHCHECK --interval=3m \
    CMD wget --no-verbose --tries=1 --spider http://localhost || exit 1

CMD ["nginx", "-g", "daemon off;"]