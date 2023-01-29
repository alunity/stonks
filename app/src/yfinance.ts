async function getSymbolData(symbol: string): Promise<object> {
  let response = fetch(
    `https://api.allorigins.win/get?url=${encodeURIComponent(
      "https://query1.finance.yahoo.com/v8/finance/chart/" +
        symbol.toUpperCase()
    )}`
  );
  let data = JSON.parse((await (await response).json()).contents);
  return data;
}

export default getSymbolData;
