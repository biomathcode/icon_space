//Todo: use click away to set the selectedId

import { useEffect, useState } from "react";
import CodeEditor from "../editor/index";
import { getIconById, updateIconSvgById } from "../../db";
import { BaseDirectory, writeFile } from "@tauri-apps/api/fs";
import getSVGColors from "./utils";
import { optmiseSvg } from "../utils";
import { save } from "@tauri-apps/api/dialog";

function BottomBar({
  selectedId,
  setSelectedId,
}: {
  selectedId: any;
  setSelectedId: any;
}) {
  const [data, setData] = useState<any>({
    id: 1,
    name: "home",
    svg: "<svg></svg>",
  });

  const [colors, setColors] = useState([]);

  useEffect(() => {
    async function fetchData() {
      let newdata = (await getIconById(Number(selectedId))) as any;

      console.log("svgdata, selectedId", newdata[0], selectedId);

      if (newdata) {
        setData(newdata);
      }
    }

    fetchData();
  }, [selectedId]);

  useEffect(() => {
    async function fetchColors() {
      if (data) {
        const colors = (await getSVGColors(data[0]?.svg || "")) as any;
        console.log("colors", colors?.fills);
        setColors(colors?.fills);
      }
    }

    fetchColors();
  }, [selectedId, data]);
  const handleExportSvg = async (svgContent: string, name: string) => {
    try {
      await writeFile(name + ".svg", svgContent, {
        dir: BaseDirectory.Desktop,
      });

      console.log(BaseDirectory);
    } catch (error) {
      console.error("Failed to export SVG:", error);
      // Handle the error as needed
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        left: "190px",
        bottom: "0px",
        height: "200px",
        width: "100%",
        background: "#222",
        transition: "all ease 216ms",
        display: selectedId !== "" ? "block" : "none",
      }}
    >
      <div
        style={{
          position: "relative",
          top: "10px",
          right: "-78%",
          width: "25px",
          height: "25px",
          background: "#222",
          color: "#fff",
          cursor: "pointer",
          border: "1px solid #eee",
          borderRadius: "99px",
        }}
        onClick={() => setSelectedId("")}
      >
        X
      </div>

      <div className="flex">
        <button
          onClick={() =>
            handleExportSvg(data && data[0]?.svg, data && data[0]?.name)
          }
        >
          Download Svg
        </button>

        <button
          onClick={async () => {
            const el = optmiseSvg(data && data[0]?.svg);

            await updateIconSvgById(data[0].id, el);

            console.log(el);
          }}
        >
          optimise
        </button>

        <button
          onClick={async () => {
            const filepath = await save({
              defaultPath: data[0].name,
              filters: [
                {
                  name: data[0]?.name,
                  extensions: ["svg"],
                },
              ],
            });

            console.log(filepath);
            if (filepath) {
              await writeFile(filepath, data[0]?.svg);
            }
          }}
        >
          Save
        </button>
      </div>
      <div className="flex gap-5">
        {colors &&
          colors?.map((e: string) => (
            <div
              key={e}
              style={{
                background: e,
                width: "40px",
                height: "40px",
                border: "1px solid #eee",
              }}
            ></div>
          ))}
      </div>

      <CodeEditor svg={data && data[0]?.svg} />
    </div>
  );
}

export default BottomBar;
