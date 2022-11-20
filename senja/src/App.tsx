import React, { useState } from "react";
import Table from "./table";
import "./App.css";
import StockView from "./stockView";

function App() {
  interface port {
    [symbol: string]: number;
  }

  let [symbol, setSymbol] = useState("");
  let [cash, setCash] = useState(1000);
  let [portfolio, setPortofolio] = useState<port>({});

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

  function updateCash(number: number): boolean {
    if (cash + number >= 0) {
      setCash(cash + number);
      return true;
    } else {
      return false;
    }
  }

  // function buy(symbol: string, amount: number): boolean {
  //   if (amount * stockData[1] > cash) {
  //     return false;
  //   } else {
  //     setCash(cash - amount * stockData[1]);
  //     updatePorfolio(symbol, amount);
  //   }
  //   return true;
  // }

  return (
    <div className="App">
      <div className="container">
        <h1>Stonks</h1>
        <h3>${cash.toFixed(2)}</h3>
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
          ></input>
        </form>
      </div>
      <StockView
        symbol={symbol}
        updateCash={(number: number) => updateCash(number)}
        updatePorfolio={(symbol: string, amount: number) =>
          updatePorfolio(symbol, amount)
        }
      />
      <div className="container">{<Table data={portfolio} />}</div>
    </div>
  );
}

export default App;
