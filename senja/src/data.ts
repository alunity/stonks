interface data {
  cash: number;
  portfolio: port;
}

interface port {
  [symbol: string]: number;
}

function saveData(cash: number, portfolio: port): void {
  let data = { cash: cash, portfolio: portfolio };
  let x = JSON.stringify(data);
  localStorage.data = x;
}

function loadData(): data {
  if (localStorage.data === undefined) {
    return { cash: 1000, portfolio: {} };
  } else {
    return JSON.parse(localStorage.data);
  }
}

export { saveData, loadData };
