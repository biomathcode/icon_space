import { useState, useCallback } from "react";
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
import useAppStore from "../../store/useAppStore";
import { updateIconById } from "../../db";

const GridContainer = () => {
  const { icons, setIcons, setIconSelected } = useAppStore();

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

      if (over && active?.id !== over?.id) {
        const activeIndex = icons.findIndex(({ id }) => id === active.id);
        const overIndex = icons.findIndex(({ id }) => id === over?.id);

        const newItems = arrayMove(icons, activeIndex, overIndex).map(
          (e, i) => ({ ...e, indx: i + 1 })
        );

        for (let icn of newItems) {
          updateIconById(Number(icn.id), {
            indx: icn.indx,
          });
        }

        setIcons(newItems);
      }

      setActiveId(null);
    },
    [icons]
  );
  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
        autoScroll={{ threshold: { x: 0, y: 0.2 } }}
      >
        <SortableContext
          items={icons.map((e) => e.id!)}
          strategy={rectSortingStrategy}
        >
          <Grid columns={10}>
            {icons.map((item: any) => (
              <SortableItem
                onClick={() => {
                  setIconSelected(item.id);
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
              name={icons?.find((e: any) => e.id === activeId)?.name}
              svg={icons?.find((e: any) => e.id === activeId)?.svg}
              id={activeId}
              isDragging
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </>
  );
};

export default GridContainer;
