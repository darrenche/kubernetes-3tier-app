FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json .

# Install dependencies
RUN npm install --production

# Copy application code
COPY src/ ./src/

EXPOSE 3000

CMD ["npm", "start"]