import { useEffect, useRef, useState } from "react";
import { getSymbolData, iSymbolData } from "./yfinance";

interface iProps {
  symbol: string;
  data: iSymbolData | null;
  loading: boolean;
}

interface iController {
  [0]: string;
  [1]: AbortController;
}

function SymbolInfo(props: iProps) {
  return (
    <>
      <div className="card text-light">
        <div className="card-header">Stock Symbol</div>
        {props.data !== null && (
          <>
            {!props.loading && (
              <div className="card-body">
                {props.data.chart.error === null && (
                  <>
                    <h5 className="card-title">
                      {props.data.chart.result[0].meta.symbol}
                    </h5>
                    <table className="table">
                      <tbody>
                        <tr>
                          <td>
                            Regular Market Price (
                            {props.data.chart.result[0].meta.currency})
                          </td>
                          <td>
                            {props.data.chart.result[0].meta.regularMarketPrice.toFixed(
                              2
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            Previous close (
                            {props.data.chart.result[0].meta.currency})
                          </td>
                          <td>
                            {props.data.chart.result[0].meta.previousClose.toFixed(
                              2
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </>
                )}
                {props.data.chart.error?.code === "Not Found" &&
                  props.symbol !== "" && (
                    <h5 className="card-title">This symbol can't be found</h5>
                  )}
                {props.data.chart.error?.code === "Failed" &&
                  props.symbol !== "" && (
                    <h5 className="card-title">
                      This information can't be fetched at the moment
                    </h5>
                  )}
              </div>
            )}
          </>
        )}
        {props.loading && (
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
