FROM node:22-alpine AS base

WORKDIR /app

COPY package.json ./
COPY apps/backend/package.json ./apps/backend/package.json
COPY apps/frontend/package.json ./apps/frontend/package.json

RUN npm install

FROM base AS dev

WORKDIR /app

COPY . .

WORKDIR /app/apps/frontend

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

FROM base AS build

WORKDIR /app

COPY . .

WORKDIR /app/apps/frontend

RUN npm run build

FROM nginx:1.27-alpine AS prod

COPY --from=build /app/apps/frontend/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
