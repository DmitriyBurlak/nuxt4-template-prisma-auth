# Stage 1: Билдер
FROM node:20.19.0-alpine as builder
WORKDIR /app

# Кэшируем зависимости
COPY package*.json ./
COPY prisma ./prisma

# Ставим зависимости и генерируем Prisma Client
RUN npm install
RUN npx prisma generate

# Копируем исходники и билдим
COPY . .
RUN npm run build

# Stage 2: Продакшн
FROM node:18-alpine
WORKDIR /app

COPY --from=builder /app/.output ./.output
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

ENTRYPOINT ["node", ".output/server/index.mjs"]