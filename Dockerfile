FROM node:10

WORKDIR /src/usr/app

COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080

CMD ["npm", "run", "dev"]
