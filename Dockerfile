FROM node:20.17.0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY ./src ./src

EXPOSE 8080 

CMD ["npm","start"]