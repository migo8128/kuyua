import React, { FC, useState } from "react";
import { InputText } from "primereact/inputtext";
import { SearchIcon } from "primereact/icons/search";
import { Button } from "primereact/button";
import { RadioButton } from "primereact/radiobutton";
import { getClassNames } from "../../utils/getClassNames";
import { SearchOptions } from "../../types/filter.types";

const inputGroupClasses = "p-inputgroup border-round-2xl surface-100 border-0";
const inputTextClasses = "border-round-2xl surface-50 border-0 text-sm";
const buttonClasses =
  "w-2 flex justify-content-center border-round-3xl border-0 bg-black-alpha-90";
const searchButtonClasses = "bg-black-alpha-90 border-round-3xl border-0";
const siteTypeClasses =
  "flex text-xs align-items-center justify-content-center gap-3 surface-100 border-0 border-round-3xl px-3";

interface LocationsTableHeaderProps {
  onSearch(searchQuery: SearchOptions): void;
}

const options = ["Own", "Upstream", "Downstream"];

const LocationsTableHeader: FC<LocationsTableHeaderProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState<{ [key: string]: any } | null>(
    null
  );
  const [selectedOption, setSelectedOption] = useState<string>("Own");

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const trimmedValue = value.replace(/\s+/g, " ");

    const sq = { ...searchQuery, [name]: trimmedValue };
    setSearchQuery(sq);
    onSearch(sq);
  };

  const onOptionChange = (e: any) => {
    setSelectedOption(e.value);
  };

  return (
    <div
      className={getClassNames(
        "flex",
        "gap-3",
        "align-items-center",
        "justify-content-between"
      )}
    >
      <div
        className={getClassNames(
          "flex",
          "align-items-center",
          "justify-content-center"
        )}
      >
        <div className={getClassNames(inputGroupClasses)}>
          <InputText
            className={getClassNames(
              "surface-100",
              "border-round-2xl",
              "border-50",
              "text-sm"
            )}
            value={searchQuery?.["name"]}
            onChange={onSearchChange}
            placeholder="Search..."
            name="name"
          />
          <Button className={getClassNames(searchButtonClasses)}>
            <SearchIcon />
          </Button>
        </div>
      </div>
      <div
        className={getClassNames(
          "flex",
          "align-items-center",
          "justify-content-center"
        )}
      >
        <div className={getClassNames("p-inputgroup")}>
          <InputText
            className={getClassNames(inputTextClasses)}
            placeholder="Country"
            onChange={onSearchChange}
            name="countryCode"
            value={searchQuery?.["countryCode"]}
          />
        </div>
      </div>

      <Button
        className={getClassNames(
          "w-1",
          "text-xs",
          "flex",
          "justify-content-center",
          "border-round-3xl",
          "border-0",
          "bg-black-alpha-90"
        )}
      >
        Export
      </Button>
      <div className={getClassNames(siteTypeClasses)}>
        <p>Site Type: </p>
        {options.map((option) => (
          <div
            key={option}
            className={getClassNames(
              "flex",
              "align-items-center",
              "gap-1",
              "py-0"
            )}
          >
            <RadioButton
              inputId={option}
              value={option}
              onChange={onOptionChange}
              checked={selectedOption === option}
            />
            <label htmlFor={option}>{option}</label>
          </div>
        ))}
      </div>

      <Button className={getClassNames(buttonClasses)}>Add Location</Button>
    </div>
  );
};

export default LocationsTableHeader;
