import { FeatureCollection, Geometry, GeoJsonProperties } from "geojson";
import { Profiles } from "../types/location.type";

export const fetchLocations = async (
  path: string,
  params?: string
): Promise<
  FeatureCollection<Geometry, GeoJsonProperties> & { total: number } & {
    profiles: Profiles;
  }
> => {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}${path}?${params}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch locations");
  }
  return response.json();
};
