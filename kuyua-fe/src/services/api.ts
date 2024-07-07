import { FeatureCollection, Geometry, GeoJsonProperties } from "geojson";
import { Profiles } from "../types/location.type";

export const fetchLocations = async (
  params?: string
): Promise<
  FeatureCollection<Geometry, GeoJsonProperties> & { total: number } & {
    profiles: Profiles;
  }
> => {
  const response = await fetch(`http://localhost:4000/locations?${params}`);
  if (!response.ok) {
    throw new Error("Failed to fetch locations");
  }
  return response.json();
};
