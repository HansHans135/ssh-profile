FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY server.js ./
COPY host_key ./

EXPOSE 22

CMD ["node", "server.js"]
