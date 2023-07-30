FROM node:18-alpine

WORKDIR /app

COPY . .

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]

EXPOSE 3000