import { useDroppable } from "@dnd-kit/core";

interface Props {
  children: React.ReactNode;
}

const PostProcessManagerComponent = ({ children }: Props): React.ReactNode => {
  const { isOver, setNodeRef } = useDroppable({
    id: "droppable",
  });

  const style = {
    color: isOver ? "green" : undefined,
  };
  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
};

export default PostProcessManagerComponent;
