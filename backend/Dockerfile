FROM node:24-alpine

RUN addgroup -g 1001 appgroup && adduser -G appgroup -u 1001 appuser -s /bin/sh -D

WORKDIR /app
COPY package*.json ./

COPY prisma ./prisma

RUN npm install nodemon --save-dev
RUN npm install

COPY --chown=appuser:appgroup . ./
EXPOSE 3000

RUN npx prisma generate

USER appuser

# CMD ["npm", "run", "dev"]