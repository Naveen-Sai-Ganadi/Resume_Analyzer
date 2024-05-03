# Use a Node.js as a parent image
FROM node:16-alpine

# Set the working directory in the container
WORKDIR /home/node/app

# Install dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json /home/node/app/

RUN npm install

# Bundle app source
COPY . /home/node/app

# Expose port 3000 to the network
EXPOSE 3000

# Define the command to run your app using CMD which defines your runtime
CMD ["npm", "start"]

