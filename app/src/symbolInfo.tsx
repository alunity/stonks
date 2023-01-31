import { useEffect, useRef, useState } from "react";
import { getSymbolData, iSymbolData } from "./yfinance";

interface iProps {
  symbol: string;
}

interface iController {
  [0]: string;
  [1]: AbortController;
}

function SymbolInfo(props: iProps) {
  let [data, setData] = useState<null | iSymbolData>(null);
  let abortController = useRef<iController>();
  useEffect(() => {
    async function getData() {
      let abort = new AbortController();
      abortController.current = [props.symbol, abort];
      setData(await getSymbolData(props.symbol, abort.signal));
    }

    if (props.symbol !== "") {
      if (abortController.current !== undefined) {
        if (abortController.current[0] !== props.symbol) {
          abortController.current[1].abort();
        }
      }

      setData(null);
      getData();
    }
  }, [props.symbol]);

  return (
    <>
      <div className="card text-light">
        <div className="card-header">Stock Symbol</div>
        {data !== null && (
          <>
            {data.chart.error?.code != "Abort" && (
              <div className="card-body">
                {data.chart.error === null && (
                  <>
                    <h5 className="card-title">
                      {data.chart.result[0].meta.symbol}
                    </h5>
                    <table className="table">
                      <tbody>
                        <tr>
                          <td>
                            Regular Market Price (
                            {data.chart.result[0].meta.currency})
                          </td>
                          <td>
                            {data.chart.result[0].meta.regularMarketPrice}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            Previous close ({data.chart.result[0].meta.currency}
                            )
                          </td>
                          <td>{data.chart.result[0].meta.previousClose}</td>
                        </tr>
                      </tbody>
                    </table>
                  </>
                )}
                {data.chart.error?.code === "Not Found" &&
                  props.symbol !== "" && (
                    <h5 className="card-title">This symbol can't be found</h5>
                  )}
              </div>
            )}
          </>
        )}
        {(data === null || data.chart.error !== null) &&
          props.symbol !== "" && (
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
