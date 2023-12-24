import { useState, useCallback, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  DragOverlay,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import Grid from "./Grid";
import SortableItem from "./SortableItem";
import Item from "./item";
import toast from "react-hot-toast";
import { writeText } from "@tauri-apps/api/clipboard";
import useAppStore from "../../store/useAppStore";

const GridContainer = ({}: // selectedId,
// setSelectedId,
{
  selectedId?: any;
  setSelectedId?: any;
}) => {
  // const [sort, setSort] = useState(false);

  const { icons, setIcons, swapIcons } = useAppStore();

  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor)
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    console.log("id", event.active.id);
    setActiveId(event.active.id as string);
  }, []);
  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;

      if (active?.id !== over?.id) {
        console.log("icons", icons);
        const oldIndex = icons.find(
          (item: any) => item.id === Number(active?.id)
        );
        const newIndex = icons.find(
          (item: any) => item.id === Number(over?.id)
        );

        console.log(oldIndex, newIndex);

        console.log(
          "activeId",
          active.id,
          "overId",
          over?.id,
          "oldIndex",
          oldIndex,
          "newIndex",
          newIndex
        );

        await swapIcons({
          index1: Number(oldIndex?.indx),
          index2: Number(newIndex?.indx),
        });

        setIcons();

        // seticons((icons: any) => {
        //   return arrayMove(icons, oldIndex, newIndex);
        // });
      }

      setActiveId(null);
    },
    [icons]
  );
  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  const copyToClipboard = async (text: string) => {
    try {
      // Use the clipboard API to write text to the clipboard
      await writeText(text);

      // Optionally, you can notify the user that the text has been copied
      // or perform any other action after successful copying.
      console.log("Text copied to clipboard:", text);
      toast.success("Copied");
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      autoScroll={{ threshold: { x: 0, y: 0.2 } }}
    >
      <SortableContext items={icons} strategy={rectSortingStrategy}>
        <Grid columns={10}>
          {icons.map((item: any) => (
            <SortableItem
              onClick={async () => {
                // setSelectedId(selectedId !== item.id ? item.id : "");
                // await copyToClipboard(item.svg);
              }}
              key={item.indx}
              id={item.id}
              name={item.name}
              svg={item.svg}
            />
          ))}
        </Grid>
      </SortableContext>
      <DragOverlay adjustScale style={{ transformOrigin: "0 0 " }}>
        {activeId ? (
          <Item
            name={icons?.find((e: any) => e.id === activeId)?.name}
            svg={icons?.find((e: any) => e.id === activeId)?.svg}
            id={activeId}
            isDragging
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default GridContainer;
