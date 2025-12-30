# Stage 1: Build
FROM node:20-slim AS builder

WORKDIR /app

# Install dependencies
# Using npm install as package-lock.json is present
COPY package.json package-lock.json* ./
RUN npm install

# Copy source code
COPY . .

# Build the app with environment variables
# These can be overridden during build time using --build-arg
ARG VITE_BACKEND_API_BASE_URL=https://api.vegagreeks.com
ENV VITE_BACKEND_API_BASE_URL=$VITE_BACKEND_API_BASE_URL

RUN npm run build

# Stage 2: Serve
FROM nginx:stable-alpine

# Copy nginx config for React Router support
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
