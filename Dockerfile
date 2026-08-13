FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm i

COPY . .
RUN npm run build

FROM nginx:alpine AS production

RUN rm -rf /etc/nginx/conf.d/default.conf
COPY nginx.config /etc/nginx/config.d/default.config

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
