FROM node:22-alpine AS base
WORKDIR /app

COPY ./ ./

RUN npm ci
RUN npm run build
RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "start"]
