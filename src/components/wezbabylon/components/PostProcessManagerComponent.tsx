import { useDraggable } from "@dnd-kit/core";
import { usePostProcesses } from "../context/PostProcessContext";
import PostProcessComponent from "./PostProcessComponent";

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

  const { postProcesses } = usePostProcesses();

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="cursor-default rounded-md bg-gray-800 p-4 font-extralight opacity-70"
      aria-describedby=""
    >
      <h3 {...listeners} className="mb-4 opacity-100">
        Post Process Manager
      </h3>
      {children}
      <div className="flex flex-col">
        {postProcesses.map((postProcess) => (
          <PostProcessComponent
            key={postProcess.name}
            postProcess={postProcess}
          />
        ))}
      </div>
    </div>
  );
};

export default PostProcessManagerComponent;
