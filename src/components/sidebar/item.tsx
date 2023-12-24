import { useDroppable } from "@dnd-kit/core";

function FolderItem({ id, name }: { id: number; name: string }) {
  const { setNodeRef } = useDroppable({
    id: id,
  });
  return (
    <div ref={setNodeRef} key={id}>
      <button
        style={{
          display: "flex",
          gap: "10px",
          fontSize: "14px",
          alignItems: "center",
        }}
      >
        <span>{name == "home" ? "🏡" : "🖼️"}</span>
        <span>{name}</span>
      </button>
    </div>
  );
}

export default FolderItem;
