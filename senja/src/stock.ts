import DB from "./symbolDB";

setInterval(() => {
  DB.updateCache();
}, 600000);

async function requestPrice(symbol: string): Promise<number> {
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
  let price = await requestPrice(symbol);

  if (price === -1) {
    DB.addNullSymbol(symbol);
    return -1;
  }
  DB.addSymbol(symbol, price);
  return price;
}

export { getPrice, requestPrice };
