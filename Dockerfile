FROM node:alpine
RUN npm install --global pnpm
WORKDIR /app
COPY package*.json ./
RUN pnpm install
COPY . .
CMD ["pnpm", "run", "start:dev"]