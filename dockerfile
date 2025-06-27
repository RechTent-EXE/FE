# Step 1: Build the app
FROM node:20-alpine AS builder 
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Step 2: Use serve to run static files
FROM node:20-alpine 
WORKDIR /app

# Install serve globally
RUN npm install -g serve

# Copy built files from previous stage
COPY --from=builder /app/dist ./dist

EXPOSE 4200
CMD ["serve", "-s", "dist", "-l", "4200"]