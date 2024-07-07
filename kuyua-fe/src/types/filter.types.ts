import { Location } from "./location.type";

export type SortOptions = {
  field: string;
  order: 0 | 1 | -1 | null | undefined;
};

export type SearchOptions = {
  [key in keyof Location["properties"]]: string;
};

export type PaginationOptions = {
  page: number;
  pageSize?: number;
};
