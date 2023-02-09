import { useEffect, useState, useSyncExternalStore } from "react";
import iPortfolio from "./iPortfolio";
import { getSymbolData } from "./yfinance";
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

interface iAssetsGraph {
  portfolio: iPortfolio;
}

function AssetsGraph(props: iAssetsGraph) {
  let [range, setRange] = useState("1d");
  let [assetsValue, setAssetsValue] = useState<Array<number>>([]);
  let [timestamps, setTimestamps] = useState<Array<number>>([]);
  let [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      setLoading(true);
      let av: Array<number> = [];
      let time: Array<number> = [];

      let check: Array<number> = [];

      for (let i in props.portfolio) {
        let symbolData = await getSymbolData(i, undefined, range);
        if (symbolData.chart.error === null) {
          if (symbolData.chart.result[0].timestamp.length < time.length) {
            time = symbolData.chart.result[0].timestamp;
          }
          if (time.length === 0) {
            time = symbolData.chart.result[0].timestamp;
          }
        }
      }

      for (let i in props.portfolio) {
        let symbolData = await getSymbolData(i, undefined, range);
        if (symbolData.chart.error === null) {
          for (let j = 0; j < time.length; j++) {
            for (
              let k = 0;
              k < symbolData.chart.result[0].timestamp.length;
              k++
            ) {
              if (time[j] <= symbolData.chart.result[0].timestamp[k]) {
                if (av[j] === undefined) {
                  av[j] =
                    symbolData.chart.result[0].indicators.quote[0].close[k] *
                    props.portfolio[i];
                  check[j] = 1;
                } else {
                  av[j] +=
                    symbolData.chart.result[0].indicators.quote[0].close[k] *
                    props.portfolio[i];
                  check[j] += 1;
                }
                break;
              }
            }
          }
        }
      }
      for (let i = check.length - 1; i >= 0; i--) {
        if (check[i] !== Object.keys(props.portfolio).length) {
          console.log(i);
          check.splice(i, 1);
          av.splice(i, 1);
          timestamps.splice(i, 1);
        }
      }
      console.log(check);
      setAssetsValue(av);
      setTimestamps(time);
    }
    getData();
  }, [props.portfolio, range]);

  useEffect(() => {
    if (assetsValue !== undefined) {
      setLoading(false);
    }
  }, [assetsValue]);

  let red = "255, 99, 132";
  let green = "0,135,60";

  // let [range, setRange] = useState("1d");
  let data;
  if (timestamps !== undefined && assetsValue !== undefined) {
    data = {
      labels: timestamps.map((x) => {
        let date = new Date(x * 1000);
        if (range === "1d") {
          return dateFormat(date, "shortTime");
        } else if (range === "5d") {
          return dateFormat(date, "ddd");
        } else if (range === "1mo") {
          return dateFormat(date, "mmm d");
        } else if (range === "6mo") {
          return dateFormat(date, "mmm d, yy");
        } else if (range === "1y") {
          return dateFormat(date, "mmm d, yy");
        } else if (range === "5y") {
          return dateFormat(date, "mmm d, yy");
        } else if (range === "max") {
          return dateFormat(date, "mmm d, yy");
        }
      }),
      datasets: [
        {
          label: "Assets",
          data: assetsValue,
          borderColor:
            "rgb(" +
            (assetsValue[assetsValue?.length - 1] > assetsValue[0]
              ? green
              : red) +
            ")",
          backgroundColor:
            "rgba(" +
            (assetsValue[assetsValue?.length - 1] > assetsValue[0]
              ? green
              : red) +
            ", 0.5)",
          fill: true,
        },
      ],
    };
  }
  return (
    <div className="card text-light">
      <div className="card-header">Assets Graph</div>
      <div className="card-body">
        {!loading && (
          <>
            <Line options={options} data={data} />
            <div className="container grid">
              <div className="row">
                <div className="form-check col">
                  <input
                    className="form-check-input"
                    checked={range === "1d"}
                    onChange={() => setRange("1d")}
                    type="radio"
                  ></input>
                  <label className="form-check-label">1 day</label>
                </div>
                <div className="form-check col">
                  <input
                    className="form-check-input"
                    checked={range === "5d"}
                    onChange={() => setRange("5d")}
                    type="radio"
                  ></input>
                  <label className="form-check-label">5 days</label>
                </div>
                <div className="form-check col">
                  <input
                    className="form-check-input"
                    checked={range === "1mo"}
                    onChange={() => setRange("1mo")}
                    type="radio"
                  ></input>
                  <label className="form-check-label">1 month</label>
                </div>
                <div className="form-check col">
                  <input
                    className="form-check-input"
                    checked={range === "6mo"}
                    onChange={() => setRange("6mo")}
                    type="radio"
                  ></input>
                  <label className="form-check-label">6 months</label>
                </div>
                <div className="form-check col">
                  <input
                    className="form-check-input"
                    checked={range === "1y"}
                    onChange={() => setRange("1y")}
                    type="radio"
                  ></input>
                  <label className="form-check-label">1 year</label>
                </div>
                <div className="form-check col">
                  <input
                    className="form-check-input"
                    checked={range === "5y"}
                    onChange={() => setRange("5y")}
                    type="radio"
                  ></input>
                  <label className="form-check-label">5 year</label>
                </div>
                <div className="form-check col">
                  <input
                    className="form-check-input"
                    checked={range === "max"}
                    onChange={() => setRange("max")}
                    type="radio"
                  ></input>
                  <label className="form-check-label">Max</label>
                </div>
              </div>
            </div>
          </>
        )}
        {loading && (
          <div
            className="position-relative start-50 spinner-border"
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default AssetsGraph;
