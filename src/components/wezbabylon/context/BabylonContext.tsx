import { type Engine, type WebGPUEngine, type Scene } from "@babylonjs/core";
import { type MutableRefObject, createContext, useContext } from "react";

interface BabylonContextType {
  engine?: Engine | WebGPUEngine | null;
  scene?: Scene | null;
  canvasRef?: MutableRefObject<HTMLCanvasElement | null> | null;
}

export const BabylonContext = createContext<BabylonContextType>({
  engine: null,
  scene: null,
  canvasRef: null,
});

export const useBabylon = () => {
  return useContext(BabylonContext);
};
