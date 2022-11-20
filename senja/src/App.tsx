import React, { useEffect, useState } from "react";
import Table from "./table";
import "./App.css";
import StockView from "./stockView";
import { loadData, saveData } from "./data";
import port from "./portInterface";
import DelayedInput from "./delayedInput";
import Networth from "./networth";

function App() {
  let [symbol, setSymbol] = useState("");
  let [cash, setCash] = useState(loadData().cash);
  let [portfolio, setPortofolio] = useState<port>(loadData().portfolio);

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

  return (
    <div className="App">
      <div className="container">
        <h1>Stonks</h1>
        {/* <h3>${cash.toFixed(2)}</h3> */}
        <Networth cash={cash} portfolio={portfolio} />
        <form onSubmit={(e) => e.preventDefault()}>
          {/* <input
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
          ></input> */}
          <DelayedInput callback={(text: string) => setSymbol(text)} />
        </form>
      </div>
      <StockView
        symbol={symbol}
        updateCash={(number: number) => setCash(cash + number)}
        updatePorfolio={(symbol: string, amount: number) =>
          updatePorfolio(symbol, amount)
        }
        cash={cash}
        portfolio={portfolio}
      />
      <div className="container">
        {
          <Table
            data={portfolio}
            updateSymbol={(symbol: string) => setSymbol(symbol)}
          />
        }
      </div>
    </div>
  );
}

export default App;
