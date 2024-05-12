# Stage-1 & specify a name 'builder'
FROM  node:latest AS builder

# Create a directory  and go to the directory 
WORKDIR /app

# Copy the package.json file to my current directory to install the necessary dependence  
COPY package.json .

# Install the dependence
RUN npm install

# Copy other files to my current directory
COPY . .

# Build and optimize static file
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]