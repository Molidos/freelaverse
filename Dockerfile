# =========================
# BUILD
# =========================
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN pnpm install

COPY . .
RUN pnpm run build

# =========================
# RUNTIME
# =========================
FROM node:20-alpine AS final
WORKDIR /app

COPY --from=build /app ./

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "start"]
# se usar "next start" direto:
# CMD ["npx", "next", "start", "-p", "3000"]