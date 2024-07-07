import { useState } from "react";
import { AgCharts } from "ag-charts-react";
import { AgChartOptions } from "ag-charts-community";

function getData() {
  return [
    { asset: "Medium risk", amount: 38 },
    { asset: "Low risk", amount: 40 },
    { asset: "High risk", amount: 12 },
  ];
}

function DoughnutChart() {
  const [options, setOptions] = useState<AgChartOptions>({
    background: { visible: false },
    data: getData(),
    title: {
      text: "Overall Location Status",
    },
    series: [
      {
        type: "donut",
        fills: ["red", "rgb(121, 224, 25)", "yellow"],
        calloutLabelKey: "asset",
        angleKey: "amount",
        innerRadiusRatio: 0.6,
        innerLabels: [
          {
            text: "Oeverall Location Status",
            fontSize: 12,
            fontWeight: "normal",
            color: "black",
          },
        ],
      },
    ],
  });

  return <AgCharts options={options} />;
}

export default DoughnutChart;
