import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { FC, useEffect, useState } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import { haversineDistance } from "../../utils/haversineDistance";
import { Image } from "primereact/image";
import { Button } from "primereact/button";
import { Location } from "../../types/location.type";
import { useSearchParams } from "react-router-dom";

interface ViewportProps {
  latitude: number;
  longitude: number;
  zoom: number;
  width: string;
  height: string;
}

interface MapProps {
  locations: Location[];
}
const Map: FC<MapProps> = ({ locations }) => {
  const [searchParams] = useSearchParams();
  const locationId = searchParams.get("location_id");

  const [viewport, setViewport] = useState<ViewportProps>({
    latitude: 0,
    longitude: 0,
    zoom: 2,
    width: "100vw",
    height: "100vh",
  });

  const [filteredLocations, setFilteredLocations] = useState<Location[] | null>(
    null
  );

  const [selectedLocation, setSelectedLocation] = useState<any | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setViewport((prevViewport) => ({
          ...prevViewport,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          zoom: 10,
        }));
      },
      () => {
        console.error("Error getting user location");
      }
    );
  }, []);

  useEffect(() => {
    if (locations && viewport.latitude && viewport.longitude) {
      const filtered = locations.filter(
        (location) =>
          haversineDistance(
            [viewport.longitude, viewport.latitude],
            (location.geometry as any).coordinates
          ) <= 1000
      );
      setFilteredLocations(filtered);
    }
  }, [locations, viewport.latitude, viewport.longitude]);

  useEffect(() => {
    if (locationId && locations.length > 0) {
      const selectedLocation = locations.find(
        (location) => location.properties?.id === locationId
      );

      if (selectedLocation) {
        setViewport((prevViewport) => ({
          ...prevViewport,
          latitude: (selectedLocation.geometry as any).coordinates[1],
          longitude: (selectedLocation.geometry as any).coordinates[0],
        }));
        setSelectedLocation(selectedLocation);
      }
    }
  }, [locationId, locations]);

  return (
    <ReactMapGL
      {...viewport}
      mapboxAccessToken="pk.eyJ1IjoiYWhtZWRtYWdkeTc3NzciLCJhIjoiY2x5N3Q3aWc1MDNtODJrc2ZoNWIyamEzZSJ9.na5s7DpbwC5E6bAQofF40g"
      onMove={(evt) =>
        setViewport({
          latitude: evt.viewState.latitude,
          longitude: evt.viewState.longitude,
          zoom: evt.viewState.zoom,
          width: viewport.width,
          height: viewport.height,
        })
      }
      style={{ height: "58vh" }}
      mapStyle="mapbox://styles/mapbox/dark-v11"
      projection={{
        name: "globe",
        center: [0, 0],
      }}
    >
      {filteredLocations?.map((location) => (
        <Marker
          key={location.properties?.id}
          latitude={(location.geometry as any)?.coordinates[1]}
          longitude={(location.geometry as any)?.coordinates[0]}
        >
          <Button
            className="marker-btn"
            onClick={() => {
              setSelectedLocation(location);
            }}
          >
            <Image
              width="300"
              src="https://docs.mapbox.com/help/demos/custom-markers-gl-js/mapbox-icon.png"
              alt="Marker Icon"
            />
          </Button>
        </Marker>
      ))}
      {selectedLocation && (
        <Popup
          latitude={(selectedLocation.geometry as any)?.coordinates[1]}
          longitude={(selectedLocation.geometry as any)?.coordinates[0]}
          onClose={() => setSelectedLocation(null)}
          closeOnClick={false}
        >
          <div>
            <h3>{selectedLocation.properties.name}</h3>
            <p>Score: {selectedLocation.properties.score}</p>
            <p>Address: {selectedLocation.properties.address}</p>
          </div>
        </Popup>
      )}
    </ReactMapGL>
  );
};

export default Map;
