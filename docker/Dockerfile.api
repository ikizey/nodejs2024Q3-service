FROM node:22-alpine

WORKDIR /homelib

COPY . .

RUN npm install

ENTRYPOINT ["npm", "run", "start"]
