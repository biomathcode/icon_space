//Todo: use click away to set the selectedId

import { useEffect, useState } from "react";
import CodeEditor from "../editor/index";
import { getIconById, updateIconSvgById } from "../../db";
import { writeFile } from "@tauri-apps/api/fs";
import getSVGColors from "./utils";
import { save } from "@tauri-apps/api/dialog";

import { copyToClipboard, optmiseSvg } from "../../utils";
import useAppStore from "../../store";
import { Button, ButtonGroup, DialogContainer } from "@adobe/react-spectrum";

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
  // const handleExportSvg = async (svgContent: string, name: string) => {
  //   try {
  //     await writeFile(name + ".svg", svgContent, {
  //       dir: BaseDirectory.Desktop,
  //     });

  //     console.log(BaseDirectory);
  //   } catch (error) {
  //     console.error("Failed to export SVG:", error);
  //     // Handle the error as needed
  //   }
  // };

  return (
    <DialogContainer
      isDismissable
      isKeyboardDismissDisabled={false}
      onDismiss={() => setIconSelected(0)}
    >
      {iconSelected !== 0 && (
        <div
          style={{
            display: "flex",
            gap: "20px",
            padding: "20px",
          }}
        >
          <CodeEditor svg={data && data[0]?.svg} />
          <div className="flex  gap-10">
            <ButtonGroup>
              <Button
                variant="primary"
                onPress={async () => {
                  const el = optmiseSvg(data && data[0]?.svg);

                  await updateIconSvgById(data[0].id, el);

                  console.log(el);
                }}
              >
                optimise
              </Button>
              <Button
                variant="negative"
                onPress={async () => {
                  removeIcon(data[0].id);
                  setIconSelected(0);
                }}
              >
                delete
              </Button>
              <Button
                variant="overBackground"
                onPress={async () => {
                  await copyToClipboard(data[0].svg);
                }}
              >
                Copy to clipboard
              </Button>

              <Button
                variant="cta"
                onPress={async () => {
                  const filepath = await save({
                    defaultPath: data[0].name,
                    filters: [
                      {
                        name: data[0]?.name,
                        extensions: ["svg"],
                      },
                    ],
                  });
                  if (filepath) {
                    await writeFile(filepath, data[0]?.svg);
                  }
                }}
              >
                Save
              </Button>
            </ButtonGroup>
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
      )}
    </DialogContainer>
  );
}

export default BottomBar;
