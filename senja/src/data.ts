import { isymbols } from "./interfaces";

interface data {
  cash: number;
  portfolio: port;
}

interface dbData {
  symbols: isymbols;
  nullSymbols: Array<string>;
}

interface port {
  [symbol: string]: number;
}

function saveData(cash: number, portfolio: port): void {
  let data = { cash: cash, portfolio: portfolio };
  let x = JSON.stringify(data);
  localStorage.data = x;
}

function loadData(): data {
  if (localStorage.data === undefined) {
    return { cash: 1000, portfolio: {} };
  } else {
    return JSON.parse(localStorage.data);
  }
}

function saveDB(symbols: isymbols, nullSymbols: Array<string>) {
  let data = { symbols: symbols, nullSymbols: nullSymbols };
  let x = JSON.stringify(data);
  localStorage.db = x;
}

function loadDB(): dbData {
  if (localStorage.db === undefined) {
    return { symbols: {}, nullSymbols: [] };
  } else {
    return JSON.parse(localStorage.db);
  }
}

export { saveData, loadData, saveDB, loadDB };
