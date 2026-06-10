FROM node:20-alpine

WORKDIR /app

COPY backend-nabs/package*.json ./

RUN npm install

COPY backend-nabs/ .

EXPOSE 5000

CMD ["node", "server.js"]