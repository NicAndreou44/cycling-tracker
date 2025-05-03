FROM node:22-alpine


RUN apk add --no-cache python3 make g++


WORKDIR /usr/src/app


COPY package*.json ./


RUN npm install --ignore-scripts


RUN npm rebuild bcrypt --build-from-source


COPY . .


RUN npm run build


EXPOSE 3000


CMD ["npm", "start"]