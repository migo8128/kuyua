# Kuyua-BE

## Overview

Kuyua-BE is a backend application designed to manage and serve location data to the Kuyua-FE frontend. This application is built using Node.js and Express and leverages various technologies and methodologies to ensure a robust, maintainable, and efficient backend system.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Technologies Used](#technologies-used)
3. [Setup and Installation](#setup-and-installation)
4. [API Endpoints](#api-endpoints)
5. [Data Generation and Management](#data-generation-and-management)
6. [Environment Variables](#environment-variables)
7. [Error Handling](#error-handling)
8. [Challenges and Improvements](#challenges-and-improvements)

## Project Structure

```
kuyua-be/
├── src/
│   ├── utils/
│   │   ├── locations-generator.js
│   ├── app.js
│   ├── index.js
├── .env
├── package.json
└── README.md
```

## Technologies Used

- **Node.js**: For server-side JavaScript execution.
- **Express**: For building the server and handling routing.
- **dotenv**: For managing environment variables.
- **fs/promises** and **fs**: For file system operations.
- **worker_threads**: For generating location data in a separate thread.

## Setup and Installation

To set up the project locally:

1. Clone the repository:

   ```bash
   git clone https://github.com/migo8128/kuyua.git
   cd kuyua-be
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your environment variables:

   ```env
   PORT=4000
   ```

4. Start the development server:
   ```bash
   npm start
   ```

## API Endpoints

### GET /locations

Fetches location data with optional pagination, sorting, and filtering.

**Request Parameters:**

- `page`: Page number (default: 1)
- `pageSize`: Number of items per page (default: 20000)
- `field`: Field to sort by
- `order`: Sort order (1 for ascending, -1 for descending)
- Additional query parameters for filtering

**Response:**

- `type`: FeatureCollection
- `features`: Array of location features
- `page`: Current page number
- `pageSize`: Number of items per page
- `total`: Total number of filtered locations
- `profiles`: Profile data for the first 5 records

## Data Generation and Management

### Data Loading

The application attempts to load location data from a JSON file (`locations.json`). If the file does not exist, it generates the data using a worker thread (`locations-generator.js`).

```javascript
// Load locations from JSON file
const locationsFilePath = path.join(__dirname, "../locations.json");

if (!_fs.existsSync(locationsFilePath)) {
  const worker = new Worker(
    path.join(__dirname, "/utils/locations-generator.js")
  );
  worker.on("message", (locations) => {
    const fileObj = {
      type: "FeatureCollection",
      features: locations,
    };

    _fs.writeFileSync(locationsFilePath, JSON.stringify(fileObj), "utf8");
  });
} else {
  console.log("Locations file already exists.");
}
```

### Fetching Locations

The `/locations` endpoint reads the data from the JSON file, applies pagination, sorting, and filtering, and returns the results.

```javascript
app.get("/locations", async (req, res) => {
  try {
    const allLocationsStr = await fs.readFile(locationsFilePath, "utf8");
    const allLocations = JSON.parse(allLocationsStr);

    const {
      page: p,
      pageSize: pz,
      field: sortField,
      order: sortOrder,
      ...searchQuery
    } = req.query;

    const page = parseInt(p) || 1;
    const pageSize = parseInt(pz) || 20000;

    const offset = (page - 1) * pageSize;

    let filteredLocations = allLocations.features;

    if (Object.keys(searchQuery).length > 0) {
      filteredLocations = filteredLocations.filter((location) => {
        return Object.entries(searchQuery).every(([key, value]) => {
          return String(location.properties[key])
            .toLowerCase()
            ?.includes(String(value).toLowerCase());
        });
      });
    }

    // Sorting
    if (sortField) {
      filteredLocations.sort((a, b) => {
        if (a.properties[sortField] < b.properties[sortField]) {
          return -1 * sortOrder;
        }
        if (a.properties[sortField] > b.properties[sortField]) {
          return 1 * sortOrder;
        }
        return 0;
      });
    }

    const paginatedLocations = filteredLocations.slice(
      offset,
      offset + pageSize
    );

    // Extract profile data for the first 5 records
    const profileData = {};
    const first5Locations = allLocations.features.slice(0, 5);

    first5Locations.forEach((location) => {
      const country = location.properties.countryCode;

      if (!profileData[country]) {
        profileData[country] = {
          impactProfile: location.properties.impactProfile,
          dependencyProfile: location.properties.dependencyProfile,
          natureRiskProfile: location.properties.natureRiskProfile,
          climateProfile: location.properties.climateProfile,
        };
      }
    });

    res.json({
      type: "FeatureCollection",
      features: paginatedLocations,
      page,
      pageSize,
      total: filteredLocations.length,
      profiles: profileData,
    });
  } catch (error) {
    console.error("Error reading locations file:", error);
    res.status(500).send("Internal Server Error");
  }
});
```

## Environment Variables

The application uses the `dotenv` package to manage environment variables. Ensure you have a `.env` file in the root directory with the following content:

```env
PORT=4000
```

## Error Handling

The application includes basic error handling for file read operations and data parsing. If an error occurs while reading the locations file, it logs the error and responds with a 500 status code.

```javascript
app.get("/locations", async (req, res) => {
  try {
    const allLocationsStr = await fs.readFile(locationsFilePath, "utf8");
    const allLocations = JSON.parse(allLocationsStr);

    // Processing code...
  } catch (error) {
    console.error("Error reading locations file:", error);
    res.status(500).send("Internal Server Error");
  }
});
```

## Challenges and Improvements

### Challenges Faced

1. **File System Operations**:

   - Ensuring that the locations file is read and written correctly, handling file not found errors, and generating the file when it doesn't exist.
   - Solution: Used `fs` and `fs/promises` for synchronous and asynchronous file operations respectively, and `worker_threads` to handle data generation in a separate thread.

2. **Data Processing**:

   - Implementing efficient pagination, sorting, and filtering mechanisms to handle large datasets.
   - Solution: Applied in-memory filtering and sorting on parsed JSON data, and used array slicing for pagination.

3. **Environment Configuration**:
   - Managing environment variables and ensuring they are correctly loaded in different environments (development, production).
   - Solution: Used `dotenv` to load environment variables from a `.env` file.

### Improvements with More Time

1. **Enhanced Error Handling**:

   - Implement more robust error handling across the application to provide clearer error messages and better fault tolerance.

2. **Database Integration**:

   - Replace file-based storage with a database (e.g., MongoDB, PostgreSQL) to improve data management, scalability, and query performance.

3. **Data Caching**:

   - Implement caching mechanisms (e.g., Redis) to reduce latency and improve response times for frequently accessed data.

4. **Testing**:

   - Expand test coverage to include integration tests and end-to-end tests to ensure the robustness and reliability of the API endpoints.

5. **Logging and Monitoring**:

   - Integrate logging and monitoring tools (e.g., Winston, Morgan) to track application performance and identify issues in real-time.

6. **API Documentation**:
   - Provide comprehensive API documentation using tools like Swagger to help developers understand and interact with the API endpoints.
