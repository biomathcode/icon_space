import HeaderArea from "../header";
import BottomBar from "../bottombar";
import { useEffect } from "react";

import useSidebarStore from "../../store/useSidebarStore";
import useAppStore from "../../store";

import TableContainer from "../tableView";

function Main() {
  const { folderSelected, setIcons } = useAppStore();

  useEffect(() => {
    setIcons();
  }, [folderSelected]);

  const { isOpen } = useSidebarStore();
  return (
    <div
      style={{
        overflow: "scroll",
        marginLeft: isOpen ? "190px" : "0px",
        maxHeight: "100vh",
        transform: "all ease-out 300ms",
      }}
    >
      <HeaderArea />

      {/* <GridContainer /> */}

      <TableContainer />

      {/* <VersionControl /> */}

      {/* <SvgContainer /> */}

      {/* <TableView /> */}

      <BottomBar />
    </div>
  );
}

export default Main;
