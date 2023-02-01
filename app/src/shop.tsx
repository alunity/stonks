import { useState } from "react";
import { iSymbolData } from "./yfinance";

interface iShop {
  selectedSymbol: string;
  setCurrentSymbol: Function;
  data: iSymbolData | null;
  loading: boolean;
}

function Shop(props: iShop) {
  let [buying, setBuying] = useState(true);
  let [numberShares, setNumberShares] = useState("");

  // Check and remove negative
  if (+numberShares < 0) {
    setNumberShares(Math.abs(+numberShares).toString());
  }

  return (
    <>
      <div className="card text-light">
        <div className="card-header">Buy and Sell</div>
        <div className="card-body">
          <div className="container">
            <div className="row">
              <div className="col-8">
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control text-black"
                    placeholder="Stock Symbol"
                    aria-describedby="basic-addon1"
                    value={props.selectedSymbol}
                    onChange={(e) => props.setCurrentSymbol(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-2">
                <div className="input-group mb-3">
                  <input
                    type="number"
                    className="form-control text-black"
                    placeholder="no shares"
                    value={numberShares}
                    onChange={(e) => setNumberShares(e.target.value)}
                    min={0}
                    aria-describedby="basic-addon1"
                  />
                </div>
              </div>
              <div className="col-2">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={buying}
                    onChange={() => setBuying(true)}
                    id="defaultCheck1"
                  />
                  <label className="form-check-label">Buy</label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={!buying}
                    onChange={() => setBuying(false)}
                    id="defaultCheck1"
                  />
                  <label className="form-check-label">Sell</label>
                </div>
              </div>
            </div>
            <p className="card-text">
              {props.data !== null && !props.loading && (
                <p>{props.data.chart.result[0].meta.regularMarketPrice}</p>
              )}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Shop;
