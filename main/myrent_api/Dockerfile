# FROM node:20-alpine
# WORKDIR /app

# COPY package*.json ./
# RUN npm ci

# COPY . .

# EXPOSE 3000
# CMD ["npm", "run", "dev"]

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

# Copier Prisma AVANT la génération
COPY prisma ./prisma

# Générer Prisma Client AU BUILD
RUN npx prisma generate

# Copier le reste du code
COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]
