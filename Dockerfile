# Base image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# A wildcard(*) is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Bundle app source
COPY . .

# Install app dependencies
RUN npm ci

# Expose the port
EXPOSE 3000

# Creates a "dist" folder with the production build
RUN npm run build

# Start the server using the production build
CMD [ "node", "dist/src/main.js" ]
