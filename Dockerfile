
# Usar la versión de Node.js compatible
FROM node:20-alpine

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar el archivo package.json y package-lock.json al contenedor
COPY package*.json ./

# Usar npm install en lugar de npm ci para resolver conflictos de dependencias
RUN npm install

# Copiar el resto de los archivos del proyecto al contenedor
COPY . .

# Compilar el proyecto si es necesario (esto depende de tu configuración de build)
RUN npm run build

# Exponer el puerto en el que se ejecutará la aplicación (si aplica)
EXPOSE 3000

# Ejecutar la aplicación
CMD ["npm", "start"]
