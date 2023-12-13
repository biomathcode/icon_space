import { useState, useCallback } from "react";

import CodeMirror from "@uiw/react-codemirror";

import { xml } from "@codemirror/lang-xml";

export const Editor = ({ svg }: any) => {
  const [value, setValue] = useState(svg);
  const onChange = useCallback((val: any) => {
    console.log("val:", val);
    setValue(val);
  }, []);

  return (
    <CodeMirror
      value={value}
      height="200px"
      extensions={[xml()]}
      onChange={onChange}
    />
  );
};
