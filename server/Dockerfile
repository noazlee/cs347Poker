# Use the official Node.js 18 image as a parent image
FROM node:18-slim

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json 
COPY package.json package.json
COPY package-lock.json package-lock.json

# Install dependencies
RUN npm install

# Bundle the source code inside the Docker image
COPY . .

# Map the port to the Docker daemon
EXPOSE 3000

# Define the command to run the app
CMD [ "npm", "start" ]
