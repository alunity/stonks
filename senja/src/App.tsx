import React, { useState } from "react";
import "./App.css";

function App() {
  let [value, setValue] = useState("");
  let [data, setData] = useState<any>([]);

  function getPrice(name: string) {
    fetch(
      `https://api.allorigins.win/get?url=${encodeURIComponent(
        "https://query1.finance.yahoo.com/v8/finance/chart/" +
          name.toUpperCase()
      )}`,
      { cache: "no-store" }
    )
      .then((response) => response.json())
      .then(
        (data) => JSON.parse(data.contents).chart.result[0].meta
        // console.log(JSON.parse(data.contents).chart.result[0].meta.symbol)
      )
      .then((data) => setData([data.symbol, data.regularMarketPrice]))
      .catch((error) => console.log("Symbol couldn't be found"));
  }

  return (
    <div className="App">
      <h1>Stonks</h1>
      <div className="container">
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
          ></input>
          <button onClick={() => getPrice(value)}>Search</button>
        </form>
      </div>
      <div className="container card">
        <h2>{data[0]}</h2>
        <p>{data[1]}</p>
      </div>
    </div>
  );
}

export default App;
