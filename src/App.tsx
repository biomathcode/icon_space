import { useEffect } from "react";
import { readTextFile } from "@tauri-apps/api/fs";
import "./App.css";
import { listen } from "@tauri-apps/api/event";
import toast, { Toaster } from "react-hot-toast";
import { handleInitializeDatabase } from "./db";
import Sidebar from "./components/sidebar";
import Main from "./components/main";
import useAppStore from "./store/useAppStore";
import { DndContext } from "@dnd-kit/core";

function isSvgFile(filePath: string) {
  return /\.svg$/i.test(filePath);
}

function App() {
  const { icons, setIcons, addIcon, setFolders } = useAppStore();

  useEffect(() => {
    listen("tauri://file-drop", async (event: any) => {
      console.log(event);

      for (let i = 0; i < event.payload.length; i++) {
        const filePath = event.payload[i];

        if (!isSvgFile(filePath)) {
          return toast.error("File is not svg", filePath);
        } else {
          const name = filePath.split("/").pop();
          const fileName = name?.replace(".svg", "") || "new File";

          try {
            const svgContent = await readTextFile(filePath);

            let newIcon = {
              name: fileName,
              svg: svgContent,
            };

            addIcon(newIcon);
          } catch (error) {
            console.error(`Error processing file ${filePath}: ${error}`);
            // Continue with the next file even if an error occurs
          }
        }
      }
    });
  }, []);

  useEffect(() => {
    const init = async () => {
      console.log("Initializing database...");

      await handleInitializeDatabase();

      console.log("Database initialized.");

      console.log("Fetching data...");
      setIcons();

      console.log("Data fetched:", icons);
    };
    init();

    setFolders();
  }, []);

  useEffect(() => {
    if (icons) {
      console.log(icons[0]);
    }
  }, []);

  return (
    <div className="container">
      <Toaster position="top-right" />

      <div className="flex gap-5">
        <DndContext
          id="New"
          // sensors={useSensors(useSensor(PointerSensor), useSensor(MouseSensor))}
          onDragEnd={(e) => console.log(e)}
          onDragCancel={(e) => console.log(e)}
          onDragMove={(e) => console.log(e)}
          onDragOver={(e) => console.log(e)}
        >
          <Sidebar />
          <Main />
        </DndContext>
      </div>
    </div>
  );
}

export default App;
