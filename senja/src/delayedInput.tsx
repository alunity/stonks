import { useEffect, useState } from "react";
import { isSymbol, search } from "./search";

interface input {
  callback: Function;
}

function DelayedInput(props: input) {
  let [text, setText] = useState("");

  useEffect(() => {
    if (isSymbol(text)) {
      props.callback(text);
    }
  });

  let options;
  let suggestions = search(text);
  if (suggestions.length < 20) {
    options = suggestions.map((x) => {
      return (
        <option key={x[0]} value={x[0]}>
          {x[1]}
        </option>
      );
    });
  }
  // useEffect(() => {
  //   let timeout = setTimeout(() => {
  //     props.callback(text);
  //   }, 500);
  //   return () => clearTimeout(timeout);
  // });

  return (
    <div>
      <input
        value={text}
        list="x"
        onChange={(e) => setText(e.target.value)}
      ></input>
      <datalist id="x">{options}</datalist>
    </div>
  );
}

export default DelayedInput;
