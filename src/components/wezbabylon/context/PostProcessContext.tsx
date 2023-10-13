import {
  BASIC_PASS_VERTEX_SHADER,
  DITHERING_FRAGMENT_SHADER,
  NO_FILTER_FRAGMENT_SHADER,
  RED_FILTER_FRAGMENT_SHADER,
} from "~/Shaders/shadersbank";

import {
  createContext,
  useContext,
  type ReactNode,
  useState,
  useEffect,
} from "react";
import { useBabylon } from "./BabylonContext";
import { Effect, PostProcess, Texture } from "@babylonjs/core";

type ShaderParameterType = "float"; // You can extend this if you add more types.
type ShaderParameterMap = Record<string, ShaderParameterType>;
export interface ShaderConfig {
  name: string;
  parameters: ShaderParameterMap;
  vertexShader: string;
  fragmentShader: string;
}

export const shaders: ShaderConfig[] = [
  {
    name: "regular",
    parameters: {},
    vertexShader: BASIC_PASS_VERTEX_SHADER,
    fragmentShader: NO_FILTER_FRAGMENT_SHADER,
  },
  {
    name: "red",
    parameters: {},
    vertexShader: BASIC_PASS_VERTEX_SHADER,
    fragmentShader: RED_FILTER_FRAGMENT_SHADER,
  },
  {
    name: "dither",
    parameters: {
      ditherScale: "float",
    },
    vertexShader: BASIC_PASS_VERTEX_SHADER,
    fragmentShader: DITHERING_FRAGMENT_SHADER,
  },
];

interface PostProcessContextProps {
  postProcesses: PostProcess[];
  addPostProcess: (postProcess: PostProcess) => void;
  removePostProcess: (id: string) => void;
  updatePostProcess: (
    postProcess: PostProcess,
    paramName: string,
    value: number,
  ) => void;
  reorderPostProcesses: (sourceIndex: number, destinationIndex: number) => void;
  attachPostProcess: (postProcess: PostProcess) => void;
  detachPostProcess: (postProcess: PostProcess) => void;
}

const PostProcessContext = createContext<PostProcessContextProps | undefined>(
  undefined,
);

export const PostProcessProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [postProcesses, setPostProcesses] = useState<PostProcess[]>([]);
  const { scene } = useBabylon();

  useEffect(() => {
    if (scene?.activeCamera != null) {
      // Camera initialized, can initialize post-processes
      setPostProcesses(
        shaders.map((shader) => {
          Effect.ShadersStore[shader.name + "VertexShader"] =
            shader.vertexShader;
          Effect.ShadersStore[shader.name + "FragmentShader"] =
            shader.fragmentShader;

          const postProcess = new PostProcess(
            shader.name,
            shader.name,
            Object.keys(shader.parameters),
            null,
            1,
            null,
            Texture.NEAREST_SAMPLINGMODE,
            scene.getEngine(),
            true,
          );
          return postProcess;
        }),
      );
    }
  }, [scene]);

  useEffect(() => {
    console.log("Post-processes changed:", postProcesses);
  }, [postProcesses]);

  const addPostProcess = (postProcess: PostProcess) => {
    setPostProcesses((prev) => [...prev, postProcess]);
  };

  const removePostProcess = (name: string) => {
    setPostProcesses((prev) => prev.filter((pp) => pp.name !== name));
  };

  const updatePostProcess = (
    postProcess: PostProcess,
    paramName: string,
    value: number,
  ) => {
    const updated = postProcess;
    updated.onApplyObservable.add((effect) => {
      effect.setFloat(paramName, value);
    });
  };

  const attachPostProcess = (postProcess: PostProcess) => {
    if (scene?.activeCamera != null) {
      scene.activeCamera.attachPostProcess(postProcess);
    }
  };

  const detachPostProcess = (postProcess: PostProcess) => {
    if (scene?.activeCamera != null) {
      scene.activeCamera.detachPostProcess(postProcess);
    }
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
        attachPostProcess,
        detachPostProcess,
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
