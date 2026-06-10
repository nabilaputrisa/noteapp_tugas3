FROM node:20-alpine

WORKDIR /app

COPY backend-nabs/package*.json ./

RUN npm install

COPY backend-nabs/ .

COPY backend-nabs/.env .env

EXPOSE 5000

CMD ["node", "server.js"]