import { faker } from "@faker-js/faker";
import { parentPort } from "node:worker_threads";

const generateProfile = () => {
  const profiles = ["Very High", "High", "Medium", "Low"];
  return profiles[Math.floor(Math.random() * profiles.length)];
};

const generateLocations = (num) => {
  const locations = [];
  for (let i = 0; i < num; i++) {
    const location = {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [faker.location.longitude(), faker.location.latitude()],
      },
      properties: {
        id: faker.string.uuid(),
        name: faker.location.city(),
        score: faker.number.int({ min: 0, max: 100 }),
        address: `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.state()}, ${faker.location.zipCode()}`,
        state: faker.location.state(),
        countryCode: faker.location.countryCode(),
        impactProfile: generateProfile(),
        dependencyProfile: generateProfile(),
        natureRiskProfile: generateProfile(),
        climateProfile: generateProfile(),
      },
    };

    locations.push(location);
  }
  return locations;
};
const locations = generateLocations(10000);

if (parentPort) {
  parentPort.postMessage(locations);
}
