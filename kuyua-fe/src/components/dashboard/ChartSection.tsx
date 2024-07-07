import DoughnutChart from "../charts/doughnut.chart";
import { getClassNames } from "../../utils/getClassNames";

const surfaceClasses = getClassNames(
  "surface-200",
  "flex",
  "justify-content-center",
  "border-round-2xl",
  "p-4"
);

const boxClasses = getClassNames(
  "flex",
  "flex-column",
  "justify-content-between",
  "w-full"
);

const labelClasses = getClassNames(
  "py-4",
  "bg-black-alpha-90",
  "text-white",
  "uppercase",
  "font-bold",
  "text-2xl",
  "text-center"
);

const LabelBox = ({ text }: { text: string }) => (
  <div style={{ borderRadius: "70px" }} className={labelClasses}>
    {text}
  </div>
);

const ChartsSection = () => {
  return (
    <div className={getClassNames("col-5", "flex", "gap-4")}>
      <div className={surfaceClasses}>
        <DoughnutChart />
      </div>
      <div className={boxClasses}>
        <LabelBox text="Report" />
        <LabelBox text="Targets" />
        <LabelBox text="Actions" />
      </div>
    </div>
  );
};

export default ChartsSection;
