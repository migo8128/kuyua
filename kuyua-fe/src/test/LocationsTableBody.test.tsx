/* eslint-disable testing-library/prefer-screen-queries */
import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LocationsTableBody from "../components/locations/LocationTableBody";
import { Location } from "../types/location.type";

const mockLocations: Location[] = [
  {
    properties: {
      score: 85,
      name: "Location 1",
      id: "1",
      address: "Address 1",
      countryCode: "US",
    },
    type: "Feature",
    geometry: undefined as any,
  },
  {
    properties: {
      score: 90,
      name: "Location 2",
      id: "2",
      address: "Address 2",
      countryCode: "UK",
    },
    type: "Feature",
    geometry: undefined as any,
  },
];

describe("LocationsTableBody", () => {
  it("should render locations correctly", () => {
    const { getByText } = render(
      <MemoryRouter>
        <LocationsTableBody locations={mockLocations} onSort={jest.fn()} />
      </MemoryRouter>
    );

    expect(getByText("Location 1")).toBeInTheDocument();
    expect(getByText("Location 2")).toBeInTheDocument();
  });

  it("should call onSort when a sortable column is clicked", () => {
    const mockOnSort = jest.fn();
    const { getByText } = render(
      <MemoryRouter>
        <LocationsTableBody locations={mockLocations} onSort={mockOnSort} />
      </MemoryRouter>
    );

    const scoreHeader = getByText("Priority Score");
    fireEvent.click(scoreHeader);

    expect(mockOnSort).toHaveBeenCalled();
  });

  it("should navigate to the correct location when a row is clicked", () => {
    const { getByText } = render(
      <MemoryRouter>
        <LocationsTableBody locations={mockLocations} onSort={jest.fn()} />
      </MemoryRouter>
    );

    const location1 = getByText("Location 1");
    fireEvent.click(location1);
  });
});
