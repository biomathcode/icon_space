import HeaderArea from "../header";
import BottomBar from "../bottombar";
import { useEffect, useState } from "react";

import GridContainer from "../grid";
import useSidebarStore from "../../store/useSidebarStore";
import useAppStore from "../../store";

function Main() {
  const { icons: data } = useAppStore();

  const [selectedId, setSelectedId] = useState("");

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
      <HeaderArea data={data} />

      <GridContainer selectedId={selectedId} setSelectedId={setSelectedId} />

      {/* <TableView /> */}

      {/* <ul
        className="row"
        style={{
          gap: "20px",
          display: "flex",
          flexWrap: "wrap",
          padding: "60px 0px",
        }}
      >
        {data.map((e: any) => {
          console.log("elements", e);
          return (
            <div
              onClick={() => setSelectedId(selectedId !== e.id ? e.id : "")}
              key={e.id}
              className="icon-card"
              style={{
                border:
                  selectedId == e.id ? "2px solid #396cd8" : "2px solid #444",
                borderRadius: "4px",
                padding: "10px",
                display: "flex",
                gap: "4px",
                flexDirection: "column",
                background: "#333",
              }}
            >
              <div>
                <img
                  style={{
                    width: "40px",
                    height: "40px",
                  }}
                  src={`data:image/svg+xml;utf8,${encodeURIComponent(e.svg)}`}
                />
                <div>{e.name}</div>
              </div>

              <div className="flex gap-5">
                <button
                  onClick={() => {
                    copyToClipboard(e.svg);
                  }}
                >
                  Copy
                </button>
                <button
                  onClick={() => {
                    DeleteIcon(e.id);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </ul> */}
      {/* <TableView /> */}

      <BottomBar setSelectedId={setSelectedId} selectedId={selectedId} />
    </div>
  );
}

export default Main;
