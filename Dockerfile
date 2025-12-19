FROM node:20-alpine AS build
WORKDIR /app

RUN npm i -g pnpm

COPY package*.json ./
COPY pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

FROM node:20-alpine AS final
WORKDIR /app

RUN npm i -g pnpm

ENV NODE_ENV=production
EXPOSE 3000

COPY --from=build /app ./
CMD ["pnpm", "start"]
