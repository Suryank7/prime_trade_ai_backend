# Use Node.js LTS as base image
FROM node:20-alpine AS build

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

# Copy app source code
COPY . .

# Generate Prisma client and build TS
RUN npm run prisma:generate
RUN npm run build

# Production image
FROM node:20-alpine

WORKDIR /app

# Copy from build stage
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

# Expose port
EXPOSE 3000

# Start server
CMD ["npm", "start"]
