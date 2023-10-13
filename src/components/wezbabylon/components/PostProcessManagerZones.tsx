import React, { useState } from "react";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import DroppableContainer from "./DroppableContainer";
import PostProcessManagerComponent from "./PostProcessManagerComponent";
import { useDragDrop } from "../context/DragDropContext";

interface Item {
  id: string;
  content: React.ReactElement<{ id: string }>;
}

const PostProcessManagerZones = (): React.ReactNode => {
  const { setCurrentContainer } = useDragDrop();

  const [items, setItems] = useState<Item[]>([
    {
      id: "container1",
      content: <PostProcessManagerComponent id="draggable1" />,
    },
    { id: "container2", content: <div></div> },
    { id: "container3", content: <div></div> },
    { id: "container4", content: <div></div> },
  ]);

  const swapItems = (fromId: string, toId: string) => {
    const fromItem = items.find((item) => item.content.props.id === fromId);
    const toItem = items.find((item) => item.id === toId);

    if (!fromItem || !toItem) {
      return;
    }

    const fromIndex = items.indexOf(fromItem);
    const toIndex = items.indexOf(toItem);

    const newItems = [...items];
    newItems[fromIndex] = toItem;
    newItems[toIndex] = fromItem;

    setItems(newItems);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;

    console.log("Active ID:", active.id);
    console.log("Over ID:", over?.id);

    if (over && typeof over.id === "string" && typeof active.id === "string") {
      setCurrentContainer(over.id);
      swapItems(active.id, over.id);
    }
  };

  return (
    <>
      <DndContext onDragEnd={handleDragEnd}>
        {items.map((item) => (
          <DroppableContainer
            key={item.id}
            id={item.id}
            content={item.content}
          />
        ))}
      </DndContext>
    </>
  );
};

export default PostProcessManagerZones;
