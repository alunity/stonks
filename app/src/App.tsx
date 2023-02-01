import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import SymbolInfo from "./symbolInfo";
import Shop from "./shop";
import { useEffect, useRef, useState } from "react";
import { iSymbolData, getSymbolData } from "./yfinance";

interface iController {
  [0]: string;
  [1]: AbortController;
}

function App() {
  let [selectedSymbol, setSelectedSymbol] = useState("");

  let [data, setData] = useState<null | iSymbolData>(null);
  let [loading, setLoading] = useState(false);
  let abortController = useRef<iController>();

  async function getData() {
    setLoading(true);
    let abort = new AbortController();
    abortController.current = [selectedSymbol, abort];
    setData(await getSymbolData(selectedSymbol, abort.signal));
  }

  useEffect(() => {
    if (selectedSymbol !== "") {
      if (abortController.current !== undefined) {
        if (abortController.current[0] !== selectedSymbol) {
          abortController.current[1].abort();
        }
      }

      setData(null);
      getData();
    }
  }, [selectedSymbol]);

  useEffect(() => {
    if (data !== null) {
      if (data.chart.error === null || data.chart.error.code === "Not Found") {
        setLoading(false);
      }
    }
  }, [data]);

  return (
    <div data-bs-theme="dark" className="App">
      <div className="container">
        <SymbolInfo symbol={selectedSymbol} data={data} loading={loading} />
        <Shop
          setCurrentSymbol={(value: string) => setSelectedSymbol(value)}
          selectedSymbol={selectedSymbol}
          data={data}
          loading={loading}
        />
      </div>
    </div>
  );
}

export default App;
