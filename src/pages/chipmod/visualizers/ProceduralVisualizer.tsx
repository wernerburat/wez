import { createRoot } from "react-dom/client";

import { useCallback, useEffect, useRef, useState } from "react";
import { type VisualizerProps } from "./VisType";
import { useActiveCamera } from "~/components/chipmod/useActiveCamera";
import {
  Color3,
  Effect,
  Mesh,
  NoiseProceduralTexture,
  PostProcess,
  StandardMaterial,
  Texture,
  Vector3,
} from "@babylonjs/core";
import { useCanvas, useScene } from "react-babylonjs";
import {
  BASIC_PASS_VERTEX_SHADER,
  DITHERING_FRAGMENT_SHADER,
  NO_FILTER_FRAGMENT_SHADER,
  RED_FILTER_FRAGMENT_SHADER,
} from "~/Shaders/shadersbank";

const useMenuDiv = () => {
  const {
    postProcesses,
    toggleShader,
    activeShader,
    shaderParams,
    updateShaderParams,
  } = useEnhancedPostProcess();

  const activeShaderConfig = activeShader
    ? shaders.find((shader) => shader.name === activeShader)
    : null;

  const activeShaderParameters = activeShaderConfig
    ? Object.keys(activeShaderConfig.parameters)
    : [];

  return (
    <div className="pointer-events-none absolute flex h-full w-full flex-row items-end justify-end overflow-hidden p-10 ">
      <div className="flex flex-col items-start overflow-hidden p-10 ">
        {postProcesses.map((postProcess) => (
          <button
            className={`pointer-events-auto ${
              postProcess.name === activeShader ? "text-red-500" : ""
            }`}
            key={postProcess.name}
            onClick={() => toggleShader(postProcess.name)}
          >
            {postProcess.name}
          </button>
        ))}
      </div>
      <div className="flex flex-col items-start overflow-hidden p-10 ">
        {activeShaderParameters.map((param) => (
          <div key={param}>
            <label>{param}</label>
            <input
              className="pointer-events-auto"
              type="range"
              min={0}
              max={1000}
              step={1}
              value={shaderParams[param]}
              onChange={(e) => {
                const newValue = parseFloat(e.target.value);
                if (shaderParams[param] !== newValue) {
                  updateShaderParams(param, newValue);
                }
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export const ProceduralVisualizer = ({}: VisualizerProps) => {
  const scene = useScene();
  const camera = useActiveCamera(scene);
  const tunnel = useRef<Mesh>(null);

  const proceduralMaterial = useProceduralMaterial();
  const menuDiv = useMenuDiv();

  // Scene setup
  useEffect(() => {
    if (tunnel.current && proceduralMaterial) {
      tunnel.current.rotation.x = Math.PI / 2;
      tunnel.current.material = proceduralMaterial;
      camera.current!.setPosition(new Vector3(0, 0.5, 0));
    }
  }, [camera, proceduralMaterial]);

  const canvas = useCanvas();
  useEffect(() => {
    if (canvas instanceof HTMLCanvasElement && canvas.parentElement) {
      const div = document.createElement("div");
      canvas.parentElement.appendChild(div);

      const root = createRoot(div);
      root.render(menuDiv);

      // Cleanup
      return () => {
        root.unmount(); // This will unmount the React component
        div.remove(); // Remove the div from the DOM
      };
    }
  }, [canvas, menuDiv]);

  return (
    <hemisphericLight name="light1" direction={new Vector3(0, 1, 0)}>
      <cylinder
        ref={tunnel}
        name="tunnel"
        diameter={3}
        height={20}
        tessellation={24}
        sideOrientation={Mesh.DOUBLESIDE}
      ></cylinder>
    </hemisphericLight>
  );
};
export default ProceduralVisualizer;

type ShaderParameterType = "float"; // You can extend this if you add more types.
type ShaderParameterMap = Record<string, ShaderParameterType>;
interface ShaderConfig {
  name: string;
  parameters: ShaderParameterMap;
  vertexShader: string;
  fragmentShader: string;
}

const shaders: ShaderConfig[] = [
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

export const usePostProcess = () => {
  const scene = useScene();
  const camera = useActiveCamera(scene);
  const activeShaderRef = useRef<string | null>(null);
  const [activeShader, setActiveShader] = useState<string | null>(
    activeShaderRef.current ?? null,
  );

  const [postProcesses, setPostProcesses] = useState<PostProcess[]>([]);
  useEffect(() => {
    if (postProcesses.length > 0) return;
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
          scene!.getEngine(),
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

function useEnhancedPostProcess(): UseEnhancedPostProcessReturn {
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
}

export const useProceduralMaterial = () => {
  const materialRef = useRef<StandardMaterial | null>(null);
  const scene = useScene();

  useEffect(() => {
    if (materialRef.current) return;
    if (!scene) throw new Error("Scene is null. Please have a scene");

    // Create procedural texture
    const proceduralTexture = new NoiseProceduralTexture("perlin", 256, scene);
    proceduralTexture.octaves = 2;
    proceduralTexture.persistence = 1;

    // Create standard material
    const proceduralMaterial = new StandardMaterial("std", scene);
    proceduralMaterial.diffuseTexture = proceduralTexture;
    proceduralMaterial.diffuseColor = new Color3(1, 0.3, 0.3);

    materialRef.current = proceduralMaterial;
  }, [scene]);

  return materialRef.current;
};
