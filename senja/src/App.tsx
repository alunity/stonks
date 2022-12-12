import React, { useEffect, useReducer, useState } from "react";
import Table from "./table";
import "./App.css";
import StockView from "./stockView";
import { loadData, saveData } from "./data";
import Networth from "./networth";
import { port } from "./interfaces";
import DB from "./symbolDB";

function App() {
  let [symbol, setSymbol] = useState("");
  let [cash, setCash] = useState(loadData().cash);
  let [portfolio, setPortofolio] = useState<port>(loadData().portfolio);
  let [loading, setloading] = useState(false);
  // const [, forceUpdate] = useReducer((x) => x + 1, 0);

  function updatePorfolio(symbol: string, amount: number): void {
    let port = JSON.parse(JSON.stringify(portfolio));
    if (symbol in port) {
      port[symbol] += amount;
    } else {
      port[symbol] = amount;
    }
    if (port[symbol] === 0) {
      delete port[symbol];
    }
    setPortofolio(port);
  }

  useEffect(() => {
    saveData(cash, portfolio);
  }, [cash, portfolio]);

  useEffect(() => {
    setloading(true);
    DB.updateCache(() => setloading(false));

    setInterval(() => {
      setloading(true);
      DB.updateCache(() => setloading(false));
    }, 600000);
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="row">
          <h1 className="display-1">Stonks</h1>
          <Networth cash={cash} portfolio={portfolio} refresh={loading} />
        </div>
        <div className="row">
          <div className="col-8">
            <Table
              data={portfolio}
              updateSymbol={(symbol: string) => setSymbol(symbol)}
              refresh={loading}
            />
          </div>
          <div className="col-4">
            <form onSubmit={(e) => e.preventDefault()}>
              {/* <SymbolInput callback={(text: string) => setSymbol(text)} /> */}
              <input
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              ></input>
            </form>
            <StockView
              symbol={symbol}
              updateCash={(number: number) => setCash(cash + number)}
              updatePorfolio={(symbol: string, amount: number) =>
                updatePorfolio(symbol, amount)
              }
              cash={cash}
              portfolio={portfolio}
            />
            {loading && (
              <div className="card">
                <h5>Updating stock prices</h5>
                <div className="d-flex justify-content-center">
                  <div
                    className="spinner-border text-primary "
                    role="status"
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
