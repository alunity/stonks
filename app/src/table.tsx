import { useEffect, useState } from "react";
import iPortfolio from "./iPortfolio";
import { getSymbolData } from "./yfinance";
import { Tooltip } from "bootstrap";

interface iTable {
  portfolio: iPortfolio;
  setSymbol: Function;
}

interface row {
  symbol: string;
  amount: number;
  price: number;
  prevClosePrice: number;
}

interface iTotal {
  price: number;
  amount: number;
  totalPrice: number;
  totalPrevPrice: number;
}

function Table(props: iTable) {
  let [data, setData] = useState<Array<row>>();
  let [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      let dat = [];
      setLoading(true);
      for (let i in props.portfolio) {
        let symbolData = await getSymbolData(i);
        if (symbolData.chart.error === null) {
          dat.push({
            symbol: symbolData.chart.result[0].meta.symbol,
            amount: props.portfolio[i],
            price: symbolData.chart.result[0].meta.regularMarketPrice,
            prevClosePrice: symbolData.chart.result[0].meta.chartPreviousClose,
          });
        }
      }
      setData(dat);
    }

    getData();
  }, [props.portfolio]);

  useEffect(() => {
    if (data !== undefined) {
      setLoading(false);
    }
  }, [data]);

  useEffect(() => {
    // Initialize tooltips
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]'
    );
    const tooltipList = [...tooltipTriggerList].map(
      (tooltipTriggerEl) => new Tooltip(tooltipTriggerEl)
    );
  });

  let total: iTotal = { price: 0, amount: 0, totalPrice: 0, totalPrevPrice: 0 };
  let rows = data?.map((x: row) => {
    total.price += x.price;
    total.amount += x.amount;
    total.totalPrice += x.price * x.amount;
    total.totalPrevPrice += x.prevClosePrice * x.amount;
    return (
      <tr key={x.symbol} onClick={() => props.setSymbol(x.symbol)}>
        <td>
          <span
            className={
              "fw-bold " +
              (x.price > x.prevClosePrice
                ? "text-success-emphasis"
                : x.price === x.prevClosePrice
                ? ""
                : "text-danger-emphasis")
            }
          >
            {x.price > x.prevClosePrice
              ? "↑ "
              : x.price === x.prevClosePrice
              ? ""
              : "↓ "}
          </span>
          {x.symbol}
        </td>
        <td
          className={
            "fw-bold " +
            (x.price > x.prevClosePrice
              ? "text-success-emphasis"
              : x.price === x.prevClosePrice
              ? ""
              : "text-danger-emphasis")
          }
        >
          {(x.price > x.prevClosePrice ? "+" : "") +
            (((x.price - x.prevClosePrice) / x.prevClosePrice) * 100).toFixed(
              2
            ) +
            "%"}
        </td>
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
          <strong>
            <span
              className={
                "fw-bold " +
                (total.totalPrice > total.totalPrevPrice
                  ? "text-success-emphasis"
                  : total.totalPrice === total.totalPrevPrice
                  ? ""
                  : "text-danger-emphasis")
              }
            >
              {total.totalPrice > total.totalPrevPrice
                ? "↑ "
                : total.totalPrice === total.totalPrevPrice
                ? ""
                : "↓ "}
            </span>
            Total
          </strong>
        </td>
        <td
          className={
            "fw-bold " +
            (total.totalPrice > total.totalPrevPrice
              ? "text-success-emphasis"
              : total.totalPrice === total.totalPrevPrice
              ? ""
              : "text-danger-emphasis")
          }
        >
          {(total.totalPrice > total.totalPrevPrice ? "+" : "") +
            (
              ((total.totalPrice - total.totalPrevPrice) /
                total.totalPrevPrice) *
              100
            ).toFixed(2) +
            "%"}
        </td>

        <td>
          <strong>{total.amount}</strong>
        </td>
        <td>
          <strong>{total.price.toFixed(2)}</strong>
        </td>
        <td>
          <strong>{total.totalPrice.toFixed(2)}</strong>
        </td>
      </tr>
    );
  }

  return (
    <>
      <div className="card text-light">
        <div className="card-header">Table</div>
        <div className="card-body">
          {!loading && (
            <table className="table table-hover">
              <thead>
                <tr>
                  <th scope="col">symbol</th>
                  <th scope="col">
                    <span
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      data-bs-title="Change from previous market close"
                    >
                      change
                    </span>
                  </th>
                  <th scope="col">amount</th>
                  <th scope="col">price</th>
                  <th scope="col">total</th>
                </tr>
              </thead>
              <tbody>{rows}</tbody>
            </table>
          )}
          {loading && (
            <div
              className="position-relative start-50 spinner-border"
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Table;
