// function getPrice(name: string, setValue: Function) {
//   fetch(
//     `https://api.allorigins.win/get?url=${encodeURIComponent(
//       "https://query1.finance.yahoo.com/v8/finance/chart/" + name.toUpperCase()
//     )}`,
//     { cache: "no-store" }
//     // Why storing??
//   )
//     .then((response) => response.json())
//     .then(
//       (data) => JSON.parse(data.contents).chart.result[0].meta
//       // console.log(JSON.parse(data.contents).chart.result[0].meta.symbol)
//     )
//     .then((data) => setValue([data.symbol, data.regularMarketPrice]))
//     .catch((error) => console.log(error));
//   // .catch((error) => console.log("Symbol couldn't be found"));
// }

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
