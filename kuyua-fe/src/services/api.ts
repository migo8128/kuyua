import { FeatureCollection, Geometry, GeoJsonProperties } from "geojson";
import { Profiles } from "../types/location.type";

export const fetchLocations = async <T>(
  path: string,
  params?: string
): Promise<T> => {
  const response = await fetch(`https://kuyua-be.vercel.app${path}?${params}`);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
};
