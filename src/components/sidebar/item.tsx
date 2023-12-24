import { useDroppable } from "@dnd-kit/core";
import useAppStore from "../../store";

function FolderItem({ id, name }: { id: number; name: string }) {
  const { setNodeRef } = useDroppable({
    id: id,
  });

  const { folderSelected, setFolderSelected } = useAppStore();

  return (
    <div ref={setNodeRef} key={id} onClick={() => setFolderSelected(id)}>
      <button
        style={{
          display: "flex",
          gap: "10px",
          fontSize: "14px",
          alignItems: "center",
          border: id === folderSelected ? "2px solid blue" : "none",
        }}
      >
        <span>{name == "home" ? "🏡" : "🖼️"}</span>
        <span>{name}</span>
      </button>
    </div>
  );
}

export default FolderItem;
