import { useEffect } from "react";
import { readTextFile } from "@tauri-apps/api/fs";
import "./App.css";
import { listen } from "@tauri-apps/api/event";
import { Toaster } from "react-hot-toast";
import { handleInitializeDatabase } from "./db";
import Sidebar from "./components/sidebar";
import Main from "./components/main";
import useAppStore from "./store/useAppStore";
import { DndContext } from "@dnd-kit/core";

function App() {
  const { icons, setIcons, addIcon, setFolders } = useAppStore();

  useEffect(() => {
    listen("tauri://file-drop", (event: any) => {
      console.log(event);

      const file = event.payload[0].split("/").pop();

      const fileName = file.replace(".svg", "") || "new File";

      console.log("filename", fileName);

      readTextFile(event.payload[0])
        .then((e) => {
          let newIcon = {
            name: fileName,
            svg: e,
          };

          addIcon(newIcon);
        })
        .catch((e) => console.log("error", e));
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
