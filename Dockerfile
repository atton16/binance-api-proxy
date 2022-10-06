FROM node:16-alpine
EXPOSE 3000
WORKDIR /app
COPY package-lock.json package.json ./
RUN npm ci
COPY index.js ./
CMD node .
