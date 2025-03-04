FROM node:18-alpine AS build

WORKDIR /build

COPY package*.json ./
RUN npm ci
COPY . .

RUN npm run build:client
RUN npm run build:server

FROM node:18-alpine

WORKDIR /app

ENV NPM_CONFIG_CACHE=/app/.npm-cache

COPY --from=build /build/dist /app/dist
COPY package*.json ./

RUN mkdir -p /app/.npm-cache && chown -R node:node /app/.npm-cache
RUN npm cache clean --force && npm ci --only=production --no-cache

RUN chown -R node:node /app

USER node

EXPOSE 3000

CMD node ./dist/node/index.js
