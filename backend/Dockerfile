FROM node:18
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm i --production
COPY server.js ./
ENV PORT=3000
EXPOSE 3000
CMD ["npm","start"]
