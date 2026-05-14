# FROM node:20-alpine AS build
# WORKDIR /app
# COPY package*.json ./
# RUN npm ci
# COPY . .
# RUN npm run build

# FROM node:20-alpine
# WORKDIR /app
# RUN npm install -g serve
# COPY --from=build /app/dist ./dist
# EXPOSE 8080
# CMD ["serve", "dist", "-s", "-l", "8080"]

FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:stable-alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]