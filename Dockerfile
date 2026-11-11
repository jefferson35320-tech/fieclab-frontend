# Estágio 1: Build
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install

# 1. Declare os ARGs recebidos do GitHub Actions
ARG REACT_APP_FIREBASE_API_KEY
ARG REACT_APP_FIREBASE_AUTH_DOMAIN
ARG REACT_APP_FIREBASE_PROJECT_ID
ARG REACT_APP_FIREBASE_STORAGE_BUCKET
ARG REACT_APP_FIREBASE_MESSAGING_SENDER_ID
ARG REACT_APP_FIREBASE_APP_ID
ARG REACT_APP_FIREBASE_MEASUREMENT_ID

# 2. Exporte como variáveis de ambiente para o build do Node/React
ENV REACT_APP_FIREBASE_API_KEY=$REACT_APP_FIREBASE_API_KEY
ENV REACT_APP_FIREBASE_AUTH_DOMAIN=$REACT_APP_FIREBASE_AUTH_DOMAIN
ENV REACT_APP_FIREBASE_PROJECT_ID=$REACT_APP_FIREBASE_PROJECT_ID
ENV REACT_APP_FIREBASE_STORAGE_BUCKET=$REACT_APP_FIREBASE_STORAGE_BUCKET
ENV REACT_APP_FIREBASE_MESSAGING_SENDER_ID=$REACT_APP_FIREBASE_MESSAGING_SENDER_ID
ENV REACT_APP_FIREBASE_APP_ID=$REACT_APP_FIREBASE_APP_ID
ENV REACT_APP_FIREBASE_MEASUREMENT_ID=$REACT_APP_FIREBASE_MEASUREMENT_ID

# 3. Publicação atrás do API Gateway (vazios = rodar na raiz, como localmente)
#    PUBLIC_URL: prefixo do site (ex: /fieclab) -> links de assets e rotas
#    REACT_APP_API_URL: URL do backend (ex: https://<api-backend>/fieclab)
ARG PUBLIC_URL=
ARG REACT_APP_API_URL=

COPY . .
# Não passa REACT_APP_API_URL vazio ao React (senão ele ignora o .env)
RUN if [ -z "$REACT_APP_API_URL" ]; then unset REACT_APP_API_URL; fi; \
    if [ -z "$PUBLIC_URL" ]; then unset PUBLIC_URL; fi; \
    npm run build

# Estágio 2: Produção com Nginx
FROM nginx:alpine
# Fallback de SPA: refresh em /home, /product/1... devolve o index.html
COPY nginx.config /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
