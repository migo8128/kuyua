import app from "./app.js";
import dotenv from "dotenv";
import fs from "node:fs/promises";
import _fs from "fs";
import path from "node:path";
import { Worker } from "node:worker_threads";
import { fileURLToPath } from "url";

dotenv.config();

const PORT = process.env.PORT || 4000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
