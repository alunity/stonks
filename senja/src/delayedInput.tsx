import { useEffect, useState } from "react";
import { isSymbol } from "./search";

interface input {
  callback: Function;
}

function DelayedInput(props: input) {
  let [text, setText] = useState("");

  useEffect(() => {
    if (isSymbol(text)) {
      props.callback(text);
    }
  }, [text, props]);

  // function getSymboL()

  // let options;
  // let suggestions = search(text);
  // if (suggestions.length < 50) {
  //   options = suggestions.map((x) => {
  //     return (
  //       <option key={x[0]} value={x[0]}>
  //         {x[1]}
  //       </option>
  //     );
  //   });
  // }
  return (
    <div>
      <input
        value={text}
        // list="suggestions"
        onChange={(e) => setText(e.target.value)}
      ></input>
      {/* <datalist id="suggestions">{options}</datalist> */}
    </div>
  );
}

export default DelayedInput;
