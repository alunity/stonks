import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import SymbolInfo from "./symbolInfo";
import Shop from "./shop";
import { useState } from "react";

function App() {
  let [selectedSymbol, setSelectedSymbol] = useState("");

  return (
    <div data-bs-theme="dark" className="App">
      <div className="container">
        <SymbolInfo symbol={selectedSymbol} />
        <Shop
          setCurrentSymbol={(value: string) => setSelectedSymbol(value)}
          selectedSymbol={selectedSymbol}
        />
      </div>
    </div>
  );
}

export default App;
