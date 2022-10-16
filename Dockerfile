FROM node:16-alpine
EXPOSE 3000
HEALTHCHECK CMD npm run healthcheck
WORKDIR /usr/app/src
COPY package*.json ./
RUN npm ci
COPY *.js ./
CMD node .
