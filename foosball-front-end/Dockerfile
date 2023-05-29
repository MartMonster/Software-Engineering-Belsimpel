FROM node:18

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm ci
# If you are building your code for production
# RUN npm ci --only=production


# Bundle app source
COPY . /app

RUN npm run build
RUN npm install serve -g

EXPOSE 3000
# CMD [ "node", "server.js" ]