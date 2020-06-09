FROM node:12.18-alpine3.12 as dev
WORKDIR /root/
CMD echo "getting latest npm modules" \
  && yarn \
  && echo "installation complete, starting" \
  && yarn start

FROM node:12.18-alpine3.12 as build
WORKDIR /root
COPY ./package.json ./package.json
RUN npm install
COPY . .
RUN npm run build -o app
