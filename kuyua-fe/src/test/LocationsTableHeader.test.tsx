/* eslint-disable testing-library/prefer-screen-queries */
import React from "react";
import { render, fireEvent } from "@testing-library/react";
import LocationsTableHeader from "../components/locations/LocationTableHeader";

describe("LocationsTableHeader", () => {
  it("should render the component correctly", () => {
    const { getByPlaceholderText, getByText } = render(
      <LocationsTableHeader onSearch={jest.fn()} />
    );
    expect(getByPlaceholderText("Search...")).toBeInTheDocument();
    expect(getByPlaceholderText("Country")).toBeInTheDocument();
    expect(getByText("Site Type:")).toBeInTheDocument();
  });

  it("should call onSearch when input changes", () => {
    const mockOnSearch = jest.fn();
    const { getByPlaceholderText } = render(
      <LocationsTableHeader onSearch={mockOnSearch} />
    );
    const searchInput = getByPlaceholderText("Search...");

    fireEvent.change(searchInput, { target: { value: "Test Location" } });
    expect(mockOnSearch).toHaveBeenCalledWith({ name: "Test Location" });
  });

  it("should change selected option when radio button is clicked", () => {
    const { getByLabelText } = render(
      <LocationsTableHeader onSearch={jest.fn()} />
    );
    const ownRadioButton = getByLabelText("Own");
    const upstreamRadioButton = getByLabelText("Upstream");

    fireEvent.click(upstreamRadioButton);
    expect(upstreamRadioButton).toBeChecked();
    expect(ownRadioButton).not.toBeChecked();
  });
});
