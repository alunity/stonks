import { isymbols } from "./interfaces";
import { loadDB, saveDB } from "./data";
import { requestPrice } from "./stock";

// async function updateDBCache(DB: symbolDB) {
//   let symbols = DB.getSymbols();

//   for (let i = 0; i < symbols.length; i++) {
//     DB.setPrice(symbols[i], await requestPrice(symbols[i]));
//   }
// }

class symbolDB {
  symbols: isymbols = {};
  nullSymbols: Array<string> = [];
  networthValue: Array<number> = [];

  constructor(
    symbols: isymbols,
    nullSymbols: Array<string>,
    portfolioPrice: Array<number>
  ) {
    this.symbols = symbols;
    this.nullSymbols = nullSymbols;
    this.networthValue = portfolioPrice;
  }

  save() {
    saveDB(this.symbols, this.nullSymbols, this.networthValue);
  }

  addSymbol(symbol: string, price: number) {
    let data = { price: price, history: [] };
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
    return symbol in this.symbols;
  }

  getPrice(symbol: string): number {
    return this.symbols[symbol].price;
  }

  setPrice(symbol: string, price: number) {
    if (price !== -1) {
      if (this.symbols[symbol] !== undefined) {
        if (this.symbols[symbol].history.length > 0) {
          if (this.symbols[symbol].price !== this.symbols[symbol].history[0]) {
            this.symbols[symbol].history.unshift(this.symbols[symbol].price);
          }
        } else {
          this.symbols[symbol].history.unshift(this.symbols[symbol].price);
        }
      }
      this.symbols[symbol].price = price;
      this.save();
    }
  }

  getPriceChange(symbol: string): number {
    symbol = symbol.toUpperCase();

    if (this.symbols[symbol].history.length === 0) {
      return 0;
    }

    let i = 0;
    while (
      i < this.symbols[symbol].history.length &&
      this.symbols[symbol].history[i] === this.symbols[symbol].price
    ) {
      i++;
    }

    if (i === this.symbols[symbol].history.length) {
      return 0;
    } else {
      return this.symbols[symbol].price - this.symbols[symbol].history[i];
    }
  }

  setNetworthValue(value: number) {
    if (this.networthValue.length === 0) {
      this.networthValue.unshift(value);
    } else {
      if (value !== this.networthValue[0]) {
        this.networthValue.unshift(value);
      }
    }
    this.save();
  }

  getNetworthPriceChange(): number {
    if (this.networthValue.length <= 1) {
      return 0;
    } else {
      return this.networthValue[0] - this.networthValue[1];
    }
  }

  async updateCache(a: Function) {
    let symbols = Object.keys(this.symbols);
    for (let i = 0; i < symbols.length; i++) {
      this.setPrice(symbols[i], await requestPrice(symbols[i]));
    }
    this.save();
    a();
  }
}

let dbData = loadDB();
const DB = new symbolDB(
  dbData.symbols,
  dbData.nullSymbols,
  dbData.networthValue
);

export default DB;
