interface cacheI {
  [symbol: string]: number;
}

let cache: cacheI = {};

async function requestPrice(symbol: string): Promise<number> {
  let response = fetch(
    `https://api.allorigins.win/get?url=${encodeURIComponent(
      "https://query1.finance.yahoo.com/v8/finance/chart/" +
        symbol.toUpperCase()
    )}`,
    { cache: "no-store" }
    // Why storing??
  );
  return JSON.parse((await (await response).json()).contents).chart.result[0]
    .meta.regularMarketPrice;
}

async function getPrice(symbol: string): Promise<number> {
  symbol = symbol.toLowerCase();
  if (cache[symbol] !== undefined) {
    return cache[symbol];
  } else {
    let price = await requestPrice(symbol);
    cache[symbol] = price;
    return price;
  }
}

export default getPrice;
