FROM node:22-alpine AS base
WORKDIR /app

COPY ./ ./

RUN npm ci
RUN npm run build

EXPOSE 8000

CMD ["node", "./dist/main.js"]
