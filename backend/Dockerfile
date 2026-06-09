FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy semua kode backend
COPY . .

# Expose port (sama dengan PORT di .env)
EXPOSE 8080

# Jalankan server
CMD ["node", "server.js"]