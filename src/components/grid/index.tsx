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

const GridContainer = ({
  items,
  setItems,
  selectedId,
  setSelectedId,
}: {
  items: any;
  setItems: any;
  selectedId: any;
  setSelectedId: any;
}) => {
  // const [items, setItems] = useState(
  //   Array.from({ length: 20 }, (_, i) => (i + 1).toString())
  // );

  const [sort, setSort] = useState(true);
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
              onClick={() =>
                setSelectedId(selectedId !== item.id ? item.id : "")
              }
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
