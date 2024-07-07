import Map from "./Map";
import { Location } from "../../types/location.type";
import { getClassNames } from "../../utils/getClassNames";

interface MapSectionProps {
  locations: Location[];
}

const exploreClasses = getClassNames(
  "grid",
  "flex",
  "border-round-2xl",
  "flex",
  "justify-content-between"
);

const exploreHeaderClasses = getClassNames("text-white", "p-5");

const exploreHeaderArticleClasses = getClassNames("uppercase", "text-6xl");
const exploreHeaderTextClasses = getClassNames("text-xs");

const ExploreHeader = () => (
  <section className={exploreHeaderClasses}>
    <article
      className={exploreHeaderArticleClasses}
      style={{ fontWeight: "bold" }}
    >
      Explore
    </article>
    <p className={exploreHeaderTextClasses}>
      Move the globe and see all your locations, click on a location to expand
      the informations
    </p>
  </section>
);

const MapSection: React.FC<MapSectionProps> = ({ locations }) => {
  return (
    <div className={exploreClasses} style={{ backgroundColor: "black" }}>
      <div className={getClassNames("col-5")}>
        <ExploreHeader />
      </div>
      <div className={getClassNames("col-7")}>
        <Map locations={locations} />
      </div>
    </div>
  );
};

export default MapSection;
