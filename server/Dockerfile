# Use the official Node.js 14 image as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json 
COPY package*.json ./

# Install dependencies
RUN npm install

# Bundle the source code inside the Docker image
COPY . .

# Map the port to the Docker daemon
EXPOSE 3000

# Define the command to run the app
CMD [ "node", "app.js" ]
