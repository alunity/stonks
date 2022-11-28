interface isymbols {
  [symbol: string]: number;
}

class symbolDB {
  symbols: isymbols = {};
  nullSymbols: Array<string> = [];

  addSymbol(symbol: string, price: number) {
    this.symbols[symbol] = price;
  }

  addNullSymbol(symbol: string) {
    this.nullSymbols.push(symbol);
  }

  checkNullSymbolExists(symbol: string): boolean {
    return this.nullSymbols.indexOf(symbol) > -1;
  }

  checkSymbolExists(symbol: string): boolean {
    return symbol in this.symbols;
  }

  getPrice(symbol: string): number {
    return this.symbols[symbol];
  }
}

const DB = new symbolDB();

async function requestData(symbol: string): Promise<number> {
  try {
    let response = fetch(
      `https://api.allorigins.win/get?url=${encodeURIComponent(
        "https://query1.finance.yahoo.com/v8/finance/chart/" +
          symbol.toUpperCase()
      )}`,
      { cache: "no-store" }
      // Why storing??
    );
    let data = JSON.parse((await (await response).json()).contents);
    return data.chart.result[0].meta.regularMarketPrice;
  } catch {
    return -1;
  }
}

async function getPrice(symbol: string): Promise<number> {
  symbol = symbol.toUpperCase();
  if (DB.checkNullSymbolExists(symbol)) {
    return -1;
  } else if (DB.checkSymbolExists(symbol)) {
    return DB.getPrice(symbol);
  }
  let price = await requestData(symbol);

  if (price === -1) {
    DB.addNullSymbol(symbol);
    return -1;
  }
  DB.addSymbol(symbol, price);
  return price;
}

export default getPrice;
