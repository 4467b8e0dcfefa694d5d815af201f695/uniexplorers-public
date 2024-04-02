FROM node:21.6-alpine as builder

WORKDIR /app

COPY package*.json ./

# Install dependencies
RUN npm install

RUN wget -O /usr/local/bin/node-prune https://gobinaries.com/tj/node-prune && \
    chmod +x /usr/local/bin/node-prune && \
    node-prune

COPY . .

FROM node:21.6-alpine

RUN apk --no-cache add curl

WORKDIR /app

COPY --from=builder /app .

CMD ["node", "app.js"]
