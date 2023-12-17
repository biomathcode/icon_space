import Editor from "@monaco-editor/react";
import { useEffect, useState } from "react";

function CodeEditor({ svg }: { svg: string }) {
  const [code, setCode] = useState(svg);

  useEffect(() => {
    console.log("this is svg", svg);
    setCode(svg);
  }, [svg]);
  return (
    svg && (
      <Editor
        onMount={(editor) => {
          editor.getAction("editor.action.formateDocument")?.run();
        }}
        height="200px"
        defaultLanguage="xml"
        defaultValue={svg}
        value={code}
        theme="vs-dark"
        width={"500px"}
        line={1}
        onChange={(value) => {
          setCode(value as string);
        }}
        options={{
          minimap: {
            enabled: false,
          },
          formatOnPaste: true,
          formatOnType: true,
          wrappingStrategy: "simple",
          wordWrap: "on",
          suggestFontSize: 24,
        }}
      />
    )
  );
}

export default CodeEditor;
