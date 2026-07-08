FROM node:22-alpine AS base

WORKDIR /app

RUN apk add --no-cache openssl libc6-compat

COPY package.json ./
COPY apps/backend/package.json ./apps/backend/package.json
COPY apps/frontend/package.json ./apps/frontend/package.json

RUN npm install

FROM base AS dev

WORKDIR /app

COPY . .

WORKDIR /app/apps/backend

EXPOSE 3000

CMD ["sh", "-c", "npm run prisma:generate && npm run prisma:db-push && npm run start:dev:docker"]

FROM base AS build

WORKDIR /app

COPY . .

WORKDIR /app/apps/backend

RUN npm run prisma:generate && npm run build

FROM node:22-alpine AS prod

WORKDIR /app

RUN apk add --no-cache openssl libc6-compat

COPY package.json ./
COPY apps/backend/package.json ./apps/backend/package.json
COPY apps/frontend/package.json ./apps/frontend/package.json

RUN npm install --omit=dev

COPY --from=build /app/apps/backend/dist ./apps/backend/dist
COPY --from=build /app/apps/backend/prisma ./apps/backend/prisma

RUN npx prisma generate --schema=apps/backend/prisma/schema.prisma

WORKDIR /app/apps/backend

EXPOSE 3000

CMD ["node", "dist/main"]