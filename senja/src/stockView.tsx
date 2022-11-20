import React, { useState, useEffect } from "react";
import getPrice from "./stock";

interface viewerProps {
  symbol: string;
  updatePorfolio: Function;
  updateCash: Function;
}

function StockView(props: viewerProps) {
  let [amount, setAmount] = useState(0);
  let [stockData, setStockData] = useState<any>([]);

  async function getData() {
    let price = await getPrice(props.symbol);
    setStockData([props.symbol, price]);
  }

  function buy(amount: number) {
    let result = props.updateCash(amount * -stockData[1]);

    if (result) {
      props.updatePorfolio(props.symbol, amount);
    }
  }

  useEffect(() => {
    if (props.symbol != "") {
      getData();
    }
  }, [props.symbol]);

  return (
    <>
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
            <button onClick={() => buy(amount)}>Buy</button>
            {amount !== undefined && <p>Cost: {amount * stockData[1]} </p>}
          </span>
        </div>
      )}
    </>
  );
}

export default StockView;
