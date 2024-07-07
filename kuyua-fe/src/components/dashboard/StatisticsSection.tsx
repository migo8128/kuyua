import { getClassNames } from "../../utils/getClassNames";

const sectionClasses = getClassNames(
  "col-7",
  "flex",
  "align-items-center",
  "p-3",
  "border-round-3xl",
  "bg-black-alpha-90",
  "gap-4"
);

const articleClasses = getClassNames(
  "col",
  "flex",
  "flex-column",
  "py-7",
  "justify-content-center",
  "surface-800",
  "border-round-3xl",
  "text-center",
  "text-white"
);

const titleClasses = getClassNames(
  "text-6xl",
  "font-bold",
  "text-white",
  "uppercase"
);

const infoClasses = getClassNames("text-white", "font-light", "text-sm");

const largeNumberClasses = getClassNames("font-bold", "text-8xl");

const smallTextClasses = getClassNames("text-xs", "font-light", "capitalize");

const StatisticsSection = () => {
  return (
    <div className={sectionClasses}>
      <section className={articleClasses}>
        <article className={largeNumberClasses}>1.457</article>
        <small className={smallTextClasses}>All locations</small>
      </section>
      <section className="col">
        <section className={titleClasses}>
          All
          <br />
          Locations
        </section>
        <small className={infoClasses}>
          Get access to the results of
          <br /> all your locations
        </small>
      </section>
    </div>
  );
};

export default StatisticsSection;
