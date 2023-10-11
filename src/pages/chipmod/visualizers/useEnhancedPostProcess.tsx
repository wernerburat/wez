import { useCallback, useEffect, useRef, useState } from "react";
import { useActiveCamera } from "~/components/chipmod/useActiveCamera";
import { Effect, PostProcess, Texture } from "@babylonjs/core";
import { useScene } from "react-babylonjs";
import { shaders } from "./ProceduralVisualizer";

export const usePostProcess = () => {
  const scene = useScene();
  const camera = useActiveCamera(scene);
  const activeShaderRef = useRef<string | null>(null);
  const [activeShader, setActiveShader] = useState<string | null>(
    activeShaderRef.current ?? null,
  );

  const [postProcesses, setPostProcesses] = useState<PostProcess[]>([]);
  useEffect(() => {
    if (postProcesses.length > 0 || !scene?.getEngine()) return;
    setPostProcesses(
      shaders.map((shader) => {
        Effect.ShadersStore[shader.name + "VertexShader"] = shader.vertexShader;
        Effect.ShadersStore[shader.name + "FragmentShader"] =
          shader.fragmentShader;

        const postProcess = new PostProcess(
          shader.name,
          shader.name,
          Object.keys(shader.parameters),
          null,
          1,
          camera.current,
          Texture.NEAREST_SAMPLINGMODE,
          scene.getEngine(),
          true,
        );
        return postProcess;
      }),
    );
    return () => {
      console.warn("I'm called! You should consider cleaning up here.");
    };
  }, [camera, postProcesses, scene]);

  useEffect(() => {
    if (!scene || !camera.current) return;
    postProcesses.forEach((postProcess) => {
      camera.current?.detachPostProcess(postProcess);
    });

    setActiveShader(activeShaderRef.current ?? null);
  }, [postProcesses, scene, camera]);

  const toggleShader = (shaderName: string) => {
    postProcesses.forEach((pp) => {
      camera.current?.detachPostProcess(pp);
    });

    const selectedShader = postProcesses.find((pp) => pp.name === shaderName);
    camera.current?.attachPostProcess(selectedShader!);
    setActiveShader(shaderName);
    activeShaderRef.current = shaderName;
  };

  return { postProcesses, toggleShader, activeShader };
};
type ShaderParameters = Record<string, number>; // You might need to adjust this if you have more parameter types.

interface UseEnhancedPostProcessReturn {
  postProcesses: PostProcess[];
  toggleShader: (shaderName: string) => void;
  activeShader: string | null;
  shaderParams: ShaderParameters;
  updateShaderParams: (name: string, value: number) => void; // Adjust as necessary for other parameter types.
}
const useEnhancedPostProcess = (): UseEnhancedPostProcessReturn => {
  const { postProcesses, toggleShader, activeShader } = usePostProcess();
  const [shaderParams, setShaderParams] = useState<ShaderParameters>({});
  useEffect(() => {
    const selectedShader = postProcesses.find((pp) => pp.name === activeShader);
    const selectedShaderConfig = shaders.find((s) => s.name === activeShader);
    if (selectedShader && selectedShaderConfig) {
      const observer = selectedShader.onApplyObservable.add((effect) => {
        for (const param in shaderParams) {
          if (shaderParams.hasOwnProperty(param)) {
            const paramType = selectedShaderConfig.parameters[param];
            const paramValue = shaderParams[param];

            if (paramValue !== undefined) {
              switch (paramType) {
                case "float":
                  effect.setFloat(param, paramValue);
                  break;
                // Add more cases if you have other data types.
              }
            }
          }
        }
      });

      return () => {
        selectedShader.onApplyObservable.remove(observer);
      };
    }
  }, [postProcesses, activeShader, shaderParams]);

  const updateShaderParams = useCallback((name: string, value: number) => {
    setShaderParams((prev) => ({ ...prev, [name]: value }));
  }, []);

  return {
    postProcesses,
    toggleShader,
    activeShader,
    shaderParams,
    updateShaderParams,
  };
};

export default useEnhancedPostProcess;
