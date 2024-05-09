# Use base Node image
FROM node:18-slim

# Working directory
WORKDIR /app

# Copy dependency lists
COPY package.json package.json
COPY package-lock.json package-lock.json

# Add dependencies
RUN npm install

# Copy remaining contents
COPY . .

# Frontend accessible on port 3001
EXPOSE 3001

# Run the frontend
CMD ["npm", "start"]