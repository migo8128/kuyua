import { renderHook } from "@testing-library/react-hooks";
import useFetch from "../hooks/useFetch";
import { fetchLocations } from "../services/api";

jest.mock("../../api/locations");

describe("useFetch", () => {
  it("should fetch locations and set state correctly", async () => {
    const mockLocations = {
      features: [
        {
          properties: {
            score: 85,
            name: "Location 1",
            id: "1",
            address: "Address 1",
            countryCode: "US",
          },
        },
        {
          properties: {
            score: 90,
            name: "Location 2",
            id: "2",
            address: "Address 2",
            countryCode: "UK",
          },
        },
      ],
      total: 2,
    };

    (fetchLocations as jest.Mock).mockResolvedValue(mockLocations);

    const { result, waitForNextUpdate } = renderHook(() =>
      useFetch("/locations")
    );

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.data).toEqual(mockLocations.features);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("should set error state when fetch fails", async () => {
    (fetchLocations as jest.Mock).mockRejectedValue(
      new Error("Failed to fetch")
    );

    const { result, waitForNextUpdate } = renderHook(() =>
      useFetch("/locations")
    );

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.error).not.toBeNull();
    expect(result.current.loading).toBe(false);
  });
});
