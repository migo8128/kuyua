import { FC, useState } from "react";
import { Column } from "primereact/column";
import {
  DataTable,
  DataTableRowClickEvent,
  DataTableStateEvent,
} from "primereact/datatable";
import { useNavigate } from "react-router-dom";
import { Location } from "../../types/location.type";
import { SortOptions } from "../../types/filter.types";
import { getClassNames } from "../../utils/getClassNames";
import ErrorBoundary from "../common/error-boundary";

const rowClasses = "text-xs cursor-pointer";
const headerClasses = "text-xs uppercase w-1rem";

interface LocationsBodyProps {
  locations: Location[];
  onSort(sortOptions: SortOptions): void;
}

const LocationsTableBody: FC<LocationsBodyProps> = ({ locations, onSort }) => {
  const navigate = useNavigate();

  const [sort, setSort] = useState<SortOptions>({
    field: "score",
    order: 1,
  });

  const sortHandler = (event: DataTableStateEvent) => {
    if (!event.sortField || !event.sortOrder) {
      console.warn("Invalid sort options provided");
      return;
    }

    const sortObj = { field: event.sortField, order: event.sortOrder };
    setSort(sortObj);
    onSort(sortObj);
  };

  if (!locations) {
    console.error("Locations prop is missing");
    return <div>Error: Locations data is not available</div>;
  }

  const mappedLocations = locations.map((location) => ({
    score: location.properties?.score ?? "N/A",
    name: location.properties?.name ?? "N/A",
    id: location.properties?.id ?? "N/A",
    address: location.properties?.address ?? "N/A",
    countryCode: location.properties?.countryCode ?? "N/A",
    type: "Own",
  }));

  const columns = [
    { field: "score", header: "Priority Score" },
    { field: "name", header: "Site Name" },
    { field: "id", header: "State Id" },
    { field: "address", header: "Address" },
    { field: "countryCode", header: "Country" },
    { field: "type", header: "Site Type" },
  ];

  const onRowClick = (event: DataTableRowClickEvent) => {
    if (!event.data.id) {
      console.warn("Location ID is missing in the clicked row data");
      return;
    }
    navigate(`/?location_id=${event.data.id}`);
  };

  const sortableFields = ["score", "name", "countryCode"];

  return (
    <ErrorBoundary>
      {mappedLocations.length === 0 ? (
        <div>No locations available</div>
      ) : (
        <DataTable
          value={mappedLocations}
          rowClassName={() => getClassNames(rowClasses)}
          stripedRows
          onRowClick={onRowClick}
          rowHover
          onSort={sortHandler}
          sortField={sort.field}
          sortOrder={sort.order}
        >
          {columns.map((col) => (
            <Column
              key={col.field}
              field={col.field}
              header={col.header}
              headerClassName={getClassNames(headerClasses)}
              sortable={sortableFields.includes(col.field)}
            />
          ))}
        </DataTable>
      )}
    </ErrorBoundary>
  );
};

export default LocationsTableBody;
