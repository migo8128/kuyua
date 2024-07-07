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
import ErrorBoundary from "../components/common/error-boundary";
import { NavLink } from "react-router-dom";

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
              <Image
                src="data:image/png;base64,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"
                width="250"
                loading="lazy"
              />
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
