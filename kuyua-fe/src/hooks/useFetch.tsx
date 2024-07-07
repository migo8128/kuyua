import { useState, useEffect } from "react";
import {
  PaginationOptions,
  SearchOptions,
  SortOptions,
} from "../types/filter.types";

type Params = PaginationOptions & SortOptions & SearchOptions;

const _initialParams: Params = {
  field: "",
  order: 1,
  page: 1,
  pageSize: 10,
};
const useFetch = <T,>(
  url: string,
  initialParams: Params = _initialParams,
  deps: any[] = []
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<Params>(initialParams);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const searchParams = new URLSearchParams(params as any);
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}${url}?${searchParams.toString()}`
        );
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, ...deps, params]);

  return { data, loading, error, setParams };
};

export default useFetch;
