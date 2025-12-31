FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=development
ENV PATH=/app/node_modules/.bin:$PATH

COPY package*.json ./

RUN npm install

COPY . .

# Build JS -> dist using SWC
RUN npm run build

# Run compiled app
CMD ["node", "dist/src/main.js"]
