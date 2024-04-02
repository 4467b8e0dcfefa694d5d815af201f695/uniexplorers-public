FROM node:21.7-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . . 

RUN chmod +x seed_migrate.sh

FROM node:21.7-alpine as runtime

WORKDIR /app

COPY --from=build /app .
