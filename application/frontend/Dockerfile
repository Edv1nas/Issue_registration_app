# Step 1: Build the React app
FROM node:16 AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY application/frontend/reg-app/package*.json ./

# Install dependencies
RUN npm install

# Copy the entire frontend app (including public/ and src/)
COPY application/frontend/reg-app/ ./

# Build the React app
RUN npm run build

# Step 2: Serve the app using a simple HTTP server
FROM node:16

# Set working directory
WORKDIR /app

# Install a simple HTTP server to serve the built React app
RUN npm install -g serve

# Copy the built React app from the previous stage
COPY --from=build /app/build /app/build

# Expose port 80 for HTTP
EXPOSE 80

# Start serving the React app
CMD ["serve", "-s", "build", "-l", "80"]


