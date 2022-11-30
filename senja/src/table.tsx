import React, { useState, useEffect } from "react";
import { port } from "./interfaces";
import { getPrice } from "./stock";
import DB from "./symbolDB";

interface tableProps {
  updateSymbol: Function;
  data: port;
}

interface row {
  [0]: string;
  [1]: number;
  [2]: number;
  [3]: number;
}

function Table(props: tableProps) {
  let [stockData, setData] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      let data = [];
      for (let i in props.data) {
        data.push([
          i,
          props.data[i],
          await getPrice(i),
          (await getPrice(i)) * props.data[i],
        ]);
      }
      setData(data);
    };

    fetchData();
  }, [props.data]);

  let total: Array<number> = [0, 0, 0];
  let rows = stockData.map((x: row) => {
    total[0] = total[0] + x[1];
    total[1] = total[1] + x[2];
    total[2] = total[2] + x[3];

    let change = DB.getPriceChange(x[0]);
    return (
      <tr key={x[0]} onClick={() => props.updateSymbol(x[0].toUpperCase())}>
        <td
          className={
            change > 0
              ? "text-success fw-bold"
              : change < 0
              ? "text-danger fw-bold"
              : "fw-bold"
          }
        >
          {change === 0 ? "-" : (change > 0 ? "↑" : "↓") + change.toFixed(2)}
        </td>
        <td>{x[0].toUpperCase()}</td>
        <td>{x[1].toFixed(2)}</td>
        <td>{x[2].toFixed(2)}</td>
        <td>{x[3].toFixed(2)}</td>
      </tr>
    );
  });

  return (
    <>
      <table className="table table-hover">
        <thead className="thead-light">
          <tr>
            <th>change</th>
            <th>symbol</th>
            <th>amount</th>
            <th>price</th>
            <th>value</th>
          </tr>
        </thead>
        <tbody>
          {rows}
          <tr className="table-secondary">
            <td></td>
            <td>Total</td>
            <td>{total[0]}</td>
            <td>{total[1].toFixed(2)}</td>
            <td>{total[2].toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

export default Table;
