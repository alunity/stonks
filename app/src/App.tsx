import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import SymbolInfo from "./symbolInfo";

function App() {
  return (
    <div data-bs-theme="dark" className="App">
      <div className="container">
        <SymbolInfo symbol="tsla" />
      </div>
    </div>
  );
}

export default App;
