interface port {
  [symbol: string]: number;
}

interface isymbols {
  [symbol: string]: isymbol;
}

interface isymbol {
  price: number;
  // cachedPrice: number;
}

export type { port, isymbols };
