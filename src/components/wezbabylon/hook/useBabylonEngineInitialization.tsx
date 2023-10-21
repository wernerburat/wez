import {
  type Engine,
  EngineFactory,
  type WebGPUEngine,
  Scene,
  HemisphericLight,
  Vector3,
  FollowCamera,
  HavokPlugin,
} from "@babylonjs/core";
import HavokPhysics from "@babylonjs/havok";
import { useState, useEffect, useRef } from "react";

let hasInitialized = false;

/* Don't call directly!
 * Use useBabylon instead.
 */
export const useBabylonEngineInitialization = () => {
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
        // Physics:
        const havokInstance = await HavokPhysics();
        const hk = new HavokPlugin(true, havokInstance);
        newScene.enablePhysics(new Vector3(0, -9.81, 0), hk);

        setEngine(createdEngine);
        setScene(newScene);
        hasInitialized = true;

        runRenderLoop(createdEngine, newScene);

        return () => {
          window.removeEventListener("resize", () => {
            createdEngine?.resize();
          });
        };
      } catch (error) {
        console.error("Error while creating the engine.", error);
      }

      function runRenderLoop(createdEngine: Engine, newScene: Scene) {
        if (createdEngine && newScene) {
          new HemisphericLight("light", new Vector3(0, 1, 0), newScene);
          new FollowCamera("FollowCam", new Vector3(0, 10, -10), newScene);
          createdEngine.runRenderLoop(() => {
            newScene.render();
          });

          window.addEventListener("resize", () => {
            createdEngine.resize();
          });

          setLoading(false);
        }
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
