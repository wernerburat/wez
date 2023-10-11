import {
  type Engine,
  EngineFactory,
  type WebGPUEngine,
  Scene,
} from "@babylonjs/core";
import { useState, useEffect, useRef } from "react";

let hasInitialized = false;
export const useBabylonEngine = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [engine, setEngine] = useState<Engine | WebGPUEngine | null>(null);
  const [scene, setScene] = useState<Scene | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initEngine = async () => {
      const { current: canvas } = canvasRef;
      if (!canvas) return;
      try {
        const createdEngine = await EngineFactory.CreateAsync(canvas, {});
        const newScene = new Scene(createdEngine);
        setEngine(createdEngine);
        setScene(newScene);
        hasInitialized = true;
      } catch (error) {
        console.error("Error while creating the engine.", error);
      } finally {
        setLoading(false);
      }
    };

    // Call the initialization function.
    if (!hasInitialized) {
      void initEngine();
    }
    return () => {
      if (engine) {
        engine.dispose();
      }
    };
  }, [engine]);

  return { canvasRef, engine, loading, scene };
};
