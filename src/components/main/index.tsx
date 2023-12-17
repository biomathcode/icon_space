import HeaderArea from "../header";
import BottomBar from "../bottombar";
import { useState } from "react";

import GridContainer from "../grid";

function Main({
  data,
  setData,
  selFolder,
}: {
  data: any;
  setData: any;
  selFolder: any;
}) {
  // const DeleteIcon = async (id: number) => {
  //   try {
  //     console.log("icon id", id);
  //     await deleteIconById(Number(id));

  //     const filteredMap = data.filter((e: any) => e.id !== id);

  //     console.log("this is the filterdMap", filteredMap);

  //     toast.success("Icon Deleted");

  //     setData(filteredMap);
  //   } catch (e) {
  //     console.error("Error Deleting element:", e);
  //   }
  // };

  const [selectedId, setSelectedId] = useState("");
  return (
    <div
      style={{
        overflow: "scroll",
        marginLeft: "190px",
        maxHeight: "100vh",
      }}
    >
      <HeaderArea data={data} setData={setData} />

      <GridContainer
        items={data}
        setItems={setData}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        selFolder={selFolder}
      />

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
