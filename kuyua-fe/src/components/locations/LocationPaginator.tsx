import { Paginator } from "primereact/paginator";

interface LocationsPaginatorProps {
  first: number;
  rows: number;
  totalRecords: number;
  onPageChange: (page: number) => void;
  setFirst: (first: number) => void;
}

const LocationsPaginator: React.FC<LocationsPaginatorProps> = ({
  first,
  rows,
  totalRecords,
  onPageChange,
  setFirst,
}) => (
  <Paginator
    first={first}
    rows={rows}
    totalRecords={totalRecords}
    onPageChange={(event) => {
      setFirst(event.first + 1);
      onPageChange(event.page + 1);
    }}
    template={{
      layout: "PrevPageLink CurrentPageReport NextPageLink",
    }}
    className="text-xs"
  />
);

export default LocationsPaginator;
