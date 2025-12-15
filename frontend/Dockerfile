# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY ssl.crt /etc/nginx/ssl/ssl.crt
COPY ssl.key /etc/nginx/ssl/ssl.key
EXPOSE 80
EXPOSE 443