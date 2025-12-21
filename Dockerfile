# syntax=docker/dockerfile:1.7

FROM node:20-alpine AS deps
WORKDIR /app

# pnpm via corepack
RUN corepack enable

COPY package.json pnpm-lock.yaml ./

# cache do store do pnpm (acelera builds repetidos)
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm config set store-dir /pnpm/store && \
    pnpm install --frozen-lockfile

# ----------------------------

FROM node:20-alpine AS build
WORKDIR /app
RUN corepack enable

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# precisa gerar .next/standalone
RUN pnpm run build

# ----------------------------

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# (opcional mas recomendado) rodar como não-root
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

# Copia só o necessário do standalone
# Isso SUBSTITUI o "COPY --from=build /app ./"
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

USER nextjs

CMD ["node", "server.js"]
