FROM node:18 as build
WORKDIR /client-app

COPY package*.json ./
RUN npm install

COPY . .
RUN chmod -R 755 /client-app
RUN npm run build  -- --mode production

FROM nginx:alpine
COPY --from=build /client-app/dist /usr/share/nginx/html

