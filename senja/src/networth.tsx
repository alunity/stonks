import { useEffect, useState } from "react";
import { port } from "./interfaces";
import { getPrice } from "./stock";
import DB from "./symbolDB";

interface worthProps {
  cash: number;
  portfolio: port;
  refresh: boolean;
}

function Networth(props: worthProps) {
  let [assets, setAssets] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      let total = 0;
      for (let i in props.portfolio) {
        total = total + (await getPrice(i)) * props.portfolio[i];
      }
      setAssets(total);
      DB.setPortfolioValue(total);
    };
    fetchData();
  }, [props.cash, props.portfolio, props.refresh]);

  return (
    <div className="card">
      <div className="container">
        <h4>Networth: ${(assets + props.cash).toFixed(2)}</h4>
        <h4>Assets: ${assets.toFixed(2)}</h4>
        <h4>Cash: ${props.cash.toFixed(2)}</h4>
      </div>
    </div>
  );
}

export default Networth;
