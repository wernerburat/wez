import { useDroppable } from "@dnd-kit/core";

interface DroppableProps {
  id: string;
  content?: React.ReactNode;
}

const DroppableContainer: React.FC<DroppableProps> = ({ id, content }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });
  const style = {
    border: isOver ? "" : "none",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="m-4 border-2 border-dashed border-gray-400 p-4"
    >
      {content}
    </div>
  );
};

export default DroppableContainer;
