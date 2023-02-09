import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import dateFormat from "dateformat";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Price",
    },
  },
};

interface iGraph {
  label: string;
  timestamps: Array<number>;
  prices: Array<number>;
  range: string;
  setRange: Function;
  increasing: boolean;
}

function PriceChart(props: iGraph) {
  let red = "255, 99, 132";
  let green = "0,135,60";

  // Remove null values
  let timestamps = props.timestamps;
  let prices = props.prices;

  // @ts-ignore
  while (prices.indexOf(null) !== -1) {
    // @ts-ignore
    prices.splice(prices.indexOf(null), 1);
    // @ts-ignore
    timestamps.splice(prices.indexOf(null), 1);
  }

  const data = {
    labels: timestamps.map((x) => {
      let date = new Date(x * 1000);
      if (props.range === "1d") {
        return dateFormat(date, "shortTime");
      } else if (props.range === "5d") {
        return dateFormat(date, "ddd");
      } else if (props.range === "1mo") {
        return dateFormat(date, "mmm d");
      } else if (props.range === "6mo") {
        return dateFormat(date, "mmm d, yy");
      } else if (props.range === "1y") {
        return dateFormat(date, "mmm d, yy");
      } else if (props.range === "5y") {
        return dateFormat(date, "mmm d, yy");
      } else if (props.range === "max") {
        return dateFormat(date, "mmm d, yy");
      }
    }),
    datasets: [
      {
        label: props.label,
        data: prices,
        borderColor: "rgb(" + (props.increasing ? green : red) + ")",
        backgroundColor: "rgba(" + (props.increasing ? green : red) + ", 0.5)",
        fill: true,
      },
    ],
  };

  return (
    <>
      <Line options={options} data={data} />
      <div className="container grid">
        <div className="row position-relative">
          <div className="form-check col">
            <input
              className="form-check-input"
              checked={props.range === "1d"}
              onChange={() => props.setRange("1d")}
              type="radio"
            ></input>
            <label className="form-check-label">1D</label>
          </div>
          <div className="form-check col">
            <input
              className="form-check-input"
              checked={props.range === "5d"}
              onChange={() => props.setRange("5d")}
              type="radio"
            ></input>
            <label className="form-check-label">5D</label>
          </div>
          <div className="form-check col">
            <input
              className="form-check-input"
              checked={props.range === "1mo"}
              onChange={() => props.setRange("1mo")}
              type="radio"
            ></input>
            <label className="form-check-label">1M</label>
          </div>
          <div className="form-check col">
            <input
              className="form-check-input"
              checked={props.range === "6mo"}
              onChange={() => props.setRange("6mo")}
              type="radio"
            ></input>
            <label className="form-check-label">6M</label>
          </div>
          <div className="form-check col">
            <input
              className="form-check-input"
              checked={props.range === "1y"}
              onChange={() => props.setRange("1y")}
              type="radio"
            ></input>
            <label className="form-check-label">1Y</label>
          </div>
          <div className="form-check col">
            <input
              className="form-check-input"
              checked={props.range === "5y"}
              onChange={() => props.setRange("5y")}
              type="radio"
            ></input>
            <label className="form-check-label">5Y</label>
          </div>
          <div className="form-check col">
            <input
              className="form-check-input"
              checked={props.range === "max"}
              onChange={() => props.setRange("max")}
              type="radio"
            ></input>
            <label className="form-check-label">Max</label>
          </div>
        </div>
      </div>
    </>
  );
}

export default PriceChart;
