import { useEffect, useState } from "react";
import iPortfolio from "./iPortfolio";
import { getSymbolData } from "./yfinance";

interface iTable {
  portfolio: iPortfolio;
  setSymbol: Function;
}

interface row {
  symbol: string;
  amount: number;
  price: number;
}

interface iTotal {
  price: number;
  amount: number;
  totalPrice: number;
}

function Table(props: iTable) {
  let [data, setData] = useState<Array<row>>();

  useEffect(() => {
    async function getData() {
      let dat = [];
      for (let i in props.portfolio) {
        let symbolData = await getSymbolData(i);
        dat.push({
          symbol: symbolData.chart.result[0].meta.symbol,
          amount: props.portfolio[i],
          price: symbolData.chart.result[0].meta.regularMarketPrice,
        });
      }
      setData(dat);
    }

    getData();
  }, [props.portfolio]);

  let total: iTotal = { price: 0, amount: 0, totalPrice: 0 };
  let rows = data?.map((x: row) => {
    total.price += x.price;
    total.amount += x.amount;
    total.totalPrice += x.price * x.amount;
    return (
      <tr key={x.symbol} onClick={() => props.setSymbol(x.symbol)}>
        <td>{x.symbol}</td>
        <td>{x.amount}</td>
        <td>{x.price.toFixed(2)}</td>
        <td>{(x.price * x.amount).toFixed(2)}</td>
      </tr>
    );
  });
  if (rows !== undefined && rows.length !== 0) {
    rows.push(
      <tr key={"total"}>
        <td>
          <strong>Total</strong>
        </td>
        <td>
          <strong>{total.amount}</strong>
        </td>
        <td>
          <strong>{total.price}</strong>
        </td>
        <td>
          <strong>{total.totalPrice}</strong>
        </td>
      </tr>
    );
  }

  return (
    <>
      <div className="card text-light">
        <div className="card-header">Table</div>

        <div className="card-body">
          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col">symbol</th>
                <th scope="col">amount</th>
                <th scope="col">price</th>
                <th scope="col">total</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Table;
