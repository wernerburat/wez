import { useCallback, useRef } from "react";
import { DynamicTexture, StandardMaterial } from "@babylonjs/core";
import { useBabylon } from "../context/BabylonContext";

function useMaterialCache() {
  const { scene } = useBabylon();

  const materialCacheRef = useRef(new Map<string, StandardMaterial>());
  const textureCacheRef = useRef(new Map<string, DynamicTexture>());

  const getMaterialForText = useCallback(
    (text: string): StandardMaterial | undefined => {
      if (!scene) return;

      if (materialCacheRef.current.has(text)) {
        return materialCacheRef.current.get(text);
      }

      const texture = new DynamicTexture(`texture-${text}`, 512, scene, true);
      texture.drawText(
        text,
        null,
        400,
        "bold 72px Arial",
        "white",
        "transparent",
        true,
        true,
      );

      const material = new StandardMaterial(`material-${text}`, scene);
      material.diffuseTexture = texture;

      materialCacheRef.current.set(text, material);
      textureCacheRef.current.set(text, texture);

      return material;
    },
    [scene],
  );

  return { getMaterialForText };
}

export default useMaterialCache;
