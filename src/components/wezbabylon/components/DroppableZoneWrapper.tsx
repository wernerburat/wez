export type LayoutType = "horizontal" | "vertical" | "grid" | "quadrant";

interface DroppableZoneProps {
  layout: LayoutType;
  children: React.ReactNode;
}
const DroppableZoneWrapper = ({
  children,
  layout,
}: DroppableZoneProps): React.ReactNode => {
  let containerClasses = "flex justify-center";

  switch (layout) {
    case "horizontal":
      containerClasses = "flex justify-center"; // Flex in a row is default
      break;
    case "vertical":
      containerClasses = "flex flex-col items-center"; // Stacks children vertically
      break;
    case "grid":
      containerClasses = "grid grid-cols-2 gap-4"; // 2x2 grid layout
      break;
    case "quadrant":
      containerClasses = "grid grid-cols-2 grid-rows-2 h-full w-full";
      break;
    default:
      break;
  }

  return <div className={containerClasses}>{children}</div>;
};

export default DroppableZoneWrapper;
