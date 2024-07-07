# Kuyua-FE

## Overview

Kuyua-FE is a React-based frontend application designed to manage and display location data. The project leverages a variety of technologies and methodologies to ensure a robust, maintainable, and efficient codebase.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Technologies Used](#technologies-used)
3. [Setup and Installation](#setup-and-installation)
4. [API Integration](#api-integration)
5. [Global Styling](#global-styling)
6. [Testing](#testing)
7. [Docker Configuration](#docker-configuration)
8. [Vercel Deployment](#vercel-deployment)
9. [Challenges and Improvements](#challenges-and-improvements)

## Project Structure

```
kuyua-fe/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── assets/
│       └── images/
├── build/
│   ├── index.html
│   ├── static/
├── src/
│   ├── assets/
│   │   ├── images/
│   ├── components/
│   │   ├── common/
│   │   │   ├── ErrorBoundary.tsx
│   │   ├── dashboard/
│   │   │   ├── ChartSection.tsx
│   │   │   ├── Map.tsx
│   │   │   ├── MapSection.tsx
│   │   │   ├── ProfilesSection.tsx
│   │   │   ├── StatisticsSection.tsx
│   │   ├── locations/
│   │   │   ├── Locations.tsx
│   │   │   ├── LocationsTable.tsx
│   │   │   ├── LocationsTableHeader.tsx
│   │   │   ├── LocationsTableBody.tsx
│   │   │   └── LocationsPaginator.tsx
│   ├── hooks/
│   │   ├── useFetch.ts
│   │
│   ├── pages/
│   │   ├── dashboard.tsx
│   │   ├── locations.tsx
│   │
│   ├── services/
│   │   ├── api.ts
│   │
│   ├── types/
│   │   ├── filter.types.ts
│   │   ├── location.types.ts
│   │
│   ├── utils/
│   │   ├── getClassNames.ts
│   │
│   ├── App.tsx
│   ├── index.tsx
│   ├── routes/
│   │
│   └──
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Technologies Used

- **React**: For building the user interface.
- **TypeScript**: For type-safe JavaScript development.
- **PrimeReact**: For UI components.
- **Mapbox GL**: For interactive maps.
- **React Router**: For navigation.
- **Styled Components**: For styling.
- **Testing Library**: For testing React components.
- **Nginx**: For serving the production build.
- **Docker**: For containerization.
- **Vercel**: For deployment.

## Setup and Installation

To set up the project locally:

1. Clone the repository:

   ```bash
   git clone https://github.com/migo8128/kuyua.git
   cd kuyua-fe
   ```

2. Install dependencies:

   ```bash
   npm install --force
   ```

3. Start the development server:

   ```bash
   npm start
   ```

4. Build the project:

   ```bash
   npm run build
   ```

5. Serve the production build locally:
   ```bash
   npm install -g serve
   serve -s build
   ```

## API Integration

The project uses a custom `useFetch` hook for API interactions. Here's a brief overview:

- **fetchAndSetLocations**: This function fetches location data from the API, sets the state for locations, and handles pagination.

```typescript
const fetchAndSetLocations = async (
  params: Params,
  setParams: React.Dispatch<React.SetStateAction<Params>>,
  setLocations: React.Dispatch<React.SetStateAction<Location[]>>,
  setTotalRows: React.Dispatch<React.SetStateAction<number>>
) => {
  try {
    const searchParams = new URLSearchParams(params as any);
    setParams(params);
    const data = await fetchLocations(searchParams.toString());

    if (!data || !data.features) {
      console.error("Locations data is not available");
      return;
    }
    setLocations(data.features);
    setTotalRows(data.total);
  } catch (error) {
    console.error("Failed to fetch locations", error);
  }
};
```

- **useFetch**: Custom hook to handle fetching data and managing state.

## Global Styling

The project uses the "Inter var" font globally, with specific font feature settings. This is done by setting CSS variables and applying them in the global CSS.

```css
/* src/index.css */
:root {
  --font-family: "Inter var", sans-serif;
  --font-feature-settings: "cv02", "cv03", "cv04", "cv11";
}

body {
  font-family: var(--font-family);
  font-feature-settings: var(--font-feature-settings);
}
```

## Testing

The project includes unit tests for various components using Testing Library.

Example test for `Locations` component:

```typescript
import { render, screen } from "@testing-library/react";
import Locations from "../components/locations/Locations";

test("renders Locations component", () => {
  render(<Locations />);
  const linkElement = screen.getByText(/Locations/i);
  expect(linkElement).toBeInTheDocument();
});
```

## Docker Configuration

The project is containerized using Docker. The Dockerfile sets up a multi-stage build for production.

```dockerfile
# Use an official node image as the base image
FROM node:16 AS build

# Set the working directory
WORKDIR /src

# Define environment variables
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

ENV REACT_APP_MAPBOX_TOKEN=pk.eyJ1IjoiYWhtZWRtYWdkeTc3NzciLCJhIjoiY2x5N3Q3aWc1MDNtODJrc2ZoNWIyamEzZSJ9.na5s7DpbwC5E6bAQofF40g

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --force

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
```

To run the app with Docker:

```bash
docker-compose up --build
```

## Vercel Deployment

The project is configured to deploy on Vercel. The `vercel.json` file is set up to use static builds and environment variables.

```json
{
  "version": 2,
  "name": "kuyua-fe",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "env": {
    "REACT_APP_API_URL": "https://kuyua-be.vercel.app/",
    "REACT_APP_MAPBOX_TOKEN": "pk.eyJ1IjoiYWhtZWRtYWdkeTc3NzciLCJhIjoiY2x5N3Q3aWc1MDNtODJrc2ZoNWIyamEzZSJ9.na5s7DpbwC5E6bAQofF40g"
  },
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

## Challenges and Improvements

### Challenges Faced

1. **Dependency Conflicts**:

   - There were conflicts with `@types/jest` and `@testing-library/jest-dom`. These were resolved by specifying compatible versions and using `npm install --force`.

2. **API Integration**:

   - Implementing lazy loading for fetching locations within a 1000 km radius of the user's location required careful handling of geospatial queries and state management.

3. **Font Integration**:
   - Ensuring global font settings and applying specific font feature settings globally required modifying the global CSS and setting CSS variables.

### Improvements with More Time

1. **Enhanced Error Handling**:

   - Improve error handling across the application to provide more user-friendly feedback and logging.

2. **Optimized Performance**:

   - Implement further optimizations for lazy loading and state management to enhance performance, especially for large datasets.

3. **Comprehensive Testing**:

   - Expand test coverage to include integration tests and end-to-end tests to ensure

4. Documentation:

   - Provide more detailed documentation and comments within the codebase to aid future developers.

5. UI/UX Enhancements:

   - Improve the user interface and experience, including better loading indicators, responsive design improvements, and accessibility features.
