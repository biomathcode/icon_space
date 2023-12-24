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

const GridContainer = () => {
  const { icons, setIcons, swapIcons, iconSelected, setIconSelected } =
    useAppStore();

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
  );
};

export default GridContainer;
