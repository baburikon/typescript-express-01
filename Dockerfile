FROM node:12
WORKDIR /home/typescript-express-01
COPY package*.json ./
RUN npm i
EXPOSE 8080
CMD [ "npm", "start" ]