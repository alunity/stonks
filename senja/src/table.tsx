import React, { useState, useEffect } from "react";
import getPrice from "./stock";

interface tableProps {
  updateSymbol: Function;
  data: port;
}

interface port {
  [symbol: string]: number;
}

interface row {
  [0]: string;
  [1]: number;
  [2]: number;
}

function Table(props: tableProps) {
  let [stockData, setData] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      let data = [];
      for (let i in props.data) {
        data.push([i, props.data[i], (await getPrice(i)) * props.data[i]]);
      }
      setData(data);
    };

    fetchData();
  }, [props.data]);

  let total: Array<number> = [0, 0];
  let rows = stockData.map((x: row) => {
    total[0] = total[0] + x[1];
    total[1] = total[1] + x[2];
    return (
      <tr key={x[0]} onClick={() => props.updateSymbol(x[0])}>
        <td>{x[0]}</td>
        <td>{x[1]}</td>
        <td>{x[2]}</td>
      </tr>
    );
  });

  return (
    <>
      <table className="table table-hover">
        <thead className="thead-light">
          <tr>
            <th>symbol</th>
            <th>amount</th>
            <th>value</th>
          </tr>
        </thead>
        <tbody>
          {rows}
          <tr className="table-secondary">
            <td>total</td>
            <td>{total[0]}</td>
            <td>{total[1]}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

export default Table;
