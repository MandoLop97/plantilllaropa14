FROM node:18-alpine

# Crear directorio
WORKDIR /app

# Copiar dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Compilar Vite
RUN npm run build

# Instalar servidor estático
RUN npm install -g serve

# Servir el contenido
EXPOSE 3000
CMD ["serve", "-s", "dist"]
