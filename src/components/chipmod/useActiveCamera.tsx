import { useEffect, useRef } from "react";
import type { ArcRotateCamera } from "@babylonjs/core";
import type { Scene as BabylonScene } from "@babylonjs/core/";

export const useActiveCamera = (scene: BabylonScene | null) => {
  const cameraRef = useRef<ArcRotateCamera | null>(null); // Initialize with null
  useEffect(() => {
    if (!cameraRef.current && scene) {
      cameraRef.current = scene.activeCamera as ArcRotateCamera;
    }
  }, [scene]);
  return cameraRef;
};
