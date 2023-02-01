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
  let [loading, setLoading] = useState(false);
  let abortController = useRef<iController>();

  async function getData() {
    setLoading(true);
    let abort = new AbortController();
    abortController.current = [props.symbol, abort];
    setData(await getSymbolData(props.symbol, abort.signal));
  }

  useEffect(() => {
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

  useEffect(() => {
    if (data !== null) {
      if (data.chart.error === null || data.chart.error.code === "Not Found") {
        setLoading(false);
      }
    }

    // if (data?.chart.error?.code === "Failed" && props.symbol !== "") {
    //   if (abortController.current !== undefined) {
    //     if (abortController.current[0] === props.symbol) {
    //       let timeout = setTimeout(() => {
    //         getData();
    //       }, 10000);
    //       return () => {
    //         clearTimeout(timeout);
    //       };
    //     }
    //   }
    // }
  }, [data]);

  return (
    <>
      <div className="card text-light">
        <div className="card-header">Stock Symbol</div>
        {data !== null && (
          <>
            {!loading && (
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
                            {data.chart.result[0].meta.regularMarketPrice.toFixed(
                              2
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            Previous close ({data.chart.result[0].meta.currency}
                            )
                          </td>
                          <td>
                            {data.chart.result[0].meta.previousClose.toFixed(2)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </>
                )}
                {data.chart.error?.code === "Not Found" &&
                  props.symbol !== "" && (
                    <h5 className="card-title">This symbol can't be found</h5>
                  )}
                {data.chart.error?.code === "Failed" && props.symbol !== "" && (
                  <h5 className="card-title">
                    This information can't be fetched at the moment
                  </h5>
                )}
              </div>
            )}
          </>
        )}
        {loading && (
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
