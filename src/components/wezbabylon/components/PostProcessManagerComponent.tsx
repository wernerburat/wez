import { useDraggable } from "@dnd-kit/core";

interface Props {
  id: string;
  children?: React.ReactNode;
}

const PostProcessManagerComponent = ({
  id,
  children,
}: Props): React.ReactNode => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="pointer-events-auto rounded-md bg-gray-800 p-4 font-extralight opacity-70"
    >
      <h3 className="mb-4 opacity-100">Post Process Manager</h3>

      {children}
    </div>
  );
};

export default PostProcessManagerComponent;
