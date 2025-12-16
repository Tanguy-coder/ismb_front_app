# Multi-stage Dockerfile for Angular app (Angular 20)

# ---------- Build stage ----------
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies using clean, reproducible install
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copy sources and build
COPY . .

# Build for production (output to dist/ng-tailadmin)
RUN npm run build


# ---------- Runtime stage ----------
FROM nginx:alpine AS runtime

# Remove default nginx static content
RUN rm -rf /usr/share/nginx/html/*

# Copy custom nginx config (SPA routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build artifacts
COPY --from=build /app/dist/ng-tailadmin/ /usr/share/nginx/html/

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
