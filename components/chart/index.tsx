"use client";
import dynamic from "next/dynamic";
import { FC } from "react";
// import Chart from "react-apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
type TCurve =
  | "smooth"
  | "straight"
  | "stepline"
  | "smooth"
  | "straight"
  | "stepline";

type Props = {
  id: string | "bar-chart";
  series: any | undefined;
  type?: "bar" | any;
  colors?: Array<string>;
  className?: string;
  dropShadowColor?: string;
  strokeColor?: Array<string>;
  height?: number | string;
  width?: number | string;
  xaxisLabel?: boolean;
  yAxisLabel?: boolean;
  stacked?: boolean;
  plotOptions?: boolean;
  showGrid?: boolean;
  categories?: Array<string>;
  label?: Array<string>;
  curve?: TCurve | TCurve[];
  showDownloads?: boolean;
};

export const WeatherChart: FC<Props> = ({
  type,
  colors,
  id,
  series,
  className,
  height,
  showGrid,
  label,
  categories,
  curve,
  stacked,
}) => {
  const yaxisOptions = {
    show: true,
    labels: {
      show: true,
      style: {
        colors: "#ACAFC8",
        fontSize: "12px",
        fontFamily: `monospace`,
      },

      formatter: (value: any) => {
        return type !== "line" && type !== "area" && value > 0
          ? `${value}K`
          : `${value}`;
      },
    },

    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  };

  const options = {
    chart: {
      id: id,
      toolbar: {
        show: false,
      },
      selection: {
        enabled: true,
        stroke: {},
      },
      stacked: stacked,
    },
    labels: label,
    xaxis: {
      categories: categories || [],
      labels: {
        show: true,
        style: {
          fontFamily: "monospace",
          colors: "#ACAFC8",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      // crosshairs: {
      //   show: true,
      //   width: 40,
      //   height: 10,
      //   top: 30,
      //   position: "front",

      //   opacity: 0.6,
      //   fill: {
      //     type: "gradient",
      //     color: "rgba(52,202,165,1)",

      //     gradient: {
      //       colorFrom: "rgba(52,202,165,1)",
      //       colorTo: "rgba(52,202,165,1)",
      //       stops: [0, 80, 100],
      //       opacityFrom: 1,
      //       opacityTo: 0.2,
      //     },
      //   },
      // },
    },
    yaxis: yaxisOptions,
    fill: {
      colors: colors,
    },
    legend: {
      show: true,
      labels: {
        colors: "whitesmoke",
        fontFamily: "Poppins",
        backgroundColor: "green",
      },
      // position: "top",
    },
    // states: {
    //   hover: {
    //     filter: { type: "none" },
    //   },
    //   active: {
    //     filter: { type: "none" },
    //   },
    // },
    grid: {
      show: showGrid ?? true,
      strokeDashArray: 0,
      borderColor: "rgba(220,214, 214, 0.3)",
      opacity: 0.5,
      yaxis: {
        lines: {
          show: true,
        },
      },
      xaxis: {
        lines: {
          show: false,
        },
        labels: {
          show: true,
          style: {
            fontSize: "13px",
            fontWeight: 300,
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
      formatter: function (val: number) {
        return val + ".00";
      },
      offsetY: -20,
      style: {
        colors: ["#304758"],
      },
    },

    // tooltip: {
    //   style: {
    //     fontSize: "12px",
    //   },
    //   theme: "dark",
    // },

    tooltip: {
      enabled: true,
      shared: false,
      show: false,
      style: {
        fontSize: "12px",
        fontFamily: "Plus Jakarta Sans, sans-serif",
        background: "green",
      },
      x: {
        show: false,
      },
      y: {
        show: true,
        formatter: function (value: number) {
          return `${value}`;
        },
      },

      marker: { show: false },
      theme: "dark",
    },

    stroke: {
      show: true,
      colors: colors,
      curve: curve,
    },
    colors: colors,
  };

  return (
    <Chart
      options={options}
      series={series}
      type={type}
      height={height ?? 300}
      className={className}
      width={"100%"}
    />
  );
};
