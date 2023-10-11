import { useRef } from "react";
import { useScene } from "react-babylonjs";
import { DynamicTexture } from "@babylonjs/core";

export const useTexture = () => {
  const textureRef = useRef<DynamicTexture>(
    new DynamicTexture("dt", { width: 512, height: 512 }, useScene(), false, 0),
  );
  textureRef.current.hasAlpha = true;
  return textureRef;
};
