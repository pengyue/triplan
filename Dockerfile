FROM node:8

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

EXPOSE 80
CMD [ "npm", "start" ]