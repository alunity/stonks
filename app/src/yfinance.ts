interface iSymbolData {
  chart: {
    error: boolean;
    result: [
      {
        indicators: {
          quote: [
            {
              high: Array<number>;
              close: Array<number>;
              low: Array<number>;
              open: Array<number>;
              volume: Array<number>;
            }
          ];
        };
        meta: {
          chartPreviousClose: number;
          currency: string;
          currentTradingPeriod: {
            post: {
              timezone: string;
              end: number;
              start: number;
              gmtoffset: number;
            };
            pre: {
              timezone: string;
              end: number;
              start: number;
              gmtoffset: number;
            };
            regular: {
              timezone: string;
              end: number;
              start: number;
              gmtoffset: number;
            };
          };
          dataGranularity: string;
          exchangeName: string;
          exchangeTimezoneName: string;
          firstTradeDate: number;
          gmtoffset: number;
          instrumentType: string;
          previousClose: number;
          priceHint: number;
          range: string;
          regularMarketPrice: number;
          regularMarketTime: number;
          scale: number;
          symbol: string;
          timezone: string;

          tradingPeriods: [
            [
              {
                end: number;
                gmtoffset: number;
                start: number;
                timezone: string;
              }
            ]
          ];
          validRanges: Array<string>;
        };
        timestamp: Array<number>;
      }
    ];
  };
}

async function getSymbolData(symbol: string): Promise<iSymbolData> {
  let response = fetch(
    `https://api.allorigins.win/get?url=${encodeURIComponent(
      "https://query1.finance.yahoo.com/v8/finance/chart/" +
        symbol.toUpperCase()
    )}`
  );
  let data: iSymbolData = JSON.parse((await (await response).json()).contents);
  return data;
}

export { getSymbolData, type iSymbolData };
