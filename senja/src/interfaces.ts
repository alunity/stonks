interface port {
  [symbol: string]: number;
}

interface isymbols {
  [symbol: string]: isymbol;
}

interface isymbol {
  history: Array<number>;
}

export type { port, isymbols };
