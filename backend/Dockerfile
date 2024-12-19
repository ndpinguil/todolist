# Usa una imagen oficial de Node.js como base
FROM node:14

# Configura el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copia los archivos necesarios para instalar dependencias
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código del backend
COPY . .

# Expone el puerto que usa tu backend
EXPOSE 5001

# Comando para iniciar tu aplicación
CMD ["npm", "start"]
