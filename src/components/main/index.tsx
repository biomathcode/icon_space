import HeaderArea from "../header";
import BottomBar from "../bottombar";
import { useEffect, useState } from "react";

import useSidebarStore from "../../store/useSidebarStore";
import useAppStore from "../../store";

import TableContainer from "../tableView";
import { ToggleButton } from "@adobe/react-spectrum";
import GridContainer from "../grid";
function Main() {
  const { folderSelected, setIcons } = useAppStore();

  const [isGrid, setIsGrid] = useState<boolean>(true);

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

      <ToggleButton
        isEmphasized
        isSelected={isGrid}
        onChange={setIsGrid}
        aria-label="Pin"
      >
        {isGrid ? "Grid" : "Table"}
      </ToggleButton>

      {isGrid ? <GridContainer /> : <TableContainer />}

      {/* <GridContainer /> */}

      {/* <VersionControl /> */}

      {/* <SvgContainer /> */}

      {/* <TableView /> */}

      <BottomBar />
    </div>
  );
}

export default Main;
