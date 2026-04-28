FROM node:20-alpine

WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm ci

# Copiar todo el código
COPY . .

# Compilar el frontend (genera /app/dist)
RUN npm run build

EXPOSE 3001

ENV NODE_ENV=production

# Arrancar el servidor Express (sirve API + frontend)
CMD ["npx", "tsx", "server/index.ts"]
