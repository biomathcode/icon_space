//Todo: use click away to set the selectedId

function BottomBar({ selectedId }: { selectedId: any }) {
  console.log("selectedid", selectedId);
  return (
    selectedId && (
      <div
        style={{
          position: "absolute",
          left: "190px",
          bottom: "0px",
          height: "200px",
          width: "100%",
          background: "#222",
        }}
      ></div>
    )
  );
}

export default BottomBar;
