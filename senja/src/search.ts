import symbols from "./symbols";

function search(term: string) {
  let selected = [];

  for (let i = 0; i < symbols.length; i++) {
    if (
      symbols[i][0].toLowerCase().includes(term.toLowerCase()) ||
      symbols[i][1].toLowerCase().includes(term.toLowerCase())
    ) {
      selected.push(symbols[i]);
    }
  }
  return selected;
}

function isSymbol(term: string) {
  for (let i = 0; i < symbols.length; i++) {
    if (symbols[i][0].toLocaleLowerCase() === term) {
      return true;
    }
  }
  return false;
}

export { search, isSymbol };
