interface iSymbolData {
  chart: {
    error: null | {
      code: string;
      description: string;
    };
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

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getSymbolData(
  symbol: string,
  signal: AbortSignal | undefined = undefined
): Promise<iSymbolData> {
  try {
    let response = fetch(
      `https://api.allorigins.win/get?url=${encodeURIComponent(
        "https://query1.finance.yahoo.com/v8/finance/chart/" +
          symbol.toUpperCase()
      )}`,
      { signal: signal }
    );
    let data: iSymbolData = JSON.parse(
      (await (await response).json()).contents
    );
    return data;
  } catch (e: any) {
    let message = "";
    if (e.message === "Failed to fetch") {
      console.log("retry");
      await timeout(5000);
      console.log("retrying");
      return getSymbolData(symbol, signal);
      // message = "Failed";
    } else {
      if (e.message === "The user aborted a request.") {
        message = "Abort";
      }
      return {
        chart: {
          error: {
            code: message,
            description: "Epic description",
          },
          result: [
            {
              indicators: {
                quote: [
                  {
                    high: [],
                    close: [],
                    low: [],
                    open: [],
                    volume: [],
                  },
                ],
              },
              meta: {
                chartPreviousClose: 0,
                currency: "",
                currentTradingPeriod: {
                  post: {
                    timezone: "",
                    end: 0,
                    start: 0,
                    gmtoffset: 0,
                  },
                  pre: {
                    timezone: "",
                    end: 0,
                    start: 0,
                    gmtoffset: 0,
                  },
                  regular: {
                    timezone: "",
                    end: 0,
                    start: 0,
                    gmtoffset: 0,
                  },
                },
                dataGranularity: "",
                exchangeName: "",
                exchangeTimezoneName: "",
                firstTradeDate: 0,
                gmtoffset: 0,
                instrumentType: "",
                previousClose: 0,
                priceHint: 0,
                range: "",
                regularMarketPrice: 0,
                regularMarketTime: 0,
                scale: 0,
                symbol: "",
                timezone: "",

                tradingPeriods: [
                  [
                    {
                      end: 0,
                      gmtoffset: 0,
                      start: 0,
                      timezone: "",
                    },
                  ],
                ],
                validRanges: [],
              },
              timestamp: [],
            },
          ],
        },
      };
    }
  }
}

export { getSymbolData, type iSymbolData };
