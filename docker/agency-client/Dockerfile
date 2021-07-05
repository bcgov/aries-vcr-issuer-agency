# build stage
FROM node:fermium as build-stage
WORKDIR /client
COPY agency-client/package*.json ./
RUN npm install
COPY agency-client/ .
RUN npm run build

# production stage
FROM caddy:alpine as production-stage
COPY --from=build-stage /client/dist /srv