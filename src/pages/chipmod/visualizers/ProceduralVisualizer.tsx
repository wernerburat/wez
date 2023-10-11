import { createRoot } from "react-dom/client";

import { useEffect, useRef } from "react";
import { type VisualizerProps } from "./VisType";
import { useActiveCamera } from "~/components/chipmod/useActiveCamera";
import {
  Color3,
  Mesh,
  NoiseProceduralTexture,
  StandardMaterial,
  Vector3,
} from "@babylonjs/core";
import { useCanvas, useScene } from "react-babylonjs";
import {
  BASIC_PASS_VERTEX_SHADER,
  DITHERING_FRAGMENT_SHADER,
  NO_FILTER_FRAGMENT_SHADER,
  RED_FILTER_FRAGMENT_SHADER,
} from "~/Shaders/shadersbank";
import useEnhancedPostProcess from "./useEnhancedPostProcess";

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
