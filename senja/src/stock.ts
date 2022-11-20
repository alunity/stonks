async function getPrice(symbol: string): Promise<number> {
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

export default getPrice;
