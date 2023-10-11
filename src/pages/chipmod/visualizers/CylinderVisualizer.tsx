import {
  ArcRotateCamera,
  Color3,
  Color4,
  CubeTexture,
  DynamicTexture,
  Mesh,
  MeshBuilder,
  NodeMaterial,
  PBRMaterial,
  StandardMaterial,
  Texture,
  Vector3,
} from "@babylonjs/core";
import { useBeatEasing } from "../useBeatEasing";
import { useBeforeRender } from "react-babylonjs";
import useBeat from "~/components/chipmod/useBeat";
import { useEffect, useRef } from "react";
import { VisualizerProps } from "./VisType";
import { Scene as BabylonScene } from "@babylonjs/core/scene";

export const CylinderVisualizer = ({ ...props }: VisualizerProps) => {
  // Visualizer setup:
  const cylinderRef = useRef<Mesh | null>(null);
  const pbrMaterialRef = useRef<PBRMaterial | null>(null);

  // Create a dynamic texture for black lines
  const textureWidth = 512;
  const textureHeight = 512;

  const dynamicTexture = new DynamicTexture(
    "cylTexture",
    { width: textureWidth, height: textureHeight },
    props.scene,
    false,
  ).update();

  // Easing setup:
  const [easingValue, animateBeat] = useBeatEasing(
    props.soundRef,
    "easeOutQuad",
    500,
  );

  useBeat(props.bpm, 20, animateBeat);

  useEffect(() => {
    if (pbrMaterialRef.current) {
    }

    if (cylinderRef.current) {
      // Scale
      cylinderRef.current.scaling.set(
        3 + easingValue,
        3 + easingValue,
        3 + easingValue,
      );
      // Rotate
      cylinderRef.current.rotate(new Vector3(0, 1, 0), easingValue / 10);
    }
  }, [easingValue]);

  useBeforeRender(() => {
    if (!cylinderRef.current) return;
  });

  useEffect(() => {
    if (props.scene) {
      // Set stuff up
      const scene = props.scene;
      const sCol = 0.6;
      scene.clearColor = new Color4(sCol, sCol, sCol, sCol);
      scene.forceShowBoundingBoxes = false;
      scene.ambientColor = new Color3(0.3, 0.3, 0.3);

      if (pbrMaterialRef.current) {
        const gold = new Color3(0.8, 0.6, 0.2);
        pbrMaterialRef.current.albedoColor = gold;
        pbrMaterialRef.current.metallic = 0.01;
      }

      // Fix the camera
      const camera = scene.activeCamera!;
      camera.position.set(0, 0, -10);
      camera.detachControl();
    }
  }, [props.scene]);

  return (
    <cylinder
      ref={cylinderRef}
      name="cyl-1"
      position={new Vector3(0, 0, 0)}
      height={100}
      scaling={new Vector3(2, 2, 2)}
      rotation={new Vector3(Math.PI / 2, 0, 0)}
    >
      <pbrMaterial
        ref={pbrMaterialRef}
        name="cyl-1-mat"
        backFaceCulling={false}
      ></pbrMaterial>
    </cylinder>
  );
};

export default CylinderVisualizer;
