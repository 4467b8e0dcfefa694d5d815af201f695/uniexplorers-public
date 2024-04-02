FROM node:20.2-alpine

WORKDIR /app
COPY package*.json ./

RUN npm install -production
RUN wget -O /usr/local/bin/node-prune https://gobinaries.com/tj/node-prune
RUN chmod +x /usr/local/bin/node-prune
RUN node-prune
COPY . .

CMD ["node", "app.js"]