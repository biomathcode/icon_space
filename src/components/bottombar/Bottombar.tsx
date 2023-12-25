//Todo: use click away to set the selectedId

import { useEffect, useState } from "react";
import CodeEditor from "../editor/index";
import { deleteIconById, getIconById, updateIconSvgById } from "../../db";
import { BaseDirectory, writeFile } from "@tauri-apps/api/fs";
import getSVGColors from "./utils";
import { save } from "@tauri-apps/api/dialog";
import useSidebarStore from "../../store/useSidebarStore";
import { copyToClipboard, optmiseSvg } from "../../utils";
import useAppStore from "../../store";

function BottomBar() {
  const [data, setData] = useState<any>({
    id: 1,
    name: "home",
    svg: "<svg></svg>",
  });

  const [colors, setColors] = useState([]);

  const { iconSelected, setIconSelected, removeIcon } = useAppStore();

  useEffect(() => {
    async function fetchData() {
      let newdata = (await getIconById(Number(iconSelected))) as any;

      console.log("svgdata, selectedId", newdata[0], iconSelected);

      if (newdata) {
        setData(newdata);
      }
    }

    fetchData();
  }, [iconSelected]);

  useEffect(() => {
    async function fetchColors() {
      if (data) {
        const colors = (await getSVGColors(data[0]?.svg || "")) as any;
        console.log("colors", colors?.fills);
        setColors(colors?.fills);
      }
    }

    fetchColors();
  }, [iconSelected, data]);
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

  const { isOpen } = useSidebarStore();

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: "999999999",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: isOpen ? "0px" : "0px",
          bottom: iconSelected !== 0 ? "300px" : "00px",
          height: "240px",
          pointerEvents: "all",

          width: "100%",
          background: "#222",
          transition: "all ease 216ms",
          // display: iconSelected !== 0 ? "block" : "none",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "0px",
            right: "20px",
            width: "25px",
            height: "25px",
            background: "#222",
            color: "#fff",
            cursor: "pointer",
            border: "1px solid #eee",
            borderRadius: "99px",
          }}
          onClick={() => setIconSelected(0)}
        >
          X
        </div>
        <div
          style={{
            display: "flex",
            gap: "20px",
            padding: "20px",
          }}
        >
          <CodeEditor svg={data && data[0]?.svg} />
          <div className="flex  gap-10">
            <div className="flex flex-start">
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
                  removeIcon(data[0].id);
                  setIconSelected(0);
                }}
              >
                delete
              </button>
              <button
                onClick={async () => {
                  await copyToClipboard(data[0].svg);
                }}
              >
                Copy to clipboard
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
            <div className="  fx mt-10 gap-10">
              {colors &&
                colors?.map((e: string) => (
                  <div
                    onClick={async () => {
                      copyToClipboard(e);
                    }}
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default BottomBar;
