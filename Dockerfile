# Use Node.js as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code (including 'routes/' folder)
COPY . /app
WORKDIR /app

# Expose the port your server runs on
EXPOSE 5000

COPY .env /app/.env

# Start the application
CMD ["node", "server.js"]
