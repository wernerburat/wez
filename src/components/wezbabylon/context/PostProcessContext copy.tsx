import { createContext, useContext, type ReactNode, useState } from "react";

interface PostProcess {
  id: string;
  type: string; // Could be 'Bloom', 'Blur', etc.
  settings: unknown; // Settings specific to this post-process
}

interface PostProcessContextProps {
  postProcesses: PostProcess[];
  addPostProcess: (postProcess: PostProcess) => void;
  removePostProcess: (id: string) => void;
  updatePostProcess: (id: string, settings: unknown) => void;
  reorderPostProcesses: (sourceIndex: number, destinationIndex: number) => void;
}

const PostProcessContext = createContext<PostProcessContextProps | undefined>(
  undefined,
);

export const PostProcessProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [postProcesses, setPostProcesses] = useState<PostProcess[]>([]);

  const addPostProcess = (postProcess: PostProcess) => {
    setPostProcesses((prev) => [...prev, postProcess]);
  };

  const removePostProcess = (id: string) => {
    setPostProcesses((prev) => prev.filter((pp) => pp.id !== id));
  };

  const updatePostProcess = (id: string, settings: unknown) => {
    setPostProcesses((prev) =>
      prev.map((pp) => (pp.id === id ? { ...pp, settings } : pp)),
    );
  };

  const reorderPostProcesses = (
    sourceIndex: number,
    destinationIndex: number,
  ) => {
    const reordered = Array.from(postProcesses);
    const [moved] = reordered.splice(sourceIndex, 1);
    // reordered.splice(destinationIndex, 0, moved);
    setPostProcesses(reordered);
  };

  return (
    <PostProcessContext.Provider
      value={{
        postProcesses,
        addPostProcess,
        removePostProcess,
        updatePostProcess,
        reorderPostProcesses,
      }}
    >
      {children}
    </PostProcessContext.Provider>
  );
};

export const usePostProcesses = () => {
  const context = useContext(PostProcessContext);
  if (context === undefined) {
    throw new Error(
      "usePostProcesses must be used within a PostProcessProvider",
    );
  }
  return context;
};
