import { type Engine, EngineFactory, type WebGPUEngine } from "@babylonjs/core";
import { useState, useEffect, useRef } from "react";

export const useBabylonEngine = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [engine, setEngine] = useState<Engine | WebGPUEngine | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initEngine = async () => {
      if (!canvasRef.current) return;

      try {
        const createdEngine = await EngineFactory.CreateAsync(
          canvasRef.current,
          {},
        );
        setEngine(createdEngine);
      } catch (error) {
        console.error("Error while creating the engine.", error);
      } finally {
        setLoading(false);
      }
    };

    // Call the initialization function.
    void initEngine();
  }, []);

  return { canvasRef, engine, loading };
};
