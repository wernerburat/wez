import { createContext, useContext, useState, type ReactNode } from "react";

// 1. Define the shape of the context's value
interface DragDropContextValue {
  currentContainer: string | null;
  setCurrentContainer: React.Dispatch<React.SetStateAction<string | null>>;
}

const DragDropContext = createContext<DragDropContextValue | undefined>(
  undefined,
);

// 2. Type the props for the DragDropProvider component
interface DragDropProviderProps {
  children: ReactNode;
}

export const DragDropProvider: React.FC<DragDropProviderProps> = ({
  children,
}) => {
  const [currentContainer, setCurrentContainer] = useState<string | null>(null);

  return (
    <DragDropContext.Provider value={{ currentContainer, setCurrentContainer }}>
      {children}
    </DragDropContext.Provider>
  );
};

export const useDragDrop = (): DragDropContextValue => {
  const context = useContext(DragDropContext);
  if (!context) {
    throw new Error("useDragDrop must be used within a DragDropProvider");
  }
  return context;
};
