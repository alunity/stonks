interface port {
  [symbol: string]: number;
}

interface isymbols {
  [symbol: string]: isymbol;
}

interface isymbol {
  price: number;
  history: Array<number>;
}

export type { port, isymbols };
