import iPortfolio from "./iPortfolio";

function saveData(cash: number, portfolio: iPortfolio): void {
  let data = { cash: cash, portfolio: portfolio };
  localStorage.data = JSON.stringify(data);
}

function loadData() {
  if (localStorage.data === undefined) {
    return { cash: 1000, portfolio: {} };
  } else {
    try {
      return JSON.parse(localStorage.data);
    } catch (error) {
      alert("Invalid data");
      localStorage.clear();
      location.reload();
    }
  }
}

export { saveData, loadData };
