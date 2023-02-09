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
import PriceChart from "./priceChart";

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
              if (
                time[j] <= symbolData.chart.result[0].timestamp[k] &&
                symbolData.chart.result[0].timestamp[k] !== null
              ) {
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
          check.splice(i, 1);
          av.splice(i, 1);
          timestamps.splice(i, 1);
        }
      }
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

  return (
    <div className="card text-light">
      <div className="card-header">Assets Graph</div>
      <div className="card-body">
        {!loading && (
          <>
            <PriceChart
              prices={assetsValue}
              timestamps={timestamps}
              range={range}
              setRange={(value: string) => setRange(value)}
              label={"Assets"}
              increasing={assetsValue[assetsValue.length - 1] > assetsValue[0]}
            />
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
