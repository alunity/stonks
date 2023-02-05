import { useEffect, useState } from "react";
import iPortfolio from "./iPortfolio";
import { getSymbolData } from "./yfinance";

interface iNetworth {
  cash: number;
  portfolio: iPortfolio;
}

function Networth(props: iNetworth) {
  let [assetsValue, setAssetsValue] = useState(-1);
  let [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      let total = 0;
      setLoading(true);
      for (let i in props.portfolio) {
        let symbolData = await getSymbolData(i);
        if (symbolData.chart.error === null) {
          total +=
            symbolData.chart.result[0].meta.regularMarketPrice *
            props.portfolio[i];
        }
      }
      setAssetsValue(total);
    }
    getData();
  }, [props.portfolio]);

  useEffect(() => {
    if (assetsValue !== -1) {
      setLoading(false);
    }
  }, [assetsValue]);

  return (
    <div className="card text-light">
      <div className="card-header">Net Worth</div>
      <div className="card-body">
        {!loading && (
          <div className="position-relative text-center">
            <div className="row">
              <div className="col"></div>
              <div className="col-5">
                <span className="h1">
                  ${(assetsValue + props.cash).toFixed(2)}
                </span>
              </div>
              <div className="col"></div>
            </div>
            <div className="row">
              <div className="col"></div>
              <div className="col-5">
                <span className="h2 text-secondary">
                  {assetsValue.toFixed(2)}
                </span>
              </div>
              <div className="col align-bottom">
                <span className="h3 fst-italic text-secondary float-start">
                  ~ assets
                </span>
              </div>
            </div>
            <div className="row">
              <div className="col"></div>
              <div className="col-5">
                <span className="h2 text-secondary ">
                  {props.cash.toFixed(2)}
                </span>
              </div>
              <div className="col">
                <span className="h3 fst-italic text-secondary float-start">
                  ~ cash
                </span>
              </div>
            </div>

            <br></br>
          </div>
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

export default Networth;
