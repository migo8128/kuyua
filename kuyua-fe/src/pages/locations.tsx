import { useCallback, useEffect, useState } from "react";
import { Image } from "primereact/image";
import LocationsTable from "../components/locations/Location";
import { Location } from "../types/location.type";
import { fetchLocations } from "../services/api";
import {
  PaginationOptions,
  SearchOptions,
  SortOptions,
} from "../types/filter.types";
import LocationsPaginator from "../components/locations/LocationPaginator";
import ErrorBoundary from "../components/common/ErrorBoundary";
import { NavLink } from "react-router-dom";
import { FeatureCollection, Geometry, GeoJsonProperties } from "geojson";
import { Profiles } from "../types/location.type";

type Params = PaginationOptions & SortOptions & SearchOptions;

const initialParams: Params = {
  field: "",
  order: 1,
  page: 1,
  pageSize: 10,
};

const fetchAndSetLocations = async (
  params: Params,
  setParams: React.Dispatch<React.SetStateAction<Params>>,
  setLocations: React.Dispatch<React.SetStateAction<Location[]>>,
  setTotalRows: React.Dispatch<React.SetStateAction<number>>
) => {
  try {
    const searchParams = new URLSearchParams(params as any);
    setParams(params);
    const data = await fetchLocations<
      FeatureCollection<Geometry, GeoJsonProperties> & { total: number } & {
        profiles: Profiles;
      }
    >("/locations", searchParams.toString());

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

const Locations = () => {
  const [params, setParams] = useState<Params>(initialParams);
  const [locations, setLocations] = useState<Location[]>([]);
  const [totalRows, setTotalRows] = useState<number>(
    initialParams.pageSize || 10
  );
  const [first, setFirst] = useState<number>(1);

  const getLocations = useCallback(
    (params: Params) =>
      fetchAndSetLocations(params, setParams, setLocations, setTotalRows),
    []
  );

  const onPageChange = (page: number) => {
    getLocations({ ...params, page });
  };

  const onSearch = (searchQuery: SearchOptions) => {
    getLocations({ ...initialParams, ...searchQuery });
  };

  const onSort = (sortQuery: SortOptions) => {
    getLocations({ ...initialParams, ...sortQuery });
  };

  useEffect(() => {
    document.title = "Locations";
    getLocations(initialParams);
  }, [getLocations]);

  return (
    <ErrorBoundary>
      <div>
        <header className="flex justify-content-between">
          <div className="flex gap-2 align-items-end">
            <NavLink to="/">
              <Image src="/logo.png" width="250" loading="lazy" />
            </NavLink>
            <h2 className="text-600 font-light uppercase">All Locations</h2>
          </div>
          <LocationsPaginator
            first={first}
            rows={params.pageSize || 10}
            totalRecords={totalRows}
            onPageChange={onPageChange}
            setFirst={setFirst}
          />
        </header>
        <LocationsTable
          onSort={onSort}
          locations={locations}
          onSearch={onSearch}
        />
      </div>
    </ErrorBoundary>
  );
};

export default Locations;
