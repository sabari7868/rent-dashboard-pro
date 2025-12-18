# Stage 1: Build React app
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy build files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP and HTTPS
EXPOSE 80 443

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

