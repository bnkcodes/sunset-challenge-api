FROM node:18.14.2-alpine

WORKDIR /usr/src/app

COPY yarn.lock ./

COPY package.json ./

RUN yarn

COPY . .

EXPOSE 3000

CMD ["yarn", "start:dev", "--host=0.0.0.0"]
