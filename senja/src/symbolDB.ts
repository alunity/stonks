import { isymbols } from "./interfaces";
import { loadDB, saveDB } from "./data";
import { requestPrice } from "./stock";

// async function updateDBCache(DB: symbolDB) {
//   let symbols = DB.getSymbols();

//   for (let i = 0; i < symbols.length; i++) {
//     DB.setPrice(symbols[i], await requestPrice(symbols[i]));
//   }
// }
interface isymbolsPrice {
  [symbol: string]: number;
}

class symbolDB {
  symbolsPrice: isymbolsPrice = {};
  symbols: isymbols = {};
  nullSymbols: Array<string> = [];

  constructor(symbols: isymbols, nullSymbols: Array<string>) {
    this.symbols = symbols;
    this.nullSymbols = nullSymbols;
  }

  save() {
    saveDB(this.symbols, this.nullSymbols);
  }

  addSymbol(symbol: string, price: number) {
    let data = { history: [] };
    this.symbolsPrice[symbol] = price;
    this.symbols[symbol] = data;
    this.save();
  }

  addNullSymbol(symbol: string) {
    this.nullSymbols.push(symbol);
    this.save();
  }

  checkNullSymbolExists(symbol: string): boolean {
    return this.nullSymbols.indexOf(symbol) > -1;
  }

  checkSymbolExists(symbol: string): boolean {
    return symbol in this.symbolsPrice;
  }

  getPrice(symbol: string): number {
    // return this.symbols[symbol].price;
    return this.symbolsPrice[symbol];
  }

  setPrice(symbol: string, price: number) {
    if (price !== -1) {
      if (this.symbols[symbol] !== undefined) {
        if (this.symbols[symbol].history.length > 0) {
          if (this.symbolsPrice[symbol] !== this.symbols[symbol].history[0]) {
            this.symbols[symbol].history.unshift(this.symbolsPrice[symbol]);
          }
        } else {
          this.symbols[symbol].history.unshift(this.symbolsPrice[symbol]);
        }
      }
      this.symbolsPrice[symbol] = price;
      this.save();
    }
  }

  getPriceChange(symbol: string): number {
    symbol = symbol.toUpperCase();

    if (this.symbols[symbol] === undefined) {
      return 0;
    }

    if (this.symbols[symbol].history.length === 0) {
      return 0;
    }

    let i = 0;
    while (
      i < this.symbols[symbol].history.length &&
      this.symbols[symbol].history[i] === this.symbolsPrice[symbol]
    ) {
      i++;
    }

    if (i === this.symbols[symbol].history.length) {
      return 0;
    } else {
      return this.symbolsPrice[symbol] - this.symbols[symbol].history[i];
    }
  }

  async updateCache(a: Function) {
    let symbols = Object.keys(this.symbolsPrice);
    for (let i = 0; i < symbols.length; i++) {
      this.setPrice(symbols[i], await requestPrice(symbols[i]));
    }
    this.save();
    a();
  }
}

let dbData = loadDB();
const DB = new symbolDB(dbData.symbols, dbData.nullSymbols);

export default DB;
