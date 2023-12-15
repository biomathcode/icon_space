import React, { FC, useState, useCallback } from "react";
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

import RectangleSelection from "react-rectangle-selection";

const GridContainer = ({
  items,
  setItems,
  selectedId,
  setSelectedId,
  selFolder,
}: {
  items: any;
  setItems: any;
  selectedId: any;
  setSelectedId: any;
  selFolder: any;
}) => {
  const [sort, setSort] = useState(false);
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
    setActiveId(event.active.id as string);
  }, []);
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    if (sort) {
      return;
    }
    const { active, over } = event;

    if (active?.id !== over?.id) {
      setItems((items: any) => {
        const oldIndex = items.findIndex((item: any) => item.id === active?.id);
        const newIndex = items.findIndex((item: any) => item.id === over?.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setActiveId(null);
  }, []);
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

  const [select, setSelect] = useState({});

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      autoScroll={{ threshold: { x: 0, y: 0.2 } }}
    >
      <SortableContext items={items} strategy={rectSortingStrategy}>
        <Grid columns={5}>
          {items.map((item: any) => (
            <SortableItem
              onClick={async () => {
                setSelectedId(selectedId !== item.id ? item.id : "");
                await copyToClipboard(item.svg);
              }}
              key={item.id}
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
            name={items.find((e: any) => e.id === activeId).name}
            svg={items.find((e: any) => e.id === activeId).svg}
            id={activeId}
            isDragging
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default GridContainer;
