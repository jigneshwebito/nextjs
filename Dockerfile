FROM node:latest

RUN mkdir /nextjs1

WORKDIR /nextjs1

COPY . /nextjs1

RUN npm install

RUN npm install next@latest react@latest react-dom@latest

RUN npm run build

COPY . /build

CMD ["npm", "start"]



