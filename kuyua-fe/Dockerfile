
# Use an official node image as the base image
FROM node:16 AS build

# Set the working directory
WORKDIR /src

ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

ENV REACT_APP_MAPBOX_TOKEN=pk.eyJ1IjoiYWhtZWRtYWdkeTc3NzciLCJhIjoiY2x5N3Q3aWc1MDNtODJrc2ZoNWIyamEzZSJ9.na5s7DpbwC5E6bAQofF40g


# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Use a lightweight web server to serve the production build
FROM nginx:stable-alpine

# Copy the build output to the Nginx html directory
COPY --from=build /src/build /usr/share/nginx/html

# Expose the port on which the app will run
EXPOSE 80

# Start the application
CMD ["nginx", "-g", "daemon off;"]
