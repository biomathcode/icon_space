import Logo from "../../assets/logo.svg";

import useSidebarStore from "../../store/useSidebarStore";

import FolderItem from "./item";
import useAppStore from "../../store";
import Dialog from "../dialog";

function Sidebar() {
  const { folders } = useAppStore();

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
        {folders &&
          folders?.map((e: { name: string; id: number }) => (
            <FolderItem key={e.id} id={e.id} name={e.name} />
          ))}

        <Dialog />
      </nav>
    </div>
  );
}

export default Sidebar;
