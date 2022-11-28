import { useEffect, useState } from "react";

interface input {
  callback: Function;
}

function DelayedInput(props: input) {
  let [text, setText] = useState("");

  useEffect(() => {
    props.callback(text);
  }, [text, props]);

  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)}></input>
    </div>
  );
}

export default DelayedInput;
