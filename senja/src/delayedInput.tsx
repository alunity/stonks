import { useEffect, useState } from "react";

interface input {
  callback: Function;
}

function DelayedInput(props: input) {
  let [text, setText] = useState("");

  useEffect(() => {
    let timeout = setTimeout(() => {
      props.callback(text);
    }, 500);
    return () => clearTimeout(timeout);
  });

  return <input value={text} onChange={(e) => setText(e.target.value)}></input>;
}

export default DelayedInput;
