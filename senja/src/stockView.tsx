import React, { useState, useEffect } from "react";
import getPrice from "./stock";

interface port {
  [symbol: string]: number;
}

interface viewerProps {
  symbol: string;
  cash: number;
  portfolio: port;
  updatePorfolio: Function;
  updateCash: Function;
}

function StockView(props: viewerProps) {
  let [amount, setAmount] = useState(0);
  let [stockData, setStockData] = useState<any>([]);
  let [buying, setBuy] = useState(true);

  async function getData() {
    let price = await getPrice(props.symbol);
    setStockData([props.symbol, price]);
  }

  function transaction(amount: number) {
    if (buying) {
      if (stockData[1] * amount <= props.cash) {
        props.updateCash(-(stockData[1] * amount));
        props.updatePorfolio(props.symbol, amount);
      }
    } else {
      if (props.portfolio[stockData[0]] >= amount) {
        props.updateCash(stockData[1] * amount);
        props.updatePorfolio(props.symbol, -amount);
      }
    }
  }

  useEffect(() => {
    if (props.symbol !== "") {
      getData();
    }
  }, [props.symbol]);

  return (
    <>
      {stockData.length !== 0 && (
        <div className="container card">
          <h2>{stockData[0]}</h2>
          <p>{stockData[1]}</p>
          <button className="btn btn-primary" onClick={() => setBuy(!buying)}>
            {buying ? "buy" : "sell"}
          </button>
          <span>
            <p>How many do you want {buying ? "buy" : "sell"}?</p>
            <input
              type={"number"}
              value={amount}
              onChange={(e) => setAmount(+e.target.value)}
            ></input>
            <button onClick={() => transaction(amount)}>
              {buying ? "buy" : "sell"}
            </button>
            {amount !== undefined && <p>Cost: {amount * stockData[1]} </p>}
          </span>
        </div>
      )}
    </>
  );
}

export default StockView;
