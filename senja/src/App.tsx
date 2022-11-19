import React, { useState } from "react";
import Table from "./table";
import "./App.css";
import getPrice from "./stock";

function App() {
  interface port {
    [symbol: string]: number;
  }

  let [symbol, setSymbol] = useState("");
  let [stockData, setStockData] = useState<any>([]);

  let [cash, setCash] = useState(1000);
  let [portfolio, setPortofolio] = useState<port>({});

  let [amount, setAmount] = useState<number>(0);

  // function getPrice(name: string): void {
  //   fetch(
  //     `https://api.allorigins.win/get?url=${encodeURIComponent(
  //       "https://query1.finance.yahoo.com/v8/finance/chart/" +
  //         name.toUpperCase()
  //     )}`,
  //     { cache: "no-store" }
  //     // Why storing??
  //   )
  //     .then((response) => response.json())
  //     .then(
  //       (data) => JSON.parse(data.contents).chart.result[0].meta
  //       // console.log(JSON.parse(data.contents).chart.result[0].meta.symbol)
  //     )
  //     .then((data) => setStockData([data.symbol, data.regularMarketPrice]))
  //     .catch((error) => console.log("Symbol couldn't be found"));
  // }

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

  function buy(symbol: string, amount: number): boolean {
    if (amount * stockData[1] > cash) {
      return false;
    } else {
      setCash(cash - amount * stockData[1]);
      updatePorfolio(symbol, amount);
    }
    return true;
  }

  async function getData() {
    let price = await getPrice(symbol);
    setStockData([symbol, price]);
  }

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
          <button onClick={() => getData()}>Search</button>
        </form>
      </div>
      {stockData.length !== 0 && (
        <div className="container card">
          <h2>{stockData[0]}</h2>
          <p>{stockData[1]}</p>
          <span>
            <p>How many you want buy?</p>
            <input
              type={"number"}
              value={amount}
              onChange={(e) => setAmount(+e.target.value)}
            ></input>
            <button onClick={() => buy(symbol, amount)}>Buy</button>
            {amount !== undefined && <p>Cost: {amount * stockData[1]} </p>}
          </span>
        </div>
      )}
      <div className="container">{<Table data={portfolio} />}</div>
    </div>
  );
}

export default App;
