import { useEffect, useRef } from "react";
import type { VisualizerProps } from "../../../types/components/VisType";
import { useActiveCamera } from "~/components/chipmod/useActiveCamera";
import {
  Color3,
  Mesh,
  NoiseProceduralTexture,
  StandardMaterial,
  Vector3,
} from "@babylonjs/core";
import { useScene } from "react-babylonjs";
import {
  BASIC_PASS_VERTEX_SHADER,
  DITHERING_FRAGMENT_SHADER,
  NO_FILTER_FRAGMENT_SHADER,
  RED_FILTER_FRAGMENT_SHADER,
} from "~/Shaders/shadersbank";

export const ProceduralVisualizer = ({}: VisualizerProps) => {
  const scene = useScene();
  const camera = useActiveCamera(scene);
  const tunnel = useRef<Mesh>(null);

  const proceduralMaterial = useProceduralMaterial();

  // Scene setup
  useEffect(() => {
    if (tunnel.current && proceduralMaterial) {
      tunnel.current.rotation.x = Math.PI / 2;
      tunnel.current.material = proceduralMaterial;
      camera.current!.setPosition(new Vector3(0, 0.5, 0));
    }
  }, [camera, proceduralMaterial]);

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
