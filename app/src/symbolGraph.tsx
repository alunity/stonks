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
import { iSymbolData } from "./yfinance";

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
  data: iSymbolData;
  range: string;
  setRange: Function;
}

function Graph(props: iGraph) {
  if (props.data.chart.result[0].timestamp === undefined) {
    return null;
  }

  // Remove null values
  let timestamps = props.data.chart.result[0].timestamp;
  let prices = props.data.chart.result[0].indicators.quote[0].close;

  // @ts-ignore
  while (prices.indexOf(null) !== -1) {
    // @ts-ignore
    prices.splice(prices.indexOf(null), 1);
    // @ts-ignore
    timestamps.splice(prices.indexOf(null), 1);
  }

  let red = "255, 99, 132";
  let green = "0,135,60";

  // let [range, setRange] = useState("1d");
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
        label: props.data.chart.result[0].meta.symbol,
        data: prices,
        borderColor:
          "rgb(" +
          (props.data.chart.result[0].meta.regularMarketPrice >
          props.data.chart.result[0].meta.chartPreviousClose
            ? green
            : red) +
          ")",
        backgroundColor:
          "rgba(" +
          (props.data.chart.result[0].meta.regularMarketPrice >
          props.data.chart.result[0].meta.chartPreviousClose
            ? green
            : red) +
          ", 0.5)",
        fill: true,
      },
    ],
  };

  // 1d, 5d, 1mo, 6mo, 1y, 5y, max

  return (
    <>
      <Line options={options} data={data} />
      <div className="container grid">
        <div className="row">
          <div className="form-check col">
            <input
              className="form-check-input"
              checked={props.range === "1d"}
              onChange={() => props.setRange("1d")}
              type="radio"
            ></input>
            <label className="form-check-label">1 day</label>
          </div>
          <div className="form-check col">
            <input
              className="form-check-input"
              checked={props.range === "5d"}
              onChange={() => props.setRange("5d")}
              type="radio"
            ></input>
            <label className="form-check-label">5 days</label>
          </div>
          <div className="form-check col">
            <input
              className="form-check-input"
              checked={props.range === "1mo"}
              onChange={() => props.setRange("1mo")}
              type="radio"
            ></input>
            <label className="form-check-label">1 month</label>
          </div>
          <div className="form-check col">
            <input
              className="form-check-input"
              checked={props.range === "6mo"}
              onChange={() => props.setRange("6mo")}
              type="radio"
            ></input>
            <label className="form-check-label">6 months</label>
          </div>
          <div className="form-check col">
            <input
              className="form-check-input"
              checked={props.range === "1y"}
              onChange={() => props.setRange("1y")}
              type="radio"
            ></input>
            <label className="form-check-label">1 year</label>
          </div>
          <div className="form-check col">
            <input
              className="form-check-input"
              checked={props.range === "5y"}
              onChange={() => props.setRange("5y")}
              type="radio"
            ></input>
            <label className="form-check-label">5 year</label>
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

export default Graph;
