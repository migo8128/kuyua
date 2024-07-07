import { Feature } from "geojson";

export type Location = Feature;
export type ProfileValue = "Very High" | "High" | "Medium" | "Low";
export type Profiles = {
  [key in keyof Location["properties"]]: {
    impactProfile: ProfileValue;
    dependencyProfile: ProfileValue;
    natureRiskProfile: ProfileValue;
    climateProfile: ProfileValue;
  };
};
