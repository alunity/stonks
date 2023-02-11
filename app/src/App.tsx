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
import Startup from "./startup";
import Settings from "./settings";

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

  let [settingsOpen, setSettingsOpen] = useState(false);

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
      <div className="row fixedPosition nav pt-3 mb-3">
        <h1 className="text-center">Stonks</h1>
      </div>
      <a
        className="gg-menu-round top-left glow"
        onClick={() => setSettingsOpen(true)}
      ></a>
      <div className="container offset">
        <div className="grid">
          <div className="row">
            <div className="col-md-7">
              <Networth cash={cash} portfolio={portfolio} />
              <br></br>
              <Table
                portfolio={portfolio}
                setSymbol={(symbol: string) => setSelectedSymbol(symbol)}
              />

              <br></br>

              <AssetsGraph portfolio={portfolio} />
            </div>
            <div className="col-md-5">
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

              <br></br>

              <SymbolInfo
                symbol={selectedSymbol}
                data={data}
                loading={loading}
                range={range}
                setRange={(val: string) => setRange(val)}
              />
            </div>
          </div>
        </div>
      </div>
      <Startup portfolio={portfolio} />
      <Settings
        open={settingsOpen}
        setOpen={(value: boolean) => setSettingsOpen(value)}
      />
    </div>
  );
}

export default App;
