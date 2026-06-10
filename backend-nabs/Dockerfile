FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY backend-nabs/ .

EXPOSE 8080

CMD ["node", "server.js"]