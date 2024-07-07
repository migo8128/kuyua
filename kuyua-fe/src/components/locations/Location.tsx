import { FC } from "react";
import LocationsBody from "./LocationTableBody";
import LocationsTableHeader from "./LocationTableHeader";
import { Location } from "../../types/location.type";
import { Card } from "primereact/card";
import { SearchOptions, SortOptions } from "../../types/filter.types";

interface LocationsTableProps {
  locations: Location[];
  onSearch(searchQuery: SearchOptions): void;
  onSort(sortOptions: SortOptions): void;
}
const LocationsTable: FC<LocationsTableProps> = ({
  locations,
  onSort,
  onSearch,
}) => {
  return (
    <div className="px-8">
      <LocationsTableHeader onSearch={onSearch} />
      <br />
      <Card className="border-round-2xl surface-50">
        <LocationsBody onSort={onSort} locations={locations} />
      </Card>
    </div>
  );
};

export default LocationsTable;
