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

interface iSymbolSearch {
  exchDisp: string;
  exchange: string;
  index: string;
  industry: string;
  isYahooFinance: boolean;
  logoUrl: string;
  longname: string;
  quoteType: string;
  score: number;
  sector: string;
  shortname: string;
  symbol: string;
  typeDisp: string;
}

const intervals: { [property: string]: string } = {
  "1d": "2m",
  "5d": "15m",
  "1mo": "30m",
  "6mo": "1d",
  "1y": "1wk",
  "5y": "1wk",
  max: "1mo",
};

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getSymbolData(
  symbol: string,
  signal: AbortSignal | undefined = undefined,
  range: string = "1d"
): Promise<iSymbolData> {
  try {
    let response = fetch(
      `https://api.allorigins.win/get?url=${encodeURIComponent(
        "https://query1.finance.yahoo.com/v8/finance/chart/" +
          symbol.toUpperCase() +
          "?region=US&lang=en-US&includePrePost=false&interval=" +
          intervals[range] +
          "&useYfid=true&range=" +
          range +
          "&corsDomain=finance.yahoo.com&.tsrc=finance?nocache=" +
          Math.floor(Date.now() / 1000 / 1440)
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
      let BASE_OFFSET = 10000;
      let MIN_OFFSET = 0;
      let MAX_OFFSET = 2500;

      await timeout(
        BASE_OFFSET +
          Math.floor(Math.random() * (MAX_OFFSET - MIN_OFFSET + 1)) +
          MIN_OFFSET
      );
      return getSymbolData(symbol, signal);
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

async function symbolSearch(
  searchTerm: string,
  signal: AbortSignal | undefined = undefined
): Promise<Array<iSymbolSearch>> {
  try {
    let response = fetch(
      `https://api.allorigins.win/get?url=${encodeURIComponent(
        `https://query2.finance.yahoo.com/v1/finance/search?q=${searchTerm}&lang=en-GB&region=GB&quotesCount=6&newsCount=4&enableFuzzyQuery=false&quotesQueryId=tss_match_phrase_query&multiQuoteQueryId=multi_quote_single_token_query&newsQueryId=news_cie_vespa&enableCb=true&enableNavLinks=true&enableEnhancedTrivialQuery=true&enableCulturalAssets=true&enableLogoUrl=true`
      )}`,
      { signal: signal }
    );
    return JSON.parse((await (await response).json()).contents).quotes;
  } catch (e: any) {
    let message = "";
    if (e.message === "Failed to fetch") {
      let BASE_OFFSET = 10000;
      let MIN_OFFSET = 0;
      let MAX_OFFSET = 2500;

      await timeout(
        BASE_OFFSET +
          Math.floor(Math.random() * (MAX_OFFSET - MIN_OFFSET + 1)) +
          MIN_OFFSET
      );
      return symbolSearch(searchTerm);
    } else {
      return [];
    }
  }
}

export { getSymbolData, type iSymbolData, symbolSearch, type iSymbolSearch };
