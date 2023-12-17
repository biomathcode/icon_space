import { useEffect, useState } from "react";
import Logo from "../../assets/logo.svg";
import { getAllFolders } from "../../db";
import Dialog from "../dialog";
import useSidebarStore from "../../store/useSidebarStore";

function Sidebar({
  selFolder,
  setSelFolder,
}: {
  selFolder: any;
  setSelFolder: any;
}) {
  const [folders, setFolders] = useState<any>([
    {
      id: 1,
      name: "home",
    },
    {
      id: 2,
      name: "illustrations",
    },
  ]);

  useEffect(() => {
    const init = async () => {
      console.log("Database initialized.");

      console.log("Fetching data...");
      const data = await getAllFolders();

      setFolders(data);
      console.log("Data fetched:", data);
    };
    init();
  }, []);

  const { isOpen } = useSidebarStore();
  return (
    <div
      style={{
        position: "absolute",
        left: isOpen ? "0px" : "-200px",
        top: "0px",
        height: "100vh",
        minWidth: "150px",
        padding: "0px 20px",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "#222",
        overflow: "scroll",
        transition: "all ease-in 216ms",
      }}
    >
      <div
        style={{
          alignContent: "center",
          alignItems: "center",
          display: "flex",
          justifyContent: "center",

          position: "sticky",
          top: "0px",
          background: "#222",
          padding: "15px 8px",
          fontWeight: "900",
        }}
      >
        <img
          style={{
            width: "40px",
            height: "40px",
            marginRight: "20px",
          }}
          src={Logo}
        />{" "}
        Icon Space
      </div>
      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {folders.map((e: any) => {
          return (
            <button
              style={{
                display: "flex",
                gap: "10px",
                fontSize: "14px",
                alignItems: "center",
                background: e.id == selFolder ? "#275DAD" : "#111",
              }}
              key={e.id}
              onClick={() => {
                setSelFolder(e.id);
              }}
            >
              <span>{e.name == "home" ? "🏡" : "🖼️"}</span>
              <span>{e.name}</span>
            </button>
          );
        })}

        <Dialog setFolder={setFolders} />
      </nav>
    </div>
  );
}

export default Sidebar;
