FROM node:argon
RUN mkdir -p /app
WORKDIR /app

COPY package.json /app
RUN npm install
RUN npm update

COPY . /app

EXPOSE 3000

CMD ["npm","start"]
