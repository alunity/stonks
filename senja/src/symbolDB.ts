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

  constructor(symbols: isymbols, nullSymbols: Array<string>) {
    this.symbols = symbols;
    this.nullSymbols = nullSymbols;
  }

  save() {
    saveDB(this.symbols, this.nullSymbols);
  }

  addSymbol(symbol: string, price: number) {
    let data = { price: price };
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
    this.symbols[symbol].price = price;
    this.save();
  }

  async updateCache() {
    let symbols = Object.keys(this.symbols);
    for (let i = 0; i < symbols.length; i++) {
      this.setPrice(symbols[i], await requestPrice(symbols[i]));
    }
    this.save();
  }
}

let dbData = loadDB();
const DB = new symbolDB(dbData.symbols, dbData.nullSymbols);

export default DB;
