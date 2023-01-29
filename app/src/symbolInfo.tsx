import { useEffect, useState } from "react";
import getSymbolData from "./yfinance";

interface iProps {
  symbol: string;
}

function SymbolInfo(props: iProps) {
  let [data, setData] = useState<null | object>(null);

  useEffect(() => {
    async function getData() {
      setData(await getSymbolData(props.symbol));
    }

    setData(null);
    getData();
  }, [props.symbol]);

  return (
    <>
      <div className="card text-light">
        <div className="card-header">Stock Symbol</div>
        {data !== null && (
          <div className="card-body">
            <h5 className="card-title">{data.chart.result[0].meta.symbol}</h5>
            <table className="table">
              <tbody>
                <tr>
                  <td>
                    Regular Market Price ({data.chart.result[0].meta.currency})
                  </td>
                  <td>{data.chart.result[0].meta.regularMarketPrice}</td>
                </tr>
                <tr>
                  <td>Previous close ({data.chart.result[0].meta.currency})</td>
                  <td>{data.chart.result[0].meta.previousClose}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        {data === null && (
          <div className="card" aria-hidden="true">
            <div className="card-body">
              <h5 className="card-title placeholder-glow">
                <span className="placeholder col-3"></span>
              </h5>
              <p className="card-text placeholder-glow">
                <span className="placeholder col-7"></span>
                <span className="placeholder col-4"></span>
                <span className="placeholder col-4"></span>
                <span className="placeholder col-6"></span>
                <span className="placeholder col-8"></span>
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default SymbolInfo;
