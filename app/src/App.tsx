import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import SymbolInfo from "./symbolInfo";
import Shop from "./shop";
import { useEffect, useRef, useState } from "react";
import { iSymbolData, getSymbolData } from "./yfinance";
import iPortfolio from "./iPortfolio";
import Table from "./table";
import Networth from "./networth";
import { loadData, saveData } from "./localstorage";
import AssetsGraph from "./assetsGraph";

interface iController {
  [0]: string;
  [1]: AbortController;
}

function App() {
  let [selectedSymbol, setSelectedSymbol] = useState("");

  let [cash, setCash] = useState(loadData().cash);
  let [portfolio, setPortfolio] = useState<iPortfolio>(loadData().portfolio);

  let [data, setData] = useState<null | iSymbolData>(null);
  let [loading, setLoading] = useState(false);
  let abortController = useRef<iController>();

  let [range, setRange] = useState("1d");

  useEffect(() => {
    saveData(cash, portfolio);
  }, [cash, portfolio]);

  function performTransaction(
    symbol: string,
    amount: number,
    buying: boolean
  ): void {
    if (selectedSymbol === "" || data === null || data.chart.error !== null)
      return;

    let port = JSON.parse(JSON.stringify(portfolio));
    if (buying) {
      setCash(cash - +data.chart.result[0].meta.regularMarketPrice * amount);
      if (symbol in port) {
        port[symbol] += amount;
      } else {
        port[symbol] = amount;
      }
    } else {
      setCash(cash + +data.chart.result[0].meta.regularMarketPrice * amount);
      port[symbol] -= amount;

      if (port[symbol] === 0) {
        delete port[symbol];
      }
    }
    setPortfolio(port);
  }

  async function getData() {
    setLoading(true);
    let abort = new AbortController();
    abortController.current = [selectedSymbol, abort];
    setData(await getSymbolData(selectedSymbol, abort.signal, range));
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
  }, [selectedSymbol, range]);

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
        <SymbolInfo
          symbol={selectedSymbol}
          data={data}
          loading={loading}
          range={range}
          setRange={(val: string) => setRange(val)}
        />
        <Shop
          setCurrentSymbol={(value: string) => setSelectedSymbol(value)}
          selectedSymbol={selectedSymbol}
          data={data}
          loading={loading}
          portfolio={portfolio}
          cash={cash}
          performTransaction={(
            symbol: string,
            amount: number,
            buying: boolean
          ) => performTransaction(symbol, amount, buying)}
        />
        <Table
          portfolio={portfolio}
          setSymbol={(symbol: string) => setSelectedSymbol(symbol)}
        />
        <Networth cash={cash} portfolio={portfolio} />
        <AssetsGraph portfolio={portfolio} />
      </div>
    </div>
  );
}

export default App;
