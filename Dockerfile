# Build stage
FROM node:latest as node
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build landingpage2 -c production

# Publish stage
FROM nginx:alpine
LABEL authors="niklasweimann"
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=node /app/dist/landingpage2 /usr/share/nginx/html
